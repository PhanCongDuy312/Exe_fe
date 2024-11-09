import {
  Flex,
  Title,
  ActionIcon,
  Text,
  Button,
  Menu,
  Skeleton,
  Badge,
} from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { DateInput } from "@mantine/dates";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import PositionAction from "../../components/Actions/PositionAction";
import { IconCalendarEvent } from "@tabler/icons-react";
import EditableCriteriaCard from "../../components/CriteriaCard";
import appStrings from "../../utils/strings";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import usePositionsState from "../../context/position";
import {
  closePositionApi,
  deletePositionApi,
  openPositionApi,
  updateCriteriaApi,
} from "../../apis/positions";
import useNotification from "../../hooks/useNotification";
import Empty from "../../components/Empty";
import useConfirmModal from "../../hooks/useConfirmModal";

export default function PositionGeneralPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const projectId = location.pathname.split("/")[1];
  const positionId = location.pathname.split("/")[2];
  const position = usePositionsState((state) => state.position);
  const setPosition = usePositionsState((state) => state.setPosition);
  const [isNewCriteria, setIsNewCriteria] = useState(false);
  const [isNewCriteriaUploading, setIsNewCriteriaUploading] = useState(false);
  const [form, setForm] = useState({
    startDate: null,
    endDate: null,
  });
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });

  function handleStartDateChange(value) {
    setForm({ ...form, startDate: value });
  }

  function handleEndDateChange(value) {
    setForm({ ...form, endDate: value });
  }

  function handleNewCriteria() {
    setIsNewCriteria(true);
  }

  function handleAddCriteria(data) {
    // Push new criteria to the list
    const newPosition = {
      ...position,
      criterias: [
        ...position.criterias,
        {
          name: data.content,
          example: data.example,
          score: data.priority,
        },
      ],
    };
    setIsNewCriteriaUploading(true);
    updateCriteriaApi({
      projectId,
      positionId,
      criteria: newPosition.criterias,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setIsNewCriteriaUploading(false);
      },
      onSuccess: (_) => {
        setIsNewCriteriaUploading(false);
        setIsNewCriteria(false);
        setPosition(newPosition);
        successNotify({
          message:
            appStrings.language.positionDetail.createCriteriaSuccessMessage,
        });
      },
    });
  }

  function handleDeleteCriteria(index) {
    // Delete criteria from the list
    const newPosition = {
      ...position,
      criterias: position.criterias.filter((_, i) => i !== index),
    };
    updateCriteriaApi({
      projectId,
      positionId,
      criteria: newPosition.criterias,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        setPosition(newPosition);
        successNotify({
          message:
            appStrings.language.positionDetail.deleteCriteriaSuccessMessage,
        });
      },
    });
  }

  function handleUpdateCriteria(index, data) {
    // Update criteria in the list
    const newPosition = {
      ...position,
      criterias: position.criterias.map((cri, i) => {
        if (i === index) {
          return {
            name: data.content,
            example: data.example,
            score: data.priority,
          };
        }
        return cri;
      }),
    };
    updateCriteriaApi({
      projectId,
      positionId,
      criteria: newPosition.criterias,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        setPosition(newPosition);
        successNotify({
          message:
            appStrings.language.positionDetail.updateCriteriaSuccessMessage,
        });
      },
    });
  }

  function handleClosePosition() {
    closePositionApi({
      projectId,
      positionId,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        successNotify({
          message: appStrings.language.position.closeSuccessMessage,
        });
        setPosition({ ...position, is_closed: true });
      },
    });
  }

  function handleOpenPosition() {
    openPositionApi({
      projectId,
      positionId,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        successNotify({
          message: appStrings.language.position.openSuccessMessage,
        });
        setPosition({ ...position, is_closed: false });
      },
    });
  }

  function handleDeletePosition() {
    deletePositionApi({
      projectId,
      positionId,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        successNotify({
          message: appStrings.language.position.deleteSuccessMessage,
        });
        navigate(`/${projectId}`);
      },
    });
  }

  const deletePositionTrigger = useConfirmModal({
    type: "delete",
    onOk: handleDeletePosition,
  });

  useEffect(() => {
    if (position) {
      setForm({
        startDate: new Date(position.start_date),
        endDate: new Date(position.end_date),
      });
    }
  }, [position]);

  return (
    <Flex direction="column" gap="lg">
      <HeadingLayout loading={!position}>
        <Flex align="center">
          <Title order={1}>{position?.name}</Title>
          <Badge
            variant="light"
            color={position?.is_closed ? "red" : "green"}
            style={{ marginLeft: 20 }}
          >
            {position?.is_closed
              ? appStrings.language.positionDetail.closedLabel
              : appStrings.language.positionDetail.activeLabel}
          </Badge>
        </Flex>
        <Menu withinPortal shadow="md" position="bottom-end" width={150}>
          <Menu.Target>
            <ActionIcon variant="light" color="gray">
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <PositionAction
              isClose={position?.is_closed ? true : false}
              onDeleteTap={deletePositionTrigger}
              onCloseTap={handleClosePosition}
              onOpenTap={handleOpenPosition}
            />
          </Menu.Dropdown>
        </Menu>
      </HeadingLayout>
      {position ? (
        <Text size="lg">{position?.description}</Text>
      ) : (
        <Skeleton h={30} w={300} />
      )}
      {position ? (
        <Flex gap="lg">
          <DateInput
            rightSection={<IconCalendarEvent />}
            valueFormat="DD/MM/YYYY"
            label={appStrings.language.positionDetail.startDateLabel}
            placeholder="3/26/2024"
            size="sm"
            value={form.startDate}
            onChange={handleStartDateChange}
            maxDate={form.endDate}
            style={{ flex: 1 }}
          />
          <DateInput
            rightSection={<IconCalendarEvent />}
            valueFormat="DD/MM/YYYY"
            label={appStrings.language.positionDetail.endDateLabel}
            placeholder="3/26/2025"
            size="sm"
            value={form.endDate}
            onChange={handleEndDateChange}
            minDate={form.startDate}
            style={{ flex: 1 }}
          />
        </Flex>
      ) : (
        <Skeleton h={50} />
      )}
      <Flex justify="space-between">
        <Title order={2}>
          {appStrings.language.positionDetail.criteriaTitle}
        </Title>
        <Button
          onClick={handleNewCriteria}
          disabled={!position || isNewCriteriaUploading}
        >
          {appStrings.language.positionDetail.createCriteriaBtn}
        </Button>
      </Flex>
      {isNewCriteria ? (
        <EditableCriteriaCard
          data={{
            content: "",
            example: "",
            priority: 1,
          }}
          onOk={handleAddCriteria}
          onCancel={() => setIsNewCriteria(false)}
          isEdit={true}
          saveBtnLoading={isNewCriteriaUploading}
        />
      ) : null}
      {position ? (
        !position.criterias.length ? (
          <Empty />
        ) : (
          position.criterias.map((cri, index) => (
            <EditableCriteriaCard
              key={index}
              data={{
                content: cri.name,
                example: cri.example,
                priority: cri.score,
              }}
              onDelete={() => handleDeleteCriteria(index)}
              onOk={(newData) => handleUpdateCriteria(index, newData)}
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
