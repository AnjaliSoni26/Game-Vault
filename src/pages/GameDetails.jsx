import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Button, Carousel } from 'react-bootstrap';
import { Heart, Star, Calendar, Monitor, Gamepad2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../store/gamesSlice';
import { getGameDetails } from '../services/api';

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.games.favorites);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const data = await getGameDetails(id);
        setGame(data);
      } catch (error) {
        console.error('Error fetching game details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  const handleFavorite = () => {
    const isFavorite = favorites.some(fav => fav.id === game.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(game.id));
    } else {
      dispatch(addToFavorites(game));
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!game) {
    return (
      <Container className="py-5">
        <h2 className="text-center text-gradient">Game not found</h2>
      </Container>
    );
  }

  return (
    <div className="game-details-page">
      <div
        className="game-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${game.background_image})`,
        }}
      >
        <Container className="py-5">
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="display-4 fw-bold text-gradient mb-3">{game.name}</h1>
              <div className="d-flex align-items-center gap-4 mb-4">
                <div className="d-flex align-items-center">
                  <Star className="text-warning me-2" />
                  <span className="fs-5">{game.rating}/5</span>
                </div>
                <div className="d-flex align-items-center">
                  <Calendar className="text-primary me-2" />
                  <span>{game.released}</span>
                </div>
              </div>
              <Button
                variant={favorites.some(fav => fav.id === game.id) ? "danger" : "primary"}
                className="neon-button me-3"
                onClick={handleFavorite}
              >
                <Heart className="me-2" />
                {favorites.some(fav => fav.id === game.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              <Button
                as={Link}
                to="/"
                variant="outline-light"
                className="neon-button"
              >
                Home
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          <Col md={8}>
            <div className="game-section mb-5">
              <h3 className="text-gradient mb-4">About</h3>
              <p className="lead">{game.description_raw}</p>
            </div>

            <div className="game-section mb-5">
              <h3 className="text-gradient mb-4">Screenshots</h3>
              <Carousel
              fade
              interval={4000}
              pause="hover"
              className="game-carousel neon-carousel"
              indicators
            >
              {game.screenshots?.results?.map((screenshot, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100 rounded"
                    src={screenshot.image}
                    alt={`Screenshot ${index + 1}`}
                  />
                  <Carousel.Caption className="carousel-caption-blur">
                    <h5 className="carousel-caption-title">{game.name}</h5>
                    <p>Screenshot {index + 1}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
            </div>
          </Col>

          <Col md={4}>
            <div className="game-info-card">
              <h3 className="text-gradient mb-4">Game Info</h3>
              
              <div className="info-item mb-4">
                <h5 className="text-gradient mb-3">Platforms</h5>
                <div className="d-flex flex-wrap gap-2">
                  {game.platforms?.map(({ platform }) => (
                    <span key={platform.id} className="platform-tag">
                      <Monitor className="me-1" size={16} />
                      {platform.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="info-item mb-4">
                <h5 className="text-gradient mb-3">Genres</h5>
                <div className="d-flex flex-wrap gap-2">
                  {game.genres?.map(genre => (
                    <span key={genre.id} className="game-tag">
                      <Gamepad2 className="me-1" size={16} />
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {game.metacritic && (
                <div className="info-item mb-4">
                  <h5 className="text-gradient mb-3">Metacritic Score</h5>
                  <div className={`metacritic-score score-${Math.floor(game.metacritic / 20)}`}>
                    {game.metacritic}
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default GameDetails;
