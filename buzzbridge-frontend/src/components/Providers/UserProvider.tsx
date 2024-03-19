import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../../types/UserTypes";
import CreateModal from "../Modals/CreateModal";
import LoginUserForm from "../Forms/LoginUserForm";
import { useAlert } from "./AlertProvider";
import { useNavigate } from "react-router-dom";
import customAxios from "../../helpers/customAxios";
const UserContext = createContext<{
  getCurrentUser: () => any | null;
  handleCurrentUserLogout: () => void;
  handleCurrentUserLogin: (data: User) => void;
  expireCurrentUserSession: () => void;
}>({
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
  const [expireSession, setExpireSession] = useState(false);
  const axiosInstance = customAxios();

  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  };
  const currentUser = getCurrentUser();

  const handleCurrentUserLogin = async (response: any) => {
    try {
      console.log("Logging In");
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      localStorage.setItem("token", JSON.stringify(response.jwt));
    } catch (error: any) {
      showAlert("error", error.message);
    }
  };
  const handleCurrentUserLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/login");
  };
  const expireCurrentUserSession = () => {
    localStorage.removeItem("token");
    setExpireSession(true);
    setOpenModal(true);
  };
  const value = {
    getCurrentUser,
    handleCurrentUserLogout,
    handleCurrentUserLogin,
    expireCurrentUserSession,
  };
  const checkSessionStatus = async () => {
    try {
      if (!currentUser) {
        handleCurrentUserLogout();
      } else {
        await axiosInstance.get(`/auth/status`);
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
      checkSessionStatus();
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
