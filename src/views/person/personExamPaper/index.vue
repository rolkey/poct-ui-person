<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="试卷名称" prop="paperName">
              <el-input
                v-model="queryParams.paperName"
                placeholder="请输入试卷名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="试卷总分" prop="totalScore">
              <el-input
                v-model="queryParams.totalScore"
                placeholder="请输入试卷总分"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="合格分数线" prop="passLine">
              <el-input
                v-model="queryParams.passLine"
                placeholder="请输入合格分数线"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="题目总数" prop="questionCount">
              <el-input
                v-model="queryParams.questionCount"
                placeholder="请输入题目总数"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="考试时长" prop="durationMinutes">
              <el-input
                v-model="queryParams.durationMinutes"
                placeholder="请输入考试时长"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="组卷策略" prop="strategy">
              <el-input
                v-model="queryParams.strategy"
                placeholder="请输入组卷策略"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="发布日期" prop="publishDate">
              <el-date-picker
                clearable
                v-model="queryParams.publishDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择发布日期"
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
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['his:personExamPaper:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="Edit"
              :disabled="single"
              @click="handleUpdate()"
              v-hasPermi="['his:personExamPaper:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete()"
              v-hasPermi="['his:personExamPaper:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['his:personExamPaper:export']"
              >导出</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="SetUp"
              @click="handleGenerate"
              v-hasPermi="['his:personExamPaper:generate']"
              >自动组卷</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="loading"
          border
          :data="personExamPaperList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="试卷ID" align="center" prop="paperId" v-if="false" />
          <el-table-column label="试卷名称" align="center" prop="paperName" />
          <el-table-column label="试卷总分" align="center" prop="totalScore" />
          <el-table-column label="合格分数线" align="center" prop="passLine" />
          <el-table-column label="题目总数" align="center" prop="questionCount" />
          <el-table-column label="考试时长" align="center" prop="durationMinutes" />
          <el-table-column label="组卷策略" align="center" prop="strategy" />
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <el-tag
                :type="scope.row.status === '已发布' ? 'success' : scope.row.status === '已作废' ? 'danger' : 'info'"
              >{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="自动组卷/手动组卷" align="center" prop="generateType" />
          <el-table-column label="发布日期" align="center" prop="publishDate" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.publishDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Edit"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['his:personExamPaper:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['his:personExamPaper:remove']"
                ></el-button>
              </el-tooltip>
              <el-button
                v-if="scope.row.status === '未发布'"
                type="success"
                link
                icon="Upload"
                @click="handlePublish(scope.row)"
                v-hasPermi="['his:personExamPaper:publish']"
                >发布</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        ref="paginationRef"
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
    <!-- 添加或修改试卷对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="personExamPaperFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="试卷名称" prop="paperName">
          <el-input v-model="form.paperName" placeholder="请输入试卷名称" />
        </el-form-item>
        <el-form-item label="试卷总分" prop="totalScore">
          <el-input v-model="form.totalScore" placeholder="请输入试卷总分" />
        </el-form-item>
        <el-form-item label="合格分数线" prop="passLine">
          <el-input v-model="form.passLine" placeholder="请输入合格分数线" />
        </el-form-item>
        <el-form-item label="题目总数" prop="questionCount">
          <el-input v-model="form.questionCount" placeholder="请输入题目总数" />
        </el-form-item>
        <el-form-item label="考试时长" prop="durationMinutes">
          <el-input v-model="form.durationMinutes" placeholder="请输入考试时长" />
        </el-form-item>
        <el-form-item label="组卷策略" prop="strategy">
          <el-input v-model="form.strategy" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker
            clearable
            v-model="form.publishDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择发布日期"
          >
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

<script setup name="PersonExamPaper" lang="ts">
import {
  listPersonExamPaper,
  getPersonExamPaper,
  delPersonExamPaper,
  addPersonExamPaper,
  updatePersonExamPaper,
  publishPaper,
} from "@/api/lis/person/personExamPaper";
import {
  PersonExamPaperVO,
  PersonExamPaperQuery,
  PersonExamPaperForm,
} from "@/api/lis/person/personExamPaper/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const personExamPaperList = ref<PersonExamPaperVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const personExamPaperFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: PersonExamPaperForm = {
  paperName: undefined,
  totalScore: undefined,
  passLine: undefined,
  questionCount: undefined,
  durationMinutes: undefined,
  strategy: undefined,
  status: undefined,
  generateType: undefined,
  publishDate: undefined,
};
const data = reactive<PageData<PersonExamPaperForm, PersonExamPaperQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    paperName: undefined,
    totalScore: undefined,
    passLine: undefined,
    questionCount: undefined,
    durationMinutes: undefined,
    strategy: undefined,
    status: undefined,
    generateType: undefined,
    publishDate: undefined,
    params: {},
  },
  rules: {
    paperName: [{ required: true, message: "试卷名称不能为空", trigger: "blur" }],
    totalScore: [{ required: true, message: "试卷总分不能为空", trigger: "blur" }],
    passLine: [{ required: true, message: "合格分数线不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询试卷列表 */
const getList = async () => {
  loading.value = true;
  const res = await listPersonExamPaper(queryParams.value);
  personExamPaperList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

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
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  personExamPaperFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: PersonExamPaperVO[]) => {
  ids.value = selection.map((item) => item.paperId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加试卷";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: PersonExamPaperVO) => {
  reset();
  const _paperId = row?.paperId || ids.value[0];
  const res = await getPersonExamPaper(_paperId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改试卷";
};

/** 提交按钮 */
const submitForm = () => {
  personExamPaperFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.paperId) {
        await updatePersonExamPaper(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPersonExamPaper(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: PersonExamPaperVO) => {
  const _paperIds = row?.paperId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除试卷编号为"' + _paperIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delPersonExamPaper(_paperIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "his/personExamPaper/export",
    {
      ...queryParams.value,
    },
    `personExamPaper_${new Date().getTime()}.xlsx`,
  );
};

/** 自动组卷 */
const handleGenerate = () => {
  proxy?.$modal.msgSuccess("自动组卷功能跳转");
};

/** 发布试卷 */
const handlePublish = async (row: any) => {
  await proxy?.$modal.confirm("确认发布试卷「" + row.paperName + "」？");
  await publishPaper(row.paperId);
  proxy?.$modal.msgSuccess("发布成功");
  getList();
};

onMounted(() => {
  getList();
  updateHeight(); // 初始计算
  window.addEventListener("resize", updateHeight); // 监听窗口变化
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight); // 清理监听
});
</script>
