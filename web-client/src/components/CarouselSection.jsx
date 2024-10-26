import BlogCarousel from "./carousel/BlogCarousel";

const CarouselSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-4">
      <div className="col-span-2 rounded-lg">
        <BlogCarousel />
      </div>
      <div className="hidden md:block bg-gray-700 p-4 rounded-lg">
        <ul>kfdjksf</ul>
      </div>
    </div>
  );
};

export default CarouselSection;
