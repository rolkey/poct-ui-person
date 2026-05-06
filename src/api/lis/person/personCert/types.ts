export interface PersonCertVO {
  /**
   * 人员ID
   */
  personId: string | number;

  /**
   * 证书类型：执业医师/护士/技术资格/POCT专项/仪器认证
   */
  certType: string;

  /**
   * 证书名称
   */
  certName: string;

  /**
   * 证书编号
   */
  certNo: string;

  /**
   * 发证机构
   */
  issuer: string;

  /**
   * 发证日期
   */
  issueDate: string;

  /**
   * 有效期至
   */
  expireDate: string;

  /**
   * 附件路径（图片/PDF）
   */
  certFile: string;

  /**
   * 有效/即将到期/已过期
   */
  certStatus: string;

}

export interface PersonCertForm extends BaseEntity {
  /**
   * 人员ID
   */
  personId?: string | number;

  /**
   * 证书类型：执业医师/护士/技术资格/POCT专项/仪器认证
   */
  certType?: string;

  /**
   * 证书名称
   */
  certName?: string;

  /**
   * 证书编号
   */
  certNo?: string;

  /**
   * 发证机构
   */
  issuer?: string;

  /**
   * 发证日期
   */
  issueDate?: string;

  /**
   * 有效期至
   */
  expireDate?: string;

  /**
   * 附件路径（图片/PDF）
   */
  certFile?: string;

  /**
   * 有效/即将到期/已过期
   */
  certStatus?: string;

}

export interface PersonCertQuery extends PageQuery {

  /**
   * 证书类型：执业医师/护士/技术资格/POCT专项/仪器认证
   */
  certType?: string;

  /**
   * 证书名称
   */
  certName?: string;

  /**
   * 证书编号
   */
  certNo?: string;

  /**
   * 发证机构
   */
  issuer?: string;

  /**
   * 发证日期
   */
  issueDate?: string;

  /**
   * 有效/即将到期/已过期
   */
  certStatus?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}



