import { useState } from 'react';
import { getIcon } from '../utils/iconUtils';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// Import icons
const UserPlusIcon = getIcon('user-plus');
const PenIcon = getIcon('pen');
const UserIcon = getIcon('user');
const FileTextIcon = getIcon('file-text');
const ClipboardCheckIcon = getIcon('clipboard-check');
const ClockIcon = getIcon('clock');
const AlertTriangleIcon = getIcon('alert-triangle');
const CheckCircleIcon = getIcon('check-circle');
const XCircleIcon = getIcon('x-circle');

function MainFeature({ onAddActivity }) {
  // States for form
  const [activeTab, setActiveTab] = useState('quick-add');
  const [formData, setFormData] = useState({
    employeeName: '',
    actionType: 'task',
    taskDescription: '',
    priority: 'medium',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    leaveType: 'vacation',
    leaveStartDate: format(new Date(), 'yyyy-MM-dd'),
    leaveEndDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    leaveReason: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setSuccessMessage('');
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    } else if (formData.employeeName.trim().length < 3) {
      newErrors.employeeName = 'Name must be at least 3 characters';
    }
    
    // Action-specific validations
    if (formData.actionType === 'task') {
      if (!formData.taskDescription.trim()) {
        newErrors.taskDescription = 'Task description is required';
      }
    } else if (formData.actionType === 'leave') {
      if (!formData.leaveReason.trim()) {
        newErrors.leaveReason = 'Please provide a reason for leave';
      }
      
      // Validate that end date is after start date
      const startDate = new Date(formData.leaveStartDate);
      const endDate = new Date(formData.leaveEndDate);
      if (endDate < startDate) {
        newErrors.leaveEndDate = 'End date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Prepare activity data for parent component
      let activityData = {
        user: formData.employeeName,
        action: '',
        status: ''
      };
      
      if (formData.actionType === 'task') {
        activityData.action = `was assigned a new ${formData.priority} priority task`;
        activityData.status = formData.priority === 'high' ? 'critical' : 'pending';
      } else if (formData.actionType === 'leave') {
        activityData.action = `requested ${formData.leaveType} leave`;
        activityData.status = 'pending';
      }
      
      // Call the parent callback
      onAddActivity(activityData);
      
      // Show success message
      const successMsg = formData.actionType === 'task' 
        ? 'Task assigned successfully!' 
        : 'Leave request submitted successfully!';
      
      setSuccessMessage(successMsg);
      
      // Reset form for next entry but keep the employee name
      const employeeName = formData.employeeName;
      setFormData({
        employeeName,
        actionType: 'task',
        taskDescription: '',
        priority: 'medium',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        leaveType: 'vacation',
        leaveStartDate: format(new Date(), 'yyyy-MM-dd'),
        leaveEndDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        leaveReason: '',
      });
      
      // Clear success message after a delay
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-card overflow-hidden">
      <div className="border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          <button
            className={`px-4 py-3 flex items-center gap-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'quick-add' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
            }`}
            onClick={() => handleTabChange('quick-add')}
          >
            <UserPlusIcon className="h-4 w-4" />
            Quick Actions
          </button>
          <button
            className={`px-4 py-3 flex items-center gap-2 font-medium whitespace-nowrap transition-colors ${
              activeTab === 'recent' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200'
            }`}
            onClick={() => handleTabChange('recent')}
          >
            <ClockIcon className="h-4 w-4" />
            Recent Actions
          </button>
        </div>
      </div>
      
      <div className="p-4 md:p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'quick-add' && (
            <motion.div
              key="quick-add"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-4">
                Create New Activity
              </h2>
              
              {/* Success Message */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg"
                  >
                    <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                    <span>{successMessage}</span>
                    <button 
                      className="ml-auto text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
                      onClick={() => setSuccessMessage('')}
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Employee Name */}
                <div>
                  <label htmlFor="employeeName" className="label">
                    Employee Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      id="employeeName"
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleChange}
                      className={`input pl-10 ${errors.employeeName ? 'border-red-500 dark:border-red-700' : ''}`}
                      placeholder="Enter employee name"
                    />
                  </div>
                  {errors.employeeName && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                      <AlertTriangleIcon className="h-4 w-4" />
                      {errors.employeeName}
                    </p>
                  )}
                </div>
                
                {/* Action Type */}
                <div>
                  <label className="label">Action Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`
                      flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all
                      ${formData.actionType === 'task' 
                        ? 'border-primary bg-primary-light/10 dark:bg-primary-dark/10' 
                        : 'border-surface-300 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700'}
                    `}>
                      <input
                        type="radio"
                        name="actionType"
                        value="task"
                        checked={formData.actionType === 'task'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <ClipboardCheckIcon className={`h-5 w-5 ${formData.actionType === 'task' ? 'text-primary' : 'text-surface-500'}`} />
                      <span className={formData.actionType === 'task' ? 'font-medium text-primary' : 'text-surface-700 dark:text-surface-300'}>
                        Assign Task
                      </span>
                    </label>
                    
                    <label className={`
                      flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all
                      ${formData.actionType === 'leave' 
                        ? 'border-primary bg-primary-light/10 dark:bg-primary-dark/10' 
                        : 'border-surface-300 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700'}
                    `}>
                      <input
                        type="radio"
                        name="actionType"
                        value="leave"
                        checked={formData.actionType === 'leave'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <CalendarIcon className={`h-5 w-5 ${formData.actionType === 'leave' ? 'text-primary' : 'text-surface-500'}`} />
                      <span className={formData.actionType === 'leave' ? 'font-medium text-primary' : 'text-surface-700 dark:text-surface-300'}>
                        Request Leave
                      </span>
                    </label>
                  </div>
                </div>
                
                {/* Conditional Form Fields based on Action Type */}
                <AnimatePresence mode="wait">
                  {formData.actionType === 'task' ? (
                    <motion.div
                      key="task-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Task Description */}
                      <div>
                        <label htmlFor="taskDescription" className="label">
                          Task Description
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-surface-500">
                            <FileTextIcon className="h-5 w-5" />
                          </div>
                          <textarea
                            id="taskDescription"
                            name="taskDescription"
                            value={formData.taskDescription}
                            onChange={handleChange}
                            rows="3"
                            className={`input pl-10 ${errors.taskDescription ? 'border-red-500 dark:border-red-700' : ''}`}
                            placeholder="Describe the task clearly..."
                          ></textarea>
                        </div>
                        {errors.taskDescription && (
                          <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                            <AlertTriangleIcon className="h-4 w-4" />
                            {errors.taskDescription}
                          </p>
                        )}
                      </div>
                      
                      {/* Priority & Due Date */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="priority" className="label">Task Priority</label>
                          <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="input"
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="dueDate" className="label">Due Date</label>
                          <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            className="input"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="leave-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Leave Type */}
                      <div>
                        <label htmlFor="leaveType" className="label">Leave Type</label>
                        <select
                          id="leaveType"
                          name="leaveType"
                          value={formData.leaveType}
                          onChange={handleChange}
                          className="input"
                        >
                          <option value="vacation">Vacation Leave</option>
                          <option value="sick">Sick Leave</option>
                          <option value="personal">Personal Leave</option>
                          <option value="maternity">Maternity/Paternity Leave</option>
                          <option value="bereavement">Bereavement Leave</option>
                        </select>
                      </div>
                      
                      {/* Leave Dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="leaveStartDate" className="label">Start Date</label>
                          <input
                            type="date"
                            id="leaveStartDate"
                            name="leaveStartDate"
                            value={formData.leaveStartDate}
                            onChange={handleChange}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            className="input"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="leaveEndDate" className="label">End Date</label>
                          <input
                            type="date"
                            id="leaveEndDate"
                            name="leaveEndDate"
                            value={formData.leaveEndDate}
                            onChange={handleChange}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            className={`input ${errors.leaveEndDate ? 'border-red-500 dark:border-red-700' : ''}`}
                          />
                          {errors.leaveEndDate && (
                            <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                              <AlertTriangleIcon className="h-4 w-4" />
                              {errors.leaveEndDate}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Leave Reason */}
                      <div>
                        <label htmlFor="leaveReason" className="label">
                          Reason for Leave
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-surface-500">
                            <PenIcon className="h-5 w-5" />
                          </div>
                          <textarea
                            id="leaveReason"
                            name="leaveReason"
                            value={formData.leaveReason}
                            onChange={handleChange}
                            rows="3"
                            className={`input pl-10 ${errors.leaveReason ? 'border-red-500 dark:border-red-700' : ''}`}
                            placeholder="Briefly explain reason for leave request..."
                          ></textarea>
                        </div>
                        {errors.leaveReason && (
                          <p className="mt-1 text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                            <AlertTriangleIcon className="h-4 w-4" />
                            {errors.leaveReason}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : formData.actionType === 'task' ? 'Assign Task' : 'Submit Leave Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
          
          {activeTab === 'recent' && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-4">
                Recent Actions
              </h2>
              
              <div className="space-y-4">
                {recentItems.map((item, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-surface-50 dark:bg-surface-700/50 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(item.status)}`}>
                        {getItemIcon(item)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-medium text-surface-800 dark:text-surface-100">
                            {item.title}
                          </h3>
                          <span className={getStatusBadge(item.status)}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-surface-500">
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>{item.employee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Icon for the CalendarIcon
const CalendarIcon = getIcon('calendar');

// Helper data for recent items
const recentItems = [
  {
    title: 'Performance Review',
    description: 'Quarterly performance evaluation for marketing department',
    employee: 'Jason Parker',
    date: '2 days ago',
    status: 'completed',
    type: 'task'
  },
  {
    title: 'Sick Leave',
    description: 'Approved for 3 days due to flu',
    employee: 'Emma Wilson',
    date: 'Yesterday',
    status: 'approved',
    type: 'leave'
  },
  {
    title: 'Project Deadline Extension',
    description: 'Request for extending the mobile app development deadline',
    employee: 'Michael Chen',
    date: '4 hours ago',
    status: 'pending',
    type: 'request'
  },
  {
    title: 'New Hire Onboarding',
    description: 'Documentation and setup for new UX designer',
    employee: 'Sarah Johnson',
    date: 'Just now',
    status: 'in-progress',
    type: 'task'
  }
];

// Helper functions for styling recent items
const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
    case 'approved':
      return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
    case 'pending':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400';
    case 'in-progress':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
    default:
      return 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400';
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'completed':
      return 'badge badge-success';
    case 'approved':
      return 'badge badge-success';
    case 'pending':
      return 'badge badge-warning';
    case 'in-progress':
      return 'badge badge-info';
    default:
      return 'badge';
  }
};

const getItemIcon = (item) => {
  const type = item.type;
  const status = item.status;
  
  if (type === 'task') {
    if (status === 'completed') {
      return <CheckCircleIcon className="h-5 w-5" />;
    } else if (status === 'in-progress') {
      return <ClockIcon className="h-5 w-5" />;
    } else {
      return <ClipboardCheckIcon className="h-5 w-5" />;
    }
  } else if (type === 'leave') {
    return <CalendarIcon className="h-5 w-5" />;
  } else {
    return <FileTextIcon className="h-5 w-5" />;
  }
};

export default MainFeature;