export interface PersonExamPaperVO {
  /**
   * 试卷名称
   */
  paperName: string;

  /**
   * 试卷总分（各题分值之和）
   */
  totalScore: number;

  /**
   * 合格分数线
   */
  passLine: number;

  /**
   * 题目总数
   */
  questionCount: number;

  /**
   * 考试时长（分钟）
   */
  durationMinutes: number;

  /**
   * 组卷策略（JSON，记录组卷时的参数快照）
   */
  strategy: string;

  /**
   * 未发布/已发布/已作废
   */
  status: string;

  /**
   * 自动组卷/手动组卷
   */
  generateType: string;

  /**
   * 发布日期
   */
  publishDate: string;

}

export interface PersonExamPaperForm extends BaseEntity {
  /**
   * 试卷名称
   */
  paperName?: string;

  /**
   * 试卷总分（各题分值之和）
   */
  totalScore?: number;

  /**
   * 合格分数线
   */
  passLine?: number;

  /**
   * 题目总数
   */
  questionCount?: number;

  /**
   * 考试时长（分钟）
   */
  durationMinutes?: number;

  /**
   * 组卷策略（JSON，记录组卷时的参数快照）
   */
  strategy?: string;

  /**
   * 未发布/已发布/已作废
   */
  status?: string;

  /**
   * 自动组卷/手动组卷
   */
  generateType?: string;

  /**
   * 发布日期
   */
  publishDate?: string;

}

export interface PersonExamPaperQuery extends PageQuery {

  /**
   * 试卷名称
   */
  paperName?: string;

  /**
   * 试卷总分（各题分值之和）
   */
  totalScore?: number;

  /**
   * 合格分数线
   */
  passLine?: number;

  /**
   * 题目总数
   */
  questionCount?: number;

  /**
   * 考试时长（分钟）
   */
  durationMinutes?: number;

  /**
   * 组卷策略（JSON，记录组卷时的参数快照）
   */
  strategy?: string;

  /**
   * 未发布/已发布/已作废
   */
  status?: string;

  /**
   * 自动组卷/手动组卷
   */
  generateType?: string;

  /**
   * 发布日期
   */
  publishDate?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}



