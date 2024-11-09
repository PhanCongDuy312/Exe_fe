import logo from "../../assets/JobFit.jpg";
import logow from "../../assets/JobFit.jpg";
import { Flex, Title } from "@mantine/core";
import useGlobalState from "../../context/global";
import appStrings from "../../utils/strings";

export default function Logo({ size = 40, onTap, variant = "auto" }) {
  let theme = useGlobalState((state) => state.theme);

  if (variant === "dark") {
    theme = "dark";
  } else if (variant === "light") {
    theme = "light";
  }

  return (
    <Flex
      align="center"
      gap={10}
      onClick={onTap}
      style={{
        cursor: "pointer",
      }}
    >
      <img
        src={theme === "dark" ? logow : logo}
        alt="logo"
        style={{ width: size, height: size }}
      />
      <Title
        ff="Oswald, sans serif"
        order={3}
        c={theme === "dark" ? "#fff" : "#000"}
      >
        {appStrings.appName}
      </Title>
    </Flex>
  );
}
