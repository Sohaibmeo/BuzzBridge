import { useState } from "react";
import UpdateExistingPasswordForm from "../components/Forms/UpdateExistingPasswordForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Grid } from "@mui/material";
import UserCard from "../components/Cards/UserCard";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/Providers/UserProvider";
import UpdateExistingEmailForm from "../components/Forms/UpdateExistingEmailForm";

const AccountSettings = () => {
  const { getCurrentUser } = useUser();
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState("password");
  const navigate = useNavigate();

  return (
    <Grid container justifyContent="center" spacing={1} columnGap={2}>
      <Grid
        item
        xs={12}
        lg={1}
        display={"flex"}
        flexDirection={"column"}
        rowGap={1}
      >
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </Button>
        <Button
          variant={activeTab === "password" ? "text" : "contained"}
          color={"inherit"}
          disabled={activeTab === "password" ? true : false}
          onClick={() => setActiveTab("password")}
        >
          Update Password
        </Button>
        <Button
          variant={activeTab === "email" ? "text" : "contained"}
          color={"inherit"}
          disabled={activeTab === "email" ? true : false}
          onClick={() => setActiveTab("email")}
        >
          Update Email
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        lg={4}
        height={'400px'}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        sx={{ backgroundColor: "white" }}
      >
        {activeTab === 'email' && (
          <UpdateExistingEmailForm user={currentUser} />
        )}
        {activeTab === 'password' && 
          <UpdateExistingPasswordForm />
        }
      </Grid>
      <Grid
        item
        xs={2.5}
        display={{ xs: "none", sm: "none", md: "none", lg: "block" }}
        sx={{ backgroundColor: "white", height: "100%" }}
      >
        {currentUser && <UserCard user={currentUser} hover />}
      </Grid>
    </Grid>
  );
};

export default AccountSettings;
