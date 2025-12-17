import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext';
import {motion} from 'motion/react';
import { BiSearch } from 'react-icons/bi';
import { Button } from '../ui/button';
import { IoSparkles } from 'react-icons/io5';
import { FiUpload } from 'react-icons/fi';

const Home = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated} = useAuth();
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <BiSearch className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold">EchoFind</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {
            isAuthenticated ? (
              <p>Welcome <strong className="font-semibold capitalize">{user?.username || user?.email}</strong></p>
            ) : (
              <Button variant="outline" onClick={() => navigate("/sign-up")}>
                Sign In / Sign Up
              </Button>
            )
          }
        </motion.div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full mb-6 border border-purple-200">
              <IoSparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-900">AI-Powered Search</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Search Inside Audio and Video
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Upload your media files and instantly search through transcribed content. 
            Find exact moments, get AI summaries, and discover insights in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate("/upload")}
            >
              <FiUpload className="w-5 h-5 mr-2" />
              Upload a File
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-6 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white border-gray-200"
              onClick={() => navigate("/upload")}
            >
              Try a Demo
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: BiSearch,
                title: "Smart Search",
                description: "Find any word or phrase instantly with timestamp precision"
              },
              {
                icon: IoSparkles,
                title: "AI Insights",
                description: "Get summaries, highlights, and answer questions about your content"
              },
              {
                icon: FiUpload,
                title: "Easy Upload",
                description: "Support for all major audio and video formats"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default Home;