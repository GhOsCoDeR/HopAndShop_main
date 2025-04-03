export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Hop and Shop
        </h1>
        <div className="bg-white shadow-xl rounded-lg p-8 mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-orange-600 mb-4">
            Coming Soon
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            We're working hard to bring you the best shopping experience. 
            Our website is currently under maintenance and will be back soon 
            with exciting new features and products.
          </p>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-orange-500 rounded-full w-3/4 animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-500">
            Progress: 75% Complete
          </p>
        </div>
        
        <div className="text-gray-600">
          <p className="mb-2">
            For inquiries, contact us at: <a href="mailto:info@hopandshop.com" className="text-blue-600 hover:underline">info@hopandshop.com</a>
          </p>
          <p>
            &copy; {new Date().getFullYear()} Hop and Shop. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
} 