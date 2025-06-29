import React from 'react'
import { motion } from 'framer-motion'
import * as FiIcons from 'react-icons/fi'
import SafeIcon from '../../common/SafeIcon'
import { useAuth } from '../../contexts/AuthContext'

const { FiUser, FiLogOut, FiBookOpen } = FiIcons

const Header = () => {
  const { user, signOut, hasActiveSubscription, getQuestionsRemaining } = useAuth()

  return (
    <motion.header 
      className="bg-white shadow-sm border-b border-gray-200"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiBookOpen} className="text-2xl text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900">AdaptivePrep</h1>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {hasActiveSubscription() ? (
                  <span className="text-green-600 font-medium">Unlimited</span>
                ) : (
                  <span className="text-orange-600 font-medium">
                    {getQuestionsRemaining()} questions left
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <SafeIcon icon={FiUser} className="text-lg" />
                <span>{user.user_metadata?.full_name || user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <SafeIcon icon={FiLogOut} className="text-lg" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}

export default Header