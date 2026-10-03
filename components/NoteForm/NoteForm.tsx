import * as Yup from "yup";
import { Field, Form, Formik, ErrorMessage } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";
import { createNote } from "../../lib/api";
import type { FormNotePayload } from "../../types/note";

const initialValues: FormNotePayload = {
  title: "",
  content: "",
  tag: "Todo",
};

export interface NoteFormProps {
  onSubmit?: (values: FormNotePayload) => void;
  onCancel: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "At least 3 characters")
    .max(50, "No more than 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "No more than 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel(); 
    },
  });

  const handleSubmit = (values: FormNotePayload) => {
    mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NoteSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            id="content"
            as="textarea"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage
            name="content"
            component="span"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field id="tag" as="select" name="tag" className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}