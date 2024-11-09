import {
  Flex,
  Title,
  ActionIcon,
  Text,
  Input,
  Button,
  Alert,
  Tooltip,
  CopyButton,
  Spoiler,
  Badge,
  Loader,
  Popover,
  Slider,
} from "@mantine/core";
import {
  IconTrash,
  IconEye,
  IconSearch,
  IconCheck,
  IconCopy,
  IconShare3,
  IconSparkles,
  IconChevronUp,
  IconChevronDown,
  IconFileTypePdf,
  IconFileTypeDocx,
  IconFile,
  IconAdjustments,
} from "@tabler/icons-react";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import UploadZone from "../../components/Upload/UploadZone";
import appStrings from "../../utils/strings";
import ProgressList from "../../components/Upload/ProgressList";
import AppTable from "../../components/AppTable";

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  deleteCVDataApi,
  getCVsApi,
  uploadCVDataApi,
  watchUploadProgressApi,
} from "../../apis/cv";
import { getMatchApi } from "../../apis/match";
import usePositionsState from "../../context/position";
import useCVState from "../../context/cv";
import useNotification from "../../hooks/useNotification";
import {
  formatDate,
  getScoreColor,
  getShareUploadUrl,
} from "../../utils/utils";
import useInterval from "../../hooks/useInterval";
import useSearch from "../../hooks/useSearch";
import useConfirmModal from "../../hooks/useConfirmModal";

const columns = [
  {
    key: "cvName",
    label: appStrings.language.cv.tableCVName,
  },
  {
    key: "upload",
    label: appStrings.language.cv.tableUploadDate,
  },
  {
    key: "score",
    label: appStrings.language.cv.tableScore,
  },
  {
    key: "actions",
    label: appStrings.language.cv.tableAction,
  },
];

