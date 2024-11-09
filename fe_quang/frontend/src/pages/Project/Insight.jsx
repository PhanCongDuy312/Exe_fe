import visual from "../../assets/insight-vis.png";
import { Flex, Image, Title, Text, Select, Button } from "@mantine/core";
import appStrings from "../../utils/strings";

import { getPositionsApi } from "../../apis/positions";
import { useLocation } from "react-router-dom";
import usePositionsState from "../../context/position";
import useNotification from "../../hooks/useNotification";
import { useEffect, useState } from "react";

export default function InsightsPage() {
  const location = useLocation();
  const projectId = location.pathname.split("/")[1];
  const positions = usePositionsState((state) => state.positions);
  const setPositions = usePositionsState((state) => state.setPositions);
  const errorNotify = useNotification({ type: "error" });
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    if (!positions) {
      getPositionsApi({
        id: projectId,
        onFail: (msg) => {
          errorNotify({ message: msg });
          setPositions([]);
          navigate("/404");
        },
        onSuccess: (positions) => {
          setPositions(positions);
        },
      });
    }
  }, [setPositions]);

  return (
    <Flex direction="column" align="center" mt="lg" gap="lg">
      <Image src={visual} alt="Insight visual" w={350} p="xl" />
      <Title order={2}>{appStrings.language.insight.heading}</Title>
      <Text w={500} align="center">
        {appStrings.language.insight.introduction}
      </Text>
      <Select
        defaultValue={selectedPosition}
        data={positions?.map((position) => ({
          value: position.id,
          label: position.name,
        }))}
        placeholder={appStrings.language.insight.selectPlaceholder}
        value={selectedPosition}
        onChange={(value) => setSelectedPosition(value)}
      />
      {selectedPosition ? (
        <Button>{appStrings.language.insight.viewInsightBtn}</Button>
      ) : null}
    </Flex>
  );
}
