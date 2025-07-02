import axios from './axios';

interface SignupData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const customerSignup = async (data: SignupData) => {
  const response = await axios.post('/customers/signup', data, {
    withCredentials: true,
  });
  return response.data;
};

export const customerLogin = async (data: LoginData) => {
  const response = await axios.post('/customers/login', data, {
    withCredentials: true,
  });
  return response.data;
};

export const fetchCustomerProfile = async () => {
  const response = await axios.get('/customers/profile', {
    withCredentials: true,
  });
  return response.data;
};
