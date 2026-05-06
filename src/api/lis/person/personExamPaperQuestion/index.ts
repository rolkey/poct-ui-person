import request from "@/utils/request";
import { AxiosPromise } from "axios";
import {
  PersonExamPaperQuestionVO,
  PersonExamPaperQuestionForm,
  PersonExamPaperQuestionQuery,
} from "./types";

/**
 * 查询试卷题目关联列表
 * @param query
 * @returns {*}
 */

export const listPersonExamPaperQuestion = (
  query?: PersonExamPaperQuestionQuery,
): AxiosPromise<PersonExamPaperQuestionVO[]> => {
  return request({
    url: "/his/personExamPaperQuestion/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询试卷题目关联详细
 * @param id
 */
export const getPersonExamPaperQuestion = (
  id: string | number,
): AxiosPromise<PersonExamPaperQuestionVO> => {
  return request({
    url: "/his/personExamPaperQuestion/" + id,
    method: "get",
  });
};

/**
 * 新增试卷题目关联
 * @param data
 */
export const addPersonExamPaperQuestion = (data: PersonExamPaperQuestionForm) => {
  return request({
    url: "/his/personExamPaperQuestion",
    method: "post",
    data: data,
  });
};

/**
 * 修改试卷题目关联
 * @param data
 */
export const updatePersonExamPaperQuestion = (data: PersonExamPaperQuestionForm) => {
  return request({
    url: "/his/personExamPaperQuestion",
    method: "put",
    data: data,
  });
};

/**
 * 删除试卷题目关联
 * @param id
 */
export const delPersonExamPaperQuestion = (id: string | number | Array<string | number>) => {
  return request({
    url: "/his/personExamPaperQuestion/" + id,
    method: "delete",
  });
};
