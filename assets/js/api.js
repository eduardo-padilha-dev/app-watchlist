(function () {
  const API_BASE_URL = 'http://localhost:3001';
  const OMDB_BASE_URL = 'https://www.omdbapi.com/';

  // Chave pública de desenvolvimento; pode ser sobrescrita definindo window.OMDB_API_KEY.
  const OMDB_API_KEY = window.OMDB_API_KEY || 'thewdb';

  async function safeJson(response) {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Resposta inválida da API.');
    }
    return response.json();
  }

  async function request(path, options) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Erro na API local: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return safeJson(response);
  }

  function mapOmdbDetail(detail) {
    return {
      imdbID: detail.imdbID,
      titulo: detail.Title || '',
      ano: detail.Year || '',
      plot: detail.Plot || 'Sem sinopse disponível.',
      poster: detail.Poster && detail.Poster !== 'N/A' ? detail.Poster : '',
      genero: detail.Genre ? detail.Genre.split(',')[0].trim() : '',
      tipo: detail.Type === 'series' ? 'serie' : 'filme',
      duracao: detail.Runtime && detail.Runtime !== 'N/A' ? detail.Runtime : '',
      imdbRating: detail.imdbRating && detail.imdbRating !== 'N/A' ? detail.imdbRating : '',
    };
  }

  async function getOmdbById(imdbID) {
    const detailUrl = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${encodeURIComponent(imdbID)}&plot=short`;
    const detailResponse = await fetch(detailUrl);
    const detail = await safeJson(detailResponse);

    if (detail.Response === 'False') {
      throw new Error(detail.Error || 'Não foi possível carregar os detalhes.');
    }

    return mapOmdbDetail(detail);
  }

  async function searchOmdbByTitle(query) {
    const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await safeJson(response);

    if (data.Response === 'False' || !Array.isArray(data.Search) || !data.Search.length) {
      throw new Error(data.Error || 'Nenhum resultado encontrado.');
    }

    return getOmdbById(data.Search[0].imdbID);
  }

  const WatchlistAPI = {
    getItems() {
      return request('/itens');
    },

    getItemById(id) {
      return request(`/itens/${id}`);
    },

    createItem(payload) {
      return request('/itens', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    updateItem(id, payload) {
      return request(`/itens/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },

    deleteItem(id) {
      return request(`/itens/${id}`, { method: 'DELETE' });
    },

    searchOmdbByTitle,
    getOmdbById,
  };

  window.WatchlistAPI = WatchlistAPI;
})();
