import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonCertVO, PersonCertForm, PersonCertQuery } from "./types";

/**
 * 查询资质证书列表
 * @param query
 * @returns {*}
 */

export const listPersonCert = (query?: PersonCertQuery): AxiosPromise<PersonCertVO[]> => {
  return request({
    url: "/his/personCert/list",
    method: "get",
    params: query,
  });
};

/**
 * 查询资质证书详细
 * @param certId
 */
export const getPersonCert = (certId: string | number): AxiosPromise<PersonCertVO> => {
  return request({
    url: "/his/personCert/" + certId,
    method: "get",
  });
};

/**
 * 新增资质证书
 * @param data
 */
export const addPersonCert = (data: PersonCertForm) => {
  return request({
    url: "/his/personCert",
    method: "post",
    data: data,
  });
};

/**
 * 修改资质证书
 * @param data
 */
export const updatePersonCert = (data: PersonCertForm) => {
  return request({
    url: "/his/personCert",
    method: "put",
    data: data,
  });
};

/**
 * 删除资质证书
 * @param certId
 */
export const delPersonCert = (certId: string | number | Array<string | number>) => {
  return request({
    url: "/his/personCert/" + certId,
    method: "delete",
  });
};
