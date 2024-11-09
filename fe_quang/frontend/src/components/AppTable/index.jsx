import { Table, Pagination, Flex, NumberInput, Skeleton } from "@mantine/core";
import Empty from "../Empty";
import { useState } from "react";

/**
 * Wrapper AppTable component
 * @param {Object[]} columns Table columns
 * Table columns object:
 * ```js
 * {
 *  key: string,
 *  label: string,
 * }
 * ```
 * @param {Object[]} data Table data
 * Table data object:
 * ```js
 * {
 * key: string,
 * }
 * ```
 * @param {number} pageSize Table page size
 * @returns {JSX.Element} AppTable component
 */
export default function AppTable({
  columns,
  data,
  pageSize = 10,
  loading = false,
}) {
  const [page, setPage] = useState(1);
  const [tablePageSize, setTablePageSize] = useState(pageSize);

  return (
    <Flex direction="column" gap="md" align="end">
      <Table stickyHeader stickyHeaderOffset={60} verticalSpacing="md">
        <Table.Thead>
          <Table.Tr>
            {columns.map((column, index) => (
              <Table.Th key={index}>{column.label}</Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        {!loading ? (
          <Table.Tbody>
            {data
              .slice(
                (page - 1) * tablePageSize,
                (page - 1) * tablePageSize + tablePageSize
              )
              .map((row, index) => (
                <Table.Tr key={index}>
                  {columns.map((column, index) => (
                    <Table.Td key={index}>{row[column.key]}</Table.Td>
                  ))}
                </Table.Tr>
              ))}
          </Table.Tbody>
        ) : (
          Array.from({ length: tablePageSize }).map((_, index) => (
            <Table.Tr key={index}>
              {columns.map((_, index) => (
                <Table.Td key={index}>
                  <Skeleton key={index} height={30} />
                </Table.Td>
              ))}
            </Table.Tr>
          ))
        )}
      </Table>
      {!loading && data?.length ? (
        <Flex align="center" gap="md">
          <NumberInput
            value={tablePageSize}
            onChange={setTablePageSize}
            w="5rem"
            min={1}
            max={data.length}
          />
          <Pagination
            total={Math.ceil(data.length / tablePageSize)}
            onChange={(p) => setPage(p)}
            withEdges
            radius="md"
          />
        </Flex>
      ) : !loading ? (
        <Flex direction="column" w="100%">
          <Empty />
        </Flex>
      ) : null}
    </Flex>
  );
}
