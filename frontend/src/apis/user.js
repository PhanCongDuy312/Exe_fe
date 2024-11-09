import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";

export async function findUsersByEmailApi(query) {
  const response = await apiHelper.get(apiUrls.findUser, { query });
  if (response?.data) {
    return response.data;
  } else {
    return [];
  }
}
