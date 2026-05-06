import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonAuthorizeItemVO, PersonAuthorizeItemForm, PersonAuthorizeItemQuery } from "./types";
import { useServiceStore } from "@/store/modules/services";

const hisPerson = () => useServiceStore().apiUrl.hisPerson;

/**
 * 查询授权明细列表
 * @param query
 * @returns {*}
 */

export const listPersonAuthorizeItem = (
  query?: PersonAuthorizeItemQuery,
): AxiosPromise<PersonAuthorizeItemVO[]> => {
  return request({
    url: `/${hisPerson()}/personAuthorizeItem/list`,
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
    url: `/${hisPerson()}/personAuthorizeItem/${itemId}`,
    method: "get",
  });
};

/**
 * 新增授权明细
 * @param data
 */
export const addPersonAuthorizeItem = (data: PersonAuthorizeItemForm) => {
  return request({
    url: `/${hisPerson()}/personAuthorizeItem`,
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
    url: `/${hisPerson()}/personAuthorizeItem`,
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
    url: `/${hisPerson()}/personAuthorizeItem/${itemId}`,
    method: "delete",
  });
};
