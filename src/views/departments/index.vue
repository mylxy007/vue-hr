<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组织结构" name="first" class="tab-pane">
              <el-row
                type="flex"
                justify="space-between"
                align="middle"
                class="department-header"
              >
                <!-- 第一列20份 -->
                <el-col :span="20">
                  <i class="el-icon-s-home" />
                  <span class="company">江苏传智播客教育科技股份有限公司</span>
                </el-col>
                <!-- 第二列4份 -->
                <el-col :span="4">
                  <!-- 在容器范围里, 一行再分2列 -->
                  <el-row type="flex" justify="end">
                    <el-col>负责人</el-col>
                    <el-col>
                      <!-- 这个之前在头部导航右侧下拉菜单讲过 -->
                      <el-dropdown>
                        <!-- 下拉菜单文字 -->
                        <span class="el-dropdown-link">
                          操作<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <!-- 下拉项 -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="add"
                            >添加子部门</el-dropdown-item
                          >
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
              <el-tree
                :data="treeData"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                class="departments-tree"
              >
                <template #default="{ data }">
                  <el-row
                    type="flex"
                    justify="space-between"
                    align="middle"
                    style="height: 40px; width: 100%"
                  >
                    <!-- 部门名字 -->
                    <el-col :span="20">
                      <span>{{ data.name }}</span>
                    </el-col>
                    <!-- 功能操作区域 -->
                    <el-col :span="4">
                      <el-row type="flex" justify="end">
                        <!-- 两个内容 -->
                        <el-col>{{ data.manager }}</el-col>
                        <el-col>
                          <!-- 下拉菜单 element -->
                          <el-dropdown>
                            <span> 操作<i class="el-icon-arrow-down" /> </span>
                            <!-- 下拉菜单 -->
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item @click.native="add(data)"
                                >添加子部门</el-dropdown-item
                              >
                              <el-dropdown-item @click.native="edit(data)"
                                >编辑部门</el-dropdown-item
                              >
                              <el-dropdown-item
                                @click.native="del(data)"
                                v-show="data && !data.children"
                                >删除部门</el-dropdown-item
                              >
                            </el-dropdown-menu>
                          </el-dropdown>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
      <!-- 添加子部门的弹窗 -->
      <!-- @dialogShowEV="changeShowFn" -->
      <departDialog
        ref="departDialog"
        :dialogVisible.sync="dialogVisible"
        :employeesSimpleList="employeesSimpleList"
        :originList="originList"
        :clickDepartId="clickDepartId"
        :isEdit="isEdit"
        @addDepartEV="addDepartFn"
      ></departDialog>
    </div>
  </div>
</template>

<script>
import departDialog from "./components/departDialog.vue";
import {
  getDepartmentsListAPI,
  getEmployeesSimpleListAPI,
  addDepartmentsAPI,
  getDepartDetailAPI,
  updateDepartmentsAPI,
} from "@/api";
import { transTree } from "@/utils";
export default {
  name: "Department",
  components: {
    departDialog,
  },
  data() {
    return {
      activeName: "first",
      treeData: [
        {
          departName: "总裁办",
          name: "孙财",
        },
        {
          departName: "行政部",
          name: "罗晓晓",
        },
        {
          departName: "人事部",
          name: "安小晴",
          children: [
            {
              departName: "财务核算部",
            },
          ],
        },
        {
          departName: "财务部",
          name: "",
          children: [
            {
              departName: "财务核算部",
            },
            {
              departName: "税务管理部",
            },
            {
              departName: "薪资管理部",
            },
          ],
        },
        {
          departName: "技术部",
          name: "",
          children: [
            {
              departName: "前端技术部",
            },
            {
              departName: "后端技术部",
            },
          ],
        },
        {
          departName: "运营部",
          name: "",
        },
        {
          departName: "市场部",
          name: "武高丽",
          children: [
            {
              departName: "市场部1",
            },
            {
              departName: "市场部2",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "departName",
      },
      dialogVisible: false,
      employeesSimpleList: [], //员工简单列表
      clickDepartId: "", //点击部门的父级部门id
      // departDetailObj: {}, //部门详情对象
      isEdit: false, //编辑状态
      originList: [], //用于校验部门列表扁平数组
    };
  },
  created() {
    this.getDepartmentsListFn();
    this.getEmployeesSimpleListFn();
  },
  methods: {
    // 获取部门列表
    async getDepartmentsListFn() {
      const res = await getDepartmentsListAPI();
      this.originList = res.data.depts;
      console.log(res.data.depts);
      this.treeData = transTree(res.data.depts, "");
    },
    // 获取员工简单列表
    async getEmployeesSimpleListFn() {
      const res = await getEmployeesSimpleListAPI();
      this.employeesSimpleList = res.data;
    },
    // 添加子部门-发送请求
    async addDepartFn(form) {
      if (this.isEdit) {
        form.id = this.clickDepartId;
        await updateDepartmentsAPI(form);
      } else {
        form.pid = this.clickDepartId;
        await addDepartmentsAPI(form);
        console.log(1);
      }
      this.getDepartmentsListFn();
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 正文部分-右侧的添加子部门
    // 头部添加子部门
    // 列表添加子部门
    add(data) {
      if (data === undefined) {
        this.clickDepartId = "";
      } else {
        this.clickDepartId = data.id;
      }
      this.dialogVisible = true;
      this.isEdit = false;
    },
    // 编辑子部分
    async edit(data) {
      const res = await getDepartDetailAPI(data.id);
      // this.$refs.departDialog -> 能拿到departDialog.vue组件this的值
      this.$refs.departDialog.form = res.data;
      this.dialogVisible = true;
      this.isEdit = true;
      this.clickDepartId = data.id;
    },
    // 删除部分
    del(data) {},
    // dialogShowEV自定义事件的回调函数
    changeShowFn(value) {
      this.dialogVisible = value;
    },
    //新增-添加部门的方法
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px 80px;

  .company {
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
  }

  .department-header {
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
  }
  .departments-tree {
    margin: 12px 0px;
  }
}
</style>
