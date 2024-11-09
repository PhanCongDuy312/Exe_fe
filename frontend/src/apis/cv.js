import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import appStrings from "../utils/strings";

export async function getCVsApi({ projectId, positionId, onFail, onSuccess }) {
  // Get CVs
  const response = await apiHelper.get(apiUrls.getCVs(projectId, positionId));
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

export async function getCVDetailApi({
  projectId,
  positionId,
  cvId,
  onFail,
  onSuccess,
}) {
  // Get CV detail
  const response = await apiHelper.get(
    apiUrls.getCV(projectId, positionId, cvId)
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

export async function uploadCVDataApi({
  projectId,
  positionId,
  files,
  onFail,
  onSuccess,
}) {
  // Create a FormData object
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("cvs", file);
  });
  // Send the request
  const response = await apiHelper.postFormData(
    apiUrls.uploadCV(projectId, positionId),
    formData
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

export async function uploadCVDataPublicApi({
  positionId,
  file,
  onFail,
  onSuccess,
}) {
  // Create a FormData object
  const formData = new FormData();
  formData.append("cv", file);
  // Send the request
  const response = await apiHelper.postFormData(
    apiUrls.uploadCVPublic(positionId),
    formData
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess(response.data);
  } else {
    onFail(response.detail);
  }
}

export async function watchUploadProgressApi(progressId) {
  const response = await apiHelper.get(apiUrls.watchUploadProgress(progressId));
  console.log(response.msg);
  if (response.data) {
    return response.data;
  } else {
    return null;
  }
}

export async function downloadCVDataControl({
  projectId,
  positionId,
  cvId,
  onFail,
  onSuccess,
}) {
  const response = await apiHelper.get(
    apiUrls.downloadCV(projectId, positionId, cvId)
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

export async function deleteCVDataApi({
  projectId,
  positionId,
  cvId,
  onFail,
  onSuccess,
}) {
  const response = await apiHelper.delete(
    apiUrls.deleteCV(projectId, positionId, cvId)
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess(response.data);
  } else {
    onFail(response.detail);
  }
}

export async function summaryAIApi({
  projectId,
  positionId,
  cvId,
  onFail,
  onSuccess,
}) {
  const response = await apiHelper.get(
    apiUrls.summaryCV(projectId, positionId, cvId)
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

export async function getCVKeywordDetailApi({
  projectId,
  positionId,
  cvId,
  onFail,
  onSuccess,
}) {
  const response = await apiHelper.get(
    apiUrls.detailCV(projectId, positionId, cvId)
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
