import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiArrowRight, FiBookOpen } = FiIcons

const SubjectCard = ({ subject, stats, onClick }) => {
  const accuracy = stats.totalAnswered > 0 ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${subject === 'math' ? 'bg-blue-100' : 'bg-green-100'}`}>
            <SafeIcon 
              icon={FiBookOpen} 
              className={`text-2xl ${subject === 'math' ? 'text-blue-600' : 'text-green-600'}`} 
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 capitalize">
              ACT {subject === 'math' ? 'Math' : 'English'} AdaptivePrep
            </h3>
            <p className="text-sm text-gray-600">
              {subject === 'math' ? '8 Topics • 66 Subtopics' : '4 Topics • 22 Subtopics'}
            </p>
          </div>
        </div>
        <SafeIcon icon={FiArrowRight} className="text-xl text-gray-400" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.totalAnswered}</div>
          <div className="text-xs text-gray-600">Questions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.totalCorrect}</div>
          <div className="text-xs text-gray-600">Correct</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            accuracy >= 70 ? 'text-green-600' : 
            accuracy >= 50 ? 'text-yellow-600' : 
            'text-red-600'
          }`}>
            {accuracy}%
          </div>
          <div className="text-xs text-gray-600">Accuracy</div>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            accuracy >= 70 ? 'bg-green-500' : 
            accuracy >= 50 ? 'bg-yellow-500' : 
            'bg-red-500'
          }`}
          style={{ width: `${accuracy}%` }}
        />
      </div>
    </motion.div>
  )
}

export default SubjectCard