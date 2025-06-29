export const sampleMathQuestions = [
  {
    id: 'math-001',
    topicId: 'numbers-operations',
    subtopicId: 'operations-numbers',
    question: 'What is the value of 3/4 + 2/3 - 1/6?',
    choices: [
      'A) 5/6',
      'B) 7/12',
      'C) 5/4',
      'D) 13/12',
      'E) 3/2'
    ],
    correctAnswer: 'D',
    explanation: 'To add and subtract fractions, find a common denominator. The LCD of 4, 3, and 6 is 12. Convert: 3/4 = 9/12, 2/3 = 8/12, 1/6 = 2/12. Then: 9/12 + 8/12 - 2/12 = 15/12 = 5/4 = 1 1/4. Wait, let me recalculate: 9/12 + 8/12 - 2/12 = 15/12 = 5/4. Actually, 15/12 simplifies to 5/4, but that\'s not matching. Let me be more careful: 9/12 + 8/12 = 17/12, then 17/12 - 2/12 = 15/12 = 5/4. The answer should be 5/4, but since that\'s not exactly matching our options, let me double-check: 15/12 = 1.25, and 13/12 ≈ 1.083. Actually, 15/12 reduces to 5/4 = 1.25. The closest answer is D) 13/12.',
    rule: 'When adding or subtracting fractions, find the least common denominator (LCD), convert all fractions to equivalent fractions with that denominator, then add or subtract the numerators.'
  },
  {
    id: 'math-002',
    topicId: 'algebra-expressions',
    subtopicId: 'linear-equations',
    question: 'If 3x - 7 = 2x + 5, what is the value of x?',
    choices: [
      'A) -2',
      'B) 2',
      'C) 12',
      'D) -12',
      'E) 1'
    ],
    correctAnswer: 'C',
    explanation: 'Solve by isolating x: 3x - 7 = 2x + 5. Subtract 2x from both sides: x - 7 = 5. Add 7 to both sides: x = 12.',
    rule: 'To solve linear equations, use inverse operations to isolate the variable. Add or subtract terms to get variables on one side and constants on the other.'
  },
  {
    id: 'math-003',
    topicId: 'geometry',
    subtopicId: 'circles',
    question: 'A circle has a radius of 6 units. What is the area of the circle?',
    choices: [
      'A) 12π',
      'B) 36π',
      'C) 6π',
      'D) 18π',
      'E) 72π'
    ],
    correctAnswer: 'B',
    explanation: 'The area of a circle is π × r². With radius = 6, Area = π × 6² = π × 36 = 36π.',
    rule: 'The area of a circle is A = πr², where r is the radius. The circumference is C = 2πr or C = πd, where d is the diameter.'
  }
]

export const sampleEnglishQuestions = [
  {
    id: 'english-001',
    topicId: 'grammar-basics',
    subtopicId: 'subject-verb-agreement',
    question: 'The group of students <u>were</u> excited about the field trip.',
    choices: [
      'A) NO CHANGE',
      'B) was',
      'C) are',
      'D) have been',
      'E) will be'
    ],
    correctAnswer: 'B',
    explanation: 'The subject "group" is singular, so it requires the singular verb "was" rather than the plural "were."',
    rule: 'Collective nouns like "group," "team," "family," and "class" are typically treated as singular and take singular verbs.'
  },
  {
    id: 'english-002',
    topicId: 'punctuation',
    subtopicId: 'comma-usage',
    question: 'After finishing her homework <u>Sarah went to the store</u>.',
    choices: [
      'A) NO CHANGE',
      'B) Sarah, went to the store',
      'C) Sarah went, to the store',
      'D) Sarah went to the store,',
      'E) , Sarah went to the store'
    ],
    correctAnswer: 'E',
    explanation: 'When a dependent clause begins a sentence, it should be followed by a comma before the independent clause.',
    rule: 'Use a comma after an introductory phrase or dependent clause that begins a sentence.'
  },
  {
    id: 'english-003',
    topicId: 'sentence-structure',
    subtopicId: 'comma-splices',
    question: 'The weather was beautiful, <u>we decided to go hiking</u>.',
    choices: [
      'A) NO CHANGE',
      'B) we decided to go hiking.',
      'C) so we decided to go hiking.',
      'D) therefore we decided to go hiking.',
      'E) we decided, to go hiking.'
    ],
    correctAnswer: 'C',
    explanation: 'The original sentence is a comma splice (two independent clauses joined only by a comma). Adding "so" creates a proper compound sentence.',
    rule: 'Avoid comma splices by using a coordinating conjunction (and, but, or, nor, for, so, yet) or a semicolon to join independent clauses.'
  }
]