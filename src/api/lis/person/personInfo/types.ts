export interface PersonInfoVO {
  /**
   * 工号
   */
  personId: string;

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
}

export interface PersonInfoForm extends BaseEntity {
  /**
   * 工号
   */
  personId?: string;

  /**
   * 工号
   */
  empNo?: string;

  /**
   * 姓名
   */
  personName?: string;

  /**
   * 性别
   */
  gender?: string;

  /**
   * 出生日期
   */
  birthDate?: string;

  /**
   * 所在科室
   */
  deptId?: string | number;

  /**
   * 职务/职称
   */
  postId?: string | number;

  /**
   * 最高学历
   */
  education?: string;

  /**
   * 专业
   */
  major?: string;

  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 邮箱
   */
  email?: string;

  /**
   * 入职日期
   */
  hireDate?: string;

  /**
   * 状态
   */
  personStatus?: string;

  /**
   * 考核状态
   */
  examStatus?: string;

  /**
   * 关联系统用户ID，FK->sys_user
   */
  userId?: string | number;
}

export interface PersonInfoQuery extends PageQuery {
  /**
   * 工号
   */
  empNo?: string;

  /**
   * 姓名
   */
  personName?: string;

  /**
   * 性别
   */
  gender?: string;

  /**
   * 出生日期
   */
  birthDate?: string;

  /**
   * 所在科室
   */
  deptId?: string | number;

  /**
   * 职务/职称
   */
  postId?: string | number;

  /**
   * 最高学历
   */
  education?: string;

  /**
   * 专业
   */
  major?: string;

  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
