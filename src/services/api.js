import axios from 'axios';
const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY; // Use the environment variable for the API key
const BASE_URL = 'https://api.rawg.io/api';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    key: RAWG_API_KEY,
  },
});

export const getGames = async (params = {}) => {
  const response = await api.get('/games', { params });
  return response.data;
};

export const getGameDetails = async (id) => {
  const [gameDetails, screenshots] = await Promise.all([
    api.get(`/games/${id}`),
    api.get(`/games/${id}/screenshots`)
  ]);
  return {
    ...gameDetails.data,
    screenshots: screenshots.data
  };
};

export const searchGames = async (query) => {
  const response = await api.get('/games', {
    params: {
      search: query,
      page_size: 20,
      search_precise: true,
      search_exact: false,
      ordering: '-rating'
    },
  });
  return response.data;
};

export const getGamesByFilters = async (filters) => {
  const params = {
    ...filters,
    page_size: 20
  };

  // Clean up empty filter values
  Object.keys(params).forEach(key => {
    if (!params[key]) delete params[key];
  });

  const response = await api.get('/games', { params });
  return response.data;
};