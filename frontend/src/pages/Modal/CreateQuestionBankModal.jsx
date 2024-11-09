import { Modal, Title, TextInput, Flex, Group, Button } from "@mantine/core";
import appStrings from "../../utils/strings";

import { useState } from "react";

export default function CreateQuestionBankModal({
  title,
  open,
  onClose,
  loading,
  onOk,
}) {
  const [bankName, setBankName] = useState("");

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title={<Title order={4}>{title}</Title>}
    >
      <Group gap="lg">
        <TextInput
          label={appStrings.language.questionBanks.nameLabel}
          placeholder={appStrings.language.questionBanks.nameLabel}
          style={{ width: "100%" }}
          onChange={(e) => setBankName(e.target.value)}
          value={bankName}
          required
        />
      </Group>
      <Flex justify="flex-end" gap="md" style={{ marginTop: "20px" }}>
        <Button variant="default" onClick={onClose}>
          {appStrings.language.btn.cancel}
        </Button>
        <Button onClick={() => onOk(bankName)} loading={loading}>
          {appStrings.language.btn.create}
        </Button>
      </Flex>
    </Modal>
  );
}
