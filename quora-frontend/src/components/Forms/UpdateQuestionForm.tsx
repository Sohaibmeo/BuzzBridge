const UpdateQuestionForm = ({
  id,
  defaultFormValues,
}: {
  id: number;
  defaultFormValues: any;
}) => {
  return (
    <div>
      UpdateQuestionForm {id} {defaultFormValues.id}
    </div>
  );
};

export default UpdateQuestionForm;
