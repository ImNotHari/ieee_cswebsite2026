-- Add start_timestamp column
ALTER TABLE public.events ADD COLUMN start_timestamp TIMESTAMPTZ;

-- Backfill existing data assuming the original date/time were entered in IST (Asia/Kolkata)
UPDATE public.events 
SET start_timestamp = 
  (date || ' ' || time)::TIMESTAMP AT TIME ZONE 'Asia/Kolkata' AT TIME ZONE 'UTC'
WHERE start_timestamp IS NULL;

-- Set NOT NULL constraint after backfill
ALTER TABLE public.events ALTER COLUMN start_timestamp SET NOT NULL;
