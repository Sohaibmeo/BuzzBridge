import { Grid } from "@mui/material";
import LoginUserForm from "../components/Forms/LoginUserForm";

const Login = () => {
  return (
    <Grid container justifyContent={"center"} height={"100vh"}>
      <Grid
        item
        xs={false}
        md={7}
        sx={{
          backgroundImage: "url(https://images.pexels.com/photos/1822608/pexels-photo-1822608.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid
        item
        xs={10}
        md={5}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        p="4%"
        sx={{backgroundColor:"white"}}
      >
        <LoginUserForm />
      </Grid>
    </Grid>
  );
};

export default Login;
