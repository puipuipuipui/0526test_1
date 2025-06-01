// frontend/src/utils/supabase.ts
import { createClient } from '@supabase/supabase-js'

// 修復正確的 Supabase URL 和密鑰
const supabaseUrl = 'https://hsnfrjnjwiclwjvegorrx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbmZyam5qd2ljbHdqdmVnb3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NDIwOTYsImV4cCI6MjA2NDMxODA5Nn0.7rWDyVmlA4tiJxjJl1HIVyHgBxpAp38slcjZglDjvLw'

// 為 Railway 部署添加額外配置
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false // 在伺服器端不持久化 session
  },
  global: {
    headers: {
      'User-Agent': 'gender-bias-study/1.0'
    }
  },
  db: {
    schema: 'public'
  }
})