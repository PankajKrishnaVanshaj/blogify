import { FcGoogle } from "react-icons/fc";

const AuthForm = () => {
  const googleLogin = () => {
    window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
  };

  return (
    <div className="">
      <div className=" inset-0 flex items-center justify-center bg-opacity-70 z-50">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg max-w-sm w-full transform scale-100 transition-transform duration-300 ease-out">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-100">
            Sign in with Google
          </h2>
          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-full border border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          >
            <FcGoogle className="text-2xl" />
            <span className="font-medium">Sign in with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
