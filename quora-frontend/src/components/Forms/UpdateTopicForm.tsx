const UpdateTopicForm = ({
  id,
  defaultFormValues,
}: {
  id: number;
  defaultFormValues: any;
}) => {
  return (
    <div>
      UpdateTopicForm {id} {defaultFormValues.id}
    </div>
  );
};

export default UpdateTopicForm;
