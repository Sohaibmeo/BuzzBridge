import { useState } from "react";
import UpdateExistingPasswordForm from "../components/Forms/UpdateExistingPasswordForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import UserCard from "../components/Cards/UserCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/Providers/UserProvider";
import UpdateExistingEmailForm from "../components/Forms/UpdateExistingEmailForm";

const AccountSettings = () => {
  const { getCurrentUser } = useUser();
  const currentUser = getCurrentUser();
  const [activeTab, setActiveTab] = useState<string | false>(false);
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
      </Grid>
      <Grid item xs={12} lg={4} justifyContent={"center"} alignItems={"center"}>
        <Accordion
          expanded={activeTab === "email"}
          onChange={() =>
            setActiveTab((activeTab) =>
              activeTab === "email" ? false : "email"
            )
          }
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="email-content"
            id="email-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              Change Email
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {currentUser.email}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ width: "fit-content", margin: "auto" }}>
            <UpdateExistingEmailForm user={currentUser} />
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={activeTab === "password"}
          onChange={() =>
            setActiveTab((activeTab) =>
              activeTab === "password" ? false : "password"
            )
          }
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="password-content"
            id="password-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              Password
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              Change Pasword
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ width: "fit-content", margin: "auto" }}>
            <UpdateExistingPasswordForm />
          </AccordionDetails>
        </Accordion>
      </Grid>
      <Grid
        item
        lg={2.5}
        display={{ xs: "none", sm: "none", md: "none", lg: "block" }}
        sx={{ backgroundColor: "white", height: "100%" }}
      >
        {currentUser && (
          <UserCard user={currentUser} hover width={"100%"} loading={false} />
        )}
      </Grid>
    </Grid>
  );
};

export default AccountSettings;
