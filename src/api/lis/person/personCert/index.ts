import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { PersonCertVO, PersonCertForm, PersonCertQuery } from "./types";
import { useServiceStore } from "@/store/modules/services";

const hisPerson = () => useServiceStore().apiUrl.hisPerson;

/**
 * 查询资质证书列表
 * @param query
 * @returns {*}
 */

export const listPersonCert = (query?: PersonCertQuery): AxiosPromise<PersonCertVO[]> => {
  return request({
    url: `/${hisPerson()}/personCert/list`,
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
    url: `/${hisPerson()}/personCert/${certId}`,
    method: "get",
  });
};

/**
 * 新增资质证书
 * @param data
 */
export const addPersonCert = (data: PersonCertForm) => {
  return request({
    url: `/${hisPerson()}/personCert`,
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
    url: `/${hisPerson()}/personCert`,
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
    url: `/${hisPerson()}/personCert/${certId}`,
    method: "delete",
  });
};

/**
 * 上传证书文件
 * @param data
 */
export const uploadCertFile = (data: FormData) =>
  request({url: `/${hisPerson()}/personCert/upload`, method: "post", data, headers: {"Content-Type": "multipart/form-data"}});

/**
 * 查询即将到期证书列表
 * @param query
 */
export const expiringCertList = (query?: any) =>
  request({url: `/${hisPerson()}/personCert/expiring`, method: "get", params: query});
