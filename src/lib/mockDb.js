// High-fidelity LocalStorage + Memory Mock Database for Anobyte
// Facilitates instant out-of-the-box local operation with fully functional workflows

const KEYS = {
  USERS: 'anobyte_users',
  PROFILES: 'anobyte_profiles',
  FILES: 'anobyte_files',
  SESSION: 'anobyte_session'
};

// Helper: Safely get from localStorage
const getLocal = (key, defaultVal = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch (e) {
    console.error(`Error reading key ${key} from localStorage:`, e);
    return defaultVal;
  }
};

// Helper: Safely set in localStorage
const setLocal = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Error writing key ${key} to localStorage:`, e);
  }
};

// Seed mock data if completely empty
const initMockData = () => {
  const users = getLocal(KEYS.USERS);
  if (users.length === 0) {
    // Seed a demo user: demo@anobyte.online / password123
    const demoUser = {
      id: 'demo-user-id-1234',
      email: 'demo@anobyte.online',
      password: 'password123',
      name: 'Alex Developer'
    };
    setLocal(KEYS.USERS, [demoUser]);
    setLocal(KEYS.PROFILES, [{
      id: demoUser.id,
      email: demoUser.email,
      full_name: demoUser.name,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      created_at: new Date().toISOString()
    }]);
    
    // Seed demo files
    const demoFiles = [
      {
        id: 'file-1',
        user_id: demoUser.id,
        name: 'anobyte-architecture.pdf',
        size: 2450000, // 2.45 MB
        type: 'application/pdf',
        storage_path: 'mock/path/architecture.pdf',
        slug: 'arch-pdf',
        password_hash: null,
        expires_at: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
        downloads_count: 42,
        created_at: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
      },
      {
        id: 'file-2',
        user_id: demoUser.id,
        name: 'brand-assets.zip',
        size: 45000000, // 45 MB
        type: 'application/zip',
        storage_path: 'mock/path/brand-assets.zip',
        slug: 'brand-kit',
        password_hash: null,
        expires_at: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours from now
        downloads_count: 12,
        created_at: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
      },
      {
        id: 'file-3',
        user_id: demoUser.id,
        name: 'premium-preview-mockup.jpg',
        size: 450000, // 450 KB
        type: 'image/jpeg',
        storage_path: 'mock/path/mockup.jpg',
        slug: 'preview-demo',
        password_hash: null,
        expires_at: null, // Never expires
        downloads_count: 104,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
      }
    ];
    setLocal(KEYS.FILES, demoFiles);
  }
};

initMockData();

// --- Auth APIs ---
export const mockAuth = {
  signUp: async (email, password, fullName) => {
    await new Promise(r => setTimeout(r, 600)); // Simulate network latency
    const users = getLocal(KEYS.USERS);
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }

    const userId = 'user-' + Math.random().toString(36).substr(2, 9);
    const newUser = { id: userId, email, password, name: fullName };
    users.push(newUser);
    setLocal(KEYS.USERS, users);

    const profiles = getLocal(KEYS.PROFILES);
    const newProfile = {
      id: userId,
      email,
      full_name: fullName,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
      created_at: new Date().toISOString()
    };
    profiles.push(newProfile);
    setLocal(KEYS.PROFILES, profiles);

    const session = { user: { id: userId, email }, profile: newProfile };
    setLocal(KEYS.SESSION, session);
    return { data: { session }, error: null };
  },

  signIn: async (email, password) => {
    await new Promise(r => setTimeout(r, 600));
    const users = getLocal(KEYS.USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const profiles = getLocal(KEYS.PROFILES);
    const profile = profiles.find(p => p.id === user.id) || {
      id: user.id,
      email: user.email,
      full_name: user.name,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
      created_at: new Date().toISOString()
    };

    const session = { user: { id: user.id, email: user.email }, profile };
    setLocal(KEYS.SESSION, session);
    return { data: { session }, error: null };
  },

  signOut: async () => {
    localStorage.removeItem(KEYS.SESSION);
    return { error: null };
  },

  getSession: () => {
    return getLocal(KEYS.SESSION, null);
  },

  getCurrentUser: () => {
    const session = getLocal(KEYS.SESSION, null);
    return session ? session.user : null;
  },

  getProfile: async (userId) => {
    const profiles = getLocal(KEYS.PROFILES);
    const profile = profiles.find(p => p.id === userId);
    return { data: profile || null, error: null };
  }
};

// --- Database & Storage APIs ---
export const mockDb = {
  files: {
    create: async (fileObj) => {
      // Simulate slow uploads
      await new Promise(r => setTimeout(r, 100));
      const files = getLocal(KEYS.FILES);
      
      const newFile = {
        id: 'file-' + Math.random().toString(36).substr(2, 9),
        user_id: fileObj.user_id || null, // null means anonymous guest upload
        name: fileObj.name,
        size: fileObj.size,
        type: fileObj.type,
        storage_path: `mock/storage/${fileObj.name}`,
        slug: fileObj.slug || Math.random().toString(36).substr(2, 6),
        password_hash: fileObj.password || null, // in production we'd bcrypt hash
        expires_at: fileObj.expires_at || null,
        downloads_count: 0,
        created_at: new Date().toISOString(),
        // Save actual data-url if file is small (under 1.5MB) to support full premium visual preview!
        file_data: fileObj.file_data || null 
      };

      files.push(newFile);
      setLocal(KEYS.FILES, files);
      return { data: newFile, error: null };
    },

    list: async (userId) => {
      await new Promise(r => setTimeout(r, 400));
      const files = getLocal(KEYS.FILES);
      // Filter out files that have expired
      const now = new Date();
      const nonExpiredFiles = files.filter(f => {
        if (!f.expires_at) return true;
        return new Date(f.expires_at) > now;
      });
      
      const userFiles = nonExpiredFiles.filter(f => f.user_id === userId);
      return { data: userFiles, error: null };
    },

    getBySlug: async (slug) => {
      await new Promise(r => setTimeout(r, 400));
      const files = getLocal(KEYS.FILES);
      const file = files.find(f => f.slug === slug);
      
      if (!file) {
        return { data: null, error: new Error('File not found') };
      }

      // Check if expired
      if (file.expires_at && new Date(file.expires_at) < new Date()) {
        return { data: null, error: new Error('This share link has expired.') };
      }

      return { data: file, error: null };
    },

    delete: async (id) => {
      await new Promise(r => setTimeout(r, 300));
      const files = getLocal(KEYS.FILES);
      const index = files.findIndex(f => f.id === id);
      if (index > -1) {
        files.splice(index, 1);
        setLocal(KEYS.FILES, files);
        return { success: true, error: null };
      }
      return { success: false, error: new Error('File not found') };
    },

    incrementDownloads: async (id) => {
      const files = getLocal(KEYS.FILES);
      const file = files.find(f => f.id === id);
      if (file) {
        file.downloads_count += 1;
        setLocal(KEYS.FILES, files);
      }
    }
  }
};
