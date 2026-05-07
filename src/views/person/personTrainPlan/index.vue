<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="计划名称" prop="planName">
              <el-input
                v-model="queryParams.planName"
                placeholder="请输入计划名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="年度" prop="year">
              <el-input
                v-model="queryParams.year"
                placeholder="请输入年度"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="季度" prop="quarter">
              <el-input
                v-model="queryParams.quarter"
                placeholder="请输入季度"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker
                clearable
                v-model="queryParams.startDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始日期"
              />
            </el-form-item>
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker
                clearable
                v-model="queryParams.endDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择结束日期"
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
              v-hasPermi="['his:personTrainPlan:add']"
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
              v-hasPermi="['his:personTrainPlan:edit']"
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
              v-hasPermi="['his:personTrainPlan:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['his:personTrainPlan:export']"
              >导出</el-button
            >
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="loading"
          border
          :data="personTrainPlanList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="计划ID" align="center" prop="planId" v-if="false" />
          <el-table-column label="计划名称" align="center" prop="planName" />
          <el-table-column label="年度/季度" align="center" prop="planType" />
          <el-table-column label="年度" align="center" prop="year" />
          <el-table-column label="季度" align="center" prop="quarter" />
          <el-table-column label="课程内容" align="center" prop="courseContent" />
          <el-table-column label="开始日期" align="center" prop="startDate" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.startDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束日期" align="center" prop="endDate" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.endDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="未开始/进行中/已结束" align="center" prop="status" />
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
                  v-hasPermi="['his:personTrainPlan:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['his:personTrainPlan:remove']"
                ></el-button>
              </el-tooltip>
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
    <!-- 添加或修改培训计划对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="personTrainPlanFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="计划名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="年度" prop="year">
          <el-input v-model="form.year" placeholder="请输入年度" />
        </el-form-item>
        <el-form-item label="季度" prop="quarter">
          <el-input v-model="form.quarter" placeholder="请输入季度" />
        </el-form-item>
        <el-form-item label="课程内容">
          <editor v-model="form.courseContent" :min-height="192" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            clearable
            v-model="form.startDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择开始日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            clearable
            v-model="form.endDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择结束日期"
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

<script setup name="PersonTrainPlan" lang="ts">
import {
  listPersonTrainPlan,
  getPersonTrainPlan,
  delPersonTrainPlan,
  addPersonTrainPlan,
  updatePersonTrainPlan,
} from "@/api/lis/person/personTrainPlan";
import {
  PersonTrainPlanVO,
  PersonTrainPlanQuery,
  PersonTrainPlanForm,
} from "@/api/lis/person/personTrainPlan/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const personTrainPlanList = ref<PersonTrainPlanVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const personTrainPlanFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: PersonTrainPlanForm = {
  planName: undefined,
  planType: undefined,
  year: undefined,
  quarter: undefined,
  courseContent: undefined,
  startDate: undefined,
  endDate: undefined,
  status: undefined,
};
const data = reactive<PageData<PersonTrainPlanForm, PersonTrainPlanQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    planName: undefined,
    planType: undefined,
    year: undefined,
    quarter: undefined,
    courseContent: undefined,
    startDate: undefined,
    endDate: undefined,
    status: undefined,
    params: {},
  },
  rules: {
    planName: [{ required: true, message: "计划名称不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询培训计划列表 */
const getList = async () => {
  loading.value = true;
  const res = await listPersonTrainPlan(queryParams.value);
  personTrainPlanList.value = res.rows;
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
  personTrainPlanFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: PersonTrainPlanVO[]) => {
  ids.value = selection.map((item) => item.planId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加培训计划";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: PersonTrainPlanVO) => {
  reset();
  const _planId = row?.planId || ids.value[0];
  const res = await getPersonTrainPlan(_planId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改培训计划";
};

/** 提交按钮 */
const submitForm = () => {
  personTrainPlanFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.planId) {
        await updatePersonTrainPlan(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPersonTrainPlan(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: PersonTrainPlanVO) => {
  const _planIds = row?.planId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除培训计划编号为"' + _planIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delPersonTrainPlan(_planIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "his/personTrainPlan/export",
    {
      ...queryParams.value,
    },
    `personTrainPlan_${new Date().getTime()}.xlsx`,
  );
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
