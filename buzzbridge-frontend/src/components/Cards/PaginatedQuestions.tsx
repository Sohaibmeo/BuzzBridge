import React, { useEffect, useState } from "react";
import useCustomAxios from "../../helpers/customAxios";
import { QuestionType } from "../../types/QuestionTypes";
import QuestionCard from "./QuestionCard";
import { Tab, Tabs } from "@mui/material";

const PaginatedQuestions = ({
  firstTab,
  limit,
}: {
  firstTab: string;
  limit: number;
}) => {
  const axiosInstance = useCustomAxios();
  const switchTabContent = ["latest", "popular", "following"];

  const [currentTab, setCurrentTab] = useState(firstTab);
  const [pageCount, setPageCount] = useState<any>({
    popularQuestionsPageCount: 1,
    latestQuestionsPageCount: 1,
    followingQuestionsPageCount: 1,
  });
  const [popular, setPopular] = useState([]);
  const [latest, setLatest] = useState([]);
  const [following, setFollowing] = useState([]);
  const handleLoadData = async (
    tab: string,
    limit: number,
    buttonCall: boolean
  ) => {
    try {
      const page = pageCount[`${tab}QuestionsPageCount`] || 1;
      console.log(
        "Button count of ",
        tab,
        "is",
        pageCount[`${tab}QuestionsPageCount`],
        buttonCall
      );
      if (page > 1 && buttonCall) return;
      const URL = `question/${tab}?page=${page}&limit=${limit}`;
      const response = await axiosInstance.get(URL);
      setPageCount((prevCounts: any) => ({
        ...prevCounts,
        [`${tab}QuestionsPageCount`]:
          prevCounts[`${tab}QuestionsPageCount`] + 1,
      }));
      switch (tab) {
        case "popular":
          setPopular((prev) => prev.concat(response.data));
          break;
        case "latest":
          setLatest((prev) => prev.concat(response.data));
          break;
        case "following":
          setFollowing((prev) => prev.concat(response.data));
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getCurrentTabData = () => {
    switch (currentTab) {
      case "popular":
        return popular;
      case "latest":
        return latest;
      case "following":
        return following;
      default:
        return [];
    }
  };
  useEffect(() => {
    console.log("button call", firstTab);
    handleLoadData(firstTab, limit, true);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    window.onscroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        handleLoadData(currentTab, limit, false);
      }
    };
    // eslint-disable-next-line
  }, [
    pageCount.popularQuestionsPageCount,
    pageCount.latestQuestionsPageCount,
    pageCount.followingQuestionsPageCount,
    currentTab,
  ]);
  return (
    <>
      <Tabs
        value={currentTab}
        onChange={(event, newValue) => setCurrentTab(newValue)}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        textColor="primary"
        indicatorColor="primary"
        sx={{ width: "100%", marginBottom: "2%" }}
      >
        {switchTabContent.map((tab, index) => (
          <Tab
            key={index}
            value={tab}
            label={tab.charAt(0).toUpperCase() + tab.slice(1)}
            onClick={() => {
              handleLoadData(tab, limit, true);
            }}
          />
        ))}
      </Tabs>
      {getCurrentTabData().map((question: QuestionType, index: number) => (
        <QuestionCard
          key={index}
          question={question}
          displayAnswers
          postAnswer
        />
      ))}
    </>
  );
};

export default PaginatedQuestions;
