import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import appStrings from "../utils/strings";

export async function getMatchApi({
  projectId,
  positionId,
  limit,
  threshold,
  onFail,
  onSuccess,
}) {
  const query = {
    limit,
    threshold,
  };
  // Get match
  const response = await apiHelper.get(
    apiUrls.matchCVJD(projectId, positionId),
    query
  );
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
