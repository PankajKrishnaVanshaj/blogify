import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <div className="">
      <Link to="/" className={`text-2xl font-semibold `}>
        PK <span className={`text-3xl text-rose-500 `}>Blogify</span>
      </Link>
    </div>
  );
};

export default Logo;
