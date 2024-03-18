import UpdateAnswerForm from '../Forms/UpdateAnswerForm';
import UpdateQuestionForm from '../Forms/UpdateQuestionForm';
import UpdateTopicForm from '../Forms/UpdateTopicForm';

const GeneralUpdateForm = ({
  id,
  defaultFormValues,
  type,
  setOpenModal,
}: {
  id: number;
  type: string;
  defaultFormValues: any;
  setOpenModal: (value: boolean) => void;
}) => {
  return (
    <>
      {type === 'question' && (
        <UpdateQuestionForm
          id={id}
          defaultFormValues={defaultFormValues}
          setOpenModal={setOpenModal}
        />
      )}
      {type === 'answer' && (
        <UpdateAnswerForm
          id={id}
          defaultFormValues={defaultFormValues}
          setOpenModal={setOpenModal}
        />
      )}
      {type === 'topic' && (
        <UpdateTopicForm
          id={id}
          defaultFormValues={defaultFormValues}
          setOpenModal={setOpenModal}
        />
      )}
    </>
  );
};

export default GeneralUpdateForm;
