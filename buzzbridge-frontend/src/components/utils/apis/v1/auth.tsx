import useCustomAxios from '../../../../helpers/customAxios';

export async function verifyCurrentUser(): Promise<any> {
  try {
    const axiosInstance = useCustomAxios();
    const { data } = await axiosInstance.get(`/auth/status`);
    return data;
  } catch (error: any) {
    if (error.status === 401) {
    }
  }
}
