import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
  Spinner,
  Row,
  Col,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  useAuth,
  SignInButton,
  UserButton
} from '@clerk/clerk-react';
import {
  TowerControl as GameController,
  Library,
  Search,
  Star
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { searchGames } from '../services/api';
import {
  setSearchResults,
  setLoading
} from '../store/gamesSlice';
import debounce from 'lodash/debounce';
import { GameCard } from '../pages/Home';

const Navigation = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchResults = useSelector(state => state.games.searchResults);
  const isSearchLoading = useSelector(state => state.games.loading);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        dispatch(setSearchResults([]));
        setShowDropdown(false);
        navigate('/');
        return;
      }
  
      dispatch(setLoading(true));
      try {
        const results = await searchGames(query);
        dispatch(setSearchResults(results?.results || []));
        setShowDropdown(true);
        navigate(`/?search=${encodeURIComponent(query)}`); // 🔥 Navigate to homepage with query
      } catch (error) {
        console.error('Search error:', error);
        dispatch(setSearchResults([]));
        setShowDropdown(false);
      } finally {
        dispatch(setLoading(false));
      }
    }, 300),
    [dispatch, navigate]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSelectGame = (id) => {
    setShowDropdown(false);
    setSearchQuery('');
    navigate(`/game/${id}`);
  };

  return (
    <Navbar bg="dark"  variant="dark" expand="lg" className="border-bottom border-primary"  style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <GameController className="text-primary me-2" />
          <span className="text-gradient">GameVault</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Form className="d-flex flex-grow-1 mx-lg-4 position-relative" onSubmit={e => e.preventDefault()}>
            <div className="position-relative w-100">
              <Search className="position-absolute top-50 translate-middle-y ms-3 text-primary" size={20} />
              <FormControl
                type="search"
                placeholder="Search games..."
                className="search-bar ps-5"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search"
              />

              {/* Search Dropdown */}
              {showDropdown && (
                <div
                  className="search-dropdown bg-dark position-absolute mt-1 w-100 rounded border border-primary shadow z-3"
                  style={{ maxHeight: '350px', overflowY: 'auto' }}
                >
                  {isSearchLoading ? (
                    <div className="d-flex justify-content-center align-items-center p-3">
                      <Spinner animation="border" variant="primary" size="sm" />
                      <span className="ms-2 text-light">Searching...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.slice(0, 5).map(game => (
                      <div
                        key={game.id}
                        onClick={() => handleSelectGame(game.id)}
                        className="search-item px-3 py-2 border-bottom border-secondary hover-bg-primary text-white d-flex align-items-center"
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={game.background_image}
                          alt={game.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'cover',
                            borderRadius: '5px',
                            marginRight: '10px',
                          }}
                        />
                        <div>
                          <div className="fw-bold">{game.name}</div>
                          {/* <div className="d-flex align-items-center text-muted" style={{ fontSize: '0.85rem' }}>
                            <Star className="text-warning me-1" size={14} />
                            {game.rating}/5
                          </div> */}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted px-3 py-2">No results found</div>
                  )}
                </div>
              )}
            </div>
          </Form>

          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/library" className="d-flex align-items-center">
              <Library className="me-2" />
              Library
            </Nav.Link>

            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="btn btn-primary">Sign In</button>
              </SignInButton>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;

