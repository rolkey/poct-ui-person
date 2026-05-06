import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonExamQuestionVO, PersonExamQuestionForm, PersonExamQuestionQuery } from "./types";
import { useServiceStore } from "@/store/modules/services";

const hisPerson = () => useServiceStore().apiUrl.hisPerson;

/**
 * 查询题库列表
 * @param query
 * @returns {*}
 */

export const listPersonExamQuestion = (
  query?: PersonExamQuestionQuery,
): AxiosPromise<PersonExamQuestionVO[]> => {
  return request({
    url: `/${hisPerson()}/personExamQuestion/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询题库详细
 * @param questionId
 */
export const getPersonExamQuestion = (
  questionId: string | number,
): AxiosPromise<PersonExamQuestionVO> => {
  return request({
    url: `/${hisPerson()}/personExamQuestion/${questionId}`,
    method: "get",
  });
};

/**
 * 新增题库
 * @param data
 */
export const addPersonExamQuestion = (data: PersonExamQuestionForm) => {
  return request({
    url: `/${hisPerson()}/personExamQuestion`,
    method: "post",
    data: data,
  });
};

/**
 * 修改题库
 * @param data
 */
export const updatePersonExamQuestion = (data: PersonExamQuestionForm) => {
  return request({
    url: `/${hisPerson()}/personExamQuestion`,
    method: "put",
    data: data,
  });
};

/**
 * 删除题库
 * @param questionId
 */
export const delPersonExamQuestion = (questionId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisPerson()}/personExamQuestion/${questionId}`,
    method: "delete",
  });
};
