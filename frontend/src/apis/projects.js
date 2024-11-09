import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import appStrings from "../utils/strings";

export async function getProjectByIdApi({ id, onFail, onSuccess }) {
  const response = await apiHelper.get(apiUrls.getProject(id));
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

export async function createProjectApi({
  name,
  alias,
  description,
  onFail,
  onSuccess,
}) {
  // Send post request
  const data = {
    name,
    alias,
    description,
  };
  const response = await apiHelper.post(apiUrls.createProject, data);
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

export async function deleteProjectApi({ id, onFail, onSuccess }) {
  // Send delete request
  const response = await apiHelper.delete(apiUrls.deleteProject(id));
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess();
  } else {
    onFail(response.detail);
  }
}

export async function deletePermanentlyProjectApi({ id, onFail, onSuccess }) {
  // Send delete request
  const response = await apiHelper.delete(apiUrls.deletePermanentlyProject(id));
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess();
  } else {
    onFail(response.detail);
  }
}

export async function restoreProjectApi({ id, onFail, onSuccess }) {
  // Send put request
  const response = await apiHelper.put(apiUrls.restoreProject(id));
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess();
  } else {
    onFail(response.detail);
  }
}

export async function shareProjectApi({ ids, projectId, onFail, onSuccess }) {
  // Send post request
  const data = {
    members: ids,
    is_add: true,
  };
  const response = await apiHelper.put(apiUrls.shareProject(projectId), data);
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess();
  } else {
    onFail(response.detail);
  }
}

export async function removeAccessApi({ ids, projectId, onFail, onSuccess }) {
  // Send post request
  const data = {
    members: ids,
    is_add: false,
  };
  const response = await apiHelper.put(apiUrls.shareProject(projectId), data);
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess();
  } else {
    onFail(response.detail);
  }
}
