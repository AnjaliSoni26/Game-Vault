import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Pagination } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@clerk/clerk-react';
import { addToFavorites, removeFromFavorites, setCurrentPage, setTotalPages } from '../store/gamesSlice';
import { getGamesByFilters } from '../services/api';
import Filters from '../components/Filters';

const GAMES_PER_PAGE = 12;

// const heroImages = [
//   'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
//   'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
//   'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
// ];

// ✅ GameCard component declared here itself and exported
export const GameCard = ({ game, handleFavorite, favorites, navigate }) => (
  <Card className="game-card h-100">
    <div className="game-card-image-container">
      <Card.Img
        variant="top"
        src={game.background_image}
        className="game-card-image"
        loading="lazy"
      />
      <Button
        variant="link"
        className="favorite-button"
        onClick={() => handleFavorite(game)}
      >
        <Heart
          className={favorites.some(fav => fav.id === game.id) ? 'text-danger' : 'text-white'}
          fill={favorites.some(fav => fav.id === game.id) ? 'currentColor' : 'none'}
        />
      </Button>
    </div>
    <Card.Body>
      <Card.Title className="text-truncate highlight-text">{game.name}</Card.Title>
      <div className="d-flex align-items-center mb-2">
        <Star className="text-warning me-1" size={16} />
        <span>{game.rating}/5</span>
      </div>
      <div className="game-tags mb-3">
        {game.genres?.slice(0, 3).map(genre => (
          <span key={genre.id} className="game-tag me-1">
            {genre.name}
          </span>
        ))}
      </div>
      <Button
        variant="outline-primary"
        className="w-100 neon-button"
        onClick={() => navigate(`/game/${game.id}`)}
      >
        View Details
      </Button>
    </Card.Body>
  </Card>
);

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSignedIn } = useAuth();
  const favorites = useSelector(state => state.games.favorites);
  const searchResults = useSelector(state => state.games.searchResults);
  const isSearchLoading = useSelector(state => state.games.loading);
  const currentPage = useSelector(state => state.games.currentPage);
  const totalPages = useSelector(state => state.games.totalPages);
  const filters = useSelector(state => state.games.filters);

  const fetchGames = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const data = await getGamesByFilters({ 
        ...filters, 
        page, 
        page_size: GAMES_PER_PAGE,
        ordering: '-rating'
      });
      setGames(data.results);
      dispatch(setTotalPages(Math.ceil(data.count / GAMES_PER_PAGE)));
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    if (searchQuery && searchResults.length > 0) {
      setGames(searchResults);
    } else {
      fetchGames(currentPage, filters);
    }
  }, [searchParams, searchResults, currentPage, filters]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo(0, 0);
  };

  const handleFavorite = (game) => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }

    const isFavorite = favorites.some(fav => fav.id === game.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(game.id));
    } else {
      dispatch(addToFavorites(game));
    }
  };

  if (loading || isSearchLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
    {/* hero section */}
      {/* <div className="hero-section position-relative mb-4">
        <Container className="py-4">
          <Row className="align-items-center min-vh-75">
            <Col md={6} className="text-center text-md-start">
              <h1 id="discover-text" className="display-3 fw-bold mb-4 text-gradient">
                Discover Your Next Gaming Adventure
              </h1>
              <p className="lead mb-4 text-light">
                Explore thousands of games, from indie gems to AAA titles. Your perfect game awaits.
              </p>
              <Button variant="outline-light" size="lg" className="neon-button">
                Explore Now
              </Button>
            </Col>
            <Col md={6} className="mt-4 mt-md-0">
              <div className="hero-image-grid">
                {games.slice(0, 4).map((game, index) => (
                  <img
                    key={game.id}
                    src={game.background_image}
                    alt={game.name}
                    className={`hero-grid-image hero-image-${index + 1}`}
                  />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </div> */}
      
  <div className="hero-section position-relative mb-4">
  <Container className="py-4">
    <Row className="align-items-center min-vh-75">
      <Col md={6} className="text-center text-md-start">
        <h1 id="discover-text" className="display-3 fw-bold mb-4 text-gradient">
          Discover Your Next Gaming Adventure
        </h1>
        <p className="lead mb-4 text-light">
          Explore thousands of games, from indie gems to AAA titles. Your perfect game awaits.
        </p>
        <Button variant="outline-light" size="lg" className="neon-button">
          Explore Now
        </Button>
      </Col>
      <Col md={6} className="mt-4 mt-md-0 text-center">
        <div className="hero-image-container">
          <img
            src="hero-visual.png"
            alt="Gaming Hero Visual"
            className="hero-main-image"
          />
        </div>
      </Col>
    </Row>
  </Container>
</div>


      <Container className="mt-4 games-section-container">
        <Row>
          <Col md={3} className="mb-4">
            <Filters />
          </Col>
          <Col md={9}>
            <h2 className="text-gradient mb-4">
              {searchResults.length > 0 ? 'Search Results' : 'Popular Games'}
            </h2>
            <Row xs={1} sm={2} md={3} className="g-4">
              {games.map(game => (
                <Col key={game.id}>
                  <GameCard
                    game={game}
                    handleFavorite={handleFavorite}
                    favorites={favorites}
                    navigate={navigate}
                  />
                </Col>
              ))}
            </Row>
            {!searchResults.length && (
              <Pagination className="justify-content-center mt-4">
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                <Pagination.Item
                  active={currentPage === 1}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </Pagination.Item>

                {totalPages > 5 && currentPage > 3 && <Pagination.Ellipsis />}

                {Array.from({ length: Math.min(totalPages - 1, currentPage + 1) - Math.max(2, currentPage - 1) + 1 })
                  .map((_, idx) => {
                    const pageNumber = Math.max(2, currentPage - 1) + idx;
                    return (
                      <Pagination.Item
                        key={pageNumber}
                        active={pageNumber === currentPage}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </Pagination.Item>
                    );
                  })}

                {totalPages > 5 && currentPage < totalPages - 2 && <Pagination.Ellipsis />}

                {totalPages > 1 && (
                  <Pagination.Item
                    active={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                  >
                    {totalPages}
                  </Pagination.Item>
                )}

                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
