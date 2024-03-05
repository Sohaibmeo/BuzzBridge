const UpdateAnswerForm = ({
  id,
  defaultFormValues,
}: {
  id: number;
  defaultFormValues: any;
}) => {
  return (
    <div>
      UpdateAnswerForm {id} {defaultFormValues.id}
    </div>
  );
};

export default UpdateAnswerForm;
