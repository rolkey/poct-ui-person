import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonExamPaperVO, PersonExamPaperForm, PersonExamPaperQuery } from "./types";
import { useServiceStore } from "@/store/modules/services";

const hisPerson = () => useServiceStore().apiUrl.hisPerson;

/**
 * 查询试卷列表
 * @param query
 * @returns {*}
 */

export const listPersonExamPaper = (
  query?: PersonExamPaperQuery,
): AxiosPromise<PersonExamPaperVO[]> => {
  return request({
    url: `/${hisPerson()}/personExamPaper/list`,
    method: "get",
    params: query,
  });
};

/**
 * 查询试卷详细
 * @param paperId
 */
export const getPersonExamPaper = (paperId: string | number): AxiosPromise<PersonExamPaperVO> => {
  return request({
    url: `/${hisPerson()}/personExamPaper/${paperId}`,
    method: "get",
  });
};

/**
 * 新增试卷
 * @param data
 */
export const addPersonExamPaper = (data: PersonExamPaperForm) => {
  return request({
    url: `/${hisPerson()}/personExamPaper`,
    method: "post",
    data: data,
  });
};

/**
 * 修改试卷
 * @param data
 */
export const updatePersonExamPaper = (data: PersonExamPaperForm) => {
  return request({
    url: `/${hisPerson()}/personExamPaper`,
    method: "put",
    data: data,
  });
};

/**
 * 删除试卷
 * @param paperId
 */
export const delPersonExamPaper = (paperId: string | number | Array<string | number>) => {
  return request({
    url: `/${hisPerson()}/personExamPaper/${paperId}`,
    method: "delete",
  });
};
