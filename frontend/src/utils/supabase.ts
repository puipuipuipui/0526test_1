import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://huihui0.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbmZyam5qd2ljbHdqdmVnb3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NDIwOTYsImV4cCI6MjA2NDMxODA5Nn0.7rWDyVmlA4tiJxjJl1HIVyHgBxpAp38slcjZglDjvLw'

export const supabase = createClient(supabaseUrl, supabaseKey)