import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Fallback to environment variables if running outside EAS
const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or Anon Key missing! Check your app.config.js / .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
