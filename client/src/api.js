import axios from 'axios';

// Use same-origin by default in production; allow override via env
export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const api = axios.create({
	baseURL: API_BASE_URL
}); 