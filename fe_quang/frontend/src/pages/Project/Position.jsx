import { useLocation, useNavigate } from "react-router-dom";
import { Button, Flex, Title, Input, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import GridLayout from "../../components/Layout/GridLayout";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import CreatePositionModal from "../Modal/CreatePositionModal";
import Empty from "../../components/Empty";
import PositionCard from "../../components/PositionCard";
import PositionAction from "../../components/Actions/PositionAction";
import appStrings from "../../utils/strings";

import { useEffect, useState } from "react";
import usePositionsState from "../../context/position";
import useNotification from "../../hooks/useNotification";
import {
  closePositionApi,
  deletePositionApi,
  getPositionsApi,
  openPositionApi,
} from "../../apis/positions";
import { formatDate } from "../../utils/utils";
import useConfirmModal from "../../hooks/useConfirmModal";
import useSearch from "../../hooks/useSearch";

export default function YourPositionPage() {
  const [isNewPositionOpen, isNewPositionToggle] = useDisclosure(false);
  const location = useLocation();
  const navigate = useNavigate();
  const projectId = location.pathname.split("/")[1];
  const positions = usePositionsState((state) => state.positions);
  const setPositions = usePositionsState((state) => state.setPositions);
  const [activePositions, setActivePositions] = useState(
    _handleFilterPositions(positions)[0]
  );
  const [closedPositions, setClosedPositions] = useState(
    _handleFilterPositions(positions)[1]
  );
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });

  function _handleFilterPositions(positions) {
    if (!positions) return [null, null];
    const _activePositions = positions.filter(
      (position) => !position.is_closed
    );
    const _closedPositions = positions.filter((position) => position.is_closed);
    return [_activePositions, _closedPositions];
  }

  function _handleUpdatePositionData(id, type) {
    if (type === "delete") {
      const _processedPositions = positions.filter(
        (position) => position.id !== id
      );
      const [_activePositions, _closedPositions] =
        _handleFilterPositions(_processedPositions);
      setPositions(_processedPositions);
      setActivePositions(_activePositions);
    } else {
      const _processedPositions = positions.map((position) => {
        if (position.id === id) {
          return { ...position, is_closed: type === "closed" ? true : false };
        }
        return position;
      });
      const [_activePositions, _closedPositions] =
        _handleFilterPositions(_processedPositions);
      setActivePositions(_activePositions);
      setClosedPositions(_closedPositions);
    }
  }

  function handleSearchPositions(query) {
    if (!query) {
      const [_activePositions, _closedPositions] =
        _handleFilterPositions(positions);
      setActivePositions(_activePositions);
      setClosedPositions(_closedPositions);
    }
    const searchedPositions = positions.filter((position) =>
      position.name.toLowerCase().includes(query.toLowerCase())
    );
    const [_activePositions, _closedPositions] =
      _handleFilterPositions(searchedPositions);
    setActivePositions(_activePositions);
    setClosedPositions(_closedPositions);
  }

  const { _, isSearching, handleSearch } = useSearch(
    positions,
    handleSearchPositions
  );

  function handleClosePosition(id) {
    closePositionApi({
      projectId,
      positionId: id,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        successNotify({
          message: appStrings.language.position.closeSuccessMessage,
        });
        _handleUpdatePositionData(id, "closed");
      },
    });
  }

  function handleOpenPosition(id) {
    openPositionApi({
      projectId,
      positionId: id,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        successNotify({
          message: appStrings.language.position.openSuccessMessage,
        });
        _handleUpdatePositionData(id, "open");
      },
    });
  }

  function handleDeletePosition(id) {
    deletePositionApi({
      projectId,
      positionId: id,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        successNotify({
          message: appStrings.language.position.deleteSuccessMessage,
        });
        _handleUpdatePositionData(id, "delete");
      },
    });
  }

  const deletePositionTrigger = useConfirmModal({
    type: "delete",
    onOk: handleDeletePosition,
  });

  useEffect(() => {
    if (!positions) {
      getPositionsApi({
        id: projectId,
        onFail: (msg) => {
          errorNotify({ message: msg });
          setPositions([]);
          setActivePositions([]);
          setClosedPositions([]);
          navigate("/404");
        },
        onSuccess: (positions) => {
          const [_activePositions, _closedPositions] =
            _handleFilterPositions(positions);
          setPositions(positions);
          setActivePositions(_activePositions);
          setClosedPositions(_closedPositions);
        },
      });
    }
  }, [setPositions]);

  return (
    <Flex direction="column" gap="md">
      <HeadingLayout loading={!positions}>
        <Title order={2}>{appStrings.language.position.heading}</Title>
        <Flex gap={15}>
          <Input
            placeholder={appStrings.language.position.searchPlaceholder}
            leftSection={
              isSearching ? <Loader size="1rem" /> : <IconSearch size="1rem" />
            }
            onChange={(event) => handleSearch(event.currentTarget.value)}
          />
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={isNewPositionToggle.open}
          >
            {appStrings.language.position.createBtn}
          </Button>
        </Flex>
      </HeadingLayout>
      {activePositions?.length !== 0 ? (
        <GridLayout
          title={appStrings.language.position.activePositions}
          loading={!activePositions}
        >
          {activePositions?.map((data) => (
            <PositionCard
              key={data.id}
              id={data.id}
              title={data.name}
              description={data.description}
              alias={data.alias}
              startDate={formatDate(data.start_date)}
              endDate={formatDate(data.end_date)}
              actions={
                <PositionAction
                  onCloseTap={() => handleClosePosition(data.id)}
                  onDeleteTap={() => deletePositionTrigger(data.id)}
                />
              }
            />
          ))}
        </GridLayout>
      ) : !closedPositions?.length ? (
        <Empty />
      ) : null}
      {closedPositions?.length !== 0 ? (
        <GridLayout
          title={appStrings.language.position.closedPositions}
          loading={!closedPositions}
        >
          {closedPositions?.map((data) => (
            <PositionCard
              key={data.id}
              id={data.id}
              title={data.name}
              description={data.description}
              alias={data.alias}
              startDate={formatDate(data.start_date)}
              endDate={formatDate(data.end_date)}
              actions={
                <PositionAction
                  isClose
                  onOpenTap={() => handleOpenPosition(data.id)}
                  onDeleteTap={() => deletePositionTrigger(data.id)}
                />
              }
            />
          ))}
        </GridLayout>
      ) : null}
      <CreatePositionModal
        title={appStrings.language.position.createBtn}
        open={isNewPositionOpen}
        onClose={isNewPositionToggle.close}
      />
    </Flex>
  );
}
