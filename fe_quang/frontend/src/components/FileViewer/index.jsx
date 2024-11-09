import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Title } from "@mantine/core";
import appStrings from "../../utils/strings";

export default function FileViewer({ url }) {
  const fileExtension = url.split(".").pop();
  if (fileExtension === "pdf" || fileExtension === "PDF") {
    return (
      <iframe
        src={url}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    );
  } else if (fileExtension === "docx" || fileExtension === "DOCX") {
    return (
      <DocViewer
        documents={[{ uri: url, fileType: "docx" }]}
        pluginRenderers={DocViewerRenderers}
      />
    );
  } else {
    return (
      <Title order={4} p="md">
        {appStrings.language.utils.unsupportFile}
      </Title>
    );
  }
}
