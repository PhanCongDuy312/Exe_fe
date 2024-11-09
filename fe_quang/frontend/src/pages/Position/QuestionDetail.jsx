import {
  Flex,
  Title,
  Button,
  ActionIcon,
  Select,
  Input,
  Fieldset,
  Textarea,
  TextInput,
  Paper,
  Text,
  Badge,
  Menu,
  Group,
  Breadcrumbs,
  Anchor,
  Skeleton,
} from "@mantine/core";
import { IconSearch, IconTrash, IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import appStrings from "../../utils/strings";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getQuestionBankByIdApi,
  updateQuestionBankApi,
} from "../../apis/question";
import useNotification from "../../hooks/useNotification";
import EditableQuestionCard from "../../components/QuestionCard";
import Empty from "../../components/Empty";

export default function QuestionDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const positionId = location.pathname.split("/")[2];
  const bankId = location.pathname.split("/")[4];
  const [bank, setBank] = useState(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [isNewQuestionUploading, setIsNewQuestionUploading] = useState(false);
  const errorNotify = useNotification({ type: "error" });

  function handleNavigateToQuestionBank() {
    navigate(`/${projectId}/${positionId}/questions`);
  }

  function handleAddQuestion(data) {
    // Push new criteria to the list
    const newBank = {
      ...bank,
      questions: [
        ...bank.questions,
        {
          content: data.content,
          answer: data.answer,
          correctAnswer: data.correctAnswer,
        },
      ],
    };
    setIsNewQuestionUploading(true);
    updateQuestionBankApi({
      projectId,
      positionId,
      bankId,
      questions: newBank.questions,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setIsNewQuestionUploading(false);
      },
      onSuccess: (_) => {
        setIsNewQuestionUploading(false);
        setIsNewQuestion(false);
        setBank(newBank);
        successNotify({
          message:
            appStrings.language.questionBankDetail.createQuestionSuccessMessage,
        });
      },
    });
  }

  function handleUpdateQuestion(index, data) {
    // Update question in the list
    const newBank = {
      ...bank,
      questions: bank.questions.map((question, i) => {
        if (i === index) {
          return {
            name: data.content,
            answer: data.answer,
            correctAnswer: data.correctAnswer,
          };
        }
        return question;
      }),
    };
    updateQuestionBankApi({
      projectId,
      positionId,
      bankId,
      questions: newBank.questions,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        setBank(newBank);
        successNotify({
          message:
            appStrings.language.questionBankDetail.updateQuestionSuccessMessage,
        });
      },
    });
  }

  useEffect(() => {
    getQuestionBankByIdApi({
      projectId,
      positionId,
      bankId,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (data) => setBank(data),
    });
  }, []);

  return (
    <Flex direction="column" gap="xl">
      <HeadingLayout loading={!bank}>
        <Breadcrumbs>
          <Anchor onClick={handleNavigateToQuestionBank}>
            {appStrings.language.questionBanks.title}
          </Anchor>
          {bank?.name}
        </Breadcrumbs>
      </HeadingLayout>
      <Flex justify="space-between" align="center">
        <Title order={1}>{bank?.name}</Title>
        <Flex align="center" gap="md">
          {appStrings.language.questionBankDetail.totalQuestion}
          <Badge variant="light" color="blue" size="lg" circle>
            {bank?.questions.length}
          </Badge>
        </Flex>
      </Flex>
      <Flex gap="md" justify="space-between">
        <Input
          placeholder={appStrings.language.questionBankDetail.searchPlaceholder}
          leftSection={<IconSearch size="1rem" />}
        />
        <Button onClick={() => setIsNewQuestion(true)}>
          {appStrings.language.questionBankDetail.createBtn}
        </Button>
      </Flex>
      {isNewQuestion ? (
        <EditableQuestionCard
          data={{
            content: "",
            answer: {
              a: "",
              b: "",
              c: "",
              d: "",
            },
            correctAnswer: [],
          }}
          onOk={handleAddQuestion}
          onCancel={() => setIsNewQuestion(false)}
          isEdit={true}
          saveBtnLoading={isNewQuestionUploading}
        />
      ) : null}
      {bank ? (
        !bank.questions.length ? (
          <Empty />
        ) : (
          bank.questions.map((question, index) => (
            <EditableQuestionCard
              key={index}
              data={{
                content: question.content,
                answer: question.answer,
                correctAnswer: question.correct_answer || [],
              }}
              // onDelete={() => handleDeleteCriteria(index)}
              onOk={(newData) => handleUpdateQuestion(index, newData)}
              isEdit={false}
            />
          ))
        )
      ) : (
        <Flex direction="column" gap="md">
          <Skeleton h={150} />
          <Skeleton h={150} />
        </Flex>
      )}
    </Flex>
  );
}
