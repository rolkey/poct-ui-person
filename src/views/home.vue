<template>
  <div class="home">
    <el-card>
      <template #header>
        <span>HIS 子应用首页</span>
      </template>
      <div class="content">
        <p>欢迎使用医院信息系统微前端子应用</p>
        <el-button type="primary" @click="testMsgBus">测试消息总线</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const msgBus = (window as any).__QIANKUN_MSG_BUS__ as IMessageBus;

function testMsgBus() {
  if (msgBus) {
    console.log("消息总线可用:", msgBus);
    msgBus.emit("m_logout");
  } else {
    console.log("独立运行模式");
  }
}
</script>

<style scoped>
.home {
  padding: 16px;
}
.content {
  padding: 20px;
}
</style>
