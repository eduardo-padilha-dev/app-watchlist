(function () {
  const STORAGE_KEYS = {
    LAST_SEARCH: 'watchlist:lastSearch',
    LAST_STATUS_USED: 'watchlist:lastStatusUsed',
    FILTRO_PREFERIDO: 'watchlist:filtroPreferido',
  };

  function setJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getJson(key, fallbackValue) {
    const raw = localStorage.getItem(key);
    if (!raw) return fallbackValue;

    try {
      return JSON.parse(raw);
    } catch (_error) {
      return fallbackValue;
    }
  }

  const WatchlistStorage = {
    saveLastSearch(item) {
      setJson(STORAGE_KEYS.LAST_SEARCH, item);
    },

    getLastSearch() {
      return getJson(STORAGE_KEYS.LAST_SEARCH, null);
    },

    clearLastSearch() {
      localStorage.removeItem(STORAGE_KEYS.LAST_SEARCH);
    },

    // ID 14 - guarda o último status usado no formulário de cadastro,
    // para já vir pré-selecionado na próxima visita
    saveLastStatusUsed(status) {
      localStorage.setItem(STORAGE_KEYS.LAST_STATUS_USED, status || '');
    },

    getLastStatusUsed() {
      return localStorage.getItem(STORAGE_KEYS.LAST_STATUS_USED) || '';
    },

    // ID 14 - guarda o último filtro de status usado na página da coleção
    saveFiltroPreferido(filtro) {
      localStorage.setItem(STORAGE_KEYS.FILTRO_PREFERIDO, filtro || 'todos');
    },

    getFiltroPreferido() {
      return localStorage.getItem(STORAGE_KEYS.FILTRO_PREFERIDO) || 'todos';
    },
  };

  window.WatchlistStorage = WatchlistStorage;
})();
