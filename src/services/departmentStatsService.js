/**
 * Service for department statistics-related operations
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
const TABLE_NAME = 'department_stats';

// Fields from the provided schema
const DEPARTMENT_STATS_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'title',
  'value',
  'icon',
  'color',
  'increase'
];

/**
 * Get all department statistics
 * @returns {Promise} - Promise that resolves to department statistics data
 */
export const getDepartmentStats = async () => {
  try {
    const client = getApperClient();
    
    const params = {
      fields: DEPARTMENT_STATS_FIELDS
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error('Error fetching department statistics:', error);
    throw error;
  }
};

/**
 * Get department statistics by title
 * @param {String} title - Department statistics title
 * @returns {Promise} - Promise that resolves to department statistics data
 */
export const getDepartmentStatsByTitle = async (title) => {
  try {
    const client = getApperClient();
    
    const params = {
      fields: DEPARTMENT_STATS_FIELDS,
      where: [
        {
          fieldName: 'title',
          operator: 'ExactMatch',
          values: [title]
        }
      ]
    };
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error(`Error fetching department statistics for title ${title}:`, error);
    throw error;
  }
};

export default {
  getDepartmentStats,
  getDepartmentStatsByTitle
};