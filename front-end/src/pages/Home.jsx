import SearchBar from "../component/SearchBar";
import Carousel from "../component/Carousel";
import Category from "../component/Category";
import HomeSection2 from "../component/HomeSection2";
import HomeSection3 from "../component/HomeSection3";
import Footer from "../component/Footer";

function Home() {
  return (
    <div className="">
      <SearchBar />
      <Carousel />
      <HomeSection2 />
      <Category />
      <HomeSection3 />
    </div>
  );
}

export default Home;
