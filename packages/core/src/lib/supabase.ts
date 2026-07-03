import { createClient } from '@supabase/supabase-js';

function getEnvVar(key: string): string {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  try {
    if (typeof import !== 'undefined' && typeof import.meta !== 'undefined') {
      const meta = import.meta as any;
      if (meta.env && meta.env[key]) {
        return meta.env[key];
      }
      if (meta.env && meta.env[`VITE_${key}`]) {
        return meta.env[`VITE_${key}`];
      }
    }
  } catch {}
  return '';
}

const supabaseUrl = getEnvVar('SUPABASE_URL') || getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY');

// Lazy initialize client to prevent crash if keys are missing
let supabaseClientInstance: any = null;

const createMockSupabase = () => {
  console.warn('⚠️ Supabase running in local/mock fallback mode. To connect to a live database, configure valid credentials.');
  const mockThenable = {
    then: function(resolve: any) {
      if (resolve) resolve({ data: [], error: null });
      return this;
    }
  };
  
  const mockQueryBuilder = {
    select: function() { return this; },
    insert: function() { return this; },
    update: function() { return this; },
    delete: function() { return this; },
    eq: function() { return this; },
    order: function() { return this; },
    limit: function() { return this; },
    then: function(resolve: any) {
      if (resolve) resolve({ data: [], error: null });
      return this;
    }
  };

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => {
        setTimeout(() => callback('SIGNED_OUT', null), 0);
        return {
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        };
      },
      signInWithPassword: async () => {
        return { data: { user: null }, error: new Error('Supabase is running in offline/mock mode. Real database credentials are required to sign in.') };
      },
      signUp: async () => {
        return { data: { user: null }, error: new Error('Supabase is running in offline/mock mode. Real database credentials are required to sign up.') };
      },
      signOut: async () => {}
    },
    from: (table: string) => {
      return mockQueryBuilder;
    }
  };
};

export function getSupabaseClient() {
  if (!supabaseClientInstance) {
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'mock' || supabaseAnonKey === 'mock') {
      supabaseClientInstance = createMockSupabase();
    } else {
      try {
        supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey);
      } catch (err) {
        console.error('Failed to initialize real Supabase client, falling back to mock:', err);
        supabaseClientInstance = createMockSupabase();
      }
    }
  }
  return supabaseClientInstance;
}

export const supabase = getSupabaseClient();
