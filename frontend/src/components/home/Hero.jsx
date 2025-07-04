import React from 'react'
import DottedButton from '../buttons/DottedButton';
import { useNavigate } from 'react-router-dom';

const boxes = [
  {
    title: "Create Notes",
    description: "Share your thoughts and experiences",
    icon: "📝"
  },
  {
    title: "Global Connect",
    description: "Connect with people worldwide",
    icon: "🌍"
  },
  {
    title: "Discover Ideas",
    description: "Explore diverse perspectives",
    icon: "💡"
  },
  {
    title: "Collaborate",
    description: "Work together on shared notes",
    icon: "🤝"
  },
  {
    title: "Learn",
    description: "Gain knowledge from others",
    icon: "📚"
  },
  {
    title: "Inspire",
    description: "Be inspired by global stories",
    icon: "⭐"
  }
]

const Hero = ( {user, loading, error, isAuthenticated} ) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        mt-10 border-1 border-black rounded-3xl flex items-center
        p-4 sm:p-6 md:p-10
        bg-gray-50
        bg-[url('https://images.pexels.com/photos/317356/pexels-photo-317356.jpeg')]
        bg-cover bg-center bg-no-repeat
        min-h-[500px] md:min-h-[600px] h-auto
      "
    >
      <div className="container mx-auto px-2 sm:px-4 py-8 md:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - App Definition */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Keep your internet 
                <span className="block text-indigo-600">Content in one place</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                WorldNote helps you capture, organize, and share knowledge from across the web. Transform scattered information into meaningful content that grows with you.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none">
              <DottedButton text="Create Note" onClick={() => {
                if (isAuthenticated) {
                  navigate("/CreateNote");
                } else {
                  navigate("/login");
                }
              }} />
              <DottedButton text="Learn More" onClick={() => {
                navigate("/about");
              }} />
            </div>

            <div className="flex flex-col xs:flex-row sm:flex-row md:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 pt-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-indigo-600">1000+</div>
                <div className="text-gray-600 text-sm sm:text-base">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-indigo-600">5000+</div>
                <div className="text-gray-600 text-sm sm:text-base">Notes Shared</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-indigo-600">50+</div>
                <div className="text-gray-600 text-sm sm:text-base">Countries</div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center items-center p-2 sm:p-6 md:p-10 w-full">
            <div className="
              grid
              grid-cols-2
              sm:grid-cols-3
              gap-3 sm:gap-4
              max-w-xs sm:max-w-md mx-auto lg:mx-0
              w-full
            ">
              {boxes.map((box, index) => (
                <div
                  key={index}
                  className="
                    backdrop-blur-sm bg-white/30 p-4 sm:p-6 rounded-xl shadow-xl
                    hover:shadow-2xl transition-all duration-300 hover:-translate-y-2
                    border border-white/40 hover:border-white/60 hover:bg-white/40
                    flex flex-col items-center
                  "
                >
                  <div className="w-8 h-8 bg-white/50 rounded-lg mb-2 sm:mb-3 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-indigo-600 text-lg">{box.icon}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 text-center">{box.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm text-center">{box.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero