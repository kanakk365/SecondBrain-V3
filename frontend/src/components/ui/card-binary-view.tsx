// import React from "react";
import { EvervaultCard } from "../ui/card-binary";
// import { Separator } from "./separator";
// import Link from "next/link";
// import ButtonStd from "./button-std";
// import HackyButton from "../hacky-button";

type PostCardProps = {
  title: string;
  description: string;
  icon?: JSX.Element;
};
export function PostCard(props: PostCardProps) {
  return (
    <div className=" rounded-md border border-black/[0.2] bg-gradient-to-tr from-purple-400/10 to-transparent/5 dark:border-white/[0.2] flex flex-col items-start max-w-sm mx-auto relative h-[16rem] w-[16rem]">
      
      

      <EvervaultCard title={props.title} description={props.description} icon={props.icon} />
      {/* <Separator className="mt-2 text-purple-900" />
      <div className="">

      <h2 className="dark:text-white text-black mt-4 text-[14px] font-light">
        {props.description}
      </h2>
      </div> */}
      {/* <p className="text-sm border font-light dark:border-white/[0.2] border-black/[0.2] rounded-full mt-4 text-black dark:text-white px-2 py-0.5">
        Watch me hover
      </p> */}
     
      {/* <ButtonStd route={props.icon} text="Read More" /> */}
    </div>
  );
}