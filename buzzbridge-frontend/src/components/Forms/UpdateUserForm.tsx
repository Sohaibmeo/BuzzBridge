import {
  Autocomplete,
  Box,
  Button,
  CardMedia,
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { User } from "../../types/UserTypes";
import { useAlert } from "../Providers/AlertProvider";
import useCustomAxios from "../../helpers/customAxios";
import CustomImgUpload from "../Custom/CustomImgUpload";
import CustomLoadingButton from "../Custom/CustomLoadingButton";
import { useUser } from "../Providers/UserProvider";

const UpdateUserForm = ({
  user,
  signUp = false,
  setOpenModal,
}: {
  user: User | any;
  signUp?: boolean;
  setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  let currentPictureUrl =
    user?.picture?.toString() || process.env.PUBLIC_URL + "/user_avatar.png";
  const [formData, setFormData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const { showAlert } = useAlert();
  const { expireCurrentUserSession } = useUser();
  const axiosInstance = useCustomAxios();

  const handleChange = async (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      e.preventDefault();
      const { picture, ...rest } = formData;
      let body = {
        ...rest,
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

        if (response && response.data) {
          body = {
            ...rest,
            picture: response.data.url,
            fileId: response.data.fileId,
          };
        }
      }
      if (!formData?.picture && user?.picture) {
        await axiosInstance.delete(
          `/auth/imagekit?url=${user?.picture}&fileId=${user?.fileId}`
        );
      }
      await axiosInstance.patch(`/user/${user?.id}`, body);
      setLoading(false);
      setSuccess(true);
      showAlert("success", "User updated successfully");
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
  return (
    <form onSubmit={handleFormSubmit}>
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
        label="Name"
        name="name"
        variant="outlined"
        defaultValue={user?.name}
        fullWidth
        margin="normal"
        onChange={handleChange}
      />
      <Grid item display={"flex"} xs={12} gap={2}>
        <Grid item xs={6}>
          <Autocomplete
            id="tags-outlined"
            options={genderOptions}
            defaultValue={genderOptions.find((option) => option.value === user?.gender) || null}
            value={genderOptions.find(
              (option) => option.value === user?.gender
            )}
            getOptionLabel={(option) => option.label}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Gender"
                name="gender"
                fullWidth
                margin="normal"
              />
            )}
            onChange={(e: any, value: any) =>
              setFormData((prev: any) => ({
                ...prev,
                gender: value?.value || null,
              }))
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Age"
            type="number"
            name="age"
            variant="outlined"
            defaultValue={user?.age}
            fullWidth
            margin="normal"
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                [e.target.name]: parseInt(e.target.value),
              }))
            }
          />
        </Grid>
      </Grid>
      <TextField
        label="About"
        name="about"
        variant="outlined"
        defaultValue={user?.about}
        multiline
        maxRows={6}
        fullWidth
        margin="normal"
        onChange={handleChange}
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
        <CustomLoadingButton
          loading={loading}
          success={success}
          handleSubmit={handleFormSubmit}
        />
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
