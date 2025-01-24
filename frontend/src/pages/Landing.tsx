import Hero from "@/components/hero section/Hero";
import { navItems } from "../components/site/nav";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import Cards from "@/components/Cards";
import { Button } from "@/components/ui/button";

function Landing() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-6 ">
      <FloatingNav navItems={navItems} />
      <div className="flex flex-col justify-center items-center max-w-6xl px-5 md:px-0">
        <Hero />
      </div>
      <div className=" mt-10 flex flex-col justify-center items-center max-w-6xl px-5 md:px-0 sm:mt-0 sm:h-full  h-[800px]  ">
        <MacbookScroll />
      </div>
      <div className=" flex justify-center items-center" id="usecase">
        <Cards />
      </div>
      <div className="text-gray-400">
        © 2024 secondbrain. All rights reserved. build by{" "}
        <Button className="p-0 " variant="link">
          <a className="text-gray-400" href="https://github.com/kanakk365">
            Kanak
          </a>
        </Button>
      </div>
      
    </div>
  );
}

export default Landing;
