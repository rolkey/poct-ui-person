<template>
  <div class="showFull p-2 flex flex-col">
    <!-- Stats Cards -->
    <el-row :gutter="16" class="mb-[10px]">
      <el-col :span="4" v-for="card in statCards" :key="card.label">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="flex flex-col items-center">
            <span class="text-sm text-gray-400">{{ card.label }}</span>
            <span :class="['text-2xl font-bold mt-1', card.color]">{{ card.value }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" :body-style="{ padding: '16px' }">
          <div class="flex flex-col items-center">
            <span class="text-sm text-gray-400">通过率</span>
            <el-progress
              :percentage="passRate"
              :stroke-width="12"
              :text-inside="true"
              class="mt-2 w-full"
              :status="passRate >= 60 ? 'success' : 'exception'"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Recent Exam Records -->
    <el-card shadow="never" class="flex flex-col flex-1" v-loading="loading">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-medium">最近考试记录</span>
          <el-button text type="primary" @click="handleRefresh">刷新</el-button>
        </div>
      </template>

      <el-table :data="examList" border max-height="500">
        <el-table-column label="考试名称" align="center" prop="examName" min-width="160" />
        <el-table-column label="人员" align="center" prop="personName" width="120" />
        <el-table-column label="得分" align="center" prop="score" width="80" />
        <el-table-column label="合格线" align="center" prop="passLine" width="80" />
        <el-table-column label="结果" align="center" prop="result" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.result === '合格' ? 'success' : 'danger'" size="small">
              {{ scope.row.result }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="正确/总题" align="center" width="100">
          <template #default="scope">
            {{ scope.row.correctCount || 0 }} / {{ scope.row.totalQuestions || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="用时(秒)" align="center" prop="durationSeconds" width="90" />
        <el-table-column label="考试时间" align="center" prop="examDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.examDate, "{y}-{m}-{d} {h}:{i}") }}</span>
          </template>
        </el-table-column>
      </el-table>

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

<script setup name="PersonExamStatistics" lang="ts">
import { listPersonExam, getExamStatistics } from "@/api/lis/person/personExam";
import { PersonExamVO } from "@/api/lis/person/personExam/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const loading = ref(false);
const total = ref(0);
const examList = ref<PersonExamVO[]>([]);
const paginationRef = ref(null);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  params: {},
});

const statCards = reactive([
  { label: "总考试次数", value: 0, color: "text-blue-500" },
  { label: "通过人数", value: 0, color: "text-green-500" },
  { label: "不合格人数", value: 0, color: "text-red-500" },
  { label: "平均分", value: 0, color: "text-orange-500" },
]);

const passRate = ref(0);

const loadStatistics = async () => {
  try {
    const res = await getExamStatistics();
    const data = res.data || res;
    statCards[0].value = data.totalCount || 0;
    statCards[1].value = data.passCount || 0;
    statCards[2].value = data.failCount || 0;
    statCards[3].value = data.avgScore || 0;
    const totalCount = data.totalCount || 1;
    passRate.value = Math.round(((data.passCount || 0) / totalCount) * 100);
  } catch {
    // statistics may not be available
  }
};

const getList = async () => {
  loading.value = true;
  try {
    const res = await listPersonExam(queryParams);
    examList.value = res.rows;
    total.value = res.total;
  } catch (e: any) {
    proxy?.$modal.msgError(e?.msg || "查询失败");
  } finally {
    loading.value = false;
  }
};

const handleRefresh = () => {
  loadStatistics();
  getList();
};

onMounted(() => {
  loadStatistics();
  getList();
});
</script>
