"use client";
import { FcGoogle } from "react-icons/fc";
import Button from "@/components/Button";
import Divider from "@/components/Divider";
import Inputbox from "@/components/Inputbox";
import Logo from "@/components/Logo";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { signIn, googleLogin, isAuthenticated } from "@/api/auth.api";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

const Signin = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const initiateGoogleLogin = () => {
    googleLogin();
  };

  const debouncedSignIn = useCallback(
    debounce(async (email, password) => {
      setIsSubmitting(true);
      const { success, message } = await signIn(email, password);
      if (success) {
        toast.success(message || "Successfully signed in!");
        router.push("/dashboard");
      } else {
        if (message.includes("Too many requests")) {
          toast.error("Please wait a moment before trying again.");
        } else {
          toast.error(message || "Sign-in failed. Please try again.");
        }
      }
      setIsSubmitting(false);
    }, 1000),
    [router]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    debouncedSignIn(data.email, data.password);
  };

  const debouncedCheckAuth = useCallback(
    debounce(async () => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        router.push("/dashboard");
      }
    }, 1000),
    [router]
  );

  useEffect(() => {
    debouncedCheckAuth();
  }, [debouncedCheckAuth]);

  return (
    <div className="flex w-full h-[100vh]">
      <div className="hidden md:flex flex-col gap-y-4 w-1/3 min-h-screen bg-black rounded-md items-center justify-center">
        <Logo type="signin" />
        <span className="text-2xl font-semibold text-white">
          Welcome, <span className="text-rose-500">back!</span>
        </span>
      </div>

      <div className="flex w-full md:w-2/3 h-full bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#071b3e] to-black items-center px-10 md:px-20 lg:px-40">
        <div className="h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="block mb-10 md:hidden">
            <Logo />
          </div>
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
                Sign in to your account
              </h2>
            </div>

            <Button
              onClick={initiateGoogleLogin}
              label="Sign in with Google"
              icon={<FcGoogle />}
              styles="w-full flex flex-row-reverse gap-4 bg-white dark:bg-transparent text-black dark:text-white px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-700"
              disabled={isSubmitting}
            />

            <Divider label="or sign in with email" />

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-col rounded-md shadow-sm -space-y-px gap-5">
                <Inputbox
                  label="Email Address"
                  name="email"
                  type="email"
                  isRequired={true}
                  placeholder="email@example.com"
                  value={data.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />

                <Inputbox
                  label="Password"
                  name="password"
                  type="password"
                  isRequired={true}
                  placeholder="Password"
                  value={data.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <Button
                label={isSubmitting ? "Signing In..." : "Sign In"}
                type="submit"
                styles="group relative w-full flex justify-center py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 mt-8"
                disabled={isSubmitting}
              />
            </form>

            <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
              <p>
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-rose-800 dark:text-rose-500 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;