import React, { useState } from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../contexts/AuthContext'

const { FiBookOpen, FiEye, FiEyeOff, FiMail, FiLock, FiUser } = FiIcons

const SignUp = () => {
  const { signUp } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/(?=.*[a-zA-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Clear confirm password error when password changes
    if (name === 'password' && errors.confirmPassword && formData.confirmPassword) {
      if (value === formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }))
      }
    }
    
    // Clear confirm password error when confirm password matches
    if (name === 'confirmPassword' && errors.confirmPassword) {
      if (value === formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }))
      }
    }
    
    // Clear auth error when user makes changes
    if (authError) {
      setAuthError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setAuthError('')

    try {
      const { error } = await signUp(
        formData.email.trim(), 
        formData.password, 
        formData.fullName.trim()
      )
      
      if (error) {
        setAuthError(error.message || 'Failed to create account. Please try again.')
      } else {
        setSuccess(true)
        setTimeout(() => {
          window.location.hash = '#/dashboard'
        }, 2000)
      }
    } catch (error) {
      console.error('Sign up error:', error)
      setAuthError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
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
            <SafeIcon icon={FiBookOpen} className="text-3xl text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to ACT Recall!</h2>
          <p className="text-gray-600 mb-4">Your account has been created successfully.</p>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mr-2"></div>
            <span className="text-primary-600">Redirecting to dashboard...</span>
          </div>
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start your free trial with 20 questions
          </p>
        </div>

        <motion.form 
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {authError && (
            <motion.div 
              className="bg-red-50 border border-red-200 rounded-lg p-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-red-800 text-sm">{authError}</p>
            </motion.div>
          )}

          <div>
            <label htmlFor="fullName" className="sr-only">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiUser} className="text-gray-400" />
              </div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={handleChange}
                className={`appearance-none rounded-lg relative block w-full px-12 py-3 border ${
                  errors.fullName ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                placeholder="Full name"
              />
            </div>
            {errors.fullName && (
              <motion.p 
                className="mt-1 text-sm text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {errors.fullName}
              </motion.p>
            )}
          </div>

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
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none rounded-lg relative block w-full px-12 py-3 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
            </div>
            {errors.email && (
              <motion.p 
                className="mt-1 text-sm text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiLock} className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none rounded-lg relative block w-full px-12 py-3 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm pr-12`}
                placeholder="Password (min. 6 characters)"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                <SafeIcon 
                  icon={showPassword ? FiEyeOff : FiEye} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                />
              </button>
            </div>
            {errors.password && (
              <motion.p 
                className="mt-1 text-sm text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiLock} className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`appearance-none rounded-lg relative block w-full px-12 py-3 border ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm pr-12`}
                placeholder="Confirm password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                <SafeIcon 
                  icon={showConfirmPassword ? FiEyeOff : FiEye} 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                />
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p 
                className="mt-1 text-sm text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {errors.confirmPassword}
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
                  Creating account...
                </div>
              ) : (
                'Start free trial'
              )}
            </motion.button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => window.location.hash = '#/signin'}
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default SignUp