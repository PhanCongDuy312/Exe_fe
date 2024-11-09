import { Flex, Group, Text, rem } from "@mantine/core";
import {
  IconUpload,
  IconFileTypePdf,
  IconFileTypeDocx,
  IconX,
} from "@tabler/icons-react";
import { Dropzone } from "@mantine/dropzone";
import appStrings from "../../utils/strings";

export default function UploadZone({
  onFileSelected,
  onFileRejected,
  multiple = true,
  disabled = false,
}) {
  return (
    <Dropzone
      onDrop={(files) => onFileSelected(files)}
      onReject={(files) => onFileRejected(files)}
      maxSize={5 * 1024 ** 2}
      accept={[
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]}
      maxFiles={multiple ? null : 1}
      disabled={disabled}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-blue-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{
              width: rem(52),
              height: rem(52),
              color: "var(--mantine-color-red-6)",
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <Flex align="center" gap="1rem" direction="column">
            <Flex gap="md">
              <IconFileTypePdf
                style={{
                  width: rem(36),
                  height: rem(36),
                  color: "var(--mantine-color-dimmed)",
                }}
                stroke={1.5}
              />
              <IconFileTypeDocx
                style={{
                  width: rem(36),
                  height: rem(36),
                  color: "var(--mantine-color-dimmed)",
                }}
                stroke={1.5}
              />
            </Flex>
            <div>
              <Text size="xl" inline>
                {appStrings.language.btn.drop}
              </Text>
            </div>
          </Flex>
        </Dropzone.Idle>
      </Group>
    </Dropzone>
  );
}
