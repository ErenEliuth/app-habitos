import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ATENCIÓN: Debes reemplazar estos valores con los de tu proyecto de Supabase
const supabaseUrl = 'https://kyyjuffmqgbuwpdzvuja.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5eWp1ZmZtcWdidXdwZHp2dWphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMTQ5MDYsImV4cCI6MjA5MTc5MDkwNn0.nQ_DfIPc9ETH8r_Y0mr4IZA0vz7DSwp17wx5XnoWh-Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
