import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useRoutes } from "react-router-dom";
import appRoutes from "./routes/routes";
import useGlobalState from "./context/global";
import customTheme from "./utils/theme";
import { useColorScheme } from "@mantine/hooks";

export default function App() {
  const theme = useGlobalState((state) => state.theme);
  const colorScheme = useColorScheme(theme);

  return (
    <MantineProvider
      theme={customTheme}
      defaultColorScheme={theme === "system" ? colorScheme : theme}
    >
      <Notifications />
      <ModalsProvider>{useRoutes(appRoutes)}</ModalsProvider>
    </MantineProvider>
  );
}
