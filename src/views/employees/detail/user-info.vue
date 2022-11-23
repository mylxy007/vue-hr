<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="userInfo.workNumber" class="inputW" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              style="width: 300px"
              type="date"
              class="inputW"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 姓名 部门 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.username" class="inputW" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门">
            <el-input
              v-model="userInfo.departmentName"
              class="inputW"
              @focus="departmentNameFocus"
              readonly
            />
            <div class="tree-box" v-show="showTree">
              <el-tree
                :data="treeData"
                default-expand-all
                :props="{ label: 'name' }"
                @node-click="treeClick"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" style="width: 300px" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="聘用形式">
            <el-select v-model="userInfo.formOfEmployment" class="inputW">
              <el-option
                v-for="item in EmployeeEnum.hireType"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <UploadImg ref="uploadImg" :imgUrl.sync="userInfo.staffPhoto" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="saveUser">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  getUserPhotoAPI,
  updateEmployeesAPI,
  getDepartmentsListAPI,
} from "@/api";
import { transTree } from "@/utils";

import EmployeeEnum from "@/api/constant";

export default {
  name: "UserInfo",
  data() {
    return {
      userId: this.$route.query.id,
      EmployeeEnum, // 员工枚举数据
      userInfo: {},
      showTree: false,
      treeData: [],
    };
  },
  created() {
    this.getUserInfoFn();
    this.getDepartmentsFn();
  },
  methods: {
    // 获取部门列表
    async getDepartmentsFn() {
      const res = await getDepartmentsListAPI();
      this.treeData = transTree(res.data.depts, "");
    },
    // 获取用户信息
    async getUserInfoFn() {
      const res = await getUserPhotoAPI(this.$route.query.id);
      this.userInfo = {
        ...res.data,
        formOfEmployment: +this.$route.query.formOfEmployment,
      };
    },
    // 保存更新按钮点击事件
    async saveUser() {
      const res = await updateEmployeesAPI(this.userInfo);
      if (!res.success) return this.$message.error(res.message);
      this.$message.success(res.message);
    },
    // 部门输入框聚焦事件
    departmentNameFocus() {
      this.showTree = true;
    },
    // 部门树形控件->行点击事件
    treeClick(data) {
      if (data && data.children) return;
      this.userInfo.departmentName = data.name;
      this.showTree = false;
    },
  },
};
</script>

<style scoped lang="scss">
.user-info {
  padding-top: 20px;
}
</style>
