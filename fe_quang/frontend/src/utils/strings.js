import english from "../language/english";
import vietnamese from "../language/vietnamese";
import japanese from "../language/japanese";
import korean from "../language/korean";
import chinese from "../language/chinese";
import hindi from "../language/hindi";
import france from "../language/france";

function getLanguageStrings(language) {
  switch (language) {
    case "en":
      return english;
    case "vi":
      return vietnamese;
    // case "ja":
    //   return japanese;
    // case "ko":
    //   return korean;
    // case "zh":
    //   return chinese;
    // case "hi":
    //   return hindi;
    // case "fr":
    //   return france;
    default:
      return english;
  }
}

export const languageOptions = [
  { value: "en", label: "🇺🇸 English" },
  { value: "vi", label: "🇻🇳 Tiếng Việt" },
  // { value: "ja", label: "🇯🇵 日本語" },
  // { value: "ko", label: "🇰🇷 한국어" },
  // { value: "zh", label: "🇨🇳 中文" },
  // { value: "hi", label: "🇮🇳 हिन्दी" },
  // { value: "fr", label: "🇫🇷 Français" },
];

const appStrings = {
  appName: "JobFit",
  language: getLanguageStrings(localStorage.getItem("language") || "en"),
};

export default appStrings;
