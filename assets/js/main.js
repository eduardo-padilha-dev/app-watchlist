(function ($) {
  const PLACEHOLDER_POSTER = 'https://via.placeholder.com/300x450/13161F/E8B44B?text=SEM+POSTER';

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDateISO() {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${mm}-${dd}`;
  }

  function showToast(message, isError) {
    const toastEl = document.getElementById('wlToast');
    const toastMsg = document.getElementById('toastMsg');
    const toastIcon = document.getElementById('toastIcon');

    if (!toastEl || !toastMsg) return;

    toastMsg.textContent = message;

    if (toastIcon) {
      toastIcon.className = isError
        ? 'bi bi-x-circle-fill text-danger'
        : 'bi bi-check-circle-fill text-success';
    }

    const instance = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2800 });
    instance.show();
  }

  function normalizeStatusLabel(status) {
    const map = {
      'quero-ver': 'Quero Ver',
      assistindo: 'Assistindo',
      concluido: 'Concluído',
      abandonado: 'Abandonado',
    };

    return map[status] || 'Sem status';
  }

  function normalizeStatusBadge(status) {
    const map = {
      'quero-ver': 'badge-wishlist',
      assistindo: 'badge-watching',
      concluido: 'badge-completed',
      abandonado: 'badge-dropped',
    };

    return map[status] || 'badge-wishlist';
  }

  async function initHomePage() {
    const $searchForm = $('#searchForm');
    if (!$searchForm.length) return;

    let currentResult = null;

    function hideError() {
      $('#searchError').addClass('d-none');
    }

    function showError(message) {
      $('#searchErrorMsg').text(message || 'Nenhum resultado encontrado.');
      $('#searchError').removeClass('d-none');
      $('#searchResult').addClass('d-none');
    }

    function renderResult(item) {
      $('#resultPoster').attr('src', item.poster || PLACEHOLDER_POSTER);
      $('#resultTitle').text(item.titulo || 'Sem título');
      $('#resultMeta').text(`${item.ano || 'Ano desconhecido'} • ${item.tipo || ''}`);
      $('#resultPlot').text(item.plot || 'Sem sinopse disponível.');
      $('#searchResult').removeClass('d-none');
      hideError();
    }

    $searchForm.on('submit', async function (event) {
      event.preventDefault();
      hideError();

      const query = $('#searchInput').val().trim();
      if (!query) {
        showError('Digite um título para buscar.');
        return;
      }

      try {
        const result = await window.WatchlistAPI.searchOmdbByTitle(query);
        currentResult = result;
        window.WatchlistStorage.saveLastSearch(result);
        renderResult(result);
      } catch (error) {
        showError(error.message || 'Erro ao buscar na OMDb.');
      }
    });

    $('#addToListBtn').on('click', async function () {
      if (!currentResult) {
        showError('Busque um título antes de adicionar à lista.');
        return;
      }

      try {
        const items = await window.WatchlistAPI.getItems();
        const exists = items.some(
          (item) =>
            String(item.titulo || '').toLowerCase() === currentResult.titulo.toLowerCase() &&
            String(item.ano || '') === String(currentResult.ano || ''),
        );

        if (exists) {
          showToast('Este título já está na sua lista.', true);
          return;
        }

        await window.WatchlistAPI.createItem({
          titulo: currentResult.titulo,
          tipo: currentResult.tipo || 'filme',
          genero: currentResult.genero || '',
          plataforma: '',
          status: 'quero-ver',
          nota: null,
          comentario: '',
          poster: currentResult.poster || '',
          ano: currentResult.ano || '',
          dataCadastro: formatDateISO(),
        });

        showToast('Título adicionado à lista!');
      } catch (error) {
        showToast(error.message || 'Não foi possível adicionar o título.', true);
      }
    });

    const lastSearch = window.WatchlistStorage.getLastSearch();
    if (lastSearch) {
      currentResult = lastSearch;
      renderResult(lastSearch);
    }
  }

  async function initRegisterPage() {
    const $form = $('#cadastroForm');
    if (!$form.length) return;

    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');
    let currentEditItem = null;
    let selectedRating = 0;

    function setRating(value) {
      selectedRating = Number(value) || 0;
      $('#nota').val(selectedRating || '');
      $('#notaLabel').text(selectedRating ? `${selectedRating}/5` : 'Sem nota');

      $('#starRating .star-input').each(function () {
        const starValue = Number($(this).data('value'));
        $(this)
          .toggleClass('bi-star-fill', starValue <= selectedRating)
          .toggleClass('bi-star', starValue > selectedRating);
      });
    }

    $('#starRating .star-input').on('click', function () {
      setRating($(this).data('value'));
    });

    $('#comentario').on('input', function () {
      $('#charCount').text($(this).val().length);
    });

    if (editId) {
      try {
        const item = await window.WatchlistAPI.getItemById(editId);
        currentEditItem = item;
        $('#titulo').val(item.titulo || '');
        $('#tipo').val(item.tipo || '');
        $('#status').val(item.status || '');
        $('#genero').val(item.genero || '');
        $('#comentario')
          .val(item.comentario || '')
          .trigger('input');
        setRating(item.nota || 0);
      } catch (_error) {
        showToast('Não foi possível carregar o item para edição.', true);
      }
    }

    $form.on('submit', async function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (!this.checkValidity()) {
        $(this).addClass('was-validated');
        return;
      }

      const payload = {
        titulo: $('#titulo').val().trim(),
        tipo: $('#tipo').val(),
        genero: $('#genero').val() || '',
        plataforma: currentEditItem?.plataforma || '',
        status: $('#status').val(),
        nota: selectedRating || null,
        comentario: $('#comentario').val().trim(),
        poster: currentEditItem?.poster || '',
        ano: currentEditItem?.ano || '',
        dataCadastro: currentEditItem?.dataCadastro || formatDateISO(),
      };

      try {
        if (editId) {
          await window.WatchlistAPI.updateItem(editId, { ...currentEditItem, ...payload });
          showToast('Título atualizado com sucesso!');
        } else {
          await window.WatchlistAPI.createItem(payload);
          showToast('Título salvo na lista!');
        }

        setTimeout(function () {
          window.location.href = 'my-list.html';
        }, 900);
      } catch (error) {
        showToast(error.message || 'Não foi possível salvar o título.', true);
      }
    });
  }

  async function initMyListPage() {
    const $grid = $('#listaGrid');
    if (!$grid.length) return;

    let items = [];
    let activeStatus = 'todos';
    let activeType = 'todos';
    let deleteId = null;
    const deleteModal = document.getElementById('modalExcluir')
      ? new bootstrap.Modal(document.getElementById('modalExcluir'))
      : null;

    function renderStars(rating) {
      const value = Number(rating) || 0;
      return Array.from({ length: 5 }, function (_, index) {
        return index < value ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';
      }).join('');
    }

    function getFilteredItems() {
      return items.filter(function (item) {
        const statusMatch = activeStatus === 'todos' || item.status === activeStatus;
        const typeMatch = activeType === 'todos' || item.tipo === activeType;
        return statusMatch && typeMatch;
      });
    }

    function renderList() {
      const filtered = getFilteredItems();

      if (!filtered.length) {
        $grid.empty();
        $('#emptyState').removeClass('d-none');
        return;
      }

      $('#emptyState').addClass('d-none');

      const html = filtered
        .map(function (item) {
          return `
						<div class="col" data-status="${escapeHtml(item.status)}" data-tipo="${escapeHtml(item.tipo)}">
							<div class="card movie-card h-100">
								<div class="poster-wrap">
									<img
										src="${escapeHtml(item.poster || PLACEHOLDER_POSTER)}"
										class="card-img-top"
										alt="Poster"
										onerror="this.src='${PLACEHOLDER_POSTER}'"
									/>
									<span class="status-badge ${normalizeStatusBadge(item.status)}">${normalizeStatusLabel(item.status)}</span>
								</div>
								<div class="card-body d-flex flex-column">
									<div class="d-flex justify-content-between align-items-start mb-1">
										<h5 class="card-title mb-0">${escapeHtml(item.titulo)}</h5>
										<span class="card-year font-mono">${escapeHtml(item.ano || '')}</span>
									</div>
									<p class="card-meta font-mono">${escapeHtml(item.genero || 'Sem gênero')}</p>
									<div class="star-rating mb-3">${renderStars(item.nota)}</div>
									<div class="d-flex gap-2 mt-auto pt-3 border-top" style="border-color: var(--border) !important">
										<a href="film-register.html?id=${encodeURIComponent(item.id)}" class="btn btn-outline-secondary btn-sm flex-fill">
											<i class="bi bi-pencil me-1"></i> Editar
										</a>
										<button class="btn btn-outline-danger btn-sm flex-fill btn-excluir" data-id="${escapeHtml(item.id)}">
											<i class="bi bi-trash me-1"></i> Excluir
										</button>
									</div>
								</div>
							</div>
						</div>
					`;
        })
        .join('');

      $grid.html(html);
    }

    async function loadItems() {
      try {
        items = await window.WatchlistAPI.getItems();
        renderList();
      } catch (_error) {
        items = [];
        renderList();
        showToast('Não foi possível carregar sua coleção.', true);
      }
    }

    $('#filtros .filter-btn').on('click', function () {
      $('#filtros .filter-btn').removeClass('active');
      $(this).addClass('active');
      activeStatus = $(this).data('filter');
      renderList();
    });

    $('.filter-tipo').on('click', function () {
      $('.filter-tipo').removeClass('active');
      $(this).addClass('active');
      activeType = $(this).data('tipo');
      renderList();
    });

    $grid.on('click', '.btn-excluir', function () {
      deleteId = $(this).data('id');
      if (deleteModal) {
        deleteModal.show();
      }
    });

    $('#confirmarExcluir').on('click', async function () {
      if (!deleteId) return;

      try {
        await window.WatchlistAPI.deleteItem(deleteId);
        items = items.filter((item) => String(item.id) !== String(deleteId));
        renderList();
        showToast('Título removido da lista.');
      } catch (_error) {
        showToast('Não foi possível remover o título.', true);
      } finally {
        deleteId = null;
        if (deleteModal) {
          deleteModal.hide();
        }
      }
    });

    loadItems();
  }

  $(function () {
    initHomePage();
    initRegisterPage();
    initMyListPage();
  });
})(window.jQuery);
