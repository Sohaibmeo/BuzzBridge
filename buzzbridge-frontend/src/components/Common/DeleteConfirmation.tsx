import { Button, Grid, Typography } from "@mui/material";
import useCustomAxios from "../../utils/helpers/customAxios";
import { useAlert } from "../Providers/AlertProvider";
import { useNavigate } from "react-router-dom";
import CustomCloseIcon from "../Custom/CustomCloseIcon";

const DeleteConfirmation = ({
  id,
  picture,
  fieldId,
  type,
  setOpenModal,
  setData,
}: {
  id: number;
  picture: string;
  fieldId: string;
  type: string;
  setOpenModal: (value: boolean) => void;
  setData: any;
}) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const axiosInstance = useCustomAxios();
  const handleDelete = async () => {
    try {
      if (picture) {
        await axiosInstance.delete(
          `/auth/imagekit?url=${picture}&fileId=${fieldId}`
        );
      }
      await axiosInstance.delete(`${type}/${id}`);
      showAlert("success", `${type} deleted successfully`);
      if(setData){
        setData((prev: any) => prev.filter((item: any) => item.id !== id));
      }else{
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
    setOpenModal(false);
  };
  return (
    <Grid container xs={12} justifyContent={"end"}>
      <Grid item xs={12} alignItems={"center"} textAlign={"end"}>
        <CustomCloseIcon setOpenModal={setOpenModal} />
      </Grid>
      <Grid item xs={12} alignItems={"center"} textAlign={"start"}>
        <Typography variant="h6">
          Are you sure you want to delete this {type} ?
        </Typography>
      </Grid>
      <Grid item xs={4} md={1.7}>
        <Button variant="contained" color="error" onClick={handleDelete}>
          Delete
        </Button>
      </Grid>
      <Grid item xs={3} md={1.6}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(false)}
        >
          Cancel
        </Button>
      </Grid>
    </Grid>
  );
};

export default DeleteConfirmation;
