import axios from 'axios';


const apiUrl = 'http://localhost:5000/users';

export const fetchProducts = async () => {
  const response = await axios.get(apiUrl);
  return response.data;
};
