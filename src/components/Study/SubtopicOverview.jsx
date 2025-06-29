import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../Layout/Header'

const { FiArrowLeft, FiBrain, FiPlay, FiBarChart } = FiIcons

const SubtopicOverview = ({ subject, topic, onBack, onStartStudy, onStartSubtopic }) => {
  const { user } = useAuth()
  const [subtopicStats, setSubtopicStats] = useState({})

  // Initialize stats for each subtopic - all starting at 0
  useEffect(() => {
    const stats = {}
    topic.subtopics.forEach(subtopic => {
      stats[subtopic.id] = {
        totalAnswered: 0,
        totalCorrect: 0,
        last5: 0,
        last10: 0,
        last20: 0
      }
    })
    setSubtopicStats(stats)
  }, [topic])

  const getSubtopicAccuracy = (subtopicId) => {
    const stats = subtopicStats[subtopicId]
    if (!stats || stats.totalAnswered === 0) return 0
    return Math.min(100, Math.round((stats.totalCorrect / stats.totalAnswered) * 100))
  }

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiArrowLeft} className="text-xl" />
              <span>Back to Topics</span>
            </motion.button>
          </div>
          <div className="flex space-x-3">
            <motion.button
              onClick={() => onStartStudy('topic-focus', { topicId: topic.id })}
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={FiBrain} className="text-lg" />
              <span>Study All Subtopics</span>
            </motion.button>
          </div>
        </div>

        <div className="mb-8">
          <div className={`w-full h-2 ${topic.color} rounded-full mb-4`} />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {topic.name}
          </h1>
          <p className="text-gray-600 mb-4">
            {topic.description}
          </p>
          <div className="text-sm text-gray-500">
            {topic.subtopics.length} subtopics available
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topic.subtopics.map((subtopic, index) => {
            const accuracy = getSubtopicAccuracy(subtopic.id)
            const stats = subtopicStats[subtopic.id] || {
              totalAnswered: 0,
              totalCorrect: 0,
              last5: 0,
              last10: 0,
              last20: 0
            }
            
            return (
              <motion.div
                key={subtopic.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {subtopic.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {subtopic.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiBarChart} className="text-lg text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{stats.totalAnswered}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getPerformanceColor(stats.last5)}`}>
                      {stats.last5}%
                    </div>
                    <div className="text-xs text-gray-600">Last 5</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getPerformanceColor(stats.last10)}`}>
                      {stats.last10}%
                    </div>
                    <div className="text-xs text-gray-600">Last 10</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getPerformanceColor(stats.last20)}`}>
                      {stats.last20}%
                    </div>
                    <div className="text-xs text-gray-600">Last 20</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Overall Accuracy</span>
                    <span>{accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        accuracy >= 80 ? 'bg-green-500' : 
                        accuracy >= 60 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>

                <motion.button
                  onClick={() => onStartSubtopic(subtopic)}
                  className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SafeIcon icon={FiPlay} className="text-lg" />
                  <span>Practice This Subtopic</span>
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SubtopicOverview