import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserSubscription(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchUserSubscription(session.user.id)
        } else {
          setSubscription(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserSubscription = async (userId) => {
    try {
      // Try to fetch from Supabase first
      const { data, error } = await supabase
        .from('user_subscriptions_act2024')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setSubscription(data)
      } else {
        // Create default trial subscription
        const { data: newSub, error: insertError } = await supabase
          .from('user_subscriptions_act2024')
          .insert({
            user_id: userId,
            status: 'trial',
            plan_type: 'trial',
            questions_used: 0,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select()
          .single()

        if (insertError) throw insertError
        setSubscription(newSub)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
      // Create mock subscription for demo
      const mockSubscription = {
        user_id: userId,
        status: 'trial',
        plan_type: 'trial',
        questions_used: 0,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
      setSubscription(mockSubscription)
    }
  }

  const signUp = async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      // For demo purposes, create a mock user
      const mockUser = {
        id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: { full_name: fullName }
      }
      setUser(mockUser)
      fetchUserSubscription(mockUser.id)
      return { data: { user: mockUser }, error: null }
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      // For demo purposes, create a mock user
      const mockUser = {
        id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
        email,
        user_metadata: { full_name: 'Demo User' }
      }
      setUser(mockUser)
      fetchUserSubscription(mockUser.id)
      return { data: { user: mockUser }, error: null }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error signing out:', error)
    setUser(null)
    setSubscription(null)
    window.location.hash = '#/'
  }

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/reset-password`
      })
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error sending reset email:', error)
      return { error }
    }
  }

  const hasActiveSubscription = () => {
    if (!subscription) return false
    
    // Lifetime access
    if (subscription.plan_type === 'lifetime') return true
    
    // Monthly subscription
    if (subscription.status === 'active') {
      const now = new Date()
      const expiresAt = new Date(subscription.expires_at)
      return expiresAt > now
    }
    
    return false
  }

  const getQuestionsRemaining = () => {
    if (hasActiveSubscription()) return Infinity
    const trialLimit = 20
    const used = subscription?.questions_used || 0
    return Math.max(0, trialLimit - used)
  }

  const incrementQuestionsUsed = async () => {
    if (hasActiveSubscription()) return
    
    try {
      const newCount = (subscription?.questions_used || 0) + 1
      
      // Update in Supabase
      const { error } = await supabase
        .from('user_subscriptions_act2024')
        .update({ questions_used: newCount })
        .eq('user_id', user?.id)

      if (!error) {
        // Update local state
        setSubscription(prev => prev ? { ...prev, questions_used: newCount } : null)
      }
    } catch (error) {
      console.error('Error updating questions used:', error)
      // Update local state anyway for demo
      setSubscription(prev => prev ? { ...prev, questions_used: (prev.questions_used || 0) + 1 } : null)
    }
  }

  const value = {
    user,
    loading,
    subscription,
    signUp,
    signIn,
    signOut,
    resetPassword,
    hasActiveSubscription,
    getQuestionsRemaining,
    incrementQuestionsUsed,
    fetchUserSubscription
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}