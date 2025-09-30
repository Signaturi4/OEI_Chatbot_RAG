# Supabase Web Interface Setup Instructions

## Overview

This guide shows how to set up the daily sync system directly through the Supabase web interface without using the CLI.

## Step 1: Database Schema Setup

### 1.1 Add Columns to Documents Table

1. Go to **Supabase Dashboard** → **Table Editor** → **documents** table
2. Click **Add Column** and add these columns one by one:

| Column Name            | Type            | Default Value | Nullable |
| ---------------------- | --------------- | ------------- | -------- |
| `source_type`        | `varchar(20)` | `'static'`  | Yes      |
| `course_id`          | `integer`     | -             | Yes      |
| `location_id`        | `integer`     | -             | Yes      |
| `last_synced`        | `timestamptz` | -             | Yes      |
| `needs_daily_update` | `boolean`     | `false`     | Yes      |
| `course_status`      | `varchar(50)` | -             | Yes      |
| `course_price`       | `varchar(20)` | -             | Yes      |
| `course_start_date`  | `date`        | -             | Yes      |
| `course_end_date`    | `date`        | -             | Yes      |

### 1.2 Create Index

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this SQL:

```sql
CREATE INDEX IF NOT EXISTS idx_documents_course_live 
ON documents (source_type, course_id, location_id) 
WHERE source_type = 'live';
```

## Step 2: Enable Extensions

### 2.1 Enable pg_cron and pg_net

1. Go to **Supabase Dashboard** → **Database** → **Extensions**
2. Search and enable:
   - `pg_cron`
   - `pg_net`

## Step 3: Create Edge Function

### 3.1 Create Function

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click **Create a new function**
3. Name: `daily-course-sync`
4. Copy and paste this code:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get your backend URL from environment or use default
    const backendUrl = Deno.env.get("BACKEND_URL") || "http://localhost:8000";

    // Call the Python sync function
    const response = await fetch(`${backendUrl}/sync/daily`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }

    const result = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Daily sync completed",
        result,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Daily sync error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
```

### 3.2 Deploy Function

1. Click **Deploy** button
2. Wait for deployment to complete

## Step 4: Create Database Function

### 4.1 Create Trigger Function

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this SQL (replace `your-project-id` with your actual project ID):

```sql
-- Create function to trigger daily sync
CREATE OR REPLACE FUNCTION trigger_daily_sync()
RETURNS void AS $$
BEGIN
    PERFORM net.http_post(
        url := 'https://yuabkucvhtaplahdxlfm.supabase.co/functions/v1/daily-course-sync',
        headers := '{"Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}',
        body := '{}'
    );
END;
$$ LANGUAGE plpgsql;
```

### 4.2 Schedule Daily Sync

1. In the same **SQL Editor**, run this SQL:

```sql
-- Schedule daily sync at 2 AM UTC
SELECT cron.schedule(
    'daily-course-sync',
    '0 2 * * *',  -- Daily at 2 AM
    'SELECT trigger_daily_sync();'
);
```

## Step 5: Set Environment Variables

### 5.1 Backend Environment

1. Create a `.env` file in your backend directory:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
OPENAI_API_KEY=your_openai_key_here
```

### 5.2 Edge Function Environment (Optional)

1. Go to **Supabase Dashboard** → **Edge Functions** → **daily-course-sync**
2. Click **Settings** → **Environment Variables**
3. Add if needed:
   - `BACKEND_URL`: `http://localhost:8000` (or your backend URL)

## Step 6: Test the Setup

### 6.1 Test Backend Sync

```bash
# Start your backend
cd backend
python main.py

# Test sync endpoint
curl -X POST http://localhost:8000/sync/daily
```

### 6.2 Test Edge Function

1. Go to **Supabase Dashboard** → **Edge Functions** → **daily-course-sync**
2. Click **Invoke function**
3. Check the response

### 6.3 Test Scheduled Job

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run this to check scheduled jobs:

```sql
SELECT * FROM cron.job;
```

## Step 7: Monitor the System

### 7.1 Check Sync Status

```sql
-- Check document counts by source type
SELECT 
    source_type,
    COUNT(*) as count,
    MAX(last_synced) as last_sync
FROM documents 
GROUP BY source_type;
```

### 7.2 Check Failed Syncs

```sql
-- Check for failed syncs
SELECT * FROM documents 
WHERE needs_daily_update = true 
AND last_synced < NOW() - INTERVAL '2 days';
```

### 7.3 View Function Logs

1. Go to **Supabase Dashboard** → **Edge Functions** → **daily-course-sync**
2. Click **Logs** tab to see execution history

## Troubleshooting

### Common Issues:

1. **Function not found**: Check if Edge Function is deployed
2. **Permission denied**: Verify service role key is correct
3. **Backend not reachable**: Check if backend is running and accessible
4. **Cron job not running**: Verify pg_cron extension is enabled

### Manual Sync Trigger:

```sql
-- Trigger sync manually
SELECT trigger_daily_sync();
```

### Check Cron Jobs:

```sql
-- View all scheduled jobs
SELECT * FROM cron.job;

-- View job run history
SELECT * FROM cron.job_run_details 
WHERE jobname = 'daily-course-sync' 
ORDER BY start_time DESC 
LIMIT 10;
```

## Next Steps

1. Test with one location first
2. Monitor sync performance
3. Adjust sync frequency if needed
4. Add error handling and retry logic
