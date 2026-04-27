import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://igkzsyacerbxzqimacxr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlna3pzeWFjZXJieHpxaW1hY3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTA4MzIsImV4cCI6MjA5Mjg2NjgzMn0.nSj8jwvbxdQ8_TLZcklo35eb1HQ2vFcJ3fdb8RYcP7o'

export const supabase = createClient(supabaseUrl, supabaseKey)