/*
  # Add avatar_path to facial_analyses

  ## Changes
    - Add `avatar_path` column to `facial_analyses` table
      - Stores the Supabase Storage file path (not the full URL)
      - Format: user-uploads/{user.id}/{random-uuid}.jpg
      - Nullable to support users without avatars

  ## Notes
    - No default value set - users start without an avatar
    - Images will be fetched at runtime using supabase.storage.from("user-images").getPublicUrl()
*/

-- Add avatar_path column to facial_analyses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'facial_analyses' AND column_name = 'avatar_path'
  ) THEN
    ALTER TABLE facial_analyses ADD COLUMN avatar_path text;
  END IF;
END $$;