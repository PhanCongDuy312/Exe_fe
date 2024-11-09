import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import appStrings from "../utils/strings";

export async function getQuestionBanksApi({
  projectId,
  positionId,
  onFail,
  onSuccess,
}) {
  const response = await apiHelper.get(
    apiUrls.getQuestionBanks(projectId, positionId)
  );
  if (response.msg) {
    if (response.data) {
      onSuccess(response.data);
    } else {
      onFail(appStrings.language.utils.noDataFound);
    }
  } else {
    onFail(response.detail);
  }
}

export async function getQuestionBankByIdApi({
  projectId,
  positionId,
  bankId,
  onFail,
  onSuccess,
}) {
  const response = await apiHelper.get(
    apiUrls.getQuestionBank(projectId, positionId, bankId)
  );
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

export async function createQuestionBankApi({
  projectId,
  positionId,
  name,
  onFail,
  onSuccess,
}) {
  const response = await apiHelper.post(
    apiUrls.createQuestionBank(projectId, positionId),
    { name }
  );
  if (response.msg) {
    onSuccess(response.data);
  } else {
    onFail(response.detail);
  }
}

export async function updateQuestionBankApi({
  projectId,
  positionId,
  bankId,
  questions,
  onFail,
  onSuccess,
}) {
  console.log(
    JSON.stringify({
      questions: questions.map((question) => ({
        content: question.content,
        answer: question.answer,
        correct_answer: question.correctAnswer,
      })),
    })
  );
  const response = await apiHelper.put(
    apiUrls.updateQuestionBank(projectId, positionId, bankId),
    {
      questions: questions.map((question) => ({
        content: question.content,
        answer: question.answer,
        correct_answer: question.correctAnswer,
      })),
    }
  );
  if (response.msg) {
    onSuccess();
  } else {
    onFail(response.detail);
  }
}

export async function deleteQuestionBankApi({
  projectId,
  positionId,
  bankId,
  onFail,
  onSuccess,
}) {
  const response = await apiHelper.delete(
    apiUrls.deleteQuestionBank(projectId, positionId, bankId)
  );
  if (response.msg) {
    onSuccess();
  } else {
    onFail(response.detail);
  }
}
