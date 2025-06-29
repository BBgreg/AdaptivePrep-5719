import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import SubjectCard from './SubjectCard'
import Header from '../Layout/Header'

const Dashboard = ({ onSelectSubject }) => {
  const { user, hasActiveSubscription, getQuestionsRemaining } = useAuth()
  const [stats, setStats] = useState({
    math: { totalAnswered: 0, totalCorrect: 0 },
    english: { totalAnswered: 0, totalCorrect: 0 }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Student'}!
          </h1>
          <p className="text-gray-600">
            Continue your ACT preparation journey
          </p>
          {!hasActiveSubscription() && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-orange-800">
                <strong>{getQuestionsRemaining()} questions remaining</strong> in your free trial.
                <button
                  className="ml-2 text-orange-600 underline hover:text-orange-800"
                  onClick={() => window.location.hash = '#/pricing'}
                >
                  Upgrade to unlimited
                </button>
              </p>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SubjectCard
            subject="math"
            stats={stats.math}
            onClick={() => onSelectSubject('math')}
          />
          <SubjectCard
            subject="english"
            stats={stats.english}
            onClick={() => onSelectSubject('english')}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard