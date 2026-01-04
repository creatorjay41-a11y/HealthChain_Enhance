/*
  # Create risk assessments table

  1. New Tables
    - `risk_assessments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `risk_level` (enum, 'low' | 'medium' | 'high')
      - `risk_factors` (text array, list of identified risk factors)
      - `recommendations` (text array, list of recommendations)
      - `assessed_at` (timestamp, when the assessment was performed)
      - `created_at` (timestamp, when the record was created)

  2. Security
    - Enable RLS on `risk_assessments` table
    - Add policy for users to read their own assessments
    - Add policy for users to insert their own assessments
    - Add policy for users to update their own assessments
    - Add policy for users to delete their own assessments
*/

CREATE TABLE IF NOT EXISTS risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  risk_level text NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
  risk_factors text[] DEFAULT ARRAY[]::text[],
  recommendations text[] DEFAULT ARRAY[]::text[],
  assessed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own risk assessments"
  ON risk_assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own risk assessments"
  ON risk_assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own risk assessments"
  ON risk_assessments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own risk assessments"
  ON risk_assessments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_risk_assessments_user_id ON risk_assessments(user_id);
CREATE INDEX idx_risk_assessments_assessed_at ON risk_assessments(assessed_at);
