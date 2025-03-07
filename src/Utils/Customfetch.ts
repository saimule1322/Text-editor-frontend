import axios from 'axios';

// Determine the base URL for the API based on the environment
const baseURL = import.meta.env.VITE_BACKEND_URL || '/api'; // Fallback to '/api' for local dev (proxy will handle this)

const customFetch = axios.create({
  baseURL, // Use the dynamic baseURL
});

export default customFetch;



