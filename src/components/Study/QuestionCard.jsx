import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'

const { FiLightbulb, FiClock, FiCheck, FiX } = FiIcons

const QuestionCard = ({ question, onAnswer, showExplanation, onToggleExplanation }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [startTime] = useState(Date.now())

  const handleAnswerSelect = (choice) => {
    if (isAnswered) return
    
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    const isCorrect = choice === question.correctAnswer
    
    setSelectedAnswer(choice)
    setIsAnswered(true)
    
    // Immediately call onAnswer when choice is selected
    onAnswer(isCorrect, timeSpent)
  }

  const getChoiceClass = (choice) => {
    const letter = choice.charAt(0)
    let baseClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer "
    
    if (!isAnswered) {
      baseClass += "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
    } else {
      if (letter === question.correctAnswer) {
        baseClass += "border-green-500 bg-green-50 text-green-900"
      } else if (selectedAnswer === letter && letter !== question.correctAnswer) {
        baseClass += "border-red-500 bg-red-50 text-red-900"
      } else {
        baseClass += "border-gray-200 bg-gray-50 text-gray-600"
      }
    }
    
    return baseClass
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <SafeIcon icon={FiClock} className="text-lg" />
            <span>Take your time</span>
          </div>
          <button
            onClick={onToggleExplanation}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <SafeIcon icon={FiLightbulb} className="text-lg" />
            <span>Explanation</span>
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
            {question.question}
          </h2>
        </div>

        <div className="space-y-3 mb-8">
          {question.choices.map((choice, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(choice.charAt(0))}
              className={getChoiceClass(choice)}
              whileHover={!isAnswered ? { scale: 1.01 } : {}}
              whileTap={!isAnswered ? { scale: 0.99 } : {}}
              disabled={isAnswered}
            >
              <div className="flex items-center justify-between">
                <span>{choice}</span>
                {isAnswered && (
                  <span className="ml-2">
                    {choice.charAt(0) === question.correctAnswer ? (
                      <SafeIcon icon={FiCheck} className="text-lg text-green-600" />
                    ) : selectedAnswer === choice.charAt(0) ? (
                      <SafeIcon icon={FiX} className="text-lg text-red-600" />
                    ) : null}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div 
              className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Explanation</h3>
              <p className="text-blue-800 mb-4">{question.explanation}</p>
              <div className="border-t border-blue-200 pt-4">
                <h4 className="font-medium text-blue-900 mb-2">Rule/Concept:</h4>
                <p className="text-blue-700">{question.rule}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default QuestionCard