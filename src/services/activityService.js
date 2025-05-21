/**
 * Service for activity-related operations
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
const TABLE_NAME = 'Activity1';

// Fields from the provided schema
const ACTIVITY_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'action',
  'time',
  'status',
  'activity_type',
  'user'
];

// Updateable fields only for create/update operations (respecting field visibility)
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'action',
  'time',
  'status',
  'activity_type',
  'user'
];

/**
 * Get all activities with optional filtering
 * @param {Object} filters - Optional filters
 * @param {Number} page - Page number for pagination
 * @param {Number} limit - Results per page
 * @returns {Promise} - Promise that resolves to activity data
 */
export const getActivities = async (filters = {}, page = 1, limit = 20) => {
  try {
    const client = getApperClient();
    const offset = (page - 1) * limit;
    
    const params = {
      fields: ACTIVITY_FIELDS,
      pagingInfo: {
        limit,
        offset
      },
      expands: [
        {
          name: "user",
          alias: "userDetails"
        }
      ],
      orderBy: [
        {
          field: "time",
          direction: "desc"
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
    console.error('Error fetching activities:', error);
    throw error;
  }
};

/**
 * Create a new activity
 * @param {Object} activityData - Activity data
 * @returns {Promise} - Promise that resolves to created activity
 */
export const createActivity = async (activityData) => {
  try {
    const client = getApperClient();
    
    // Set current time if not provided
    if (!activityData.time) {
      activityData.time = new Date().toISOString();
    }
    
    // Filter to only include updateable fields
    const filteredData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (activityData[field] !== undefined) {
        filteredData[field] = activityData[field];
      }
    });
    
    const params = {
      records: [filteredData]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};

export default {
  getActivities,
  createActivity
};