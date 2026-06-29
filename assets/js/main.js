(function ($) {
  const PLACEHOLDER_POSTER = 'https://via.placeholder.com/300x450/13161F/E8B44B?text=SEM+POSTER';
  const TRENDING_IMDB_IDS = ['tt4154796', 'tt15398776', 'tt9362722', 'tt0903747'];

  // ID 12 - REGEX para validar o título: precisa ter ao menos 2 caracteres
  // (letras, números e acentos) e não pode conter símbolos como @ # $ %.
  const TITULO_REGEX = /^[A-Za-zÀ-ÿ0-9][A-Za-zÀ-ÿ0-9\s:'\-,.!?]{1,119}$/;
  const NOTA_REGEX = /^(5([.,]0)?|[0-4]([.,][0-9])?)$/;

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

    async function addMovieToList(movie) {
      const items = await window.WatchlistAPI.getItems();
      const exists = items.some(
        (item) =>
          String(item.titulo || '').toLowerCase() === movie.titulo.toLowerCase() &&
          String(item.ano || '') === String(movie.ano || ''),
      );

      if (exists) {
        showToast('Este título já está na sua lista.', true);
        return;
      }

      await window.WatchlistAPI.createItem({
        titulo: movie.titulo,
        tipo: movie.tipo || 'filme',
        genero: movie.genero || '',
        plataforma: '',
        status: 'quero-ver',
        nota: null,
        comentario: '',
        poster: movie.poster || '',
        ano: movie.ano || '',
        dataCadastro: formatDateISO(),
      });

      showToast('Título adicionado à lista!');
    }

    function renderTrending(items) {
      const html = items
        .map(function (item) {
          const meta = [item.genero, item.duracao].filter(Boolean).join(' • ');

          return `
            <div class="col-12 col-sm-6 col-lg-3">
              <div class="movie-card d-flex flex-column bg-surface rounded-4 overflow-hidden h-100">
                <div class="movie-card-img-wrapper position-relative overflow-hidden">
                  <img
                    src="${escapeHtml(item.poster || PLACEHOLDER_POSTER)}"
                    alt="${escapeHtml(item.titulo)}"
                    class="movie-card-img w-100 h-100 object-fit-cover"
                    onerror="this.src='${PLACEHOLDER_POSTER}'"
                  />
                  <div
                    class="position-absolute top-0 end-0 m-3 bg-dark bg-opacity-75 rounded-pill px-3 py-1 d-flex align-items-center gap-1 backdrop-blur-12"
                  >
                    <span class="material-symbols-outlined text-primary-container fs-14px icon-fill">star</span>
                    <span class="font-mono text-primary-container fw-bold fs-12px">${escapeHtml(item.imdbRating || '-')}</span>
                  </div>
                </div>
                <div class="p-4 d-flex flex-column flex-grow-1">
                  <h3 class="fs-5 fw-semibold mb-1 movie-title">${escapeHtml(item.titulo)}</h3>
                  <p class="font-mono text-outline text-uppercase mb-4 fs-10px letter-spacing-01">
                    ${escapeHtml(meta || item.tipo || 'Título')}
                  </p>
                  <button
                    class="btn btn-add-list mt-auto py-2 rounded-3 fs-6 fw-semibold d-flex align-items-center justify-content-center gap-2 btn-add-trending"
                    data-imdb-id="${escapeHtml(item.imdbID)}"
                  >
                    <span class="material-symbols-outlined fs-18px">add</span>
                    Adicionar à Lista
                  </button>
                </div>
              </div>
            </div>
          `;
        })
        .join('');

      $('#trendingGrid').html(html);
    }

    async function loadTrending() {
      const $trendingGrid = $('#trendingGrid');
      if (!$trendingGrid.length) return;

      try {
        const trendingItems = await Promise.all(
          TRENDING_IMDB_IDS.map((imdbID) => window.WatchlistAPI.getOmdbById(imdbID)),
        );
        renderTrending(trendingItems);
      } catch (_error) {
        $trendingGrid.html(`
          <div class="col-12">
            <div class="alert alert-danger mb-0">
              Não foi possível carregar os títulos em alta pela OMDb.
            </div>
          </div>
        `);
      }
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
        await addMovieToList(currentResult);
      } catch (error) {
        showToast(error.message || 'Não foi possível adicionar o título.', true);
      }
    });

    $('#trendingGrid').on('click', '.btn-add-trending', async function () {
      const imdbID = $(this).data('imdb-id');

      try {
        const movie = await window.WatchlistAPI.getOmdbById(imdbID);
        await addMovieToList(movie);
      } catch (error) {
        showToast(error.message || 'Não foi possível adicionar o título.', true);
      }
    });

    const lastSearch = window.WatchlistStorage.getLastSearch();
    if (lastSearch) {
      currentResult = lastSearch;
      renderResult(lastSearch);
    }

    loadTrending();
  }

  async function initRegisterPage() {
    const $form = $('#cadastroForm');
    if (!$form.length) return;

    const params = new URLSearchParams(window.location.search);
    const editId = params.get('id');
    let currentEditItem = null;

    // ID 21 - jQuery Mask Plugin aplicado ao campo de nota (0.0 a 5.0)
    if ($.fn.mask) {
      $('#nota').mask('0.0', { reverse: false });
    }

    // ID 12 - validação customizada com REGEX no título
    function validateTitulo() {
      const value = $('#titulo').val().trim();
      const isValid = TITULO_REGEX.test(value);
      $('#titulo')
        .toggleClass('is-invalid', !isValid)
        .toggleClass('is-valid', isValid && value.length > 0);
      return isValid;
    }

    function validateNota() {
      const value = $('#nota').val().trim();
      const isValid = !value || NOTA_REGEX.test(value);
      $('#nota')
        .toggleClass('is-invalid', !isValid)
        .toggleClass('is-valid', isValid && !!value);
      return isValid;
    }

    $('#titulo').on('input blur', validateTitulo);
    $('#nota').on('input blur', validateNota);

    $('#comentario, #sinopse').on('input', function () {
      $('#charCount').text($(this).val().length);
    });

    if (editId) {
      try {
        const item = await window.WatchlistAPI.getItemById(editId);
        currentEditItem = item;

        $('#formTitle').text('Editar Conteúdo');
        $('#titulo').val(item.titulo || '');
        $('#tipo').val(item.tipo || '');
        $('#status').val(item.status || '');
        $('#genero').val(item.genero || '');
        $('#nota').val(item.nota ? Number(item.nota).toFixed(1) : '');
        $('#sinopse, #comentario')
          .val(item.comentario || '')
          .trigger('input');

        // ID 13 - restaura checkboxes de plataforma marcados anteriormente
        const plataformas = (item.plataforma || '').split(',').map((p) => p.trim());
        $('.check-plataforma').each(function () {
          $(this).prop('checked', plataformas.includes($(this).val()));
        });

        // ID 13 - restaura o radio "assistiu no cinema"
        if (item.assistiuCinema === 'sim') {
          $('#cinemaSim').prop('checked', true);
        }
      } catch (_error) {
        showToast('Não foi possível carregar o item para edição.', true);
      }
    }

    $form.on('submit', async function (event) {
      event.preventDefault();
      event.stopPropagation();

      const tituloValido = validateTitulo();
      const notaValida = validateNota();

      if (!this.checkValidity() || !tituloValido || !notaValida) {
        $(this).addClass('was-validated');
        if (!tituloValido) {
          $('#titulo').addClass('is-invalid');
        }
        if (!notaValida) {
          $('#nota').addClass('is-invalid');
        }
        return;
      }

      // ID 13 - coleta os checkboxes marcados de plataforma
      const plataformasSelecionadas = $('.check-plataforma:checked')
        .map(function () {
          return $(this).val();
        })
        .get()
        .join(', ');

      // ID 13 - coleta o radio "assistiu no cinema"
      const assistiuCinema = $('input[name="cinema"]:checked').val() || 'nao';

      const notaTexto = $('#nota').val().trim();
      const notaNumero = notaTexto ? parseFloat(notaTexto.replace(',', '.')) : null;

      const payload = {
        titulo: $('#titulo').val().trim(),
        tipo: $('#tipo').val(),
        genero: $('#genero').val() || '',
        plataforma: plataformasSelecionadas || currentEditItem?.plataforma || '',
        status: $('#status').val(),
        nota: Number.isFinite(notaNumero) ? notaNumero : null,
        comentario: ($('#sinopse').val() || $('#comentario').val() || '').trim(),
        assistiuCinema,
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

        // ID 14 - lembra o último status usado, para já vir selecionado
        // na próxima vez que o usuário cadastrar um título
        window.WatchlistStorage.saveLastStatusUsed(payload.status);

        setTimeout(function () {
          window.location.href = 'collection.html';
        }, 900);
      } catch (error) {
        showToast(error.message || 'Não foi possível salvar o título.', true);
      }
    });

    // ID 14 - pré-seleciona o status mais usado pelo usuário, lido do localStorage
    if (!editId) {
      const lastStatus = window.WatchlistStorage.getLastStatusUsed();
      if (lastStatus) {
        $('#status').val(lastStatus);
      }
    }
  }

  async function initMyListPage() {
    const $grid = $('#listaGrid');
    if (!$grid.length) return;

    let items = [];
    let activeStatus = window.WatchlistStorage.getFiltroPreferido();
    let activeType = 'todos';
    let deleteId = null;
    const deleteModal = document.getElementById('modalExcluir')
      ? new bootstrap.Modal(document.getElementById('modalExcluir'))
      : null;

    // ID 14 - aplica visualmente o filtro de status lido do localStorage
    $('#filtros button')
      .removeClass('active')
      .filter(function () {
        return $(this).data('filter') === activeStatus;
      })
      .addClass('active');

    function renderStars(rating) {
      const value = Math.min(Math.max(Number(rating) || 0, 0), 5);
      return Array.from({ length: 5 }, function (_, index) {
        if (value >= index + 1) {
          return '<i class="bi bi-star-fill"></i>';
        }
        if (value > index) {
          return '<i class="bi bi-star-half"></i>';
        }
        return '<i class="bi bi-star"></i>';
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
						<div class="col-12 col-sm-6 col-lg-4 col-xl-3" data-status="${escapeHtml(item.status)}" data-tipo="${escapeHtml(item.tipo)}">
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
										<a href="add-new-movie.html?id=${encodeURIComponent(item.id)}" class="btn btn-outline-secondary btn-sm flex-fill">
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

    $('#filtros button').on('click', function () {
      $('#filtros button').removeClass('active');
      $(this).addClass('active');
      activeStatus = $(this).data('filter');
      window.WatchlistStorage.saveFiltroPreferido(activeStatus);
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
