import { CardContent, Typography } from "@mui/material";

const AdvertisementCard = ({mt}:{
  mt?: string | number;
}) => {
  return (
    <CardContent
      sx={{
        mt: mt,
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
      }}
    >
      <Typography color={"#636466"} textAlign={"center"}>
        Advertisement
      </Typography>
    </CardContent>
  );
};

export default AdvertisementCard;
