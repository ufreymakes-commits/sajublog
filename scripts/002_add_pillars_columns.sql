-- Add pillars_data and interactions_data columns to saju_readings table
ALTER TABLE saju_readings 
ADD COLUMN IF NOT EXISTS pillars_data JSONB,
ADD COLUMN IF NOT EXISTS interactions_data JSONB;
