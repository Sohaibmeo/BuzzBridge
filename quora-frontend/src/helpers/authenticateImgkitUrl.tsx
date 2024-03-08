import customAxios from './customAxios';

export default function imageKitAuth() {
  const axiosInstance = customAxios();

  const getToken = async() => {
    try {
      const response = await axiosInstance.get('/imagekit/generate-auth-token');
      const { signature, expire, token } = response.data;
      return { signature, expire, token };
    } catch (error:any) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  return getToken();
}
