import { useState, useCallback } from 'react'

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
      const adjustment = Math.floor((range.max - range.min) * 0.3)
      range.min = Math.min(range.max, range.min + adjustment)
    } else {
      const adjustment = Math.floor((range.max - range.min) * 0.3)
      range.max = Math.max(range.min, range.max - adjustment)
      range.min = Math.max(1, range.min - 5)
    }

    const distance = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    const position = algorithm.cardsSinceStart + distance

    const subtopicQuestions = questionsPool.filter(q => q.subtopicId === subtopicId)
    if (subtopicQuestions.length === 0) return

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
    const currentPosition = algorithm.cardsSinceStart
    
    for (const [subtopicId, schedule] of algorithm.subtopicSchedule) {
      if (schedule.nextAppearance <= currentPosition) {
        const question = questionsPool.find(q => q.id === schedule.questionId)
        if (question) {
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
      // For demo purposes, just log the progress
      console.log('Progress saved:', {
        userId,
        questionId,
        isCorrect,
        difficulty,
        timeSpent
      })
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }, [userId])

  return {
    addToQueue,
    getNextQuestion,
    incrementCardCounter,
    saveUserProgress,
    cardsSinceStart: algorithm.cardsSinceStart
  }
}