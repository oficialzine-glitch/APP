/*
  # Create facial profiles table

  1. New Tables
    - `facial_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `overall_score` (decimal)
      - `scores` (jsonb - array of score objects)
      - `recommendations` (text array)
      - `image_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `facial_profiles` table
    - Add policy for users to read/write their own analyses
*/

CREATE TABLE IF NOT EXISTS facial_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  overall_score decimal(3,1) NOT NULL,
  scores jsonb NOT NULL,
  recommendations text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE facial_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own analyses"
  ON facial_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON facial_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
  ON facial_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
  ON facial_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS facial_profiles_user_id_idx ON facial_profiles(user_id);
CREATE INDEX IF NOT EXISTS facial_profiles_created_at_idx ON facial_profiles(created_at DESC);