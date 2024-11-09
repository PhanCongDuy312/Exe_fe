import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import appStrings from "../utils/strings";
import { getCookie, setCookie, removeCookie } from "../utils/cookie";

export async function loginApi({ accessToken, onFail, onSuccess }) {
  // Remove current token
  removeCookie("token");
  // Send login request
  const response = await apiHelper.post(apiUrls.login, {
    gtoken: accessToken,
  });
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    if (response?.data?.token) {
      // Set cookies
      setCookie("token", response.data.token);
      // Set token to apiHelper
      apiHelper.addToken(response.data.token);
      // Call onSuccess callback
      onSuccess();
    } else {
      // Call onFail callback
      onFail(appStrings.language.utils.noDataFound);
    }
  } else {
    // Call onFail callback
    onFail(response.detail);
  }
}

export async function logoutApi({ onFail, onSuccess }) {
  // Remove token from cookie storage
  removeCookie("token");
  // Send logout request
  const response = await apiHelper.post(apiUrls.logout);
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess();
    window.location.reload();
  } else {
    onFail(response.detail);
  }
}

export async function getCurrentUserApi({ user, onFail, onSuccess }) {
  if (user) {
    onSuccess(user);
    return;
  }
  // Get token from cookie storage
  const token = getCookie("token");
  // If no token found, call onFail callback
  if (!token) {
    // onFail(appStrings.language.auth.noLogin);
    return;
  }
  // Send getMe request
  const response = await apiHelper.get(apiUrls.getMe);
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess(response.data);
  } else {
    onFail(response.detail);
  }
}
