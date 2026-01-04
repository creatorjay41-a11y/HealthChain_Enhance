/*
  # Create health records table

  1. New Tables
    - `health_records`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `heart_rate` (integer, beats per minute)
      - `blood_pressure_systolic` (integer, mmHg)
      - `blood_pressure_diastolic` (integer, mmHg)
      - `oxygen_level` (integer, percentage)
      - `temperature` (decimal, celsius)
      - `recorded_at` (timestamp, when the measurement was taken)
      - `created_at` (timestamp, when the record was created)

  2. Security
    - Enable RLS on `health_records` table
    - Add policy for users to read their own health records
    - Add policy for users to insert their own health records
    - Add policy for users to update their own health records
    - Add policy for users to delete their own health records
*/

CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  heart_rate integer NOT NULL,
  blood_pressure_systolic integer NOT NULL,
  blood_pressure_diastolic integer NOT NULL,
  oxygen_level integer NOT NULL,
  temperature decimal(4, 2) NOT NULL,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own health records"
  ON health_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health records"
  ON health_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health records"
  ON health_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health records"
  ON health_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_health_records_user_id ON health_records(user_id);
CREATE INDEX idx_health_records_recorded_at ON health_records(recorded_at);
