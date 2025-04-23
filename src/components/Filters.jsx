import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { updateFilters, resetFilters } from '../store/gamesSlice';

const Filters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(state => state.games.filters);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFilters({ [name]: value }));
  };

  const handleReset = () => {
    dispatch(resetFilters());
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="filters-container p-4 bg-dark rounded">
      <h4 className="text-gradient mb-4">Filters</h4>
      
      <Form.Group className="mb-3">
        <Form.Label className="text-light">Category</Form.Label>
        <Form.Select 
          name="genres" 
          value={filters.genres}
          onChange={handleFilterChange} 
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="action">Action</option>
          <option value="rpg">RPG</option>
          <option value="strategy">Strategy</option>
          <option value="shooter">Shooter</option>
          <option value="adventure">Adventure</option>
          <option value="puzzle">Puzzle</option>
          <option value="racing">Racing</option>
          <option value="sports">Sports</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="text-light">Release Year</Form.Label>
        <Form.Select 
          name="dates" 
          value={filters.dates}
          onChange={handleFilterChange} 
          className="filter-select"
        >
          <option value="">All Years</option>
          {years.map(year => (
            <option key={year} value={`${year}-01-01,${year}-12-31`}>
              {year}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="text-light">Sort By</Form.Label>
        <Form.Select 
          name="ordering" 
          value={filters.ordering}
          onChange={handleFilterChange} 
          className="filter-select"
        >
          <option value="-rating">Popularity (High to Low)</option>
          <option value="rating">Popularity (Low to High)</option>
          <option value="-released">Release Date (Newest)</option>
          <option value="released">Release Date (Oldest)</option>
          <option value="-metacritic">Metacritic (High to Low)</option>
        </Form.Select>
      </Form.Group>

      <Button 
        variant="outline-primary" 
        className="w-100 neon-button"
        onClick={handleReset}
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default Filters;