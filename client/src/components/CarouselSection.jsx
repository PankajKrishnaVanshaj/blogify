import BlogCarousel from "./carousel/BlogCarousel";
import WebStoriesGrid from "./WebStoriesGrid";

const CarouselSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-4 ">
      <div className="col-span-2 rounded-lg">
        <BlogCarousel />
      </div>
      <div className="rounded-lg hidden md:block">
        <WebStoriesGrid/>
      </div>
    </div>
  );
};

export default CarouselSection;
