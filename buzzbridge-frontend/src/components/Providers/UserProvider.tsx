import { createContext, useContext, useEffect, useState } from 'react';
import customAxios from '../../helpers/customAxios';
import { User } from '../../types/UserTypes';
import { JwtPayload } from 'jwt-decode';
import getExtractedJwt from '../../helpers/jwtExtracId';
import { useCookies } from 'react-cookie';
import CreateModal from '../Modals/CreateModal';
import LoginUserForm from '../Forms/LoginUserForm';
import { useAlert } from './AlertProvider';
const UserContext = createContext<{
  currentUser: User | null;
  handleCurrentUserLogout: () => void;
  handleCurrentUserLogin: (jwt: JwtPayload) => void;
  expireCurrentUserSession: () => void;
}>({
  currentUser: null,
  handleCurrentUserLogout: () => {},
  handleCurrentUserLogin: () => {},
  expireCurrentUserSession: () => {},
});

export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { showAlert } = useAlert();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookies, removeCookie] = useCookies(['jwt']);
  console.log(
    'Login Modal Will Show: ',
    !currentUser,
    openModal,
    cookies?.jwt?.length,
  );
  const axiosInstance = customAxios();
  const handleCurrentUserLogin = async (jwt: JwtPayload) => {
    try {
      console.log('Logging In');
      const { data } = await axiosInstance.get(`/user/${getExtractedJwt(jwt)}`);
      // setCookies('jwt', jwt);
      setCurrentUser(data);
    } catch (error: any) {
      showAlert('error', error.message);
    }
  };
  const handleRenewLoginSession = async () => {
    try {
      console.log(`Renewing Session with`,cookies.jwt);
      console.log('Current : ',currentUser);
      const response = await axiosInstance.get(`/user/find/currentUser`);
      console.log('Current User', response);
      setCurrentUser(response.data);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        console.error('Invalid Session',error);
        showAlert('error', 'Session expired, please login again');
        setOpenModal(true);
      } else {
        showAlert('error', error.message);
      }
    }
  };
  const handleCurrentUserLogout = () => {
    setCurrentUser(null);
    removeCookie('jwt');
  };
  const expireCurrentUserSession = () => {
    console.log("I am called indeed")
    setCurrentUser(null);
    setOpenModal(true);
  };
  console.log('Current User', currentUser);
  const value = {
    currentUser,
    handleCurrentUserLogout,
    handleCurrentUserLogin,
    expireCurrentUserSession,
  };
  useEffect(
    () => {
      handleRenewLoginSession();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <UserContext.Provider value={value}>
      {children}
      {!currentUser && openModal && cookies.jwt && (
        <CreateModal
          openModal={openModal}
          width={410}
          setOpenModal={setOpenModal}
          disableBackDrop
          Children={<LoginUserForm setOpenModal={setOpenModal} isModal />}
        />
      )}
    </UserContext.Provider>
  );
};
