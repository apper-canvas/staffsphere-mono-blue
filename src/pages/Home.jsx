import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Import icons
const UsersIcon = getIcon('users');
const BriefcaseIcon = getIcon('briefcase');
const CalendarIcon = getIcon('calendar');
const ClockIcon = getIcon('clock');
const TrendingUpIcon = getIcon('trending-up');
const AlertCircleIcon = getIcon('alert-circle');

function Home() {
  const [stats, setStats] = useState([
    { id: 1, title: 'Total Employees', value: 142, icon: 'users', color: 'bg-blue-500', increase: '+12%' },
    { id: 2, title: 'Departments', value: 8, icon: 'briefcase', color: 'bg-purple-500', increase: '+1 new' },
    { id: 3, title: 'On Leave Today', value: 4, icon: 'calendar', color: 'bg-amber-500', increase: '-2' },
    { id: 4, title: 'Late Check-ins', value: 3, icon: 'clock', color: 'bg-red-500', increase: '-1' }
  ]);
  
  const [activities, setActivities] = useState([
    { id: 1, user: 'Alex Morgan', action: 'requested vacation', time: '2 hours ago', status: 'pending' },
    { id: 2, user: 'Sarah Johnson', action: 'completed training', time: '4 hours ago', status: 'completed' },
    { id: 3, user: 'James Wilson', action: 'submitted monthly report', time: '1 day ago', status: 'completed' },
    { id: 4, user: 'Emma Davis', action: 'is late for check-in', time: 'just now', status: 'critical' }
  ]);
  
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to get the appropriate icon component
  const getActivityIcon = (status) => {
    switch (status) {
      case 'pending':
        return ClockIcon;
      case 'completed':
        return TrendingUpIcon;
      case 'critical':
        return AlertCircleIcon;
      default:
        return ClockIcon;
    }
  };
  
  // Function to get the appropriate status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'completed':
        return 'badge-success';
      case 'critical':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  };
  
  // Add a new activity (interactive feature)
  const handleAddActivity = (newActivity) => {
    setActivities(prev => [
      { 
        id: Date.now(), 
        user: newActivity.user, 
        action: newActivity.action, 
        time: 'just now', 
        status: newActivity.status 
      },
      ...prev
    ]);
    
    toast.success(`Activity for ${newActivity.user} recorded successfully!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto max-w-6xl"
    >
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-surface-100">Dashboard</h1>
        <p className="text-surface-600 dark:text-surface-400 mt-2">
          Welcome to StaffSphere, your workforce management solution
        </p>
      </header>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-pulse">
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="card h-28">
              <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            // Get the correct icon component
            const IconComponent = (() => {
              switch(stat.icon) {
                case 'users': return UsersIcon;
                case 'briefcase': return BriefcaseIcon;
                case 'calendar': return CalendarIcon;
                case 'clock': return ClockIcon;
                default: return UsersIcon;
              }
            })();
            
            return (
              <div key={stat.id} className="card-neu hover-scale group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-surface-600 dark:text-surface-400 text-sm font-medium mb-1">
                      {stat.title}
                    </h3>
                    <div className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-surface-100">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
                      {stat.increase}
                    </div>
                  </div>
                  <div className={`p-3.5 rounded-full ${stat.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                    <IconComponent className={`h-5 w-5 ${stat.color} text-opacity-90`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <MainFeature onAddActivity={handleAddActivity} />
        </div>
        
        <div className="flex flex-col bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-card">
          <div className="p-4 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-lg font-semibold text-surface-800 dark:text-surface-100">
              Recent Activities
            </h2>
          </div>
          
          <div className="p-4 flex-1 overflow-auto">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4].map(item => (
                  <div key={item} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => {
                  const IconComponent = getActivityIcon(activity.status);
                  
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.status === 'critical' ? 'bg-red-100 dark:bg-red-900/30' :
                        activity.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                        'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        <IconComponent className={`h-4 w-4 ${
                          activity.status === 'critical' ? 'text-red-500 dark:text-red-400' :
                          activity.status === 'completed' ? 'text-green-500 dark:text-green-400' :
                          'text-amber-500 dark:text-amber-400'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-surface-800 dark:text-surface-100">
                            {activity.user}
                          </span>
                          <span className={getStatusBadgeClass(activity.status)}>
                            {activity.status}
                          </span>
                        </div>
                        <p className="text-surface-600 dark:text-surface-400">
                          {activity.action}
                        </p>
                        <p className="text-xs text-surface-500 dark:text-surface-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;