import { createClient } from '@supabase/supabase-js';
import { mockAuth, mockDb } from './mockDb';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if valid keys are present to decide whether to use real or mock Supabase
export const isMocked = !supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL';

let supabaseClient = null;

if (!isMocked) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('⚡ Connected to real Supabase database client.');
  } catch (error) {
    console.error('Failed to initialize Supabase client. Defaulting to mock database:', error);
  }
}

if (isMocked || !supabaseClient) {
  console.log('📂 Running Anobyte in local mock sandbox database. To connect a live Supabase, configure your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  
  // Custom auth listeners storage
  const authListeners = new Set();
  
  // Create high-fidelity adapter mapping to mock database
  supabaseClient = {
    auth: {
      signUp: async ({ email, password, options }) => {
        try {
          const res = await mockAuth.signUp(email, password, options?.data?.full_name || 'Guest User');
          // Trigger listeners
          authListeners.forEach(cb => cb('SIGNED_IN', res.data.session));
          return res;
        } catch (e) {
          return { data: { session: null, user: null }, error: e };
        }
      },
      signInWithPassword: async ({ email, password }) => {
        try {
          const res = await mockAuth.signIn(email, password);
          authListeners.forEach(cb => cb('SIGNED_IN', res.data.session));
          return res;
        } catch (e) {
          return { data: { session: null, user: null }, error: e };
        }
      },
      signOut: async () => {
        await mockAuth.signOut();
        authListeners.forEach(cb => cb('SIGNED_OUT', null));
        return { error: null };
      },
      getSession: async () => {
        const session = mockAuth.getSession();
        return { data: { session }, error: null };
      },
      getUser: async () => {
        const user = mockAuth.getCurrentUser();
        return { data: { user }, error: null };
      },
      onAuthStateChange: (callback) => {
        authListeners.add(callback);
        // Fire initial event
        const session = mockAuth.getSession();
        if (session) {
          callback('SIGNED_IN', session);
        } else {
          callback('SIGNED_OUT', null);
        }
        return {
          data: {
            subscription: {
              unsubscribe: () => authListeners.delete(callback)
            }
          }
        };
      }
    },
    
    // Database queries
    from: (table) => {
      if (table === 'profiles') {
        return {
          select: (query = '*') => ({
            eq: async (column, value) => {
              if (column === 'id') {
                const res = await mockAuth.getProfile(value);
                return res;
              }
              return { data: null, error: new Error('Query column not supported in mock mode') };
            }
          })
        };
      }
      
      if (table === 'files') {
        return {
          select: (query = '*') => ({
            eq: async (column, value) => {
              if (column === 'user_id') {
                return await mockDb.files.list(value);
              }
              if (column === 'slug') {
                return await mockDb.files.getBySlug(value);
              }
              return { data: null, error: new Error('Query column not supported in mock mode') };
            },
            order: (col, opts) => ({
              eq: async (column, value) => {
                const list = await mockDb.files.list(value);
                // Sort by created_at desc
                list.data = list.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                return list;
              }
            })
          }),
          insert: async (dataArr) => {
            const records = Array.isArray(dataArr) ? dataArr : [dataArr];
            const created = [];
            for (const rec of records) {
              const res = await mockDb.files.create(rec);
              if (res.error) return { data: null, error: res.error };
              created.push(res.data);
            }
            return { data: created, error: null };
          },
          delete: () => ({
            eq: async (column, value) => {
              if (column === 'id') {
                return await mockDb.files.delete(value);
              }
              return { data: null, error: new Error('Delete column not supported in mock mode') };
            }
          })
        };
      }

      return {
        select: () => ({ eq: () => ({ data: [], error: null }) }),
        insert: () => ({ data: [], error: null })
      };
    },

    // Storage bucket simulation
    storage: {
      from: (bucket) => ({
        upload: async (path, fileBlob) => {
          // In mock mode, we simulate file upload and return a fake path
          await new Promise(r => setTimeout(r, 600));
          return { data: { path: `mock/${bucket}/${path}` }, error: null };
        },
        remove: async (paths) => {
          return { data: paths, error: null };
        },
        createSignedUrl: async (path, expiry) => {
          // Simply return a dynamic mockup path or base64 stream representation
          return { data: { signedUrl: `mock-signed-url://${path}` }, error: null };
        }
      })
    }
  };
}

export const supabase = supabaseClient;
