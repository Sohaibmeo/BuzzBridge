import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../../types/UserTypes";
import CreateModal from "../Modals/CreateModal";
import LoginUserForm from "../Forms/LoginUserForm";
import { useAlert } from "./AlertProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const UserContext = createContext<{
  token: string | null;
  getCurrentUser: () => any | null;
  handleCurrentUserLogout: () => void;
  handleCurrentUserLogin: (data: User) => void;
  expireCurrentUserSession: () => void;
  getCurrentUserStatus: () => number | null;
}>({
  token: null,
  getCurrentUser: () => null,
  handleCurrentUserLogout: () => {},
  handleCurrentUserLogin: () => {},
  expireCurrentUserSession: () => {},
  getCurrentUserStatus: () => null,
});

export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>("" || null);
  const [expireSession, setExpireSession] = useState(false);

   const getCurrentUser = () => {
    if(JSON.parse(localStorage.getItem("token") || "null") !== null){
      return user;
    }
    return null;
  };
  const getCurrentUserStatus = () => {
    return JSON.parse(localStorage.getItem("token") || "null");
  };

  const handleCurrentUserLogin = async (response: any) => {
    try {
      localStorage.setItem("token", JSON.stringify(response.jwt));
      setToken(JSON.stringify(response.jwt));
      checkSessionStatus(JSON.stringify(response.jwt));
    } catch (error: any) {
      showAlert("error", error.message);
    }
  };
  const handleCurrentUserLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };
  const expireCurrentUserSession = () => {
    setExpireSession(true);
    setOpenModal(true);
    setToken(null);
  };
  const value = {
    token,
    getCurrentUser,
    handleCurrentUserLogout,
    handleCurrentUserLogin,
    expireCurrentUserSession,
    getCurrentUserStatus,
  };
  const checkSessionStatus = async (localToken?: string | null) => {
    try {
      const { data } = localToken
        ? await axios.get(
            process.env.REACT_APP_BASE_URL + `/user/find/currentUser`,
            {
              headers: {
                Authorization: `Bearer ${localToken}`,
              },
            }
          )
        : await axios.get(
            process.env.REACT_APP_BASE_URL + `/user/find/currentUser`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      console.log(data)
      if (data) {
        if (localToken) {
          setToken(localToken);
          setUser(data);
        }
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        showAlert("error", "Session expired, please login again");
        expireCurrentUserSession();
      } else {
        showAlert("error", error.message);
      }
    }
  };
  useEffect(
    () => {
      if (token && token !== "null") {
        checkSessionStatus();
      } else if (localStorage.getItem("token")) {
        checkSessionStatus(localStorage.getItem("token"));
      }else{
        handleCurrentUserLogout();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <UserContext.Provider value={value}>
      {children}
      {expireSession && openModal && (
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
