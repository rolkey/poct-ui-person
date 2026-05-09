export interface CertSummary {
  certId: string | number;
  certType: string;
  certName: string;
  certNo: string;
  issuer: string;
  issueDate: string;
  expireDate: string;
  certStatus: string;
}

export interface AuthorizeSummary {
  authorizeId: string | number;
  authorizeType: string;
  authorizeStatus: string;
  authorizeDate: string;
  expireDate: string;
}

export interface PersonProfileVO {
  /**
   * 人员ID
   */
  personId: string | number;

  /**
   * 工号
   */
  empNo: string;

  /**
   * 姓名
   */
  personName: string;

  /**
   * 性别
   */
  gender: string;

  /**
   * 出生日期
   */
  birthDate: string;

  /**
   * 所在科室
   */
  deptId: string | number;

  /**
   * 职务/职称
   */
  postId: string | number;

  /**
   * 最高学历
   */
  education: string;

  /**
   * 专业
   */
  major: string;

  /**
   * 联系电话
   */
  phone: string;

  /**
   * 邮箱
   */
  email: string;

  /**
   * 入职日期
   */
  hireDate: string;

  /**
   * 状态
   */
  personStatus: string;

  /**
   * 考核状态
   */
  examStatus: string;

  /**
   * 证书数量
   */
  certCount: number;

  /**
   * 授权数量
   */
  authorizeCount: number;

  /**
   * 考试次数
   */
  examCount: number;

  /**
   * 培训记录数
   */
  trainRecordCount: number;

  /**
   * 证书摘要列表
   */
  certSummary: CertSummary[];

  /**
   * 授权摘要列表
   */
  authorizeSummary: AuthorizeSummary[];

  /**
   * 最近考试结果
   */
  latestExamResult: string;
}

export interface PersonProfileQuery extends PageQuery {
  empNo?: string;
  personName?: string;
  deptId?: string | number;
  education?: string;
  personStatus?: string;
  examStatus?: string;
  params?: any;
}
