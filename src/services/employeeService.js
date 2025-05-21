/**
 * Service for employee-related operations
 */

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Table name from the provided schema
const TABLE_NAME = 'employee1';

// Fields from the provided schema
const EMPLOYEE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'email',
  'phone',
  'department',
  'position',
  'join_date',
  'status'
];

// Updated fields only for create/update operations (respecting field visibility)
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'email',
  'phone',
  'department',
  'position',
  'join_date',
  'status'
];

/**
 * Get all employees with optional filtering
 * @param {Object} filters - Optional filters
 * @param {Number} page - Page number for pagination
 * @param {Number} limit - Results per page
 * @returns {Promise} - Promise that resolves to employee data
 */
export const getEmployees = async (filters = {}, page = 1, limit = 20) => {
  try {
    const client = getApperClient();
    const offset = (page - 1) * limit;
    
    const params = {
      fields: EMPLOYEE_FIELDS,
      pagingInfo: {
        limit,
        offset
      }
    };
    
    // Add filtering if provided
    if (Object.keys(filters).length > 0) {
      params.where = Object.entries(filters).map(([fieldName, value]) => ({
        fieldName,
        operator: 'Contains',
        values: [value]
      }));
    }
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

/**
 * Get an employee by ID
 * @param {String} id - Employee ID
 * @returns {Promise} - Promise that resolves to employee data
 */
export const getEmployeeById = async (id) => {
  try {
    const client = getApperClient();
    const response = await client.getRecordById(TABLE_NAME, id);
    return response;
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new employee
 * @param {Object} employeeData - Employee data
 * @returns {Promise} - Promise that resolves to created employee
 */
export const createEmployee = async (employeeData) => {
  try {
    const client = getApperClient();
    
    // Filter to only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (employeeData[field] !== undefined) {
        filteredData[field] = employeeData[field];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

/**
 * Update an employee
 * @param {String} id - Employee ID
 * @param {Object} employeeData - Updated employee data
 * @returns {Promise} - Promise that resolves to updated employee
 */
export const updateEmployee = async (id, employeeData) => {
  try {
    const client = getApperClient();
    
    // Filter to only include updateable fields and add ID
    const filteredData = { Id: id };
    UPDATEABLE_FIELDS.forEach(field => {
      if (employeeData[field] !== undefined) {
        filteredData[field] = employeeData[field];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.updateRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error(`Error updating employee with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an employee
 * @param {String} id - Employee ID
 * @returns {Promise} - Promise that resolves when employee is deleted
 */
export const deleteEmployee = async (id) => {
  try {
    const client = getApperClient();
    const params = {
      RecordIds: [id]
    };
    
    const response = await client.deleteRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error(`Error deleting employee with ID ${id}:`, error);
    throw error;
  }
};

export default {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};