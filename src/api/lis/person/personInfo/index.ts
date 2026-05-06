import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonInfoVO, PersonInfoForm, PersonInfoQuery } from "./types";

/**
 * 查询人员基础信息列表
 * @param query
 * @returns {*}
 */

export const listPersonInfo = (query?: PersonInfoQuery): AxiosPromise<PersonInfoVO[]> => {
  return request({
    url: "/his/personInfo/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询人员基础信息详细
 * @param personId
 */
export const getPersonInfo = (personId: string | number): AxiosPromise<PersonInfoVO> => {
  return request({
    url: "/his/personInfo/" + personId,
    method: "get",
  });
};

/**
 * 新增人员基础信息
 * @param data
 */
export const addPersonInfo = (data: PersonInfoForm) => {
  return request({
    url: "/his/personInfo",
    method: "post",
    data: data,
  });
};

/**
 * 修改人员基础信息
 * @param data
 */
export const updatePersonInfo = (data: PersonInfoForm) => {
  return request({
    url: "/his/personInfo",
    method: "put",
    data: data,
  });
};

/**
 * 删除人员基础信息
 * @param personId
 */
export const delPersonInfo = (personId: string | number | Array<string | number>) => {
  return request({
    url: "/his/personInfo/" + personId,
    method: "delete",
  });
};
