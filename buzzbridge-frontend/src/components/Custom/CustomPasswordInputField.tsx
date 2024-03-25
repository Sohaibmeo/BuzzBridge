import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import React, { useState } from "react";

const CustomPasswordInputField = ({
  name,
  label,
  onBlur,
  config,
  error,
  helperText,
  width = "300px",
}: {
  name: string;
  label: string;
  onBlur?: (e: any) => void;
  config?: any;
  error?: boolean;
  helperText?: string | undefined;
  width?: string | number;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <FormControl sx={{ width: width }} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
      <OutlinedInput
        {...config}
        error={error}
        fullWidth
        name={name}
        type={showPassword ? "text" : "password"}
        onBlur={onBlur}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
      <FormHelperText error id="username-error">
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};

export default CustomPasswordInputField;
