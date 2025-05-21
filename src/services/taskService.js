/**
 * Service for task-related operations
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
const TABLE_NAME = 'task3';

// Fields from the provided schema
const TASK_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'description',
  'priority',
  'due_date',
  'status',
  'assigned_to'
];

// Updateable fields only for create/update operations (respecting field visibility)
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'description',
  'priority',
  'due_date',
  'status',
  'assigned_to'
];

/**
 * Get all tasks with optional filtering
 * @param {Object} filters - Optional filters
 * @param {Number} page - Page number for pagination
 * @param {Number} limit - Results per page
 * @returns {Promise} - Promise that resolves to task data
 */
export const getTasks = async (filters = {}, page = 1, limit = 20) => {
  try {
    const client = getApperClient();
    const offset = (page - 1) * limit;
    
    const params = {
      fields: TASK_FIELDS,
      pagingInfo: {
        limit,
        offset
      },
      expands: [
        {
          name: "assigned_to",
          alias: "employee"
        }
      ]
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
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @returns {Promise} - Promise that resolves to created task
 */
export const createTask = async (taskData) => {
  try {
    const client = getApperClient();
    
    // Filter to only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (taskData[field] !== undefined) {
        filteredData[field] = taskData[field];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Get tasks for a specific employee
 * @param {String} employeeId - Employee ID
 * @returns {Promise} - Promise that resolves to task data
 */
export const getTasksByEmployee = async (employeeId) => {
  try {
    const client = getApperClient();
    
    const params = {
      fields: TASK_FIELDS,
      where: [
        {
          fieldName: 'assigned_to',
          operator: 'ExactMatch',
          values: [employeeId]
        }
      ]
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error(`Error fetching tasks for employee ${employeeId}:`, error);
    throw error;
  }
};

export default {
  getTasks,
  createTask,
  getTasksByEmployee
};