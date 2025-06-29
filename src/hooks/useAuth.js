import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../config/supabase'

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
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error)
      } else {
        setSubscription(data)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/#/dashboard`
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const hasActiveSubscription = () => {
    if (!subscription) return false
    const now = new Date()
    const expiresAt = new Date(subscription.expires_at)
    return subscription.status === 'active' && expiresAt > now
  }

  const getQuestionsRemaining = () => {
    if (hasActiveSubscription()) return Infinity
    return Math.max(0, 20 - (subscription?.questions_used || 0))
  }

  const value = {
    user,
    loading,
    subscription,
    signInWithGitHub,
    signOut,
    hasActiveSubscription,
    getQuestionsRemaining,
    fetchUserSubscription
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}