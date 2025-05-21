/**
 * Service for leave request-related operations
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
const TABLE_NAME = 'leave_request';

// Fields from the provided schema
const LEAVE_REQUEST_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'leave_type',
  'start_date',
  'end_date',
  'reason',
  'status',
  'employee'
];

// Updateable fields only for create/update operations (respecting field visibility)
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'leave_type',
  'start_date',
  'end_date',
  'reason',
  'status',
  'employee'
];

/**
 * Get all leave requests with optional filtering
 * @param {Object} filters - Optional filters
 * @param {Number} page - Page number for pagination
 * @param {Number} limit - Results per page
 * @returns {Promise} - Promise that resolves to leave request data
 */
export const getLeaveRequests = async (filters = {}, page = 1, limit = 20) => {
  try {
    const client = getApperClient();
    const offset = (page - 1) * limit;
    
    const params = {
      fields: LEAVE_REQUEST_FIELDS,
      pagingInfo: {
        limit,
        offset
      },
      expands: [
        {
          name: "employee",
          alias: "employeeDetails"
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
    console.error('Error fetching leave requests:', error);
    throw error;
  }
};

/**
 * Create a new leave request
 * @param {Object} leaveRequestData - Leave request data
 * @returns {Promise} - Promise that resolves to created leave request
 */
export const createLeaveRequest = async (leaveRequestData) => {
  try {
    const client = getApperClient();
    
    // Filter to only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (leaveRequestData[field] !== undefined) {
        filteredData[field] = leaveRequestData[field];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error('Error creating leave request:', error);
    throw error;
  }
};

/**
 * Get leave requests for a specific employee
 * @param {String} employeeId - Employee ID
 * @returns {Promise} - Promise that resolves to leave request data
 */
export const getLeaveRequestsByEmployee = async (employeeId) => {
  try {
    const client = getApperClient();
    
    const params = {
      fields: LEAVE_REQUEST_FIELDS,
      where: [
        {
          fieldName: 'employee',
          operator: 'ExactMatch',
          values: [employeeId]
        }
      ]
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error(`Error fetching leave requests for employee ${employeeId}:`, error);
    throw error;
  }
};

export default {
  getLeaveRequests,
  createLeaveRequest,
  getLeaveRequestsByEmployee
};