<template>
  <div class="patient-page">
    <el-card>
      <template #header>
        <span>患者管理</span>
      </template>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tableData = ref([
  { id: 1, name: '张三', age: 45, gender: '男', phone: '13800138000' },
  { id: 2, name: '李四', age: 32, gender: '女', phone: '13900139000' },
  { id: 3, name: '王五', age: 28, gender: '男', phone: '13700137000' }
]);

function handleEdit(row: any) {
  console.log('编辑:', row);
}

function handleDelete(row: any) {
  console.log('删除:', row);
}
</script>

<style scoped>
.patient-page {
  padding: 16px;
}
</style>
