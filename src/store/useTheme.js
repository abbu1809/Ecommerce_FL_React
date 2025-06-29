import { create } from 'zustand';

const useThemeStore = create((set, get) => ({
  theme: 'light', // 'light' | 'dark' | 'system'
  isDarkMode: false,
  
  // Set theme manually
  setTheme: (theme) => {
    set({ theme });
    
    if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      set({ isDarkMode: systemPrefersDark });
      updateDocumentClass(systemPrefersDark);
    } else {
      const isDark = theme === 'dark';
      set({ isDarkMode: isDark });
      updateDocumentClass(isDark);
    }
    
    // Save to localStorage
    localStorage.setItem('anand-mobiles-theme', theme);
  },
  
  // Toggle between light and dark (skips system)
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },
  
  // Initialize theme based on stored preference or system
  initializeTheme: () => {
    // Temporarily disable transitions during initialization
    document.documentElement.classList.add('no-transitions');
    
    const savedTheme = localStorage.getItem('anand-mobiles-theme') || 'light';
    get().setTheme(savedTheme);
    
    // Re-enable transitions after a brief delay
    setTimeout(() => {
      document.documentElement.classList.remove('no-transitions');
    }, 100);
  }
}));

// Helper function to update document class
const updateDocumentClass = (isDark) => {
  const docElement = document.documentElement;
  
  if (isDark) {
    docElement.classList.add('dark');
    // Also add to body for better compatibility
    document.body.classList.add('dark');
  } else {
    docElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }
};

// Listen for system theme changes
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    const { theme, setTheme } = useThemeStore.getState();
    if (theme === 'system') {
      useThemeStore.getState().setTheme('system');
    }
  });
}

export default useThemeStore;
