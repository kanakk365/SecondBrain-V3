

const Features = () => {
  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate__animated animate__fadeIn">
            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
              Powerful Features for Your Links
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto animate__animated animate__fadeIn animate__delay-1s">
            Everything you need to organize and share your digital world in one place
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-neutral-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 animate__animated animate__fadeInUp text-black">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Save & Organize</h3>
            <p className="text-gray-600">Store and categorize links from any website with just one click. Create collections and keep everything organized.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-neutral-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 animate__animated animate__fadeInUp animate__delay-1s text-black">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Auto Fetch Data</h3>
            <p className="text-gray-600">Automatically extract titles, descriptions, and thumbnails from YouTube, Twitter, and more platforms.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-neutral-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 animate__animated animate__fadeInUp animate__delay-2s text-black">
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Share with Ease</h3>
            <p className="text-gray-600">Share your curated collections with anyone, anywhere. Perfect for teams and communities.</p>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default Features;