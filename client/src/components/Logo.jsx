import Image from "next/image";
import Link from "next/link";

const Logo = ({ type }) => {
  return (
    <div className="">
      <Link
        href="/"
        className={`text-3xl text-rose-500 ${type && " text-5xl font-bold"}`}
      >
        PK
        <span>
          <Image
            src={"/pankri.png"}
            width={50}
            height={50}
            alt="logo"
            className="inline-block animate-bounce"
          />
        </span>
        <span
          className={`text-2xl font-semibold dark:text-white ${
            type && "text-white  text-4xl"
          }`}
        >
          Blogify
        </span>
      </Link>
    </div>
  );
};

export default Logo;
