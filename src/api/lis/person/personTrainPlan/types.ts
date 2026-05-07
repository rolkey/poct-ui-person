export interface PersonTrainPlanVO {
  /**
   * 计划名称
   */
  planId: string;

  /**
   * 计划名称
   */
  planName: string;

  /**
   * 年度/季度
   */
  planType: string;

  /**
   * 年度
   */
  year: number;

  /**
   * 季度
   */
  quarter: number;

  /**
   * 课程内容
   */
  courseContent: string;

  /**
   * 开始日期
   */
  startDate: string;

  /**
   * 结束日期
   */
  endDate: string;

  /**
   * 未开始/进行中/已结束
   */
  status: string;
}

export interface PersonTrainPlanForm extends BaseEntity {
  /**
   * 计划名称
   */
  planId?: string;

  /**
   * 计划名称
   */
  planName?: string;

  /**
   * 年度/季度
   */
  planType?: string;

  /**
   * 年度
   */
  year?: number;

  /**
   * 季度
   */
  quarter?: number;

  /**
   * 课程内容
   */
  courseContent?: string;

  /**
   * 开始日期
   */
  startDate?: string;

  /**
   * 结束日期
   */
  endDate?: string;

  /**
   * 未开始/进行中/已结束
   */
  status?: string;
}

export interface PersonTrainPlanQuery extends PageQuery {
  /**
   * 计划名称
   */
  planName?: string;

  /**
   * 年度/季度
   */
  planType?: string;

  /**
   * 年度
   */
  year?: number;

  /**
   * 季度
   */
  quarter?: number;

  /**
   * 课程内容
   */
  courseContent?: string;

  /**
   * 开始日期
   */
  startDate?: string;

  /**
   * 结束日期
   */
  endDate?: string;

  /**
   * 未开始/进行中/已结束
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
