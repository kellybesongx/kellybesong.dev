/**
 * Supabase client configuration
 * Using your existing Supabase connection from Vercel
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// These will be set in Vercel environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials. Please check Vercel environment variables.');
  process.exit(1);
}

// Create Supabase client (same one your portfolio uses)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;