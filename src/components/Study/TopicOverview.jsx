import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../contexts/AuthContext'
import { mathTopics, englishTopics } from '../../data/topics'
import Header from '../Layout/Header'

const { FiArrowLeft, FiBrain, FiSettings, FiPlay } = FiIcons

const TopicOverview = ({ subject, onBack, onStartStudy, onSelectTopic }) => {
  const { user } = useAuth()
  const [selectedSubtopics, setSelectedSubtopics] = useState([])
  const [showCustomModal, setShowCustomModal] = useState(false)

  const topics = subject === 'math' ? mathTopics : englishTopics

  const handleCustomStudy = () => {
    if (selectedSubtopics.length > 0) {
      onStartStudy('custom', { selectedSubtopics })
      setShowCustomModal(false)
    }
  }

  const getAllSubtopics = () => {
    return topics.flatMap(topic => 
      topic.subtopics.map(subtopic => ({
        ...subtopic,
        topicName: topic.name,
        topicColor: topic.color
      }))
    )
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
              <span>Back to Dashboard</span>
            </motion.button>
          </div>
          <div className="flex space-x-3">
            <motion.button
              onClick={() => onStartStudy('spaced-repetition')}
              className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={FiBrain} className="text-lg" />
              <span>AI Spaced Repetition</span>
            </motion.button>
            <motion.button
              onClick={() => setShowCustomModal(true)}
              className="flex items-center space-x-2 bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SafeIcon icon={FiSettings} className="text-lg" />
              <span>Custom Study</span>
            </motion.button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">
            ACT {subject} Topics
          </h1>
          <p className="text-gray-600">
            Select a topic to view subtopics, or use the buttons above for comprehensive study sessions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
              onClick={() => onSelectTopic(topic)}
            >
              <div className={`w-full h-2 ${topic.color} rounded-full mb-4`} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {topic.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {topic.description}
              </p>
              <div className="text-sm text-gray-500">
                {topic.subtopics.length} subtopics
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showCustomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Custom Study Session</h2>
                <p className="text-gray-600 mt-1">Select subtopics to include in your study session</p>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiArrowLeft} className="text-xl" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="space-y-3">
                {getAllSubtopics().map(subtopic => (
                  <label key={subtopic.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSubtopics.includes(subtopic.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubtopics([...selectedSubtopics, subtopic.id])
                        } else {
                          setSelectedSubtopics(selectedSubtopics.filter(id => id !== subtopic.id))
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className={`w-4 h-4 ${subtopic.topicColor} rounded`} />
                    <div>
                      <span className="text-gray-900 font-medium">{subtopic.name}</span>
                      <span className="text-gray-500 text-sm ml-2">({subtopic.topicName})</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomStudy}
                disabled={selectedSubtopics.length === 0}
                className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SafeIcon icon={FiPlay} className="text-lg" />
                <span>Start Custom Study ({selectedSubtopics.length})</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default TopicOverview