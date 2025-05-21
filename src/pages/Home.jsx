import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import { useSelector } from 'react-redux';
import { getDepartmentStats } from '../services/departmentStatsService';
import { getActivities, createActivity } from '../services/activityService';
import { format, formatDistanceToNow } from 'date-fns';

// Import icons
const UsersIcon = getIcon('users');
const BriefcaseIcon = getIcon('briefcase');
const CalendarIcon = getIcon('calendar');
const ClockIcon = getIcon('clock');
const TrendingUpIcon = getIcon('trending-up');
const AlertCircleIcon = getIcon('alert-circle');

function Home() {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);  
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [activitiesError, setActivitiesError] = useState('');
  
  const { user } = useSelector((state) => state.user);

  // Fetch department stats and activities on component mount
  useEffect(() => {
    fetchDepartmentStats();
    fetchActivities();
  }, []);

  // Fetch department stats
  const fetchDepartmentStats = async () => {
    setIsStatsLoading(true);
    setStatsError('');
    try {
      const response = await getDepartmentStats();
      if (response && response.data) {
        setStats(response.data.map(stat => ({
          id: stat.Id,
          title: stat.title,
          value: stat.value,
          icon: stat.icon,
          color: stat.color,
          increase: stat.increase
        })));
      }
    } catch (error) {
      console.error('Error fetching department stats:', error);
      setStatsError('Failed to load department statistics');
      toast.error('Failed to load department statistics');
    } finally {
      setIsStatsLoading(false);
    }
  };

  // Fetch activities
  const fetchActivities = async () => {
    setIsActivitiesLoading(true);
    setActivitiesError('');
    try {
      const response = await getActivities({}, 1, 10);
      if (response && response.data) {
        const formattedActivities = response.data.map(activity => {
          const timeAgo = formatDistanceToNow(new Date(activity.time), { addSuffix: true });
          
          return {
            id: activity.Id,
            user: activity.user?.Name || 'Unknown User',
            action: activity.action,
            time: timeAgo,
            status: activity.status
          };
        });
        setActivities(formattedActivities);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivitiesError('Failed to load activities');
      toast.error('Failed to load activities');
    } finally {
      setIsActivitiesLoading(false);
    }
  };
  
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
  
  // Handle adding a new activity
  const handleAddActivity = (newActivity) => {
    // Create the activity record in the backend
    createActivityRecord(newActivity);
  };

  // Create activity record in the backend
  const createActivityRecord = async (activityData) => {
    try {
      // First, we need to get the employee ID based on the name
      // In a real application, you would have a proper employee selection UI
      // For now, we'll create a simple activity with the provided data
      
      const newActivity = {
        Name: `Activity for ${activityData.user}`,
        action: activityData.action,
        status: activityData.status,
        activity_type: activityData.action.includes('task') ? 'task' : 'leave',
        time: new Date().toISOString()
      };
      
      // Create the activity
      const response = await createActivity(newActivity);
      
      if (response && response.success) {
        toast.success(`Activity for ${activityData.user} recorded successfully!`);
        // Refresh activities after adding a new one
        fetchActivities();
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Failed to record activity. Please try again.');
    }
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
      
      {isStatsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-pulse">
          {[1, 2, 3, 4].map(item => (
            <div key={`skeleton-${item}`} className="card h-28">
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
            {isActivitiesLoading ? (
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