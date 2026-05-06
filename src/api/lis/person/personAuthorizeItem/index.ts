import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonAuthorizeItemVO, PersonAuthorizeItemForm, PersonAuthorizeItemQuery } from "./types";

/**
 * 查询授权明细列表
 * @param query
 * @returns {*}
 */

export const listPersonAuthorizeItem = (
  query?: PersonAuthorizeItemQuery,
): AxiosPromise<PersonAuthorizeItemVO[]> => {
  return request({
    url: "/his/personAuthorizeItem/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询授权明细详细
 * @param itemId
 */
export const getPersonAuthorizeItem = (
  itemId: string | number,
): AxiosPromise<PersonAuthorizeItemVO> => {
  return request({
    url: "/his/personAuthorizeItem/" + itemId,
    method: "get",
  });
};

/**
 * 新增授权明细
 * @param data
 */
export const addPersonAuthorizeItem = (data: PersonAuthorizeItemForm) => {
  return request({
    url: "/his/personAuthorizeItem",
    method: "post",
    data: data,
  });
};

/**
 * 修改授权明细
 * @param data
 */
export const updatePersonAuthorizeItem = (data: PersonAuthorizeItemForm) => {
  return request({
    url: "/his/personAuthorizeItem",
    method: "put",
    data: data,
  });
};

/**
 * 删除授权明细
 * @param itemId
 */
export const delPersonAuthorizeItem = (itemId: string | number | Array<string | number>) => {
  return request({
    url: "/his/personAuthorizeItem/" + itemId,
    method: "delete",
  });
};
