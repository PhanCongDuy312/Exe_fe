import {
  Flex,
  Title,
  Input,
  Badge,
  ActionIcon,
  Button,
  Loader,
} from "@mantine/core";
import { IconSearch, IconTrash, IconEye } from "@tabler/icons-react";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import AppTable from "../../components/AppTable";
import CreateQuestionBankModal from "../Modal/CreateQuestionBankModal";
import appStrings from "../../utils/strings";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import {
  createQuestionBankApi,
  deleteQuestionBankApi,
  getQuestionBanksApi,
} from "../../apis/question";
import useNotification from "../../hooks/useNotification";
import useSearch from "../../hooks/useSearch";
import useConfirmModal from "../../hooks/useConfirmModal";

const columns = [
  {
    key: "questionName",
    label: appStrings.language.questionBanks.tableName,
  },
  {
    key: "total",
    label: appStrings.language.questionBanks.tableCount,
  },
  {
    key: "level",
    label: appStrings.language.questionBanks.tableLevel,
  },
  {
    key: "actions",
    label: appStrings.language.questionBanks.tableAction,
  },
];

export default function QuestionBankPage() {
  const [isNewBankOpen, isNewBankToggle] = useDisclosure(false);
  const [banks, setBanks] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const positionId = location.pathname.split("/")[2];
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });
  const [isCreating, setIsCreating] = useState(false);

  function handleNavigateToDetail(bankId) {
    navigate(`/${projectId}/${positionId}/questions/${bankId}`);
  }

  function handleSearchBank(query) {
    if (!query) return banks;
    const searchedBank = banks.filter((bank) =>
      bank.name.toLowerCase().includes(query.toLowerCase())
    );
    return searchedBank;
  }

  const {
    search: currentBank,
    isSearching,
    handleSearch,
  } = useSearch(banks, handleSearchBank);

  function handleCreateBank(name) {
    setIsCreating(true);
    createQuestionBankApi({
      projectId,
      positionId,
      name,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: () => {
        getQuestionBanksApi({
          projectId,
          positionId,
          onFail: (msg) => {
            errorNotify({ message: msg });
            setIsCreating(false);
          },
          onSuccess: (data) => {
            isNewBankToggle.close();
            setBanks(data);
            setIsCreating(false);
          },
        });
      },
    });
  }

  function handleDeleteBank(id) {
    deleteQuestionBankApi({
      projectId,
      positionId,
      bankId: id,
      onFail: (msg) => {
        errorNotify({ message: msg });
      },
      onSuccess: () => {
        successNotify({
          message: appStrings.language.questionBanks.deleteSuccessMessage,
        });
        setCVs((prev) => prev.filter((bank) => bank.id !== id));
      },
    });
  }

  const deleteCVTrigger = useConfirmModal({
    type: "delete",
    onOk: handleDeleteBank,
  });

  useEffect(() => {
    getQuestionBanksApi({
      projectId,
      positionId,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (data) => setBanks(data),
    });
  }, []);

  return (
    <Flex direction="column" gap="md">
      <HeadingLayout>
        <Title order={1}>{appStrings.language.questionBanks.heading}</Title>
      </HeadingLayout>
      <Flex gap="md" justify="space-between">
        <Input
          placeholder={appStrings.language.questionBanks.searchPlaceholder}
          leftSection={
            isSearching ? <Loader size="1rem" /> : <IconSearch size="1rem" />
          }
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button onClick={isNewBankToggle.open}>
          {appStrings.language.questionBanks.addBtn}
        </Button>
      </Flex>
      <AppTable
        columns={columns}
        loading={!currentBank}
        data={currentBank?.map((bank) => ({
          questionName: bank.name,
          total: bank.questions?.length || 0,
          level: (
            <Badge color="blue" variant="light">
              ~
            </Badge>
          ),
          actions: (
            <Flex gap="sm">
              <ActionIcon
                onClick={() => handleNavigateToDetail(bank.id)}
                variant="subtle"
              >
                <IconEye size="1rem" />
              </ActionIcon>
              <ActionIcon
                onClick={() => deleteCVTrigger(bank.id)}
                color="red"
                variant="subtle"
              >
                <IconTrash size="1rem" />
              </ActionIcon>
            </Flex>
          ),
        }))}
        pageSize={5}
      />
      <CreateQuestionBankModal
        title={appStrings.language.questionBanks.addBtn}
        open={isNewBankOpen}
        onClose={isNewBankToggle.close}
        onOk={(name) => handleCreateBank(name)}
        loading={isCreating}
      />
    </Flex>
  );
}
