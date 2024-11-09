import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import { getCookie } from "../utils/cookie";
import appStrings from "../utils/strings";

export async function getYourProjectsApi({ onFail, onSuccess }) {
  // Get token from cookie storage
  const token = getCookie("token");
  // If no token found, call onFail callback
  if (!token) {
    onFail(appStrings.language.auth.noLogin);
    return;
  }
  // Send get request
  const params = {
    get_type: "owned",
  };
  const response = await apiHelper.get(apiUrls.getProjects, params);
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

export async function getSharedProjectsApi({ onFail, onSuccess }) {
  // Get token from cookie storage
  const token = getCookie("token");
  // If no token found, call onFail callback
  if (!token) {
    onFail(appStrings.language.auth.noLogin);
    return;
  }
  // Send get request
  const params = {
    get_type: "shared",
  };
  const response = await apiHelper.get(apiUrls.getProjects, params);
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

export async function getTrashProjectsApi({ onFail, onSuccess }) {
  // Get token from cookie storage
  const token = getCookie("token");
  // If no token found, call onFail callback
  if (!token) {
    onFail(appStrings.language.auth.noLogin);
    return;
  }
  // Send get request
  const params = {
    get_type: "deleted",
  };
  const response = await apiHelper.get(apiUrls.getProjects, params);
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
