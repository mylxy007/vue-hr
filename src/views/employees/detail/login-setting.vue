<template>
  <div class="login-setting">
    <el-form
      ref="userForm"
      :model="userInfo"
      :rules="rules"
      label-width="120px"
      style="margin-left: 120px; margin-top: 30px"
    >
      <el-form-item label="姓名:" prop="username">
        <el-input v-model="userInfo.username" style="width: 300px" />
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input
          v-model="userInfo.password"
          type="password"
          style="width: 300px"
          show-password
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="updateEmployeesFn">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getUserPhotoAPI, updateEmployeesAPI } from "@/api";
export default {
  name: "LoginSetting",
  data() {
    return {
      userInfo: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserInfoFn();
  },
  methods: {
    // 获取用户信息
    async getUserInfoFn() {
      const res = await getUserPhotoAPI(this.$route.query.id);
      this.userInfo = res.data;
    },
    // 更新按钮事件
    updateEmployeesFn() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          const res = await updateEmployeesAPI(this.userInfo);
          if (!res.success) return this.$message.error(res.message);
          this.$message.success(res.message);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
