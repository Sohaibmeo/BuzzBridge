import { createContext, useContext, useState } from 'react';
import customAxios from '../../helpers/customAxios';
import { User } from '../../types/UserTypes';
import { JwtPayload } from 'jwt-decode';
import getExtractedJwt from '../../helpers/jwtExtracId';
import { useCookies } from 'react-cookie';

const UserContext = createContext<{
  currentUser: User | null;
  handleCurrentUserLogout: () => void;
  handleCurrentUserLogin: (jwt: JwtPayload) => void;
}>({
  currentUser: null,
  handleCurrentUserLogout: () => {},
  handleCurrentUserLogin: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cookies, setCookies, removeCookie] = useCookies(['jwt']);
  const axiosInstance = customAxios();
  const handleCurrentUserLogin = async (jwt: JwtPayload) => {
    const id = getExtractedJwt(jwt);
    console.log('id', id);
    if (!id) return;
    const user = await axiosInstance.get(`/user/${id}`);
    if(!cookies.jwt){
      setCookies('jwt', jwt);
    }
    setCurrentUser(user.data);
  };
  const handleCurrentUserLogout = () => {
    setCurrentUser(null);
    removeCookie('jwt');
  };
  const value = {
    currentUser,
    handleCurrentUserLogout,
    handleCurrentUserLogin,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
