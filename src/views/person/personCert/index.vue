<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="证书名称" prop="certName">
              <el-input
                v-model="queryParams.certName"
                placeholder="请输入证书名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="证书编号" prop="certNo">
              <el-input
                v-model="queryParams.certNo"
                placeholder="请输入证书编号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="发证机构" prop="issuer">
              <el-input
                v-model="queryParams.issuer"
                placeholder="请输入发证机构"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="发证日期" style="width: 308px">
              <el-date-picker
                v-model="dateRangeIssueDate"
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
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['his:personCert:add']"
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
              v-hasPermi="['his:personCert:edit']"
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
              v-hasPermi="['his:personCert:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="Download"
              @click="handleExport"
              v-hasPermi="['his:personCert:export']"
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
          :data="personCertList"
          :height="tableHeight"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="证书ID" align="center" prop="certId" v-if="false" />
          <el-table-column label="人员ID" align="center" prop="personId" />
          <el-table-column
            label="证书类型：执业医师/护士/技术资格/POCT专项/仪器认证"
            align="center"
            prop="certType"
          />
          <el-table-column label="证书名称" align="center" prop="certName" />
          <el-table-column label="证书编号" align="center" prop="certNo" />
          <el-table-column label="发证机构" align="center" prop="issuer" />
          <el-table-column label="发证日期" align="center" prop="issueDate" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.issueDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="有效期至" align="center" prop="expireDate" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.expireDate, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column>
          <el-table-column label="附件路径" align="center" prop="certFile" />
          <el-table-column label="有效/即将到期/已过期" align="center" prop="certStatus" />
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
                  v-hasPermi="['his:personCert:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['his:personCert:remove']"
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
    <!-- 添加或修改资质证书对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="personCertFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="人员ID" prop="personId">
          <el-input v-model="form.personId" placeholder="请输入人员ID" />
        </el-form-item>
        <el-form-item label="证书名称" prop="certName">
          <el-input v-model="form.certName" placeholder="请输入证书名称" />
        </el-form-item>
        <el-form-item label="证书编号" prop="certNo">
          <el-input v-model="form.certNo" placeholder="请输入证书编号" />
        </el-form-item>
        <el-form-item label="发证机构" prop="issuer">
          <el-input v-model="form.issuer" placeholder="请输入发证机构" />
        </el-form-item>
        <el-form-item label="发证日期" prop="issueDate">
          <el-date-picker
            clearable
            v-model="form.issueDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择发证日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效期至" prop="expireDate">
          <el-date-picker
            clearable
            v-model="form.expireDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择有效期至"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="附件路径" prop="certFile">
          <file-upload v-model="form.certFile" />
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

<script setup name="PersonCert" lang="ts">
import {
  listPersonCert,
  getPersonCert,
  delPersonCert,
  addPersonCert,
  updatePersonCert,
} from "@/api/lis/person/personCert";
import { PersonCertVO, PersonCertQuery, PersonCertForm } from "@/api/lis/person/personCert/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const personCertList = ref<PersonCertVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRangeIssueDate = ref<[DateModelType, DateModelType]>(["", ""]);

const queryFormRef = ref<ElFormInstance>();
const personCertFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: PersonCertForm = {
  personId: undefined,
  certType: undefined,
  certName: undefined,
  certNo: undefined,
  issuer: undefined,
  issueDate: undefined,
  expireDate: undefined,
  certFile: undefined,
  certStatus: undefined,
};
const data = reactive<PageData<PersonCertForm, PersonCertQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    certType: undefined,
    certName: undefined,
    certNo: undefined,
    issuer: undefined,
    certStatus: undefined,
    params: {
      issueDate: undefined,
    },
  },
  rules: {
    personId: [{ required: true, message: "人员ID不能为空", trigger: "blur" }],
    certType: [
      {
        required: true,
        message: "证书类型：执业医师/护士/技术资格/POCT专项/仪器认证不能为空",
        trigger: "change",
      },
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询资质证书列表 */
const getList = async () => {
  loading.value = true;
  queryParams.value.params = {};
  proxy?.addDateRange(queryParams.value, dateRangeIssueDate.value, "IssueDate");
  const res = await listPersonCert(queryParams.value);
  personCertList.value = res.rows;
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
  personCertFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  dateRangeIssueDate.value = ["", ""];
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: PersonCertVO[]) => {
  ids.value = selection.map((item) => item.certId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加资质证书";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: PersonCertVO) => {
  reset();
  const _certId = row?.certId || ids.value[0];
  const res = await getPersonCert(_certId);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改资质证书";
};

/** 提交按钮 */
const submitForm = () => {
  personCertFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.certId) {
        await updatePersonCert(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addPersonCert(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: PersonCertVO) => {
  const _certIds = row?.certId || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除资质证书编号为"' + _certIds + '"的数据项？')
    .finally(() => (loading.value = false));
  await delPersonCert(_certIds);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "his/personCert/export",
    {
      ...queryParams.value,
    },
    `personCert_${new Date().getTime()}.xlsx`,
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
