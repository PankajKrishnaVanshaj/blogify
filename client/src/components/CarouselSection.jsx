import BlogCarousel from "./carousel/BlogCarousel";

const CarouselSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-4">
      <div className="col-span-2 rounded-lg">
        <BlogCarousel />
      </div>
      <div className="bg-gray-800 p-4 rounded-lg md:block hidden sm:min-h-[150px] sm:opacity-0 sm:visible md:opacity-100 md:visible">
        <ul>
          <li className="text-black">Ads</li>
        </ul>
      </div>
    </div>
  );
};

export default CarouselSection;
