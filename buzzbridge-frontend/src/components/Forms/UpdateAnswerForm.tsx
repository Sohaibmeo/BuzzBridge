import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useAlert } from "../Providers/AlertProvider";
import useCustomAxios from "../../utils/helpers/customAxios";
import { useUser } from "../Providers/UserProvider";
import { AnswerTypes, UpdateAnswer } from "../../types/AnswerTypes";

const UpdateAnswerForm = ({
  id,
  defaultFormValues,
  setOpenModal,
  setAnswers,
}: {
  id: number;
  defaultFormValues: any;
  setOpenModal: any;
  setAnswers: React.Dispatch<React.SetStateAction<AnswerTypes[]>>;
}) => {
  const [formData, setFormData] = useState<UpdateAnswer>({});
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const { expireCurrentUserSession } = useUser();

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await axiosInstance.patch(`/answer/${id}`, formData);
      showAlert("success", "Answer updated successfully");
      setOpenModal(false);
      setAnswers((prev: any) =>
        prev.map((answer: any) =>
          answer.id === id ? { ...answer, ...formData } : answer
        )
      );
    } catch (error: any) {
      showAlert("error", "Error updating user");
      if (error.response.status === 401) {
        expireCurrentUserSession();
      }
    }
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <TextField
        label="Description"
        name="description"
        variant="outlined"
        defaultValue={defaultFormValues.description}
        fullWidth
        margin="normal"
        onBlur={(e) =>
          setFormData({ ...formData, [e.target.name]: e.target.value })
        }
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "right",
          columnGap: 1,
          mt: "3%",
        }}
      >
        <Button variant="contained" color="primary" type="submit">
          Update
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenModal(false)}
        >
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default UpdateAnswerForm;
