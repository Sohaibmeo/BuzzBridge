import UserCard from "./UserCard";

const HoverCards = ({
  currentTab,
  data,
}: {
  currentTab: string;
  data: any;
}) => {
  return (
    <>
      {currentTab === "user" && data && (
        <UserCard
          user={data}
          hover
          width={"340px"}
          height={"fit-content"}
          loading={false}
        />
      )}
    </>
  );
};

export default HoverCards;
