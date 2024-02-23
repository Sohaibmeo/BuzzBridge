import { Grid } from "@mui/material"
import CreateTopicModal from '../components/Modals/CreateTopicModal'
import CreateQuestionModal from '../components/Modals/CreateQuestionModal'
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

const HomePage =  () =>{
    const [topics,setTopics] = useState<any>([{}])
    const [questions,setQuestions] = useState<any>([{}])
    const [openCreateTopicModal,setOpenCreateTopicModal] = useState<boolean>(false)
    const [openCreateQuestionModal,setOpenCreateQuestionModal] = useState<boolean>(false)
    useEffect(()=>{
         const apiCalls = async() => {
            try {
                const topics:AxiosResponse= await axios.get("http://localhost:3000/topic")
                setTopics(topics.data)
                const questions:AxiosResponse = await axios.get("http://localhost:3000/question")
                setQuestions(questions.data)

                console.log("Results: ",topics,questions)
            } catch (error) {
                console.log("ERR:UseEffectApiCALL"+error)
            }
        }
        apiCalls()
    },[])
    return(
        <>
            <Grid container>
                <Grid item xs={4}>
                    {
                        topics? topics.map((topic:any)=>{
                            return <><div>{topic.id}</div>
                                    <div>{topic.title}</div>
                                    </>
                        }): <div>Loading Topics</div>
                    }
                </Grid>
                <Grid item xs={6}>
                    {
                       questions? questions.map((question:any)=>{
                            return <>
                                    <div>{question.id}</div>
                                    <div>{question.title}</div>
                                    <div>{question.image}</div>
                                    <div>{question?.assignedTopics?.map((topic:any)=>{
                                        return topic?.id
                                    })}</div>
                                    <div>{question?.belongsTo?.name}</div>
                                    <div>{question?.answers?.map((answers:any)=>{
                                        return <div>{answers?.description}</div>
                                    })}</div>
                                </>
                        }): <div>Loading Questions</div>
                    }
                </Grid>
                <Grid item xs={2}>
                    <button onClick={()=>setOpenCreateTopicModal(true)}>Create New Topic</button>
                    <button onClick={()=>setOpenCreateQuestionModal(true)}>Create New Questions</button>
                </Grid>
            </Grid>
            {openCreateTopicModal && 
                <CreateTopicModal  
                    openCreateTopicModal={openCreateTopicModal} 
                    setOpenCreateTopicModal={setOpenCreateTopicModal}
                />
            }
            {openCreateQuestionModal && 
                <CreateQuestionModal 
                    openCreateQuestionModal={openCreateQuestionModal}
                    setOpenCreateQuestionModal={setOpenCreateQuestionModal}
                />
            }
        </>
    )
}

export default HomePage;