export default function CVPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const positionId = location.pathname.split("/")[2];
  const position = usePositionsState((state) => state.position);
  const cvs = useCVState((state) => state.cvs);
  const setCVs = useCVState((state) => state.setCVs);
  const setCVScores = useCVState((state) => state.setCVScores);
  const uploadFiles = useCVState((state) => state.uploadFiles);
  const setUploadFiles = useCVState((state) => state.setUploadFiles);
  const [isUploading, setIsUploading] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [progressObject, setProgressObject] = useState({});
  const [adjustment, setAdjustment] = useState({
    limit: 20,
    threshold: 0.6,
  });
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });
  const intervalFunction = useInterval(500);

  function handleSearchCVs(query) {
    if (!query) return cvs;
    const searchedCVs = cvs.filter((cv) =>
      cv.cvName.toLowerCase().includes(query.toLowerCase())
    );
    return searchedCVs;
  }

  const { search, isSearching, handleSearch } = useSearch(cvs, handleSearchCVs);

  function handleNavigateToCVDetail(cvId) {
    navigate(`/${projectId}/${positionId}/cv/${cvId}`);
  }

  const _isProgressComplete = useCallback((progressObject) => {
    if (!progressObject) return true;
    return (
      Object.keys(progressObject).length &&
      Object.values(progressObject).every((percent) => percent >= 100)
    );
  });

  function handleUploadFiles(files) {
    if (!position?.criterias?.length) {
      errorNotify({
        message: appStrings.language.cv.noCriteriaError,
      });
      return;
    }
    setUploadFiles(files);
    uploadCVDataApi({
      projectId,
      positionId,
      files,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setUploadFiles(null);
      },
      onSuccess: (data) => {
        // Set progress object
        const initProgressObject = {};
        files.forEach((file) => {
          initProgressObject[file.name] = 0;
        });
        setProgressObject(initProgressObject);

        // Start interval function to watch upload progress
        intervalFunction({
          callback: (stop) => {
            if (!isUploading) {
              setIsUploading(true);
            }
            watchUploadProgressApi(data.progress_id).then((progressData) => {
              // Only update progress if percent is available
              if (progressData?.percent) {
                setProgressObject((prev) => ({
                  ...prev,
                  ...progressData?.percent,
                }));
              }
              // Check if all progress is complete
              if (_isProgressComplete(progressData?.percent)) {
                stop();
                setIsUploading(false);
                successNotify({
                  message: appStrings.language.cv.uploadSuccessMessage,
                });
              }
            });
          },
        });
      },
    });
  }

  function handleMatchCVJD() {
    if (!search.length) {
      errorNotify({
        message: appStrings.language.cv.noCVError,
      });
      return;
    }
    setIsMatching(true);
    getMatchApi({
      projectId,
      positionId,
      limit: adjustment.limit,
      threshold: adjustment.threshold,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setIsMatching(false);
      },
      onSuccess: (data) => {
        setIsMatching(false);
        successNotify({
          title: appStrings.language.cv.matchSuccessTitle,
          message: appStrings.language.cv.matchSuccessMessage,
        });
        // Set score to CVs
        const formatedData = Object.entries(data).map(([key, value]) => ({
          id: key,
          score: value.overall,
        }));
        setCVScores(formatedData);
      },
    });
  }

  function handleDeleteCV(id) {
    deleteCVDataApi({
      projectId,
      positionId,
      cvId: id,
      onFail: (msg) => {
        errorNotify({ message: msg });
      },
      onSuccess: () => {
        successNotify({
          message: appStrings.language.cv.deleteCVSuccessMessage,
        });
        setCVs((prev) => prev.filter((cv) => cv.id !== id));
      },
    });
  }

  const deleteCVTrigger = useConfirmModal({
    type: "delete",
    onOk: handleDeleteCV,
  });

  useEffect(() => {
    getCVsApi({
      projectId,
      positionId,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setCVs([]);
      },
      onSuccess: (cvs) => {
        // Sort data by score
        cvs.sort((a, b) => b.score.overall - a.score.overall);
        const formatedCVs = cvs.map((cv) => ({
          id: cv.id,
          cvName: cv.name,
          upload: cv.upload_at,
          score: cv.score.overall,
        }));
        setCVs(formatedCVs);
      },
    });
  }, [setCVs]);

  return (
    <Flex direction="column" gap="md">
      <HeadingLayout>
        <Title order={1}>{appStrings.language.cv.title}</Title>
      </HeadingLayout>
      <Spoiler
        initialState={true}
        maxHeight={0}
        showLabel={
          <Flex align="center" gap="xs">
            <Text>{appStrings.language.cv.showUploadZone}</Text>
            <IconChevronDown size="1rem" />
          </Flex>
        }
        hideLabel={
          <Flex align="center" gap="xs">
            <Text c="dimmed">{appStrings.language.cv.hideUploadZone}</Text>
            <IconChevronUp size="1rem" color="gray" />
          </Flex>
        }
      >
        <Flex direction="column" gap="md">
          {uploadFiles ? (
            <ProgressList
              items={progressObject}
              isClosable={!isUploading}
              onClose={() => setUploadFiles(null)}
            />
          ) : (
            <UploadZone onFileSelected={(files) => handleUploadFiles(files)} />
          )}
          <Alert
            variant="light"
            color="grape"
            title={appStrings.language.cv.shareUrlTitle}
            icon={<IconShare3 />}
          >
            <Flex align="center" gap="xs">
              {appStrings.language.cv.shareUrlMessage}
              <CopyButton value={getShareUploadUrl(positionId)} timeout={2000}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={
                      copied
                        ? appStrings.language.btn.copied
                        : appStrings.language.btn.copy
                    }
                    withArrow
                    position="right"
                  >
                    <ActionIcon
                      color={copied ? "teal" : "gray"}
                      variant="subtle"
                      onClick={copy}
                    >
                      {copied ? (
                        <IconCheck size="1rem" />
                      ) : (
                        <IconCopy size="1rem" />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Flex>
          </Alert>
        </Flex>
      </Spoiler>
      <Flex align="center" gap="md">
        <Flex gap="md" flex={1}>
          <Input
            placeholder={appStrings.language.cv.searchPlaceholder}
            leftSection={
              isSearching ? <Loader size="1rem" /> : <IconSearch size="1rem" />
            }
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Flex>
        <Popover width={300} position="top">
          <Popover.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconAdjustments size="1rem" />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Flex direction="column" gap="sm">
              <Text>{appStrings.language.cv.adjustLimit}</Text>
              <Slider
                min={0}
                max={cvs?.length * 10}
                defaultValue={adjustment.limit}
                onChangeEnd={(value) =>
                  setAdjustment((prev) => ({ ...prev, limit: value }))
                }
              />
              <Text>{appStrings.language.cv.adjustThreshold}</Text>
              <Slider
                min={0}
                max={1}
                step={0.005}
                defaultValue={adjustment.threshold}
                onChangeEnd={(value) =>
                  setAdjustment((prev) => ({ ...prev, threshold: value }))
                }
              />
            </Flex>
          </Popover.Dropdown>
        </Popover>
        <Button
          leftSection={<IconSparkles size="1rem" />}
          onClick={handleMatchCVJD}
          loading={isMatching}
          disabled={isUploading}
        >
          {appStrings.language.cv.matchBtn}
        </Button>
      </Flex>
      <AppTable
        columns={columns}
        loading={!search}
        data={search?.map((data) => ({
          cvName: (
            <Flex align="center" gap="md">
              {data.cvName.toLowerCase().includes(".pdf") ? (
                <IconFileTypePdf size="1rem" color="#E03131" />
              ) : data.cvName.toLowerCase().includes(".docx") ? (
                <IconFileTypeDocx size="1rem" color="#3B5BDB" />
              ) : (
                <IconFile size="1rem" />
              )}
              <Text>{data.cvName}</Text>
            </Flex>
          ),
          upload: formatDate(data.upload, true),
          score: data.score ? (
            <Badge variant="light" color={getScoreColor(data.score)}>
              {data.score}%
            </Badge>
          ) : (
            <Text c="dimmed">{appStrings.language.cv.notScored}</Text>
          ),
          actions: (
            <Flex gap="xs">
              <Tooltip
                label={appStrings.language.cv.viewActionTooltip}
                withArrow
              >
                <ActionIcon
                  variant="subtle"
                  onClick={() => handleNavigateToCVDetail(data.id)}
                >
                  <IconEye size="1rem" />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={appStrings.language.btn.delete} withArrow>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => deleteCVTrigger(data.id)}
                >
                  <IconTrash size="1rem" />
                </ActionIcon>
              </Tooltip>
            </Flex>
          ),
        }))}
        pageSize={5}
      />
    </Flex>
  );
}
