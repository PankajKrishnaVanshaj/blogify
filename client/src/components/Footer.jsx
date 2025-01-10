import Link from "next/link";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row w-full py-8 items-center justify-between text-[14px] text-gray-700 dark:text-gray-500 min-h-[100px]">
      <p className="w-full text-center md:text-left">
        © 2024 PK Blogify. All rights reserved.
      </p>
      <nav className="flex gap-5 mt-4 md:mt-0 w-full justify-center md:justify-start">
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
        <Link href="/" className="hover:underline">
          Terms of Service
        </Link>
        <Link href="/" target="_blank" className="hover:underline">
          Privacy Policy
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;
