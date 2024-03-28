import {
  Box,
  Button,
  CardMedia,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { UpdateUser, User } from "../../types/UserTypes";
import { useAlert } from "../Providers/AlertProvider";
import useCustomAxios from "../../utils/helpers/customAxios";
import CustomImgUpload from "../Custom/CustomImgUpload";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import { useUser } from "../Providers/UserProvider";
import { useForm } from "react-hook-form";
import { UpdateUserProfileSchema } from "../../utils/schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const UpdateUserForm = ({
  user,
  signUp = false,
  setOpenModal,
  setUser,
}: {
  user: User | any;
  signUp?: boolean;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) => {
  let currentPictureUrl =
    user?.picture?.toString() || process.env.PUBLIC_URL + "/user_avatar.png";
  const [formData, setFormData] = useState<UpdateUser>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const { showAlert } = useAlert();
  const { expireCurrentUserSession } = useUser();
  const axiosInstance = useCustomAxios();

  const handleChange = async (e: any) => {
    setFormData((prev: UpdateUser) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleProfileFormSubmit = async () => {
    try {
      setLoading(true);
      const { picture } = formData;
      let body = {
        ...formData,
      };
      if (picture) {
        const response = await axiosInstance.post(
          "/auth/imagekit/getImageUrl",
          { file: picture },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (user?.picture) {
          await axiosInstance.delete(
            `/auth/imagekit?url=${user?.picture}&fileId=${user?.fileId}`
          );
        }
        body = {
          ...body,
          fileId: response.data.fileId,
          picture: response.data.url,
        };
      }
      await axiosInstance.patch(`/user/${user?.id}`, body);
      setLoading(false);
      setSuccess(true);
      showAlert("success", "User updated successfully");
      setUser && setUser((prev: any) => ({ ...prev, ...body }));
      setOpenModal && setOpenModal(false)
    } catch (error: any) {
      setLoading(false);
      setSuccess(false);
      showAlert("error", "Error updating user");
      if (error.response.status === 401) {
        expireCurrentUserSession();
      }
    }
  };
  const genderOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
    { value: "O", label: "Other" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUser>({
    resolver: zodResolver(UpdateUserProfileSchema),
  });
  return (
    <form onSubmit={handleSubmit(handleProfileFormSubmit)}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          columnGap: 2,
          mt: "3%",
        }}
      >
        <CustomImgUpload
          setFormData={setFormData}
          width={"fit-content"}
          height={"min-content"}
          customText=" "
          borderRadius={"50%"}
          hover
          children={
            <CardMedia
              component="img"
              sx={{
                height: "200px",
                width: "200px",
                borderRadius: "50%",
              }}
              src={
                formData?.picture
                  ? URL.createObjectURL(formData?.picture)
                  : currentPictureUrl
              }
              alt="green iguana"
            />
          }
        />
      </Box>
      <TextField
        {...register("name")}
        error={Boolean(errors.name?.message)}
        helperText={errors.name?.message}
        label="Name"
        name="name"
        variant="outlined"
        defaultValue={user?.name}
        fullWidth
        margin="normal"
        onBlur={handleChange}
      />
      <Grid item display={"flex"} xs={12} gap={2}>
        <Grid item xs={6} alignContent={"center"} mt={"11px"}>
          <FormControl fullWidth>
            <InputLabel id="simple-select-label">Gender</InputLabel>
            <Select
              {...register("gender")}
              name="gender"
              fullWidth
              labelId="simple-select-label"
              defaultValue={user?.gender}
              onChange={(e: any) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              error={Boolean(errors.gender?.message)}
              variant="outlined"
              label="Gender"
              placeholder="Select Topics"
            >
              {genderOptions.map((gender) => (
                <MenuItem key={gender.value} value={gender.value}>
                  {gender.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText error={Boolean(errors.gender?.message)}>
              {errors.gender?.message}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            {...register("age")}
            error={Boolean(errors.age?.message)}
            helperText={errors.age?.message}
            label="Age"
            type="number"
            name="age"
            variant="outlined"
            defaultValue={user?.age}
            fullWidth
            margin="normal"
            onBlur={(e) =>
              setFormData((prev: UpdateUser) => ({
                ...prev,
                [e.target.name]: parseInt(e.target.value),
              }))
            }
          />
        </Grid>
      </Grid>
      <TextField
        {...register("about")}
        error={Boolean(errors.about?.message)}
        helperText={errors.about?.message}
        label="About"
        name="about"
        variant="outlined"
        defaultValue={user?.about}
        multiline
        maxRows={6}
        fullWidth
        margin="normal"
        onBlur={handleChange}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
          columnGap: 1,
          mt: "3%",
        }}
      >
        <CustomLoadingButton loading={loading} success={success} />
        {!signUp && (
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenModal && setOpenModal(false)}
          >
            Cancel
          </Button>
        )}
      </Box>
    </form>
  );
};

export default UpdateUserForm;
