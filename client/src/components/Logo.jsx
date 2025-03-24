import Image from "next/image";
import Link from "next/link";

const Logo = ({ type }) => {
  return (
    <div className="">
      <Link
        href="/"
        className={`text-3xl text-primary ${type && " text-5xl font-bold"}`}
      >
        PK
        <span>
          <Image
            src={"/blogify.png"}
            width={50}
            height={50}
            alt="logo"
            className="inline-block animate-bounce"
          />
        </span>
        <span
          className={`text-2xl text-primary ${type && " text-4xl font-bold"}`}
        >
          Blogify
        </span>
      </Link>
    </div>
  );
};

export default Logo;
