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
}>({
  token: null,
  getCurrentUser: () => null,
  handleCurrentUserLogout: () => {},
  handleCurrentUserLogin: () => {},
  expireCurrentUserSession: () => {},
});

export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [openModal, setOpenModal] = useState(false);
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>("" || null);
  const [expireSession, setExpireSession] = useState(false);

  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  };
  const currentUser = getCurrentUser();

  const handleCurrentUserLogin = async (response: any) => {
    try {
      console.log("Logging In");
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      localStorage.setItem("token", JSON.stringify(response.jwt));
      setToken(JSON.stringify(response.jwt));
    } catch (error: any) {
      showAlert("error", error.message);
    }
  };
  const handleCurrentUserLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };
  const expireCurrentUserSession = () => {
    localStorage.removeItem("token");
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
  };
  const checkSessionStatus = async (localToken?: string | null) => {
    try {
      const { data } = localToken
        ? await axios.get(process.env.REACT_APP_BASE_URL + `/auth/status`, {
            headers: {
              Authorization: `Bearer ${localToken}`,
            },
          })
        : await axios.get(process.env.REACT_APP_BASE_URL + `/auth/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      if (data==='good') {
        console.log("Session Active");
        if (localToken) {
          setToken(localToken);
        }
      }
    } catch (error: any) {
      console.log("Session Expired", error);
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
      if (token && token!=="null") {
        console.log(token)
        checkSessionStatus();
      } else if (localStorage.getItem("token")) {
        checkSessionStatus(localStorage.getItem("token"));
      } else if (currentUser) {
        expireCurrentUserSession();
      } else {
        console.log("No User Found");
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
