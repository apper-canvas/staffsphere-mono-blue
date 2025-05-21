import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getIcon } from '../utils/iconUtils';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeService';
 
// Import icons
const SearchIcon = getIcon('search');
const UserPlusIcon = getIcon('user-plus');
const EditIcon = getIcon('edit');
const TrashIcon = getIcon('trash');
const XIcon = getIcon('x');
const CheckIcon = getIcon('check');
const UserIcon = getIcon('user');
const MailIcon = getIcon('mail');
const PhoneIcon = getIcon('phone');
const BriefcaseIcon = getIcon('briefcase');
const CalendarIcon = getIcon('calendar');

const departments = [
  'Human Resources',
  'Engineering',
  'Marketing',
  'Finance',
  'Sales',
  'Operations',
  'Customer Support',
  'Research & Development'
];

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    phone: '', 
    department: '',
    position: '',
    joinDate: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});

  // Get employee data from the service
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Function to fetch employees
  const fetchEmployees = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await getEmployees();
      if (response && response.data) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setErrorMessage('Failed to load employees. Please try again.');
      toast.error('Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    employee => 
      employee.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.Name.trim()) errors.Name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!formData.department) errors.department = 'Department is required';
    if (!formData.position.trim()) errors.position = 'Position is required';
    if (!formData.join_date) errors.join_date = 'Join date is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add employee
  const handleAddEmployee = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    // Convert form data to match API fields
    const employeeData = {
      Name: formData.Name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      position: formData.position,
      join_date: formData.join_date,
      status: formData.status
    };
    
    createEmployee(employeeData)
      .then(response => {
        toast.success('Employee added successfully!');
        fetchEmployees(); // Refresh the employee list
        setShowAddModal(false);
        resetForm();
      })
      .catch(error => {
        toast.error('Failed to add employee. Please try again.');
      })
      .finally(() => setIsSubmitting(false));
  };
  
  // Handle edit employee
  const handleEditEmployee = () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Convert form data to match API fields
    const employeeData = {
      Name: formData.Name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      position: formData.position,
      join_date: formData.join_date,
      status: formData.status
    };
    
    updateEmployee(currentEmployee.Id, employeeData)
      .then(response => {
        toast.success('Employee updated successfully!');
        fetchEmployees(); // Refresh the employee list
        setShowEditModal(false);
        resetForm();
      })
      .catch(error => {
        toast.error('Failed to update employee. Please try again.');
      })
      .finally(() => setIsSubmitting(false));
  };

  // Handle delete employee
  const handleDeleteEmployee = () => {
    setIsSubmitting(true);
    
    deleteEmployee(currentEmployee.Id)
      .then(response => {
        fetchEmployees(); // Refresh the employee list
        setShowDeleteModal(false);
        setCurrentEmployee(null);
      })
      .catch(error => {
        toast.error('Failed to delete employee. Please try again.');
      })
      .finally(() => setIsSubmitting(false));
  };

  // Open edit modal
  const openEditModal = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      Name: employee.Name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      join_date: employee.join_date,
      status: employee.status
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const openDeleteModal = (employee) => {
    setCurrentEmployee(employee);
    setShowDeleteModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      Name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      join_date: '',
      status: 'active'
    });
    setFormErrors({});
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
        <h1 className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-surface-100">
          Employee Management
        </h1>
        <p className="text-surface-600 dark:text-surface-400 mt-2">
          Manage your organization's workforce
        </p>
      </header>
      
      {/* Search and Add Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={18} />
          <input
            type="text"
            placeholder="Search employees..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className="btn btn-primary flex items-center gap-2"
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          <UserPlusIcon size={18} />
          <span>Add Employee</span>
        </button>
      </div>
      
      {/* Employee Table */}
      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden shadow-card">
        {isLoading ? (
          <div className="p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-full max-w-3xl"></div>
              <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
              <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
              <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
              <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
            </div>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-700 mb-4">
              <UserIcon size={24} className="text-surface-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No employees found</h3>
            <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
              {searchTerm 
                ? "No employees match your search criteria. Try a different search."
                : "There are no employees in the system yet. Add your first employee to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-700">
                  <th className="text-left p-4 text-surface-600 dark:text-surface-300 font-semibold">Name</th>
                  <th className="text-left p-4 text-surface-600 dark:text-surface-300 font-semibold">Department</th>
                  <th className="text-left p-4 text-surface-600 dark:text-surface-300 font-semibold">Position</th>
                  <th className="text-left p-4 text-surface-600 dark:text-surface-300 font-semibold">Join Date</th>
                  <th className="text-left p-4 text-surface-600 dark:text-surface-300 font-semibold">Status</th>
                  <th className="text-right p-4 text-surface-600 dark:text-surface-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, index) => (
                  <tr 
                    key={employee.Id || index} 
                    className="border-t border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-750"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          {employee.Name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="font-medium text-surface-800 dark:text-surface-100">{employee.Name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-surface-700 dark:text-surface-300">{employee.department}</td>
                    <td className="p-4 text-surface-700 dark:text-surface-300">{employee.position}</td>
                    <td className="p-4 text-surface-700 dark:text-surface-300">{formatDate(employee.join_date)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                      }`}>
                        {employee.status === 'active' ? 'Active' : 'On Leave'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(employee)}
                          className="p-1.5 text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary transition-colors rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
                          aria-label="Edit employee"
                        >
                          <EditIcon size={16} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(employee)}
                          className="p-1.5 text-surface-600 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-500 transition-colors rounded-md hover:bg-surface-100 dark:hover:bg-surface-700"
                          aria-label="Delete employee"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-semibold">Add New Employee</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                Are you sure you want to delete {currentEmployee.Name}? This action cannot be undone.
              >
                <XIcon size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <EmployeeForm 
                formData={formData}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                departments={departments}
              />
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleAddEmployee}
                  disabled={isSubmitting}>
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Employee Modal */}
      {showEditModal && currentEmployee && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-semibold">Edit Employee</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <XIcon size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <EmployeeForm 
                formData={formData}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                departments={departments}
              />
              
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleEditEmployee}
                  disabled={isSubmitting}>
                  Update Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentEmployee && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-md w-full">
            <div className="p-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-center mb-2">Delete Employee</h3>
              <p className="text-surface-600 dark:text-surface-400 text-center mb-6">
                Are you sure you want to delete {currentEmployee.Name}? This action cannot be undone.
              </p>
              
              <div className="flex justify-center gap-3">
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="btn bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                  onClick={handleDeleteEmployee}
                  disabled={isSubmitting}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Employee Form Component
function EmployeeForm({ formData, formErrors, handleInputChange, departments }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="col-span-1">
        <label className="label" htmlFor="name">Name</label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
          <input
            id="name"
            name="Name"
            type="text"
            className={`input pl-10 ${formErrors.Name ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Full Name"
            value={formData.Name}
            onChange={handleInputChange}
          />
        </div>
        {formErrors.Name && <p className="text-red-500 text-sm mt-1">{formErrors.Name}</p>}
      </div>
      
      <div className="col-span-1">
        <label className="label" htmlFor="email">Email</label>
        <div className="relative">
          <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
          <input
            id="email"
            name="email"
            type="email"
            className={`input pl-10 ${formErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
      </div>
      
      <div className="col-span-1">
        <label className="label" htmlFor="phone">Phone</label>
        <div className="relative">
          <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
          <input
            id="phone"
            name="phone"
            type="tel"
            className={`input pl-10 ${formErrors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
      </div>
      
      <div className="col-span-1">
        <label className="label" htmlFor="department">Department</label>
        <div className="relative">
          <BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
          <select
            id="department"
            name="department"
            className={`input pl-10 ${formErrors.department ? 'border-red-500 focus:ring-red-500' : ''}`}
            value={formData.department}
            onChange={handleInputChange}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        {formErrors.department && <p className="text-red-500 text-sm mt-1">{formErrors.department}</p>}
      </div>
      
      <div className="col-span-1">
        <label className="label" htmlFor="position">Position</label>
        <input
          id="position"
          name="position"
          type="text"
          className={`input ${formErrors.position ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="Job Position"
          value={formData.position}
          onChange={handleInputChange}
        />
        {formErrors.position && <p className="text-red-500 text-sm mt-1">{formErrors.position}</p>}
      </div>
      
      <div className="col-span-1">
        <label className="label" htmlFor="joinDate">Join Date</label>
        <div className="relative">
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" size={16} />
          <input
            id="joinDate"
            name="join_date"
            type="date"
            className={`input pl-10 ${formErrors.join_date ? 'border-red-500 focus:ring-red-500' : ''}`}
            value={formData.join_date}
            onChange={handleInputChange}
          />
        </div>
        {formErrors.join_date && <p className="text-red-500 text-sm mt-1">{formErrors.join_date}</p>}
      </div>
      
      <div className="col-span-1">
        <label className="label" htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          className="input"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="active">Active</option>
          <option value="on leave">On Leave</option>
        </select>
      </div>
    </div>
  );
}

export default Employees;