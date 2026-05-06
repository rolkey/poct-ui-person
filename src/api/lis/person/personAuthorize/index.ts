import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonAuthorizeVO, PersonAuthorizeForm, PersonAuthorizeQuery } from "./types";

/**
 * 查询授权记录列表
 * @param query
 * @returns {*}
 */

export const listPersonAuthorize = (
  query?: PersonAuthorizeQuery,
): AxiosPromise<PersonAuthorizeVO[]> => {
  return request({
    url: "/his/personAuthorize/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询授权记录详细
 * @param authId
 */
export const getPersonAuthorize = (authId: string | number): AxiosPromise<PersonAuthorizeVO> => {
  return request({
    url: "/his/personAuthorize/" + authId,
    method: "get",
  });
};

/**
 * 新增授权记录
 * @param data
 */
export const addPersonAuthorize = (data: PersonAuthorizeForm) => {
  return request({
    url: "/his/personAuthorize",
    method: "post",
    data: data,
  });
};

/**
 * 修改授权记录
 * @param data
 */
export const updatePersonAuthorize = (data: PersonAuthorizeForm) => {
  return request({
    url: "/his/personAuthorize",
    method: "put",
    data: data,
  });
};

/**
 * 删除授权记录
 * @param authId
 */
export const delPersonAuthorize = (authId: string | number | Array<string | number>) => {
  return request({
    url: "/his/personAuthorize/" + authId,
    method: "delete",
  });
};
