import UpdateAnswerForm from '../Forms/UpdateAnswerForm';
import UpdateQuestionForm from '../Forms/UpdateQuestionForm';
import UpdateTopicForm from '../Forms/UpdateTopicForm';

const GeneralUpdateForm = ({
  id,
  defaultFormValues,
  type,
  setOpenModal,
  setData,
  setSingleData,
}: {
  id: number;
  type: string;
  defaultFormValues: any;
  setOpenModal: (value: boolean) => void;
  setData?: any;
  setSingleData?: any;
}) => {
  return (
    <>
      {type === 'question' && (
        <UpdateQuestionForm
          id={id}
          defaultFormValues={defaultFormValues}
          setOpenModal={setOpenModal}
          setQuestions={setData}
          setQuestion={setSingleData}
        />
      )}
      {type === 'answer' && (
        <UpdateAnswerForm
          id={id}
          defaultFormValues={defaultFormValues}
          setOpenModal={setOpenModal}
          setAnswers={setData}
        />
      )}
      {type === 'topic' && (
        <UpdateTopicForm
          id={id}
          defaultFormValues={defaultFormValues}
          setOpenModal={setOpenModal}
          setTopics={setData}
          setTopic={setSingleData}
        />
      )}
    </>
  );
};

export default GeneralUpdateForm;
