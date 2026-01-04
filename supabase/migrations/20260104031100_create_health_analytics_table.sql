/*
  # Create health analytics table

  1. New Tables
    - `health_analytics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `avg_heart_rate` (integer, average heart rate)
      - `avg_blood_pressure` (text, formatted as "systolic/diastolic")
      - `avg_oxygen_level` (integer, average oxygen percentage)
      - `date` (date, the date the analytics are for)
      - `created_at` (timestamp, when the record was created)

  2. Security
    - Enable RLS on `health_analytics` table
    - Add policy for users to read their own analytics
    - Add policy for users to insert their own analytics
    - Add policy for users to update their own analytics
    - Add policy for users to delete their own analytics
*/

CREATE TABLE IF NOT EXISTS health_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  avg_heart_rate integer NOT NULL,
  avg_blood_pressure text NOT NULL,
  avg_oxygen_level integer NOT NULL,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own analytics"
  ON health_analytics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON health_analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
  ON health_analytics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analytics"
  ON health_analytics FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_health_analytics_user_id ON health_analytics(user_id);
CREATE INDEX idx_health_analytics_date ON health_analytics(date);
