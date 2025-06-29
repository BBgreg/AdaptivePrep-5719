import React from 'react'
import { motion } from 'framer-motion'

const difficulties = [
  { value: 'easy', label: 'Easy', color: 'bg-green-500', description: 'I knew this well' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500', description: 'Took some thought' },
  { value: 'hard', label: 'Hard', color: 'bg-red-500', description: 'This was challenging' }
]

const DifficultyRating = ({ onRate, isCorrect }) => {
  const handleRate = (difficulty) => {
    // Immediately proceed to next question
    onRate(difficulty)
  }

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            How difficult was this question?
          </h3>
          <p className="text-gray-600">
            Your rating helps our AI optimize your learning schedule
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {difficulties.map((difficulty) => (
            <motion.button
              key={difficulty.value}
              onClick={() => handleRate(difficulty.value)}
              className={`p-6 rounded-xl border-2 border-transparent hover:border-gray-300 transition-all duration-200 ${difficulty.color} text-white`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{difficulty.label}</div>
                <div className="text-sm opacity-90">{difficulty.description}</div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isCorrect ? (
            <p className="text-green-600">✓ Correct! Great job!</p>
          ) : (
            <p className="text-red-600">✗ Incorrect, but that's how we learn!</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default DifficultyRating