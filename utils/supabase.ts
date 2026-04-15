import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ATENCIÓN: Debes reemplazar estos valores con los de tu proyecto de Supabase
const supabaseUrl = 'https://kyyjuffmqqbuwpdzvuja.supabase.co';
const supabaseAnonKey = 'sb_publishable_NtuOiLCJHlR7D3xahGvLEg_t_7A1zfH';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
