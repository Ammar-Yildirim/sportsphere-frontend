import axios from 'axios';

export const authApi = axios.create({
  baseURL: "http://localhost:8080/api/v1/auth", 
  withCredentials: true,                  
  headers: {
    "Content-Type": "application/json",   
  },
});

export const axiosPrivate = axios.create({
  baseURL: "http://localhost:8080/api/v1", 
  withCredentials: true,                  
  headers: {
    "Content-Type": "application/json",   
  },
});