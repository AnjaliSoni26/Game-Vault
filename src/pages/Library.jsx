import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { removeFromFavorites } from '../store/gamesSlice';

const Library = () => {
  const favorites = useSelector(state => state.games.favorites);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  
  if (favorites.length === 0) {
    return (
      

      <Container className="py-5 text-center">
        <div className="empty-library">
          <Heart size={64} className="text-primary mb-4" />
          <h2 className="text-gradient mb-4">Your Library is Empty</h2>
          <p className="lead mb-4">Start adding your favorite games to build your collection!</p>
          <Button
            variant="outline-primary"
            className="neon-button"
            onClick={() => navigate('/')}
          >
            Explore Games
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="library-title text-gradient mb-4 text-center">My Game Library</h1>

      <Row xs={1} sm={2} md={3} lg={4} className="g-4 mb-5">
        {favorites.map(game => (
          <Col key={game.id}>
            <Card className="game-card h-100">
              <div className="game-card-image-container">
                <Card.Img
                  variant="top"
                  src={game.background_image}
                  className="game-card-image"
                />
                <Button
                  variant="link"
                  className="favorite-button"
                  onClick={() => dispatch(removeFromFavorites(game.id))}
                >
                  <Heart className="text-danger" fill="currentColor" />
                </Button>
              </div>
              <Card.Body>
                <Card.Title className="text-truncate">{game.name}</Card.Title>
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
          </Col>
        ))}
      </Row>

      <div className="text-center">
        <Button
          variant="outline-light"
          className="neon-button"
          onClick={() => navigate('/')}
        >
          ⬅ Explore More Games
        </Button>
      </div>
    </Container>
  );
};

export default Library;

