export interface PersonTrainRecordVO {
  /**
   * 人员ID
   */
  recordId: string | number;

  /**
   * 人员ID
   */
  personId: string | number;

  /**
   * 培训计划ID
   */
  planId: string | number;

  /**
   * 培训时长（小时）
   */
  hours: number;

  /**
   * 学习进度（%）
   */
  progress: number;

  /**
   * 签到时间
   */
  signInTime: string;

  /**
   * 是否已生成合格证书 Y/N
   */
  certGenerated: string;

  /**
   * 证书有效期
   */
  certExpireDate: string;
}

export interface PersonTrainRecordForm extends BaseEntity {
  /**
   * 人员ID
   */
  recordId?: string | number;

  /**
   * 人员ID
   */
  personId?: string | number;

  /**
   * 培训计划ID
   */
  planId?: string | number;

  /**
   * 培训时长（小时）
   */
  hours?: number;

  /**
   * 学习进度（%）
   */
  progress?: number;

  /**
   * 签到时间
   */
  signInTime?: string;

  /**
   * 是否已生成合格证书 Y/N
   */
  certGenerated?: string;

  /**
   * 证书有效期
   */
  certExpireDate?: string;
}

export interface PersonTrainRecordQuery extends PageQuery {
  /**
   * 人员ID
   */
  recordId?: string | number;

  /**
   * 人员ID
   */
  personId?: string | number;

  /**
   * 培训计划ID
   */
  planId?: string | number;

  /**
   * 培训时长（小时）
   */
  hours?: number;

  /**
   * 学习进度（%）
   */
  progress?: number;

  /**
   * 签到时间
   */
  signInTime?: string;

  /**
   * 是否已生成合格证书 Y/N
   */
  certGenerated?: string;

  /**
   * 证书有效期
   */
  certExpireDate?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
