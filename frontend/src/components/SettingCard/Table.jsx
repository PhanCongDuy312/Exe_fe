import { Table, Flex, Input, Button, Skeleton, Loader } from "@mantine/core";
import Empty from "../Empty";
import { IconSearch } from "@tabler/icons-react";
import appStrings from "../../utils/strings";
import useSearch from "../../hooks/useSearch";

export default function TableSettingCard({
  data = [],
  loading = false,
  disableActions = false,
  onShareTap,
}) {
  function handleSearchMembers(query) {
    if (!query) {
      return data;
    }
    return data.filter((member) =>
      member[1].toLowerCase().includes(query.toLowerCase())
    );
  }

  const {
    search: currentMembers,
    isSearching,
    handleSearch,
  } = useSearch(data, handleSearchMembers);

  const tableData = {
    head: [
      appStrings.language.setting.member.member,
      appStrings.language.setting.member.email,
      appStrings.language.setting.member.role,
      appStrings.language.setting.member.actions,
    ],
    body: currentMembers,
  };

  return (
    <Flex direction="column" gap="md">
      <Flex justify="space-between">
        {!loading ? (
          <Input
            placeholder={appStrings.language.setting.member.searchPlaceholder}
            leftSection={
              isSearching ? <Loader size="1rem" /> : <IconSearch size="1rem" />
            }
            onChange={(event) => handleSearch(event.currentTarget.value)}
          />
        ) : (
          <Skeleton width={300} height={36} />
        )}
        {!disableActions ? (
          !loading ? (
            <Button onClick={onShareTap}>
              {appStrings.language.setting.member.add}
            </Button>
          ) : (
            <Skeleton width={100} height={36} />
          )
        ) : null}
      </Flex>
      {!loading ? (
        <Table
          stickyHeader
          stickyHeaderOffset={60}
          verticalSpacing="md"
          data={tableData}
        />
      ) : (
        <Skeleton height={300} />
      )}
      {!loading && !data?.length ? <Empty /> : null}
    </Flex>
  );
}
