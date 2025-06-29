import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiBrain, FiTrendingUp, FiZap, FiTarget, FiX } = FiIcons

const LearnMoreModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Unlock Your ACT Potential with AdaptivePrep
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <SafeIcon icon={FiX} className="text-2xl" />
              </button>
            </div>

            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed">
                Stop studying harder, start studying smarter. AdaptivePrep revolutionizes ACT prep by combining cutting-edge AI with proven learning science.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Spaced Repetition:</h3>
                <p className="mb-4">
                  Traditional prep doesn't beat the Forgetting Curve, when studying for the ACT you might see a topic once or twice randomly thrown into practice tests, especially with Math's linear progress (questions get harder over time) you may see a question once and never again. The next time you see the question is on test day. AKA too late!
                </p>
                <p className="mb-4">
                  Our AI-powered spaced repetition changes that. After each question, you tell us if it was "Easy," "Medium," or "Hard." Our algorithm uses this feedback, along with your correct/incorrect answers, to pinpoint exactly when to re-test you on a subtopic. Struggling with "Quadratic Equations"? You'll see them again soon. Mastered "Comma Splices"? We'll review them less frequently, freeing up your time for weaker areas.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Performance & Focus</h3>
                <p className="mb-4">
                  Never guess what to study next. Your AdaptivePrep dashboard gives you crystal-clear insights:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>Track your overall progress for Math and English.</li>
                  <li>While seeing your all time and current progress in specific Topics & Subtopics. We show your percentage for the last 5, 10, and 20 questions in each subtopic, so you see your improvement in real-time.</li>
                  <li>With features to drill one topic at a time or the ability to create a custom study session where you can choose what topics to practice. You never have to worry about forgetting a topic!</li>
                </ul>
                <div className="bg-gray-100 rounded-lg p-4 my-6">
                  <p className="text-sm text-gray-600 italic">
                    [Screenshot of subtopic dashboard would be displayed here]
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Math & English Only</h3>
                <p className="mb-4">
                  ACT Math and English are the sections that are fundamentally knowledge-based. They require you to recall and apply specific formulas, grammar rules, and problem-solving techniques. Our spaced repetition flashcard method is perfectly suited for drilling these concrete facts.
                </p>
                <p>
                  The ACT Reading and Science sections, however, are primarily about comprehension and analytical skills, with all necessary information provided in the passages.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={onClose}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

const Hero = ({ onGetStarted }) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <motion.h1
                  className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="block xl:inline">Master the ACT with</span>{' '}
                  <span className="block text-primary-600 xl:inline">AdaptivePrep</span>
                </motion.h1>
                <motion.p
                  className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Stop forgetting what you've learned. Our spaced repetition algorithm ensures you master every concept and never waste time on questions you already know.
                </motion.p>
                <motion.div
                  className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="rounded-md shadow">
                    <button
                      onClick={onGetStarted}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                    >
                      Start Free Trial - 20 Questions
                    </button>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                    >
                      Learn More
                    </button>
                  </div>
                </motion.div>
                <motion.div
                  className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-center">
                    <SafeIcon icon={FiTarget} className="mr-2" />
                    <span>20 Free Questions</span>
                  </div>
                  <div className="flex items-center">
                    <SafeIcon icon={FiZap} className="mr-2" />
                    <span>No Credit Card Required</span>
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
        
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <motion.div
            className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-8 text-white">
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <SafeIcon icon={FiBrain} className="text-4xl mx-auto mb-2" />
                <p className="text-sm font-medium">Smart Learning</p>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <SafeIcon icon={FiTrendingUp} className="text-4xl mx-auto mb-2" />
                <p className="text-sm font-medium">Track Progress</p>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <SafeIcon icon={FiZap} className="text-4xl mx-auto mb-2" />
                <p className="text-sm font-medium">Efficient Study</p>
              </motion.div>
              <motion.div
                className="text-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <SafeIcon icon={FiTarget} className="text-4xl mx-auto mb-2" />
                <p className="text-sm font-medium">Targeted Practice</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <LearnMoreModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

export default Hero