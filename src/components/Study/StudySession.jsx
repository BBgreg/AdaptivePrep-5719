import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../contexts/AuthContext'
import { useSpacedRepetition } from '../../utils/spacedRepetition'
import { sampleMathQuestions, sampleEnglishQuestions } from '../../data/sampleQuestions'
import Header from '../Layout/Header'
import QuestionCard from './QuestionCard'
import DifficultyRating from './DifficultyRating'

const { FiArrowLeft, FiBarChart } = FiIcons

const StudySession = ({ subject, mode, options, onBack }) => {
  const { user, hasActiveSubscription, getQuestionsRemaining, incrementQuestionsUsed } = useAuth()
  const spacedRepetition = useSpacedRepetition(user?.id, subject)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [awaitingDifficulty, setAwaitingDifficulty] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    totalAnswered: 0,
    totalCorrect: 0,
    currentStreak: 0
  })
  const [lastAnswer, setLastAnswer] = useState(null)

  const questionsPool = subject === 'math' ? sampleMathQuestions : sampleEnglishQuestions

  useEffect(() => {
    loadNextQuestion()
  }, [])

  const loadNextQuestion = () => {
    // Check if user has questions remaining
    if (!hasActiveSubscription() && getQuestionsRemaining() <= 0) {
      // Redirect to pricing
      window.location.hash = '#/pricing'
      return
    }

    let nextQuestion

    if (mode === 'spaced-repetition') {
      nextQuestion = spacedRepetition.getNextQuestion(questionsPool)
    } else if (mode === 'topic' && options?.topicId) {
      const topicQuestions = questionsPool.filter(q => q.topicId === options.topicId)
      nextQuestion = topicQuestions[Math.floor(Math.random() * topicQuestions.length)]
    } else if (mode === 'custom' && options?.selectedSubtopics) {
      const customQuestions = questionsPool.filter(q => 
        options.selectedSubtopics.includes(q.subtopicId)
      )
      nextQuestion = customQuestions[Math.floor(Math.random() * customQuestions.length)]
    } else if (mode === 'subtopic' && options?.subtopicId) {
      const subtopicQuestions = questionsPool.filter(q => q.subtopicId === options.subtopicId)
      nextQuestion = subtopicQuestions[Math.floor(Math.random() * subtopicQuestions.length)]
    } else {
      nextQuestion = questionsPool[Math.floor(Math.random() * questionsPool.length)]
    }

    setCurrentQuestion(nextQuestion)
    setShowExplanation(false)
    setAwaitingDifficulty(false)
  }

  const handleAnswer = async (isCorrect, timeSpent) => {
    setLastAnswer({ isCorrect, timeSpent })
    setAwaitingDifficulty(true)

    // Increment questions used for non-premium users
    if (!hasActiveSubscription()) {
      await incrementQuestionsUsed()
    }

    // Update session stats
    setSessionStats(prev => ({
      totalAnswered: prev.totalAnswered + 1,
      totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
      currentStreak: isCorrect ? prev.currentStreak + 1 : 0
    }))
  }

  const handleDifficultyRating = async (difficulty) => {
    if (!currentQuestion || !lastAnswer) return

    // Save progress
    await spacedRepetition.saveUserProgress(
      currentQuestion.id,
      lastAnswer.isCorrect,
      difficulty,
      lastAnswer.timeSpent
    )

    // Add to spaced repetition queue if in spaced repetition mode
    if (mode === 'spaced-repetition') {
      spacedRepetition.addToQueue(
        currentQuestion.subtopicId,
        difficulty,
        lastAnswer.isCorrect,
        questionsPool
      )
      spacedRepetition.incrementCardCounter()
    }

    // Load next question
    setTimeout(loadNextQuestion, 500)
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiArrowLeft} className="text-xl" />
            <span>Back</span>
          </motion.button>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <SafeIcon icon={FiBarChart} className="text-lg" />
                <span>{sessionStats.totalAnswered} answered</span>
              </div>
              <div className="text-green-600 font-medium">
                {sessionStats.totalCorrect}/{sessionStats.totalAnswered} correct
              </div>
              <div className="text-primary-600 font-medium">
                {sessionStats.currentStreak} streak
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            showExplanation={showExplanation}
            onToggleExplanation={() => setShowExplanation(!showExplanation)}
          />

          {awaitingDifficulty && (
            <DifficultyRating
              onRate={handleDifficultyRating}
              isCorrect={lastAnswer?.isCorrect}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default StudySession