import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../Layout/Header'
import Pricing from '../Landing/Pricing'
import stripePromise from '../../config/stripe'

const PricingPage = () => {
  const { user } = useAuth()

  const handleSelectPlan = async (planType) => {
    if (planType === 'free-trial') {
      // Redirect to signup for free trial
      window.location.hash = '#/signup'
      return
    }

    // For paid plans, redirect to signup if not authenticated
    if (!user) {
      // Store the selected plan in localStorage
      localStorage.setItem('selectedPlan', planType)
      window.location.hash = '#/signup'
      return
    }

    if (planType === 'monthly' || planType === 'lifetime') {
      try {
        const stripe = await stripePromise
        
        // Determine the price ID based on plan type
        const priceId = planType === 'monthly' 
          ? 'price_monthly_999' // Replace with your actual Stripe price ID
          : 'price_lifetime_2000' // Replace with your actual Stripe price ID
        
        // Create a checkout session
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId,
            userId: user?.id,
            planType,
            successUrl: `${window.location.origin}/#/dashboard?success=true`,
            cancelUrl: `${window.location.origin}/#/pricing?canceled=true`,
          }),
        })

        const session = await response.json()

        if (session.error) {
          console.error('Error creating checkout session:', session.error)
          // For demo purposes, just redirect to dashboard
          window.location.hash = '#/dashboard'
          return
        }

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        })

        if (result.error) {
          console.error('Error redirecting to checkout:', result.error)
          // For demo purposes, just redirect to dashboard
          window.location.hash = '#/dashboard'
        }
      } catch (error) {
        console.error('Error handling subscription:', error)
        // For demo purposes, just redirect to dashboard
        window.location.hash = '#/dashboard'
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with our free trial, upgrade to monthly, or get lifetime access
          </p>
        </motion.div>

        <Pricing onSelectPlan={handleSelectPlan} />
      </div>
    </div>
  )
}

export default PricingPage