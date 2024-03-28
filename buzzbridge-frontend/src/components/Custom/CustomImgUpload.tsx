import { Button, Fade, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";

const CustomImgUpload = ({
  setFormData,
  height,
  width,
  customText,
  children,
  hover,
  borderRadius,
  onlyImage=false,
}: {
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  height?: string | number;
  width?: string | number;
  customText?: string;
  children?: React.ReactNode;
  hover?: boolean;
  borderRadius?: string | number;
  onlyImage?: boolean;
}) => {
  const handleChange = (e: any) => {
    setFormData((prev: any) => ({ ...prev, picture: e.target.files[0] }));
  }
  const [hoverIcon, setHoverIcon] = useState(false);
  return (
    <Button
      component="label"
      variant="contained"
      color="inherit"
      startIcon={!children && <CloudUploadIcon />}
      fullWidth
      sx={{
        height: { height },
        width: { width },
        borderRadius: { borderRadius },
        position: "relative",
        padding: hover ? 0 : "",
        opacity: hover && hoverIcon ? 0.8 : 1,
      }}
      onMouseEnter={() => setHoverIcon(true)}
      onMouseLeave={() => setHoverIcon(false)}
    >
      {children}
      {hover && (
        <Fade in={hoverIcon}>
          <EditIcon
            fontSize="large"
            color="inherit"
            sx={{
              color: "white",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          />
        </Fade>
      )}
      {customText || "Upload"}
      <TextField
        sx={{
          clip: "rect(0 0 0 0)",
          clipPath: "inset(50%)",
          height: 1,
          overflow: "hidden",
          position: "absolute",
          bottom: 0,
          left: 0,
          whiteSpace: "nowrap",
          width: 1,
        }}
        type="file"
        onChange={handleChange}
        inputProps={{ accept: onlyImage ? "image/*" : ""}}
      />
    </Button>
  );
};

export default CustomImgUpload;
