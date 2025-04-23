import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [],
  searchResults: [],
  loading: false,
  currentPage: 1,
  totalPages: 0,
  filters: {
    genres: '',
    dates: '',
    ordering: '-rating'
  }
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter(game => game.id !== action.payload);
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    }
  },
});

export const { 
  addToFavorites, 
  removeFromFavorites, 
  setSearchResults, 
  setLoading,
  updateFilters,
  resetFilters,
  setCurrentPage,
  setTotalPages
} = gamesSlice.actions;

export default gamesSlice.reducer;