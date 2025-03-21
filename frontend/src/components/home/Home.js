import Hero from "../hero/Hero";
import { Container, Row, Col } from "react-bootstrap";
import "./Home.css";

const Home = ({ movies }) => {
  return (
    <Container fluid className="home-container p-0">
      <Row className="g-0">
        <Col xs={12}>
          <Hero movies={movies} />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
