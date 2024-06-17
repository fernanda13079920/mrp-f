import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; 
export const getProceso = async () => {
  try {
    const response = await axios.get(`${API_URL}/proceso`);
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching tipo ubicaciones:", error);
    throw error;
  }
};
export const getUbicacion = async () => {
  try {
    const response = await axios.get(`${API_URL}/ubicacion`);
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching tipo ubicaciones:", error);
    throw error;
  }
};
export const getArticulo = async () => {
  try {
    const response = await axios.get(`${API_URL}/articulo`);
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching tipo ubicaciones:", error);
    throw error;
  }
};
export const getTipoArticulo = async () => {
  try {
    const response = await axios.get(`${API_URL}/tipo-articulo`);
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching tipo articulos:", error);
    throw error;
  }
};
export const getTipoUbicacion = async () => {
  try {
    const response = await axios.get(`${API_URL}/tipo-ubicacion`);
    return response.data.data; 
  } catch (error) {
    console.error("Error fetching tipo ubicaciones:", error);
    throw error;
  }
};