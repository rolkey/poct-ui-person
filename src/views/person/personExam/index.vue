<template>
  <div class="showFull p-2 flex flex-col">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="人员ID" prop="personId">
              <el-input v-model="queryParams.personId" placeholder="请输入人员ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="关联试卷ID" prop="paperId">
              <el-input v-model="queryParams.paperId" placeholder="请输入关联试卷ID" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="考试名称" prop="examName">
              <el-input v-model="queryParams.examName" placeholder="请输入考试名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="总分" prop="score">
              <el-input v-model="queryParams.score" placeholder="请输入总分" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="合格分数线" prop="passLine">
              <el-input v-model="queryParams.passLine" placeholder="请输入合格分数线" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="合格/不合格" prop="result">
              <el-input v-model="queryParams.result" placeholder="请输入合格/不合格" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="总题数" prop="totalQuestions">
              <el-input v-model="queryParams.totalQuestions" placeholder="请输入总题数" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="正确题数" prop="correctCount">
              <el-input v-model="queryParams.correctCount" placeholder="请输入正确题数" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="答题详情" prop="answerSheet">
              <el-input v-model="queryParams.answerSheet" placeholder="请输入答题详情" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="答题用时" prop="durationSeconds">
              <el-input v-model="queryParams.durationSeconds" placeholder="请输入答题用时" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="补考次数" prop="retryCount">
              <el-input v-model="queryParams.retryCount" placeholder="请输入补考次数" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="考试时间" prop="examDate">
              <el-date-picker clearable
                v-model="queryParams.examDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择考试时间"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never" class="flex flex-col flex-1 table-card">
      <template #header>
        <el-row ref="editButtonsRef" :gutter="10" class="mb-[6px]">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['his:personExam:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['his:personExam:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['his:personExam:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['his:personExam:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table v-loading="loading" border :data="personExamList" :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="考试记录ID" align="center" prop="examId" v-if="true" />
          <el-table-column label="人员ID" align="center" prop="personId" />
          <el-table-column label="关联试卷ID" align="center" prop="paperId" />
          <el-table-column label="在线考试/操作考核" align="center" prop="examType" />
          <el-table-column label="考试名称" align="center" prop="examName" />
          <el-table-column label="总分" align="center" prop="score" />
          <el-table-column label="合格分数线" align="center" prop="passLine" />
          <el-table-column label="合格/不合格" align="center" prop="result" />
          <el-table-column label="总题数" align="center" prop="totalQuestions" />
          <el-table-column label="正确题数" align="center" prop="correctCount" />
          <el-table-column label="答题详情" align="center" prop="answerSheet" />
          <el-table-column label="答题用时" align="center" prop="durationSeconds" />
          <el-table-column label="补考次数" align="center" prop="retryCount" />
          <el-table-column label="考试时间" align="center" prop="examDate" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.examDate, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="合格自动授权 Y/N" align="center" prop="autoAuthorize" />
          <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['his:personExam:edit']"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['his:personExam:remove']"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
	  </div>

      <pagination ref="paginationRef" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改考试记录对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="personExamFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="人员ID" prop="personId">
          <el-input v-model="form.personId" placeholder="请输入人员ID" />
        </el-form-item>
        <el-form-item label="关联试卷ID" prop="paperId">
          <el-input v-model="form.paperId" placeholder="请输入关联试卷ID" />
        </el-form-item>
        <el-form-item label="考试名称" prop="examName">
          <el-input v-model="form.examName" placeholder="请输入考试名称" />
        </el-form-item>
        <el-form-item label="总分" prop="score">
          <el-input v-model="form.score" placeholder="请输入总分" />
        </el-form-item>
        <el-form-item label="合格分数线" prop="passLine">
          <el-input v-model="form.passLine" placeholder="请输入合格分数线" />
        </el-form-item>
        <el-form-item label="合格/不合格" prop="result">
          <el-input v-model="form.result" placeholder="请输入合格/不合格" />
        </el-form-item>
        <el-form-item label="总题数" prop="totalQuestions">
          <el-input v-model="form.totalQuestions" placeholder="请输入总题数" />
        </el-form-item>
        <el-form-item label="正确题数" prop="correctCount">
          <el-input v-model="form.correctCount" placeholder="请输入正确题数" />
        </el-form-item>
        <el-form-item label="答题详情" prop="answerSheet">
            <el-input v-model="form.answerSheet" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="答题用时" prop="durationSeconds">
          <el-input v-model="form.durationSeconds" placeholder="请输入答题用时" />
        </el-form-item>
        <el-form-item label="补考次数" prop="retryCount">
          <el-input v-model="form.retryCount" placeholder="请输入补考次数" />
        </el-form-item>
        <el-form-item label="考试时间" prop="examDate">
          <el-date-picker clearable
            v-model="form.examDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择考试时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="PersonExam" lang="ts">
import { listPersonExam, getPersonExam, delPersonExam, addPersonExam, updatePersonExam } from '@/api/his/personExam';
import { PersonExamVO, PersonExamQuery, PersonExamForm } from '@/api/his/personExam/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const personExamList = ref<PersonExamVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const personExamFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: PersonExamForm = {
  examId: undefined,
  personId: undefined,
  paperId: undefined,
  examType: undefined,
  examName: undefined,
  score: undefined,
  passLine: undefined,
  result: undefined,
  totalQuestions: undefined,
  correctCount: undefined,
  answerSheet: undefined,
  durationSeconds: undefined,
  retryCount: undefined,
  examDate: undefined,
  autoAuthorize: undefined,
}
const data = reactive<PageData<PersonExamForm, PersonExamQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    personId: undefined,
    paperId: undefined,
    examType: undefined,
    examName: undefined,
    score: undefined,
    passLine: undefined,
    result: undefined,
    totalQuestions: undefined,
    correctCount: undefined,
    answerSheet: undefined,
    durationSeconds: undefined,
    retryCount: undefined,
    examDate: undefined,
    autoAuthorize: undefined,
    params: {
    }
  },
  rules: {
    examId: [
      { required: true, message: "考试记录ID不能为空", trigger: "blur" }
    ],
    personId: [
      { required: true, message: "人员ID不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询考试记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listPersonExam(queryParams.value);
  personExamList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

const tableWrapperRef = ref(null);
const editButtonsRef = ref(null);
const paginationRef = ref(null);
// 计算高度
const tableHeight = ref("500px"); // 使用 ref 而非 computed

const updateHeight = () => {
    setTimeout(() => {
        if (tableWrapperRef.value) {
            const pageinationHeight = paginationRef.value?.$el?.clientHeight || 0;
            const editButtonsHeight = editButtonsRef.value?.$el?.clientHeight || 0;
            const tabHeightCale =
                tableWrapperRef.value.clientHeight - pageinationHeight - editButtonsHeight - 40;
            console.log(
                "tabHeightCale",
                tabHeightCale,
                "pageinationHeight",
                pageinationHeight,
                "editButtonsHeight",
                editButtonsHeight,
            );
            if (tabHeightCale > 500) {
                queryParams.value.pageSize = 20;
            } else if (tabHeightCale < 500) {
                queryParams.value.pageSize = 10;
            }
            tableHeight.value = tabHeightCale + "px";
        }
    }, 150);
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  personExamFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: PersonExamVO[]) => {
  ids.value = selection.map(item => item.examId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加考试记录";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: PersonExamVO) => {
  reset();
  const _examId = row?.examId || ids.value[0]
  const res = await getPersonExam(_examId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改考试记录";
}

/** 提交按钮 */
const submitForm = () => {
  personExamFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.examId) {
        await updatePersonExam(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addPersonExam(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: PersonExamVO) => {
  const _examIds = row?.examId || ids.value;
  await proxy?.$modal.confirm('是否确认删除考试记录编号为"' + _examIds + '"的数据项？').finally(() => loading.value = false);
  await delPersonExam(_examIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('his/personExam/export', {
    ...queryParams.value
  }, `personExam_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
  updateHeight(); // 初始计算
  window.addEventListener("resize", updateHeight); // 监听窗口变化
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight); // 清理监听
});
</script>
