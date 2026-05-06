<template>
  <div class="showFull p-2 flex flex-col">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="科室主管" prop="auditor1">
              <el-input v-model="queryParams.auditor1" placeholder="请输入科室主管" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="科室主管审核时间" prop="auditor1Time">
              <el-date-picker clearable
                v-model="queryParams.auditor1Time"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择科室主管审核时间"
              />
            </el-form-item>
            <el-form-item label="检验科/质管部门" prop="auditor2">
              <el-input v-model="queryParams.auditor2" placeholder="请输入检验科/质管部门" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="质检部门审核时间" prop="auditor2Time">
              <el-date-picker clearable
                v-model="queryParams.auditor2Time"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择质检部门审核时间"
              />
            </el-form-item>
            <el-form-item label="完成时间" style="width: 308px">
              <el-date-picker
                v-model="dateRangeFinishTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['his:personAuthorizeFlow:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['his:personAuthorizeFlow:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['his:personAuthorizeFlow:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['his:personAuthorizeFlow:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table v-loading="loading" border :data="personAuthorizeFlowList" :height="tableHeight" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="流程ID" align="center" prop="flowId" v-if="false" />
          <el-table-column label="授权申请类型" align="center" prop="flowType" />
          <el-table-column label="待审核/已通过/已驳回" align="center" prop="flowStatus" />
          <el-table-column label="科室主管" align="center" prop="auditor1" />
          <el-table-column label="科室主管审核时间" align="center" prop="auditor1Time" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.auditor1Time, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="检验科/质管部门" align="center" prop="auditor2" />
          <el-table-column label="质检部门审核时间" align="center" prop="auditor2Time" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.auditor2Time, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="完成时间" align="center" prop="finishTime" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.finishTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-tooltip content="修改" placement="top">
                <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['his:personAuthorizeFlow:edit']"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['his:personAuthorizeFlow:remove']"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
	  </div>

      <pagination ref="paginationRef" v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改授权审批流对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="personAuthorizeFlowFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="科室主管" prop="auditor1">
          <el-input v-model="form.auditor1" placeholder="请输入科室主管" />
        </el-form-item>
        <el-form-item label="科室主管审核时间" prop="auditor1Time">
          <el-date-picker clearable
            v-model="form.auditor1Time"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择科室主管审核时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检验科/质管部门" prop="auditor2">
          <el-input v-model="form.auditor2" placeholder="请输入检验科/质管部门" />
        </el-form-item>
        <el-form-item label="质检部门审核时间" prop="auditor2Time">
          <el-date-picker clearable
            v-model="form.auditor2Time"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择质检部门审核时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="完成时间" prop="finishTime">
          <el-date-picker clearable
            v-model="form.finishTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择完成时间">
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

<script setup name="PersonAuthorizeFlow" lang="ts">
import { listPersonAuthorizeFlow, getPersonAuthorizeFlow, delPersonAuthorizeFlow, addPersonAuthorizeFlow, updatePersonAuthorizeFlow } from '@/api/his/personAuthorizeFlow';
import { PersonAuthorizeFlowVO, PersonAuthorizeFlowQuery, PersonAuthorizeFlowForm } from '@/api/his/personAuthorizeFlow/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const personAuthorizeFlowList = ref<PersonAuthorizeFlowVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeFinishTime = ref<[DateModelType, DateModelType]>(['', '']);

const queryFormRef = ref<ElFormInstance>();
const personAuthorizeFlowFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: PersonAuthorizeFlowForm = {
  flowType: undefined,
  flowStatus: undefined,
  auditor1: undefined,
  auditor1Time: undefined,
  auditor2: undefined,
  auditor2Time: undefined,
  finishTime: undefined,
}
const data = reactive<PageData<PersonAuthorizeFlowForm, PersonAuthorizeFlowQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    flowType: undefined,
    flowStatus: undefined,
    auditor1: undefined,
    auditor1Time: undefined,
    auditor2: undefined,
    auditor2Time: undefined,
    params: {
      finishTime: undefined,
    }
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询授权审批流列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeFinishTime.value, 'FinishTime');
  const res = await listPersonAuthorizeFlow(queryParams.value);
  personAuthorizeFlowList.value = res.rows;
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
  personAuthorizeFlowFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeFinishTime.value = ['', ''];
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: PersonAuthorizeFlowVO[]) => {
  ids.value = selection.map(item => item.flowId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加授权审批流";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: PersonAuthorizeFlowVO) => {
  reset();
  const _flowId = row?.flowId || ids.value[0]
  const res = await getPersonAuthorizeFlow(_flowId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改授权审批流";
}

/** 提交按钮 */
const submitForm = () => {
  personAuthorizeFlowFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.flowId) {
        await updatePersonAuthorizeFlow(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addPersonAuthorizeFlow(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: PersonAuthorizeFlowVO) => {
  const _flowIds = row?.flowId || ids.value;
  await proxy?.$modal.confirm('是否确认删除授权审批流编号为"' + _flowIds + '"的数据项？').finally(() => loading.value = false);
  await delPersonAuthorizeFlow(_flowIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('his/personAuthorizeFlow/export', {
    ...queryParams.value
  }, `personAuthorizeFlow_${new Date().getTime()}.xlsx`)
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
