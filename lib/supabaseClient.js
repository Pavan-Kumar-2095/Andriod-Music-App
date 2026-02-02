import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig?.extra || {};

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env vars missing!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);