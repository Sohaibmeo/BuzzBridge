import { Box, CircularProgress, Fab } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import CrossIcon from "@mui/icons-material/Close";

const CustomLoadingButton = ({
  loading,
  success,
  handleSubmit,
  width = null,
  Icon = <SaveIcon />,
}: {
  loading: boolean;
  success: boolean | null;
  handleSubmit: any;
  Icon?: React.ReactNode;
  width?: number | string | null;
}) => {
  return (
    <Box sx={{ m: 1, position: "relative" }}>
      <Fab
        aria-label="save"
        color="primary"
        sx={{
          width: width ? width : "",
          borderRadius: width ? "16px" : '50%',
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
        onClick={handleSubmit}
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
