-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- User Subscriptions Table
CREATE TABLE user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'trial',
  plan_type TEXT NOT NULL DEFAULT 'trial',
  questions_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- User Stats Table
CREATE TABLE user_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic_id TEXT,
  subtopic_id TEXT,
  questions_answered INTEGER DEFAULT 0,
  questions_correct INTEGER DEFAULT 0,
  last_studied TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User Answers Table
CREATE TABLE user_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic_id TEXT,
  subtopic_id TEXT,
  is_correct BOOLEAN NOT NULL,
  difficulty_rating TEXT NOT NULL,
  time_spent INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Questions Table (for storing your 2000+ questions)
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  subtopic_id TEXT NOT NULL,
  question TEXT NOT NULL,
  choices JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  rule TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security Policies
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own answers" ON user_answers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers" ON user_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "All users can view questions" ON questions
  FOR SELECT TO authenticated USING (true);

-- Enable RLS on all tables
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Function to update user stats
CREATE OR REPLACE FUNCTION update_user_stats(
  p_user_id UUID,
  p_subject TEXT,
  p_question_id TEXT,
  p_is_correct BOOLEAN
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_topic_id TEXT;
  v_subtopic_id TEXT;
BEGIN
  -- Get topic and subtopic from questions table
  SELECT topic_id, subtopic_id INTO v_topic_id, v_subtopic_id
  FROM questions WHERE id = p_question_id;
  
  -- Update or insert user stats for subject
  INSERT INTO user_stats (user_id, subject, questions_answered, questions_correct, last_studied)
  VALUES (p_user_id, p_subject, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END, NOW())
  ON CONFLICT (user_id, subject, topic_id, subtopic_id)
  DO UPDATE SET
    questions_answered = user_stats.questions_answered + 1,
    questions_correct = user_stats.questions_correct + (CASE WHEN p_is_correct THEN 1 ELSE 0 END),
    last_studied = NOW(),
    updated_at = NOW();
    
  -- Update or insert user stats for topic
  INSERT INTO user_stats (user_id, subject, topic_id, questions_answered, questions_correct, last_studied)
  VALUES (p_user_id, p_subject, v_topic_id, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END, NOW())
  ON CONFLICT (user_id, subject, topic_id, subtopic_id)
  DO UPDATE SET
    questions_answered = user_stats.questions_answered + 1,
    questions_correct = user_stats.questions_correct + (CASE WHEN p_is_correct THEN 1 ELSE 0 END),
    last_studied = NOW(),
    updated_at = NOW();
    
  -- Update or insert user stats for subtopic
  INSERT INTO user_stats (user_id, subject, topic_id, subtopic_id, questions_answered, questions_correct, last_studied)
  VALUES (p_user_id, p_subject, v_topic_id, v_subtopic_id, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END, NOW())
  ON CONFLICT (user_id, subject, topic_id, subtopic_id)
  DO UPDATE SET
    questions_answered = user_stats.questions_answered + 1,
    questions_correct = user_stats.questions_correct + (CASE WHEN p_is_correct THEN 1 ELSE 0 END),
    last_studied = NOW(),
    updated_at = NOW();
END;
$$;

-- Function to create user subscription on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO user_subscriptions (user_id, status, plan_type, expires_at)
  VALUES (
    NEW.id,
    'trial',
    'trial',
    NOW() + INTERVAL '30 days'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create user subscription on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Indexes for performance
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_user_stats_subject ON user_stats(subject);
CREATE INDEX idx_user_answers_user_id ON user_answers(user_id);
CREATE INDEX idx_user_answers_subject ON user_answers(subject);
CREATE INDEX idx_questions_subject ON questions(subject);
CREATE INDEX idx_questions_topic ON questions(topic_id);
CREATE INDEX idx_questions_subtopic ON questions(subtopic_id);