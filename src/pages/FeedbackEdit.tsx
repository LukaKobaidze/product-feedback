import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CategoryType, FeedbackType, FeedbacksDataType } from 'types';
import { IconEditFeedback } from 'assets/shared';
import { categories } from 'data';
import { Button, Dropdown, Feedback, GoBack, Heading } from 'components';
import Field from 'components/Field';
import ModalDelete from 'components/ModalDelete';
import styles from 'styles/FeedbackEdit.module.scss';

interface Props {
  data: FeedbacksDataType;
  upvoted: number[];
  onDelete: (id: number) => void;
  onSaveChanges: (data: FeedbackType) => void;
}

export default function FeedbackEdit(props: Props) {
  const { data, upvoted, onDelete, onSaveChanges } = props;

  const { feedbackId } = useParams();
  const feedbackData = useMemo(():
    | (FeedbackType & {
        status: keyof FeedbacksDataType;
      })
    | null => {
    const keys = Object.keys(data) as (keyof FeedbacksDataType)[];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      const found = data[key].find((feedback) => feedback.id === Number(feedbackId));

      if (found) {
        return { ...found, status: key };
      }
    }

    return null;
  }, [feedbackId, data]);

  const [titleEdited, setTitleEdited] = useState(feedbackData?.title || '');
  const [categoryEdited, setCategoryEdited] = useState<CategoryType>(
    feedbackData?.category || 'UI'
  );
  const [statusEdited, setStatusEdited] = useState(
    feedbackData?.status || 'Suggestion'
  );
  const [descriptionEdited, setDescriptionEdited] = useState(
    feedbackData?.description || ''
  );
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <GoBack variant="1" to={'/' + feedbackId} />
      </header>
      <main className={`element-rounded ${styles.main}`}>
        <IconEditFeedback className={styles['edit-icon']} />

        {feedbackData && (
          <>
            <Heading level="1">Editing '{feedbackData.title}'</Heading>

            <Heading level="2" styleLevel="4">
              Feedback Title
            </Heading>
            <label htmlFor="title">Add a short, descriptive headline</label>
            <Field
              type="text"
              id="title"
              value={titleEdited}
              onChange={(e) => setTitleEdited(e.target.value)}
            />

            <Heading level="2" styleLevel="4">
              Category
            </Heading>
            <label htmlFor="category">Choose a category for your feedback</label>
            <Dropdown
              items={categories.map((category) => ({ value: category }))}
              selected={categoryEdited}
              onSelect={(category) => setCategoryEdited(category as CategoryType)}
              id="category"
            >
              {categoryEdited}
            </Dropdown>

            <Heading level="2" styleLevel="4">
              Update Status
            </Heading>
            <label htmlFor="status">Change feedback state</label>
            <Dropdown
              id="status"
              items={Object.keys(data).map((status) => ({ value: status }))}
              onSelect={(status) =>
                setStatusEdited(status as keyof FeedbacksDataType)
              }
              selected={statusEdited}
            >
              {statusEdited}
            </Dropdown>

            <Heading level="2" styleLevel="4">
              Feedback Detail
            </Heading>
            <label>
              Include any specific comments on what should be improved, added, etc.
            </label>
            <Field type="textarea" />

            <div>
              <Button variant="4" onClick={() => setIsDeleting(true)}>
                Delete
              </Button>
              <Button variant="3">Cancel</Button>
              <Button variant="1">Add Feedback</Button>
            </div>

            {isDeleting && (
              <ModalDelete
                heading="Delete Feedback"
                paragraph="Are you sure you want to delete this feedback?"
                elementDeleting={
                  <Feedback
                    isUpvoted={upvoted.includes(feedbackData.id)}
                    {...feedbackData}
                  />
                }
                onCloseModal={() => setIsDeleting(false)}
                onDelete={() => onDelete(Number(feedbackId))}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
