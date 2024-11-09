import {
  Text,
  Center,
  Container,
  Loader,
  Title,
  Box,
  Spoiler,
  Divider,
  Flex,
  Badge,
  Button,
} from "@mantine/core";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { getPublicPositionApi } from "../../apis/positions";
import UploadZone from "../../components/Upload/UploadZone";
import Logo from "../../components/Logo";
import appStrings from "../../utils/strings";

import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEditor } from "@tiptap/react";
import useNotification from "../../hooks/useNotification";
import { uploadCVDataPublicApi } from "../../apis/cv";

export default function UploadPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const positionId = location.pathname.split("/").pop();
  const editor = useEditor({
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
  const errorNotify = useNotification({ type: "error" });
  const successNotify = useNotification({ type: "success" });
  const [isUploadedOnce, setIsUploadedOnce] = useState(
    localStorage.getItem("isUploadedId") === positionId
  );

  function handleResubmitTap() {
    setIsUploadedOnce(false);
    localStorage.setItem("isUploadedId", "");
  }

  function handleUpload(file) {
    uploadCVDataPublicApi({
      positionId,
      file,
      onFail: (msg) => errorNotify({ message: msg }),
      onSuccess: (_) => {
        successNotify({
          title: appStrings.language.cv.uploadSuccessTitle,
          message: appStrings.language.cv.uploadSuccessMessage,
        });
        setIsUploadedOnce(true);
        localStorage.setItem("isUploadedId", positionId);
      },
    });
  }

  useEffect(() => {
    getPublicPositionApi({
      positionId,
      onFail: (_) => navigate("/404"),
      onSuccess: (data) => {
        setPosition(data);
        editor?.commands.setContent(data.jd.content);
      },
    });
  }, [editor]);

  return (
    <Center>
      {!position ? (
        <Center w="100vw" h="100vh">
          <Loader />
        </Center>
      ) : (
        <Container
          style={{
            maxWidth: "800px",
            width: "100%",
          }}
          mb="xl"
        >
          <Box mt="lg">
            <Logo size={30} />
          </Box>
          <Divider mt="md" />
          <Flex align="center" justify="space-between">
            <Title order={1} mt="lg" mb="md">
              {position.name}
            </Title>
            <Badge
              variant="light"
              color={position.is_closed ? "red" : "green"}
              style={{ marginLeft: 20 }}
              size="lg"
            >
              {position.is_closed
                ? appStrings.language.positionDetail.closedLabel
                : appStrings.language.positionDetail.activeLabel}
            </Badge>
          </Flex>
          <Text mb="lg">{position.description}</Text>
          <Divider mt="md" />
          {isUploadedOnce ? (
            <Flex direction="column" align="start">
              <Title order={3} mt="lg" mb="md">
                {appStrings.language.cv.thanksForUploading}
              </Title>
              <Button onClick={handleResubmitTap}>
                {appStrings.language.cv.resubmitBtn}
              </Button>
            </Flex>
          ) : (
            <Flex direction="column">
              <Title order={4} mt="lg" mb="md">
                {appStrings.language.jd.heading}
              </Title>
              <Spoiler
                hideLabel={appStrings.language.jd.hideJD}
                showLabel={appStrings.language.jd.showJD}
                maxHeight={0}
                initialState={true}
              >
                <RichTextEditor
                  editor={editor}
                  h={400}
                  style={{ overflow: "hidden" }}
                >
                  <RichTextEditor.Content
                    style={{ maxHeight: "400px", overflowY: "auto" }}
                  />
                </RichTextEditor>
              </Spoiler>
              <Title order={4} mt="xl" mb="md">
                {appStrings.language.cv.uploadCVPublic}
              </Title>
              <UploadZone
                multiple={false}
                onFileRejected={(_) =>
                  errorNotify({ message: appStrings.language.cv.limitExceeded })
                }
                onFileSelected={(files) => handleUpload(files[0])}
                disabled={position.is_closed}
              />
            </Flex>
          )}
        </Container>
      )}
    </Center>
  );
}
