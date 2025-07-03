import axios from 'axios';

// ✅ Base URL for all API requests
const baseURL = 'https://jsonplaceholder.typicode.com';

// ✅ Create public instance (unauthenticated requests)
const publicApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Create private instance (authenticated requests)
const privateApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔒 Attach Bearer token to all private requests
privateApi.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Global error handling for private API
privateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.error('Unauthorized: Token expired or invalid.');
          localStorage.removeItem('token');
          break;
        case 403:
          console.error("Forbidden: You don't have access to this resource.");
          break;
        case 404:
          console.error('Not Found: The requested resource does not exist.');
          break;
        case 500:
          console.error('Server Error: Something went wrong on the server.');
          break;
        default:
          console.error('API Error:', data?.message || error.message);
          break;
      }
    } else {
      console.error('Network Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// ✅ Export both instances
export { privateApi, publicApi };

// ✅ API Helper Functions
export const apiHelpers = {
  // Get posts with pagination and search
  getPosts: async (params = {}) => {
    try {
      const queryParams = {
        _page: params.page || 1,
        _limit: params.limit || 10,
      };

      if (params.search?.trim()) {
        queryParams.q = params.search.trim();
        // Or specific field: queryParams.title_like = params.search.trim();
      }

      if (params.sortBy) {
        queryParams._sort = params.sortBy;
        queryParams._order = params.sortOrder || 'asc';
      }

      console.log('🔍 API Request - getPosts with params:', queryParams);

      const response = await publicApi.get('/posts', { params: queryParams });

      return {
        success: true,
        data: response.data,
        total: 100, // JSONPlaceholder has 100 posts
        error: null,
        headers: response.headers,
      };
    } catch (error) {
      console.error(
        '❌ API Error - getPosts:',
        error.response?.data || error.message
      );

      return {
        success: false,
        data: [],
        total: 0,
        error:
          error.response?.data?.message ||
          error.message ||
          'Failed to fetch posts',
        headers: null,
      };
    }
  },

  // Get a single post by ID
  getPost: async (id) => {
    try {
      console.log('🔍 API Request - getPost with ID:', id);

      const response = await publicApi.get(`/posts/${id}`);

      return {
        success: true,
        data: response.data,
        error: null,
      };
    } catch (error) {
      console.error(
        '❌ API Error - getPost:',
        error.response?.data || error.message
      );

      return {
        success: false,
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          'Failed to fetch post',
      };
    }
  },

  // Get users with pagination
  getUsers: async (params = {}) => {
    try {
      const queryParams = {
        _page: params.page || 1,
        _limit: params.limit || 10,
      };

      console.log('🔍 API Request - getUsers with params:', queryParams);

      const response = await publicApi.get('/users', { params: queryParams });

      return {
        success: true,
        data: response.data,
        total: 10, // JSONPlaceholder has 10 users
        error: null,
      };
    } catch (error) {
      console.error(
        '❌ API Error - getUsers:',
        error.response?.data || error.message
      );

      return {
        success: false,
        data: [],
        total: 0,
        error:
          error.response?.data?.message ||
          error.message ||
          'Failed to fetch users',
      };
    }
  },

  // Create a new post (requires authentication)
  createPost: async (postData) => {
    try {
      console.log('🔍 API Request - createPost with data:', postData);

      const response = await privateApi.post('/posts', postData);

      return {
        success: true,
        data: response.data,
        error: null,
      };
    } catch (error) {
      console.error(
        '❌ API Error - createPost:',
        error.response?.data || error.message
      );

      return {
        success: false,
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          'Failed to create post',
      };
    }
  },
};

/*
🔧 Example usage:

import { publicApi, privateApi, apiHelpers } from "@/api/api";

// Public call
publicApi.get("/posts")
  .then(res => console.log(res.data))
  .catch(err => console.error("Public API error:", err));

// Private call
privateApi.get("/user/profile")
  .then(res => console.log(res.data))
  .catch(err => console.error("Private API error:", err));

// Using helper
apiHelpers.getPosts({ page: 1, limit: 5, search: "qui" });
*/
