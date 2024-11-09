import { Center, Flex, Title, Tooltip } from "@mantine/core";
import { IconSun, IconMoon, IconDevices } from "@tabler/icons-react";
import HeadingLayout from "../../components/Layout/HeadingLayout";
import SettingLayout from "../../components/Layout/SettingLayout";
import SelectSettingCard from "../../components/SettingCard/Select";
import DropdownSettingCard from "../../components/SettingCard/Dropdown";
import appStrings, { languageOptions } from "../../utils/strings";

import { useState } from "react";
import useGlobalState from "../../context/global";

export default function SettingPage() {
  const theme = useGlobalState((state) => state.theme);
  const language = useGlobalState((state) => state.language);
  const [currentTheme, setTheme] = useState(theme);
  const [currentLanguage, setLanguage] = useState(language);

  function handleSetTheme(value) {
    localStorage.setItem("theme", value);
    setTheme(value);
  }

  function handleSetLanguage(value) {
    localStorage.setItem("language", value);
    setLanguage(value);
  }

  return (
    <Flex direction="column" gap="md">
      <HeadingLayout>
        <Title order={2}>{appStrings.language.setting.heading}</Title>
      </HeadingLayout>
      <SettingLayout title={appStrings.language.setting.general.title}>
        <SelectSettingCard
          title={appStrings.language.setting.general.theme}
          warning={
            currentTheme !== theme
              ? appStrings.language.setting.requiredRestart
              : null
          }
          options={[
            {
              value: "light",
              label: (
                <Center>
                  <Tooltip label={appStrings.language.utils.theme.light}>
                    <IconSun size="1rem" />
                  </Tooltip>
                </Center>
              ),
            },
            {
              value: "dark",
              label: (
                <Center>
                  <Tooltip label={appStrings.language.utils.theme.dark}>
                    <IconMoon size="1rem" />
                  </Tooltip>
                </Center>
              ),
            },
            {
              value: "system",
              label: (
                <Center>
                  <Tooltip label={appStrings.language.utils.theme.system}>
                    <IconDevices size="1rem" />
                  </Tooltip>
                </Center>
              ),
            },
          ]}
          value={currentTheme}
          onChange={(value) => handleSetTheme(value)}
        />
        <DropdownSettingCard
          title={appStrings.language.setting.general.language}
          warning={
            currentLanguage !== language
              ? appStrings.language.setting.requiredRestart
              : null
          }
          options={languageOptions}
          value={currentLanguage}
          onChange={(value) => handleSetLanguage(value)}
        />
      </SettingLayout>
    </Flex>
  );
}
