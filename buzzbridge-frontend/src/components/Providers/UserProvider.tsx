import { createContext, useContext, useEffect, useState } from "react";
import customAxios from "../../helpers/customAxios";
import { User } from "../../types/UserTypes";
import CreateModal from "../Modals/CreateModal";
import LoginUserForm from "../Forms/LoginUserForm";
import { useAlert } from "./AlertProvider";
import { useNavigate } from "react-router-dom";
const UserContext = createContext<{
  getCurrentUser: () => User | null;
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
  const axiosInstance = customAxios();
  const navigate = useNavigate();
  const handleCurrentUserLogin = async (data: User) => {
    try {
      console.log("Logging In");
      localStorage.setItem("currentUser", JSON.stringify(data));
    } catch (error: any) {
      showAlert("error", error.message);
    }
  };
  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  };
  const handleRenewLoginSession = async () => {
    try {
      console.log(`Renewing Session with`, getCurrentUser());
      const response = await axiosInstance.get(`/user/find/currentUser`, {
        withCredentials: true,
      });
      console.log("Current User", response);
      localStorage.setItem("currentUser", JSON.stringify(response.data));
    } catch (error: any) {
      if (error?.response?.status === 401) {
        console.error("Invalid Session", error);
        showAlert("error", "Session expired, please login again");
        setOpenModal(true);
      } else {
        showAlert("error", error.message);
      }
    }
  };
  console.log(
    "Login Modal Will Show: ",
    openModal,
    getCurrentUser()
  );
  const handleCurrentUserLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };
  const expireCurrentUserSession = () => {
    console.log("I am called indeed");
    localStorage.removeItem("currentUser");
    setOpenModal(true);
  };
  console.log("Current User", getCurrentUser());
  const value = {
    getCurrentUser,
    handleCurrentUserLogout,
    handleCurrentUserLogin,
    expireCurrentUserSession,
  };
  useEffect(
    () => {
      handleRenewLoginSession();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <UserContext.Provider value={value}>
      {children}
      {!getCurrentUser() && openModal && (
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
