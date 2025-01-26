
const HowItWorks = () => {
  return (
    <section id="howItWorks" className="py-32 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white animate__animated animate__fadeIn">
            How <span className="bg-gradient-to-tr from-purple-500/80 to-purple-100/90 bg-clip-text text-transparent">Second Brain</span> Works
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto animate__animated animate__fadeIn animate__delay-1s">
            Three simple steps to organize your digital world
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="relative animate__animated animate__fadeInUp">
            <div className="bg-neutral-800 rounded-2xl p-6 h-full relative overflow-hidden group hover:bg-neutral-700/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br  blur-xl rounded-full transform group-hover:scale-150 transition-all duration-300"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-600/80 to-purple-400/90  w-12 h-12 rounded-full flex items-center justify-center mb-6 text-white font-bold text-xl">1</div>
                <h3 className="text-xl font-semibold mb-4 text-white">Install Extension</h3>
                <p className="text-gray-400">Add our browser extension with a single click. Compatible with all major browsers.</p>
                
                <div className="mt-6 flex space-x-4">
                  <div className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                    </svg>
                    One Click Install
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative animate__animated animate__fadeInUp animate__delay-1s">
            <div className="bg-neutral-800 rounded-2xl p-6 h-full relative overflow-hidden group hover:bg-neutral-700/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br  blur-xl rounded-full transform group-hover:scale-150 transition-all duration-300"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-600/80 to-purple-400/90  w-12 h-12 rounded-full flex items-center justify-center mb-6 text-white font-bold text-xl">2</div>
                <h3 className="text-xl font-semibold mb-4 text-white">Save Links</h3>
                <p className="text-gray-400">Click the extension icon or use keyboard shortcuts to save any link instantly.</p>
                
                <div className="mt-6 flex space-x-4">
                  <div className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd"/>
                    </svg>
                    Auto-categorization
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative animate__animated animate__fadeInUp animate__delay-2s">
            <div className="bg-neutral-800 rounded-2xl p-6 h-full relative overflow-hidden group hover:bg-neutral-700/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br  blur-xl rounded-full transform group-hover:scale-150 transition-all duration-300"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-600/80 to-purple-400/90 w-12 h-12 rounded-full flex items-center justify-center mb-6 text-white font-bold text-xl">3</div>
                <h3 className="text-xl font-semibold mb-4 text-white">Organize & Share</h3>
                <p className="text-gray-400">Create collections, add tags, and share with your team or the world.</p>
                
                <div className="mt-6 flex space-x-4">
                  <div className="flex items-center text-gray-400">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                    </svg>
                    Instant Sharing
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default HowItWorks;