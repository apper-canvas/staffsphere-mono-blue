import { useState, useEffect, createContext } from 'react'
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { setUser, clearUser } from './store/userSlice'
import { Sun, Moon, Menu, X, Home as HomeIcon, Users, BarChart2, Settings, Calendar, LogOut } from 'lucide-react'

// Pages
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Employees from './pages/Employees'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Callback from './pages/Callback'
import ErrorPage from './pages/ErrorPage'

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev
      localStorage.setItem('darkMode', newValue.toString())
      return newValue
    })
  }
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])
  
  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Get authentication status
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
               ? `/signup?redirect=${currentPath}`
               : currentPath.includes('/login')
               ? `/login?redirect=${currentPath}`
               : '/login');
          } else if (redirectPath) {
            if (
              ![
                'error',
                'signup',
                'login',
                'callback'
              ].some((path) => currentPath.includes(path)))
              navigate(`/login?redirect=${redirectPath}`);
            else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed. Please try again.");
      }
    });
    
    // Set initialized state even if there's an error with ApperUI setup
    setIsInitialized(true);
  }, [dispatch, navigate]);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    }
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading">Initializing application...</div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden block text-surface-800 dark:text-surface-100">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-lg font-semibold text-surface-800 dark:text-surface-100">StaffSphere</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <span className="text-sm text-surface-700 dark:text-surface-300 mr-2">
                {userState?.user?.firstName || 'User'}
              </span>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isAuthenticated && (
              <button onClick={authMethods.logout} 
                className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <div className={`fixed inset-0 bg-black/50 z-20 transform transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`w-64 h-full bg-white dark:bg-surface-800 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="text-lg font-semibold">StaffSphere</span>
            </div>
            
            {renderNavLinks()}
          </div>
        </div>
      </div>

      {isAuthenticated ? (
      /* Main Layout */
      
      <div className="flex flex-1">
      
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 p-4 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700">
          <div className="sticky top-20">
            {renderNavLinks()}
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-4">
        
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<Login />} />
        </Routes>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="rounded-md"
      />
    </div>
    </AuthContext.Provider>
  )
}

function renderNavLinks() {
  const { pathname } = useLocation();
  const navItems = [
    { icon: <HomeIcon size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Employees', path: '/employees' },
    { icon: <Calendar size={20} />, label: 'Leave Management', path: '/leave' },
    { icon: <BarChart2 size={20} />, label: 'Performance', path: '/performance' }
  ]
  
  return (
    <nav className="space-y-1">
      {navItems.map((item, index) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname === item.path
              ? 'bg-primary bg-opacity-10 text-primary dark:text-primary-light'
              : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

function getIcon(name) {
  return function(size = 24) {
    return <span className={`lucide lucide-${name}`} style={{width: size, height: size}}></span>;
  }
}

export default App