import BlogCarousel from "./carousel/BlogCarousel";
import WebStoriesGrid from "./WebStoriesGrid";

const CarouselSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
      {/* Blog Carousel Section */}
      <div className="col-span-2 rounded-lg">
        <BlogCarousel />
      </div>

      {/* Web Stories Grid Section */}
      <div className="rounded-lg hidden md:block min-h-[200px]">
        <WebStoriesGrid />
      </div>
    </div>
  );
};

export default CarouselSection;
