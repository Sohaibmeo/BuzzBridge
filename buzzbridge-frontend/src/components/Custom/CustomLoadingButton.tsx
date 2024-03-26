import { Box, CircularProgress, Fab } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import CrossIcon from "@mui/icons-material/Close";

const CustomLoadingButton = ({
  loading,
  success,
  disabled = false,
  width = null,
  Icon = <SaveIcon />,
  marginBottom = "0px",
}: {
  loading: boolean;
  success: boolean | null;
  disabled?: boolean;
  Icon?: React.ReactNode;
  width?: number | string | null;
  marginBottom?: string;
}) => {
  return (
    <Box sx={{ m: 1, position: "relative", marginBottom: { marginBottom } }}>
      <Fab
        aria-label="save"
        color="primary"
        sx={{
          width: width ? width : "56px",
          borderRadius: width ? "16px" : "50%",
          backgroundColor: success
            ? "green"
            : success === null
            ? ""
            : "#d32f2f",
          "&:hover": {
            backgroundColor: success ? "rgb(56, 142, 60)" : "rgb(25, 118, 210)",
          },
        }}
        type="submit"
      >
        {success === null ? Icon : success ? <CheckIcon /> : <CrossIcon />}
      </Fab>
      {loading && (
        <CircularProgress
          size={68}
          sx={{
            color: "green",
            fontWeight: "bold",
            position: "absolute",
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};

export default CustomLoadingButton;
