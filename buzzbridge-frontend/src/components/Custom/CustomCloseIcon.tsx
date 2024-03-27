import CloseIcon from "@mui/icons-material/Close";

const CustomCloseIcon = ({
  setOpenModal,
}: {
  setOpenModal: (value: boolean) => void;
}) => {
  return (
    <CloseIcon
      onClick={() => setOpenModal(false)}
      sx={{
        position: "absolute",
        right: "1%",
        top: "1%",
        ":hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
        borderRadius: "50%",
        padding: "0.5rem",
        color: "rgba(0, 0, 0, 0.6)",
      }}
    />
  );
};

export default CustomCloseIcon;
