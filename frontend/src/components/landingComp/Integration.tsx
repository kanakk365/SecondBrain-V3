

export default function SeamlessIntegrations() {
  return (
    <section id="integrations" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate__animated animate__fadeIn">
          <span className="bg-gradient-to-r from-purple-600/80 to-purple-400/90  text-transparent bg-clip-text">
            Seamless Integrations
          </span>
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto animate__animated animate__fadeIn animate__delay-1s">
          Connect and fetch data from your favorite platforms automatically
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
       
        <div className="bg-neutral-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group animate__animated animate__fadeInUp">
          <div className="bg-red-500/10 rounded-xl p-4 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">YouTube</h3>
          <p className="text-gray-600 text-center text-sm">Auto-fetch video details and thumbnails</p>
        </div>

       
        <div className="bg-neutral-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group animate__animated animate__fadeInUp animate__delay-1s">
          <div className="bg-blue-500/10 rounded-xl p-4 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">Twitter</h3>
          <p className="text-gray-600 text-center text-sm">Save threads and tweets instantly</p>
        </div>

        
        <div className="bg-neutral-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group animate__animated animate__fadeInUp animate__delay-2s">
          <div className="bg-blue-700/10 rounded-xl p-4 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">LinkedIn</h3>
          <p className="text-gray-600 text-center text-sm">Coming Soon</p>
          
        </div>

        
        <div className="bg-neutral-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group animate__animated animate__fadeInUp animate__delay-3s">
          <div className="bg-red-600/10 rounded-xl p-4 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">Pinterest</h3>
          <p className="text-gray-600 text-center text-sm">Coming Soon</p>
          
        </div>
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center px-6 py-3 bg-neutral-100 rounded-full animate__animated animate__fadeIn animate__delay-4s">
          <svg className="w-5 h-5 text-violet-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <span className="text-gray-600">More integrations coming soon!</span>
        </div>
      </div>
    </div>
  </section>
  )
}



