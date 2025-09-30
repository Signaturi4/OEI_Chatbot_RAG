-- supabase/migrations/001_daily_sync_setup.sql
-- Enable required extensions for scheduled functions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Add columns to existing documents table for live data tracking
ALTER TABLE documents ADD COLUMN IF NOT EXISTS source_type VARCHAR(20) DEFAULT 'static';
ALTER TABLE documents ADD COLUMN IF NOT EXISTS course_id INTEGER;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS location_id INTEGER;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS last_synced TIMESTAMP WITH TIME ZONE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS needs_daily_update BOOLEAN DEFAULT FALSE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS course_status VARCHAR(50);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS course_price VARCHAR(20);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS course_start_date DATE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS course_end_date DATE;

-- Create index for efficient live data queries
CREATE INDEX IF NOT EXISTS idx_documents_course_live 
ON documents (source_type, course_id, location_id) 
WHERE source_type = 'live';

-- Create function to trigger daily sync (will be updated after Edge Function deployment)
CREATE OR REPLACE FUNCTION trigger_daily_sync()
RETURNS void AS $$
BEGIN
    -- This will be updated with the correct URL after Edge Function deployment
    PERFORM net.http_post(
        url := 'https://yuabkucvhtaplahdxlfm.supabase.co/functions/v1/daily-course-sync',
        headers := '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}',
        body := '{}'
    );
END;
$$ LANGUAGE plpgsql;

-- Schedule daily sync at 2 AM UTC (uncomment after Edge Function is deployed)
-- SELECT cron.schedule(
--     'daily-course-sync',
--     '0 2 * * *',  -- Daily at 2 AM
--     'SELECT trigger_daily_sync();'
