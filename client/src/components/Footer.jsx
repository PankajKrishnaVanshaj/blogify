import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex flex-col md:flex-row w-full py-8 items-center justify-between text-[14px] text-gray-700 dark:text-gray-500">
      <p>© 2024 PK Blogify. All rights reserved.</p>
      <dir className="flex gap-5">
        <Link href="/contact">Contact</Link>
        <Link href="/">Terms of Service</Link>
        <Link href="/" target="_blank">
          Privacy Policy
        </Link>
      </dir>
    </div>
  );
};

export default Footer;
