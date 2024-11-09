import {
  Flex,
  Breadcrumbs,
  Anchor,
  Paper,
  Box,
  Title,
  ActionIcon,
  RingProgress,
  Text,
  Badge,
  Menu,
  Skeleton,
  Center,
  Tooltip,
  Blockquote,
  SegmentedControl,
  ScrollArea,
  Stepper,
} from "@mantine/core";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import appStrings from "../../utils/strings";
import {
  IconDownload,
  IconDots,
  IconTrash,
  IconInfoSquareRounded,
  IconSparkles,
  IconFile,
  IconAlignLeft,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useNotification from "../../hooks/useNotification";
import {
  getCVDetailApi,
  getCVKeywordDetailApi,
  summaryAIApi,
} from "../../apis/cv";
import { getScoreColor } from "../../utils/utils";
import FileViewer from "../../components/FileViewer";
import DetailTable from "../../components/DetailTable";

function getStepStatusActive(status) {
  switch (status) {
    case "APPLYING":
      return 0;
    case "ACCEPTED":
      return 1;
    case "INTERVIEWING":
      return 2;
    case "HIRED":
      return 3;
  }
}

export default function CVDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const positionId = location.pathname.split("/")[2];
  const cvId = location.pathname.split("/")[4];
  const [cv, setCV] = useState(null);
  const [isTextView, setIsTextView] = useState(false);
  const [isSummary, setIsSummary] = useState(false);
  const [cvDetail, setCVDetail] = useState(null);
  const errorNotify = useNotification({ type: "error" });

  function handleNavigateToCVs() {
    navigate(`/${projectId}/${positionId}/cv`);
  }

  function handleSummaryCV() {
    setIsSummary(true);
    summaryAIApi({
      projectId,
      positionId,
      cvId,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setIsSummary(false);
      },
      onSuccess: (summary) => {
        setCV((prev) => ({
          ...prev,
          summary,
        }));
        setIsSummary(false);
      },
    });
  }

  useEffect(() => {
    // Get CV detail
    getCVDetailApi({
      projectId,
      positionId,
      cvId,
      onFail: (msg) => {
        errorNotify({ message: msg });
      },
      onSuccess: (cv) => {
        setCV(cv);
      },
    });
    // Get CV keyword detail
    getCVKeywordDetailApi({
      projectId,
      positionId,
      cvId,
      onFail: (msg) => {
        errorNotify({ message: msg });
      },
      onSuccess: (detail) => {
        setCVDetail(detail);
      },
    });
  }, []);

  return (
    <Flex direction="column" gap="xl">
      <HeadingLayout>
        <Breadcrumbs>
          <Anchor onClick={handleNavigateToCVs}>
            {appStrings.language.cv.title}
          </Anchor>
          {cv ? cv.name : <Skeleton width={200} height={25} />}
        </Breadcrumbs>
      </HeadingLayout>
      {cv ? (
        <Stepper size="xs" active={getStepStatusActive(cv.status)}>
          <Stepper.Step label={appStrings.language.cvDetail.stepApply} />
          <Stepper.Step label={appStrings.language.cvDetail.stepAccept} />
          <Stepper.Step label={appStrings.language.cvDetail.stepInterview} />
          <Stepper.Step label={appStrings.language.cvDetail.stepHire} />
        </Stepper>
      ) : (
        <Skeleton height={50} />
      )}
      {cv ? (
        <Box pos="relative">
          <SegmentedControl
            size="xs"
            data={[
              { value: "file", label: <IconFile size="1rem" /> },
              { value: "text", label: <IconAlignLeft size="1rem" /> },
            ]}
            pos="absolute"
            inset="auto auto 10px 10px"
            onChange={(value) => setIsTextView(value === "text")}
          />
          <Paper
            withBorder
            h={500}
            style={{
              overflow: "hidden",
            }}
          >
            {isTextView ? (
              <ScrollArea p="md" h={500}>
                <Text>{cv.content}</Text>
              </ScrollArea>
            ) : (
              <FileViewer url={cv.url} />
            )}
          </Paper>
        </Box>
      ) : (
        <Skeleton height={500} />
      )}
      <Flex justify="space-between">
        {cv ? (
          <Title order={2}>{cv.name}</Title>
        ) : (
          <Skeleton width={200} height={36} />
        )}
        <Menu withinPortal shadow="md" position="top-end" width={150}>
          <Menu.Target>
            <ActionIcon variant="light" color="gray">
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown p={5}>
            <Menu.Item
              c="violet"
              leftSection={<IconSparkles size="1rem" />}
              disabled={isSummary}
              onClick={handleSummaryCV}
            >
              {appStrings.language.btn.ai}
            </Menu.Item>
            <Menu.Item
              c="gray"
              leftSection={<IconDownload size="1rem" />}
              onClick={() => handleEdit(question, index)}
            >
              {appStrings.language.btn.download}
            </Menu.Item>
            <Menu.Item c="red" leftSection={<IconTrash size="1rem" />}>
              {appStrings.language.btn.delete}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
      {cv?.summary || isSummary ? (
        <Blockquote color="violet" icon={<IconSparkles size="1rem" />}>
          {isSummary ? (
            <Flex direction="column" gap="sm">
              <Skeleton h={20} />
              <Skeleton h={20} w={200} />
            </Flex>
          ) : (
            cv?.summary
          )}
        </Blockquote>
      ) : null}
      <Flex gap="lg">
        {cv
          ? Object.entries(cv.score).map(([key, value]) => (
              <Flex direction="column" align="center">
                <RingProgress
                  label={
                    <Text>
                      <Center>{value}%</Center>
                    </Text>
                  }
                  roundCaps
                  sections={[{ value: value, color: getScoreColor(value) }]}
                />
                <Text>
                  {key === "overall"
                    ? appStrings.language.cvDetail.overall
                    : key}
                </Text>
              </Flex>
            ))
          : null}
      </Flex>
      <Flex direction="column" align="start" gap="xl" mb="xl">
        {cv
          ? Object.entries(cv.extraction).map(([key, value]) => (
              <Flex direction="column" align="start" gap="md">
                <Flex align="center" gap="md">
                  <Title order={3}>{key}</Title>
                  <Tooltip>
                    <IconInfoSquareRounded size="1rem" />
                  </Tooltip>
                </Flex>
                <Flex wrap="wrap" gap="md">
                  {Object.entries(value).map(([key, value]) => (
                    <Badge
                      color="blue"
                      radius="xl"
                      size="lg"
                      rightSection={
                        <Badge color="gray" size="md">
                          {value}
                        </Badge>
                      }
                    >
                      {key}
                    </Badge>
                  ))}
                </Flex>
              </Flex>
            ))
          : null}
      </Flex>
      <DetailTable data={cvDetail} />
    </Flex>
  );
}
