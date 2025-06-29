import { useState, useCallback } from 'react'
import { supabase } from '../config/supabase'

export const useSpacedRepetition = (userId, subject) => {
  const [algorithm, setAlgorithm] = useState({
    cardQueue: [],
    subtopicSchedule: new Map(),
    cardsSinceStart: 0
  })

  const addToQueue = useCallback((subtopicId, difficulty, isCorrect, questionsPool) => {
    const baseDistance = {
      'hard': { min: 1, max: 15 },
      'medium': { min: 15, max: 30 },
      'easy': { min: 30, max: 60 }
    }

    let range = baseDistance[difficulty]
    
    // Adjust based on correctness
    if (isCorrect) {
      // Push towards max of range
      const adjustment = Math.floor((range.max - range.min) * 0.3)
      range.min = Math.min(range.max, range.min + adjustment)
    } else {
      // Push towards min of range (or even less)
      const adjustment = Math.floor((range.max - range.min) * 0.3)
      range.max = Math.max(range.min, range.max - adjustment)
      range.min = Math.max(1, range.min - 5) // Never less than 1
    }

    // Add randomization within range
    const distance = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    const position = algorithm.cardsSinceStart + distance

    // Find available questions for this subtopic
    const subtopicQuestions = questionsPool.filter(q => q.subtopicId === subtopicId)
    if (subtopicQuestions.length === 0) return

    // Select a random question from this subtopic
    const selectedQuestion = subtopicQuestions[Math.floor(Math.random() * subtopicQuestions.length)]

    setAlgorithm(prev => ({
      ...prev,
      subtopicSchedule: new Map(prev.subtopicSchedule).set(subtopicId, {
        nextAppearance: position,
        difficulty,
        lastCorrect: isCorrect,
        questionId: selectedQuestion.id
      })
    }))
  }, [algorithm.cardsSinceStart])

  const getNextQuestion = useCallback((questionsPool) => {
    // Check if any subtopics are due
    const currentPosition = algorithm.cardsSinceStart
    
    for (const [subtopicId, schedule] of algorithm.subtopicSchedule) {
      if (schedule.nextAppearance <= currentPosition) {
        const question = questionsPool.find(q => q.id === schedule.questionId)
        if (question) {
          // Remove from schedule since it's being served
          setAlgorithm(prev => {
            const newSchedule = new Map(prev.subtopicSchedule)
            newSchedule.delete(subtopicId)
            return {
              ...prev,
              subtopicSchedule: newSchedule
            }
          })
          return question
        }
      }
    }

    // If no scheduled questions, return a random question
    if (questionsPool.length === 0) return null
    return questionsPool[Math.floor(Math.random() * questionsPool.length)]
  }, [algorithm])

  const incrementCardCounter = useCallback(() => {
    setAlgorithm(prev => ({
      ...prev,
      cardsSinceStart: prev.cardsSinceStart + 1
    }))
  }, [])

  const saveUserProgress = useCallback(async (questionId, isCorrect, difficulty, timeSpent) => {
    if (!userId) return

    try {
      // Save the answer
      const { error: answerError } = await supabase
        .from('user_answers')
        .insert({
          user_id: userId,
          question_id: questionId,
          is_correct: isCorrect,
          difficulty_rating: difficulty,
          time_spent: timeSpent,
          subject: subject
        })

      if (answerError) throw answerError

      // Update user stats
      const { error: statsError } = await supabase.rpc('update_user_stats', {
        p_user_id: userId,
        p_subject: subject,
        p_question_id: questionId,
        p_is_correct: isCorrect
      })

      if (statsError) throw statsError

    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }, [userId, subject])

  return {
    addToQueue,
    getNextQuestion,
    incrementCardCounter,
    saveUserProgress,
    cardsSinceStart: algorithm.cardsSinceStart
  }
}