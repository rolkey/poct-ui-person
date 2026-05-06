import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonExamVO, PersonExamForm, PersonExamQuery } from "./types";

/**
 * 查询考试记录列表
 * @param query
 * @returns {*}
 */

export const listPersonExam = (query?: PersonExamQuery): AxiosPromise<PersonExamVO[]> => {
  return request({
    url: "/his/personExam/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询考试记录详细
 * @param examId
 */
export const getPersonExam = (examId: string | number): AxiosPromise<PersonExamVO> => {
  return request({
    url: "/his/personExam/" + examId,
    method: "get",
  });
};

/**
 * 新增考试记录
 * @param data
 */
export const addPersonExam = (data: PersonExamForm) => {
  return request({
    url: "/his/personExam",
    method: "post",
    data: data,
  });
};

/**
 * 修改考试记录
 * @param data
 */
export const updatePersonExam = (data: PersonExamForm) => {
  return request({
    url: "/his/personExam",
    method: "put",
    data: data,
  });
};

/**
 * 删除考试记录
 * @param examId
 */
export const delPersonExam = (examId: string | number | Array<string | number>) => {
  return request({
    url: "/his/personExam/" + examId,
    method: "delete",
  });
};
