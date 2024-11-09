import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import appStrings from "../utils/strings";

export async function getJDApi({ projectId, positionId, onFail, onSuccess }) {
  // Send get request
  const response = await apiHelper.get(apiUrls.getJD(projectId, positionId));
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    if (response.data) {
      onSuccess(response.data);
    } else {
      onFail(appStrings.language.utils.noDataFound);
    }
  } else {
    onFail(response.detail);
  }
}

export async function uploadJDApi({
  projectId,
  positionId,
  content,
  onFail,
  onSuccess,
}) {
  // Send post request
  const data = {
    content: content,
  };
  const response = await apiHelper.put(
    apiUrls.uploadJD(projectId, positionId),
    data
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess(response.data);
  } else {
    onFail(response.detail);
  }
}
