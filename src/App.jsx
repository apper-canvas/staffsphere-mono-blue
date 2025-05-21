import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify'
import { Sun, Moon, Menu, X, Home, Users, BarChart2, Settings, Calendar } from 'lucide-react'

// Pages
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  
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

  return (
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
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
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
      
      {/* Main Layout */}
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
      
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
  )
}

function renderNavLinks() {
  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Users size={20} />, label: 'Employees', path: '/employees' },
    { icon: <Calendar size={20} />, label: 'Leave Management', path: '/leave' },
    { icon: <BarChart2 size={20} />, label: 'Performance', path: '/performance' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ]
  
  return (
    <nav className="space-y-1">
      {navItems.map((item, index) => (
        <a
          key={index}
          href={item.path}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        >
          {item.icon}
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  )
}

export default App