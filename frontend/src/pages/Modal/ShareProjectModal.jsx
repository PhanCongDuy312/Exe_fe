import {
  Modal,
  Button,
  Avatar,
  Group,
  Text,
  MultiSelect,
  Flex,
  Title,
  Loader,
} from "@mantine/core";
import appStrings from "../../utils/strings";
import { useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";

const renderAutocompleteOption = ({ option, data }) => {
  const user = data.find((item) => item.email === option.value);
  return (
    <Group gap="sm">
      <Avatar src={user.avatar} size={36} radius="xl" />
      <div>
        <Text size="sm">{user.name}</Text>
        <Text size="xs" opacity={0.5}>
          {user.email}
        </Text>
      </div>
    </Group>
  );
};

export default function ShareProjectModal({
  open,
  onClose,
  onSearch,
  onShare,
}) {
  const [isSearchLoading, setSearchLoading] = useState(false);
  const [data, setData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [selected, setSelected] = useState([]);
  const handleSearch = useDebouncedCallback(async (query) => {
    if (!query) return;
    setSearchLoading(true);
    onSearch(query).then((queryData) => {
      const notDuplicateData = queryData.filter(
        (item) => !data.find((d) => d.email === item.email)
      );
      setData([...data, ...notDuplicateData]);
      const notSelectedData = queryData.filter(
        (item) => !selected.includes(item.email)
      );
      setDisplayData(notSelectedData);
      setSearchLoading(false);
    });
  }, 500);

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title={<Title order={4}>{appStrings.language.share.title}</Title>}
    >
      <Flex direction="column" gap="md">
        <MultiSelect
          data={displayData.map((item) => item.email)}
          renderOption={({ option }) =>
            renderAutocompleteOption({ option, data: displayData })
          }
          maxDropdownHeight={300}
          placeholder={appStrings.language.share.searchPlaceholder}
          searchable
          onSearchChange={handleSearch}
          leftSection={isSearchLoading && <Loader size="xs" />}
          value={selected}
          onChange={(value) => setSelected(value)}
        />
        <Flex justify="flex-end" gap="md">
          <Button variant="default" onClick={onClose}>
            {appStrings.language.btn.cancel}
          </Button>
          <Button
            onClick={() => {
              onShare &&
                onShare(data.filter((item) => selected.includes(item.email)));
              onClose();
            }}
          >
            {appStrings.language.btn.share}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
}
