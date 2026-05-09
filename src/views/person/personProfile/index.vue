<template>
  <div class="showFull p-2 flex flex-col">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="工号" prop="empNo">
              <el-input
                v-model="queryParams.empNo"
                placeholder="请输入工号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="姓名" prop="personName">
              <el-input
                v-model="queryParams.personName"
                placeholder="请输入姓名"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="所在科室" prop="deptId">
              <el-input
                v-model="queryParams.deptId"
                placeholder="请输入所在科室"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="最高学历" prop="education">
              <el-input
                v-model="queryParams.education"
                placeholder="请输入最高学历"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="personStatus">
              <el-select v-model="queryParams.personStatus" placeholder="人员状态" clearable>
                <el-option label="在职" value="在职" />
                <el-option label="离职" value="离职" />
                <el-option label="休假" value="休假" />
              </el-select>
            </el-form-item>
            <el-form-item label="考核状态" prop="examStatus">
              <el-select v-model="queryParams.examStatus" placeholder="考核状态" clearable>
                <el-option label="合格" value="合格" />
                <el-option label="不合格" value="不合格" />
                <el-option label="待考核" value="待考核" />
              </el-select>
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
              icon="Search"
              @click="handleRefresh"
              v-hasPermi="['person:profile:list']"
            >刷新</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <div ref="tableWrapperRef" class="flex flex-row flex-1 overflow-hidden">
        <el-table
          v-loading="loading"
          border
          :data="profileList"
          :height="tableHeight"
          @row-click="handleRowClick"
          :row-class-name="rowClassName"
        >
          <el-table-column label="工号" align="center" prop="empNo" width="120" />
          <el-table-column label="姓名" align="center" prop="personName" width="120" />
          <el-table-column label="性别" align="center" prop="gender" width="60" />
          <el-table-column label="所在科室" align="center" prop="deptId" width="120" />
          <el-table-column label="最高学历" align="center" prop="education" width="100" />
          <el-table-column label="证书数" align="center" prop="certCount" width="80" />
          <el-table-column label="授权数" align="center" prop="authorizeCount" width="80" />
          <el-table-column label="考试次数" align="center" prop="examCount" width="80" />
          <el-table-column label="培训记录" align="center" prop="trainRecordCount" width="80" />
          <el-table-column label="考核状态" align="center" prop="examStatus" width="100">
            <template #default="scope">
              <el-tag
                :type="scope.row.examStatus === '合格' ? 'success' : scope.row.examStatus === '不合格' ? 'danger' : 'info'"
                size="small"
              >
                {{ scope.row.examStatus || "待考核" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="personStatus" width="80">
            <template #default="scope">
              <el-tag
                :type="scope.row.personStatus === '在职' ? 'success' : 'danger'"
                size="small"
              >
                {{ scope.row.personStatus }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Expand Detail Panel -->
      <el-drawer
        v-model="drawerVisible"
        :title="`人员档案 - ${currentProfile?.personName || ''}`"
        size="600px"
        append-to-body
      >
        <template v-if="currentProfile">
          <el-descriptions title="基本信息" :column="2" border class="mb-4">
            <el-descriptions-item label="工号">{{ currentProfile.empNo }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ currentProfile.personName }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ currentProfile.gender }}</el-descriptions-item>
            <el-descriptions-item label="出生日期">{{ parseTime(currentProfile.birthDate, "{y}-{m}-{d}") }}</el-descriptions-item>
            <el-descriptions-item label="所在科室">{{ currentProfile.deptId }}</el-descriptions-item>
            <el-descriptions-item label="职务/职称">{{ currentProfile.postId }}</el-descriptions-item>
            <el-descriptions-item label="最高学历">{{ currentProfile.education }}</el-descriptions-item>
            <el-descriptions-item label="专业">{{ currentProfile.major }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ currentProfile.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ currentProfile.email }}</el-descriptions-item>
            <el-descriptions-item label="入职日期">{{ parseTime(currentProfile.hireDate, "{y}-{m}-{d}") }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="currentProfile.personStatus === '在职' ? 'success' : 'danger'" size="small">
                {{ currentProfile.personStatus }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>

          <el-divider content-position="left">资质证书</el-divider>
          <el-table :data="currentProfile.certSummary || []" border size="small" class="mb-4">
            <el-table-column label="证书名称" prop="certName" min-width="140" />
            <el-table-column label="证书编号" prop="certNo" width="120" />
            <el-table-column label="有效期至" prop="expireDate" width="100">
              <template #default="scope">
                <span>{{ parseTime(scope.row.expireDate, "{y}-{m}-{d}") }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="certStatus" width="80">
              <template #default="scope">
                <el-tag
                  :type="scope.row.certStatus === '有效' ? 'success' : scope.row.certStatus === '即将到期' ? 'warning' : 'danger'"
                  size="small"
                >
                  {{ scope.row.certStatus }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>

          <el-divider content-position="left">授权信息</el-divider>
          <el-table :data="currentProfile.authorizeSummary || []" border size="small" class="mb-4">
            <el-table-column label="授权类型" prop="authorizeType" min-width="140" />
            <el-table-column label="授权状态" prop="authorizeStatus" width="100">
              <template #default="scope">
                <el-tag
                  :type="scope.row.authorizeStatus === '已授权' ? 'success' : 'info'"
                  size="small"
                >
                  {{ scope.row.authorizeStatus }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="授权日期" prop="authorizeDate" width="100">
              <template #default="scope">
                <span>{{ parseTime(scope.row.authorizeDate, "{y}-{m}-{d}") }}</span>
              </template>
            </el-table-column>
          </el-table>

          <el-divider content-position="left">最近考试</el-divider>
          <div class="text-center py-4" v-if="currentProfile.latestExamResult">
            <el-tag :type="currentProfile.latestExamResult === '合格' ? 'success' : 'danger'" size="large">
              最近考试结果：{{ currentProfile.latestExamResult }}
            </el-tag>
          </div>
          <el-empty v-else description="暂无考试记录" />
        </template>
      </el-drawer>

      <pagination
        ref="paginationRef"
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script setup name="PersonProfile" lang="ts">
import { listProfile, getProfile } from "@/api/lis/person/personProfile";
import { PersonProfileVO, PersonProfileQuery } from "@/api/lis/person/personProfile/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const profileList = ref<PersonProfileVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const tableWrapperRef = ref(null);
const editButtonsRef = ref(null);
const paginationRef = ref(null);
const tableHeight = ref("500px");

const drawerVisible = ref(false);
const currentProfile = ref<PersonProfileVO | null>(null);

const queryParams = reactive<PersonProfileQuery>({
  pageNum: 1,
  pageSize: 10,
  empNo: undefined,
  personName: undefined,
  deptId: undefined,
  education: undefined,
  personStatus: undefined,
  examStatus: undefined,
  params: {},
});

const getList = async () => {
  loading.value = true;
  try {
    const res = await listProfile(queryParams);
    profileList.value = res.rows;
    total.value = res.total;
  } catch (e: any) {
    proxy?.$modal.msgError(e?.msg || "查询失败");
  } finally {
    loading.value = false;
  }
};

const updateHeight = () => {
  setTimeout(() => {
    if (tableWrapperRef.value) {
      const pageinationHeight = paginationRef.value?.$el?.clientHeight || 0;
      const editButtonsHeight = editButtonsRef.value?.$el?.clientHeight || 0;
      const tabHeightCale =
        tableWrapperRef.value.clientHeight - pageinationHeight - editButtonsHeight - 40;
      if (tabHeightCale > 500) {
        queryParams.pageSize = 20;
      } else if (tabHeightCale < 500) {
        queryParams.pageSize = 10;
      }
      tableHeight.value = tabHeightCale + "px";
    }
  }, 150);
};

const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

const handleRefresh = () => {
  getList();
};

const rowClassName = () => "cursor-pointer";

const handleRowClick = async (row: PersonProfileVO) => {
  try {
    const res = await getProfile(row.personId);
    currentProfile.value = res.data || res;
    drawerVisible.value = true;
  } catch (e: any) {
    proxy?.$modal.msgError(e?.msg || "查询档案详情失败");
  }
};

onMounted(() => {
  getList();
  updateHeight();
  window.addEventListener("resize", updateHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeight);
});
</script>
