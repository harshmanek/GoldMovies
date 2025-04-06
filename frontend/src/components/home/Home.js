import Hero from "../hero/Hero";
import "./Home.css";

const Home = ({ movies }) => {
  return (
    <div className="home-container w-full px-0">
      <div className="w-full">
        <Hero movies={movies} />
      </div>
    </div>
  );
};

export default Home;
