import axios from './axios';

interface SignupData {
  email: string;
  password: string;
}

export const customerSignup = async (data: SignupData) => {
  const response = await axios.post('/customers/signup', data);
  console.log(response);
  return response.data;
};
