import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../contexts/AuthContext'

const { FiBookOpen, FiMail, FiArrowLeft } = FiIcons

const ForgotPassword = () => {
  const { resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email) => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      return 'Email is required'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return 'Please enter a valid email address'
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const emailValidationError = validateEmail(email)
    if (emailValidationError) {
      setEmailError(emailValidationError)
      return
    }
    
    setIsLoading(true)
    setError('')
    setEmailError('')

    try {
      const { error } = await resetPassword(email.trim())
      
      if (error) {
        setError(error.message || 'Failed to send reset email. Please try again.')
      } else {
        setSuccess(true)
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (emailError) {
      setEmailError('')
    }
    if (error) {
      setError('')
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SafeIcon icon={FiMail} className="text-3xl text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <motion.button
            onClick={() => window.location.hash = '#/signin'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to sign in
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SafeIcon icon={FiBookOpen} className="text-6xl text-primary-600" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a reset link
          </p>
        </div>

        <motion.form 
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {error && (
            <motion.div 
              className="bg-red-50 border border-red-200 rounded-lg p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-red-800 text-sm">{error}</p>
            </motion.div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiMail} className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                className={`appearance-none rounded-lg relative block w-full px-12 py-3 border ${
                  emailError ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
            </div>
            {emailError && (
              <motion.p 
                className="mt-1 text-sm text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {emailError}
              </motion.p>
            )}
          </div>

          <div>
            <motion.button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send reset link'
              )}
            </motion.button>
          </div>

          <div className="text-center">
            <motion.button
              type="button"
              onClick={() => window.location.hash = '#/signin'}
              className="flex items-center justify-center space-x-2 text-sm text-gray-600 hover:text-gray-900 mx-auto transition-colors"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <SafeIcon icon={FiArrowLeft} className="text-sm" />
              <span>Back to sign in</span>
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default ForgotPassword