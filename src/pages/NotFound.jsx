import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const AlertTriangleIcon = getIcon('alert-triangle');
const HomeIcon = getIcon('home');

function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
        <AlertTriangleIcon className="h-10 w-10 text-amber-500 dark:text-amber-400" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-surface-800 dark:text-surface-100 mb-4">
        404
      </h1>
      
      <h2 className="text-xl md:text-2xl font-semibold text-surface-700 dark:text-surface-300 mb-2">
        Page Not Found
      </h2>
      
      <p className="text-surface-600 dark:text-surface-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
        Please check the URL or navigate back to the dashboard.
      </p>
      
      <Link 
        to="/"
        className="btn btn-primary flex items-center gap-2"
      >
        <HomeIcon className="h-5 w-5" />
        Back to Dashboard
      </Link>
    </motion.div>
  );
}

export default NotFound;