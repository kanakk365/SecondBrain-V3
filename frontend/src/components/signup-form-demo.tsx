"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router";
import axios from "axios"
import { ApiRoutes } from "@/utils/routeApi";

export default function SignupForm() {

  const navigate = useNavigate()

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loding, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  console.log(loding, errors)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    const newErrors: { [key: string]: string } = {};

    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters";
      
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    try {
      const config= {
        headers:{
          "Content-type" : "application/json"
        }
      }
      const body = JSON.stringify({username , email , password})
      const res= await axios.post(ApiRoutes.signup , body , config)

      if(res.status == 200){
        navigate("/login")
      }else{
        newErrors.email = "Email already exists try login in. "
      }

    } catch (error) {
      newErrors.email = "Email already exists try loggin in with this email. Or use different email!"
      console.log(error)
    }
    
  };


  return (
    <div className="max-w-md w-96 mx-auto rounded-none md:rounded-2xl p-4 md:p-8  bg-black dark:bg-transparent h-fit ">
      <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-tr  from-purple-300/80 to-white/90 bg-clip-text text-transparent">
        Create an account
      </h1>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300"></p>

      <form className="my-8 " onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label className="font-normal" htmlFor="email">
            Email Address
          </Label>
          <Input
            className="bg-[#020617]"
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label className="font-normal" htmlFor="password">
            Username
          </Label>
          <Input
            className="bg-[#020617]"
            id="username"
            placeholder="Project"
            type="text"
            onChange={(e) => setUsername(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label className="font-normal" htmlFor="twitterpassword">
           Password
          </Label>
          <Input
            className="bg-[#020617]"
            id="password"
            placeholder="Min Pass Length 8 char"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>

        <button 
          className="bg-gradient-to-br relative group/btn block  w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4 px-10 ">
          <Link to={"/login"}>
            <Button className="text-gray-400 hover:text-white" variant={"link"}>
              Already have an account? Sign In
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
