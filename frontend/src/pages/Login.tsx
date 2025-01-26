"use client";
import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ApiRoutes } from "@/utils/routeApi";



// interface User {
//   id: string;
//   name: string;
//   email: string;
// }

// interface SignInProps {
//   setUser: React.Dispatch<React.SetStateAction<User | null>>;
// }



export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  console.log(loading)

  async function handleSubmit(e:  React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    if (!username.trim()) newErrors.username = "Username is required.";
    if (!password.trim()) newErrors.password = "Password is required.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ username, password });
      const res = await axios.post(ApiRoutes.signin, body, config);

      if (res.status === 200) {
        const { token, user } = res.data;
        console.log(user)
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/home");
      } else {
        throw new Error(res.data.message || "Invalid email or password.");
      }
    } catch (error: any) {
      setErrors({
        form: error.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="h-[100vh] flex justify-center items-center  ">
        <div className="max-w-md w-96 mx-auto rounded-none md:rounded-2xl p-4 md:p-8 bg-black dark:bg-black h-fit">
          <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-tr from-purple-300/80 to-white/90 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <form className="my-8" onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label className="font-normal" htmlFor="username">
                Username
              </Label>
              <Input
                className="bg-[#020617]"
                id="username"
                placeholder="projectmayhem@fc.com"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username}</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label className="font-normal" htmlFor="password">
                Password
              </Label>
              <Input
                className="bg-[#020617]"
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </LabelInputContainer>
            {errors.form && (
              <p className="text-red-500 text-sm mb-4">{errors.form}</p>
            )}
         <button
          className=" p-2 bg-gradient-to-br relative group/btn block  w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
          <div className="  bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </button>
          </form>
          <div className="text-center mt-4 ">
            <Link to="/signup">
              <Button className="text-gray-400 hover:text-white" variant={"link"}>
                Don’t have an account? Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

