
import { Link } from 'react-router';

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-[80vh] bg-neutral-900 flex items-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 "></div>
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-neutral-900 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate__animated animate__fadeInUp">
              <span className="bg-gradient-to-tr from-purple-500/80 to-purple-100/90 bg-clip-text text-transparent">
                Your Digital Brain
              </span>
              <br />
              
            </h1>

            <p className="text-gray-300 text-lg md:text-xl mb-8 animate__animated animate__fadeInUp animate__delay-1s">
              Save, organize, and share your favorite links effortlessly. Automatically fetch data from popular platforms and keep everything organized in one beautiful space.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center  lg:justify-start animate__animated animate__fadeInUp animate__delay-2s">
              <Link to={"/login"} ><button className="px-8 py-4 bg-gradient-to-r from-purple-600/80 to-purple-400/90  text-white rounded-full font-medium hover:opacity-90 transition-all transform hover:scale-105">
                Get Started - It's Free
              </button></Link>
              <Link to={"https://youtu.be/mrTKk7OxJFw"}><button className="px-8 py-4 max-w-40 bg-white/10 text-white rounded-full font-medium hover:bg-white/20 transition-all backdrop-blur-sm">
                Watch Demo
              </button></Link>
              
            </div>

            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 animate__animated animate__fadeInUp animate__delay-3s">
              <div className="text-gray-400 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>10K+ Users</span>
              </div>
              <div className="text-gray-400 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>100K+ Links Saved</span>
              </div>
            </div>
          </div>

          <div className="relative animate__animated animate__fadeInRight animate__delay-1s">
            <div className="bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl p-1">
              <div className="bg-neutral-800 rounded-2xl p-6">
                <div className="bg-neutral-900 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 bg-neutral-800 rounded-lg animate-pulse"></div>
                    <div className="h-8 bg-neutral-800 rounded-lg animate-pulse"></div>
                    <div className="h-8 bg-neutral-800 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full blur-xl opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;