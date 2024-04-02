import { CircularProgress, Container } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../components/Providers/UserProvider";

const RedirectPage = () => {
  const { token } = useParams();
  const { handleCurrentUserLogin } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (token) {
      const body = {
        jwt: token,
      };
      handleCurrentUserLogin(body);
      navigate("/");
    }else{
      navigate("/login");
    }
  });
  return (
    <Container sx={{ width: "100%", height: "100%" }}>
      <CircularProgress />
    </Container>
  );
};

export default RedirectPage;
