import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiBrain, FiRepeat, FiBarChart3, FiLightbulb, FiTarget, FiClock } = FiIcons

const features = [
  {
    icon: FiBrain,
    title: 'AI-Powered Spaced Repetition',
    description: 'Our intelligent algorithm learns from your performance and schedules questions at optimal intervals to maximize retention.'
  },
  {
    icon: FiTarget,
    title: 'Targeted Practice',
    description: 'Focus on specific topics or let our AI create custom study sessions based on your weak areas.'
  },
  {
    icon: FiBarChart3,
    title: 'Detailed Analytics',
    description: 'Track your progress with comprehensive statistics showing improvement over your last 5, 10, and 20 questions for each topic.'
  },
  {
    icon: FiLightbulb,
    title: 'Instant Explanations',
    description: 'Get detailed explanations and rule guides for every question to understand the underlying concepts.'
  },
  {
    icon: FiRepeat,
    title: 'Adaptive Learning',
    description: 'Questions adapt to your performance - harder concepts appear more frequently until mastered.'
  },
  {
    icon: FiClock,
    title: 'Efficient Study',
    description: 'No more wasting time on concepts you already know. Focus on what needs improvement.'
  }
]

const Features = () => {
  return (
    <section id="features" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why AdaptivePrep Works
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Combat the forgetting curve with scientifically-backed spaced repetition
          </p>
        </motion.div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-md mb-4">
                  <SafeIcon icon={feature.icon} className="text-2xl text-primary-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features