export interface PersonExamVO {
  /**
   * 考试记录ID
   */
  examId: string | number;

  /**
   * 人员ID
   */
  personId: string | number;

  /**
   * 关联试卷ID（为空则操作考核不入卷）
   */
  paperId: string | number;

  /**
   * 在线考试/操作考核
   */
  examType: string;

  /**
   * 考试名称（可自动从试卷名称带出）
   */
  examName: string;

  /**
   * 总分
   */
  score: number;

  /**
   * 合格分数线（从试卷冗余存储，避免联表）
   */
  passLine: number;

  /**
   * 合格/不合格
   */
  result: string;

  /**
   * 总题数
   */
  totalQuestions: number;

  /**
   * 正确题数
   */
  correctCount: number;

  /**
   * 答题详情（JSON，记录每题的作答和评分）
   */
  answerSheet: string;

  /**
   * 答题用时（秒）
   */
  durationSeconds: number;

  /**
   * 补考次数（第几次考试）
   */
  retryCount: number;

  /**
   * 考试时间
   */
  examDate: string;

  /**
   * 合格自动授权 Y/N
   */
  autoAuthorize: string;

}

export interface PersonExamForm extends BaseEntity {
  /**
   * 考试记录ID
   */
  examId?: string | number;

  /**
   * 人员ID
   */
  personId?: string | number;

  /**
   * 关联试卷ID（为空则操作考核不入卷）
   */
  paperId?: string | number;

  /**
   * 在线考试/操作考核
   */
  examType?: string;

  /**
   * 考试名称（可自动从试卷名称带出）
   */
  examName?: string;

  /**
   * 总分
   */
  score?: number;

  /**
   * 合格分数线（从试卷冗余存储，避免联表）
   */
  passLine?: number;

  /**
   * 合格/不合格
   */
  result?: string;

  /**
   * 总题数
   */
  totalQuestions?: number;

  /**
   * 正确题数
   */
  correctCount?: number;

  /**
   * 答题详情（JSON，记录每题的作答和评分）
   */
  answerSheet?: string;

  /**
   * 答题用时（秒）
   */
  durationSeconds?: number;

  /**
   * 补考次数（第几次考试）
   */
  retryCount?: number;

  /**
   * 考试时间
   */
  examDate?: string;

  /**
   * 合格自动授权 Y/N
   */
  autoAuthorize?: string;

}

export interface PersonExamQuery extends PageQuery {

  /**
   * 人员ID
   */
  personId?: string | number;

  /**
   * 关联试卷ID（为空则操作考核不入卷）
   */
  paperId?: string | number;

  /**
   * 在线考试/操作考核
   */
  examType?: string;

  /**
   * 考试名称（可自动从试卷名称带出）
   */
  examName?: string;

  /**
   * 总分
   */
  score?: number;

  /**
   * 合格分数线（从试卷冗余存储，避免联表）
   */
  passLine?: number;

  /**
   * 合格/不合格
   */
  result?: string;

  /**
   * 总题数
   */
  totalQuestions?: number;

  /**
   * 正确题数
   */
  correctCount?: number;

  /**
   * 答题详情（JSON，记录每题的作答和评分）
   */
  answerSheet?: string;

  /**
   * 答题用时（秒）
   */
  durationSeconds?: number;

  /**
   * 补考次数（第几次考试）
   */
  retryCount?: number;

  /**
   * 考试时间
   */
  examDate?: string;

  /**
   * 合格自动授权 Y/N
   */
  autoAuthorize?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}



