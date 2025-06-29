import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiCheck, FiStar, FiZap } = FiIcons

const plans = [
  {
    name: 'Free Trial',
    price: '$0',
    period: '20 questions',
    description: 'Perfect for trying out AdaptivePrep',
    features: [
      '20 practice questions',
      'AI-powered spaced repetition',
      'Detailed analytics & progress tracking',
      'All subjects (Math & English)',
      'Instant explanations & rule guides',
      'Custom study sessions',
      'Subtopic drilling',
      'Performance insights'
    ],
    buttonText: 'Start Free Trial',
    popular: false,
    color: 'gray'
  },
  {
    name: 'Monthly',
    price: '$4.99',
    period: '/month',
    description: 'Unlimited access with monthly billing',
    features: [
      'Unlimited practice questions',
      'AI-powered spaced repetition',
      'Detailed analytics & progress tracking',
      'All subjects (Math & English)',
      'Instant explanations & rule guides',
      'Custom study sessions',
      'Subtopic drilling',
      'Performance insights',
      'Priority support'
    ],
    buttonText: 'Start Monthly Plan',
    popular: true,
    color: 'primary'
  },
  {
    name: 'Lifetime',
    price: '$20',
    period: 'one-time',
    description: 'Best value - pay once, use forever',
    features: [
      'Everything in Monthly plan',
      'Unlimited lifetime access',
      'No recurring payments',
      'All future updates included',
      'Premium support',
      'Early access to new features'
    ],
    buttonText: 'Get Lifetime Access',
    popular: false,
    color: 'green',
    badge: 'Best Value'
  }
]

const Pricing = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Choose the plan that works best for you
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl ${
                plan.popular 
                  ? 'bg-primary-50 border-2 border-primary-200 shadow-lg scale-105' 
                  : 'bg-white border border-gray-200 shadow-sm'
              } p-8 ${plan.name === 'Lifetime' ? 'ring-2 ring-green-200' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    <SafeIcon icon={FiStar} className="text-sm" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}
              
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-1 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    <SafeIcon icon={FiZap} className="text-sm" />
                    <span>{plan.badge}</span>
                  </div>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-lg font-medium text-gray-500 ml-1">{plan.period}</span>
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <SafeIcon 
                      icon={FiCheck} 
                      className={`text-lg mr-3 ${
                        plan.color === 'primary' 
                          ? 'text-primary-600' 
                          : plan.color === 'green' 
                            ? 'text-green-600' 
                            : 'text-green-500'
                      }`} 
                    />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelectPlan(plan.name.toLowerCase().replace(' ', '-'))}
                className={`mt-8 w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                  plan.popular 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : plan.color === 'green' 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing