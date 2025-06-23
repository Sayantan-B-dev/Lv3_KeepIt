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
    <div style={{ height: "600px" }} className="mt-10 border-1 border-black rounded-3xl flex items-center p-10 bg-gray-50 bg-[url('https://images.pexels.com/photos/317356/pexels-photo-317356.jpeg')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center lg:gap-0">
          {/* Left Side - App Definition */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Keep your internet 
                <span className="block text-indigo-600">Content in one place</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
              WorldNote helps you capture, organize, and share knowledge from across the web. Transform scattered information into meaningful content that grows with you.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <DottedButton text="Create Note" onClick={() => {
                if (isAuthenticated) {
                  navigate("/CreateNote");
                } else {
                  navigate("/login");
                }
              }} />
              <DottedButton text="Learn More" />
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">1000+</div>
                <div className="text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">5000+</div>
                <div className="text-gray-600">Notes Shared</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">50+</div>
                <div className="text-gray-600">Countries</div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center items-center p-10 ">
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                {boxes.map((box, index) => (
                  <div key={index} 
                  className="backdrop-blur-sm bg-white/30 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/40 hover:border-white/60 hover:bg-white/40"
                  >
                    <div className="w-8 h-8 bg-white/50 rounded-lg mb-3 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-indigo-600 text-lg">{box.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{box.title}</h3>
                    <p className="text-gray-600">{box.description}</p>
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