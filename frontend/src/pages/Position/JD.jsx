import {
  Flex,
  Title,
  Button,
  Alert,
  Group,
  FileButton,
  Skeleton,
  Badge,
  Tooltip,
  Divider,
  Box,
} from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { IconInfoSquareRounded } from "@tabler/icons-react";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import appStrings from "../../utils/strings";

import { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useNotification from "../../hooks/useNotification";
import { getJDApi, uploadJDApi } from "../../apis/jd";
import usePositionsState from "../../context/position";

export default function JDPage() {
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const positionId = location.pathname.split("/")[2];
  const position = usePositionsState((state) => state.position);
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });

  const editorController = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [jd, setJD] = useState(null);

  function handleSaveJD() {
    if (!position?.criterias?.length) {
      errorNotify({
        message: appStrings.language.jd.noCriteriaError,
      });
      return;
    }
    setIsLoading(true);
    const content = editorController?.getHTML();
    if (content === "<p></p>") {
      errorNotify({
        message: appStrings.language.jd.noContentError,
      });
      setIsLoading(false);
      return;
    }
    uploadJDApi({
      projectId,
      positionId,
      content,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setIsLoading(false);
      },
      onSuccess: (_) => {
        setIsLoading(false);
        successNotify({ message: appStrings.language.jd.saveSuccess });
      },
    });
  }

  useEffect(() => {
    getJDApi({
      projectId,
      positionId,
      onFail: (msg) => {
        errorNotify({ message: msg });
        setIsFetching(false);
      },
      onSuccess: (jd) => {
        setJD(jd);
        setIsFetching(false);
        editorController?.commands.setContent(jd?.content || "");
      },
    });
  }, [editorController]);

  return (
    <Flex direction="column" gap="md">
      <HeadingLayout>
        <Title order={1}>{appStrings.language.jd.heading}</Title>
      </HeadingLayout>
      <Alert variant="light" color="blue">
        <Group justify="space-between" align="center">
          <div>
            <Title order={4}>{appStrings.language.jd.uploadJDTitle}</Title>
            {appStrings.language.jd.uploadJDMessage}
          </div>
          <FileButton accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            {(props) => (
              <Button {...props}>{appStrings.language.jd.uploadJDBtn}</Button>
            )}
          </FileButton>
        </Group>
      </Alert>
      {isFetching ? (
        <Skeleton height={400} />
      ) : (
        <RichTextEditor editor={editorController} style={{ height: "400px" }}>
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content
            style={{ maxHeight: "calc(100% - 47px)", overflowY: "auto" }}
          />
        </RichTextEditor>
      )}
      <Flex justify="flex-end" gap="md">
        <Button
          loading={isLoading}
          onClick={handleSaveJD}
          disabled={isFetching}
        >
          {appStrings.language.btn.save}
        </Button>
      </Flex>
      {Object.keys(jd?.extraction || {}).length ? <Divider /> : null}
      <Flex direction="column" gap="xl" mb="xl">
        {jd
          ? Object.entries(jd.extraction).map(([key, value]) => (
              <Flex direction="column" gap="md">
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
    </Flex>
  );
}
