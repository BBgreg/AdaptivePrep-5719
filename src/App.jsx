import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

// Components
import Hero from './components/Landing/Hero'
import Features from './components/Landing/Features'
import Pricing from './components/Landing/Pricing'
import SignIn from './components/Auth/SignIn'
import SignUp from './components/Auth/SignUp'
import ForgotPassword from './components/Auth/ForgotPassword'
import Dashboard from './components/Dashboard/Dashboard'
import TopicOverview from './components/Study/TopicOverview'
import SubtopicOverview from './components/Study/SubtopicOverview'
import StudySession from './components/Study/StudySession'
import PricingPage from './components/Pricing/PricingPage'

const LandingPage = () => {
  const handleGetStarted = () => {
    window.location.hash = '#/signup'
  }

  const handleSelectPlan = (planType) => {
    if (planType === 'free-trial') {
      window.location.hash = '#/signup'
    } else {
      localStorage.setItem('selectedPlan', planType)
      window.location.hash = '#/signup'
    }
  }

  return (
    <div className="min-h-screen">
      <Hero onGetStarted={handleGetStarted} />
      <Features />
      <Pricing onSelectPlan={handleSelectPlan} />
    </div>
  )
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  return children
}

const AppContent = () => {
  const { user } = useAuth()
  const [currentSubject, setCurrentSubject] = useState(null)
  const [currentTopic, setCurrentTopic] = useState(null)
  const [studyMode, setStudyMode] = useState(null)
  const [studyOptions, setStudyOptions] = useState(null)

  // Handle selected plan from localStorage
  useEffect(() => {
    if (user) {
      const selectedPlan = localStorage.getItem('selectedPlan')
      if (selectedPlan && selectedPlan !== 'free-trial') {
        // Redirect to pricing to complete payment
        localStorage.removeItem('selectedPlan')
        window.location.hash = '#/pricing'
      }
    }
  }, [user])

  const handleSelectSubject = (subject) => {
    setCurrentSubject(subject)
  }

  const handleSelectTopic = (topic) => {
    setCurrentTopic(topic)
  }

  const handleStartStudy = (mode, options = null) => {
    setStudyMode(mode)
    setStudyOptions(options)
  }

  const handleStartSubtopic = (subtopic) => {
    setStudyMode('subtopic')
    setStudyOptions({ subtopicId: subtopic.id })
  }

  const handleBackToTopics = () => {
    setStudyMode(null)
    setStudyOptions(null)
    setCurrentTopic(null)
  }

  const handleBackToSubtopics = () => {
    setStudyMode(null)
    setStudyOptions(null)
  }

  const handleBackToDashboard = () => {
    setCurrentSubject(null)
    setCurrentTopic(null)
    setStudyMode(null)
    setStudyOptions(null)
  }

  // Study Session View
  if (studyMode && currentSubject) {
    return (
      <StudySession
        subject={currentSubject}
        mode={studyMode}
        options={studyOptions}
        onBack={currentTopic ? handleBackToSubtopics : handleBackToTopics}
      />
    )
  }

  // Subtopic Overview View
  if (currentTopic && currentSubject) {
    return (
      <SubtopicOverview
        subject={currentSubject}
        topic={currentTopic}
        onBack={handleBackToTopics}
        onStartStudy={handleStartStudy}
        onStartSubtopic={handleStartSubtopic}
      />
    )
  }

  // Topic Overview View
  if (currentSubject) {
    return (
      <TopicOverview
        subject={currentSubject}
        onBack={handleBackToDashboard}
        onStartStudy={handleStartStudy}
        onSelectTopic={handleSelectTopic}
      />
    )
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/signin" element={user ? <Navigate to="/dashboard" replace /> : <SignIn />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignUp />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard onSelectSubject={handleSelectSubject} />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AnimatePresence mode="wait">
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AppContent />
          </motion.div>
        </AnimatePresence>
      </Router>
    </AuthProvider>
  )
}

export default App