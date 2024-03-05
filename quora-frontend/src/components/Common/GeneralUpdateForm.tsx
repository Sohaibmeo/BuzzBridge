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
  return <>
  {type==='question' && <UpdateQuestionForm id={id} defaultFormValues={defaultFormValues}/>}
  {type==='answer' && <UpdateAnswerForm id={id} defaultFormValues={defaultFormValues}/>}
  {type==='topic' && <UpdateTopicForm id={id} defaultFormValues={defaultFormValues}/>}
  </>;
};

export default GeneralUpdateForm;
