<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 通用工具栏组件使用 -->
      <page-tools>
        <!-- 自定义左侧内容 -->
        <template #slot-left>
          <span>共 19 条记录</span>
        </template>

        <!-- 自定义右侧内容 -->
        <template #slot-right>
          <el-button type="danger" size="small" @click="uploadBtnFn"
            >导入excel</el-button
          >
          <el-button type="success" size="small" @click="exportBtnFn"
            >导出excel</el-button
          >
          <el-button type="primary" size="small" @click="addEmployeeFn"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <el-card style="margin-top: 10px">
        <el-table border :data="employeesList">
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="头像" prop="">
            <template v-slot="{ row }">
              <image-holder class="staffPhoto" :src="row.staffPhoto" />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile" />
          <el-table-column
            label="工号"
            prop="workNumber"
            sortable
            :sort-method="workNumberSortFn"
          />
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatter"
          />
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column
            label="入职时间"
            prop="timeOfEntry"
            :formatter="timeFormatter"
          />
          <el-table-column label="操作" width="280">
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="small"
                @click="lookDetailFn(row.id, row.formOfEmployment)"
                >查看</el-button
              >
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small" @click="delEmpFn(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="end" align="middle" style="height: 60px">
          <!-- 分页区域 -->
          <el-pagination
            :current-page="query.page"
            :page-sizes="[10, 15, 20, 25]"
            :page-size="query.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
      <el-dialog
        title="新增员工"
        :visible.sync="showDialog"
        @close="addEmpDialogCloseFn"
      >
        <emp-form
          ref="addEmpDialog"
          @addEmpEv="addEmpEv"
          @cancelFn="cancelFn"
          :treeData="treeData"
        ></emp-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getEmployeesListAPI,
  getDepartmentsListAPI,
  addEmployeesAPI,
  delEmployeeAPI,
} from "@/api";
import { transTree } from "@/utils";
import Employees from "@/api/constant";
import dayjs from "dayjs";
import EmpForm from "./component/EmpForm";
export default {
  name: "Employees",
  components: {
    EmpForm,
  },
  data() {
    return {
      query: {
        page: 1, // 页码
        size: 10, // 每页条数
      },
      employeesList: [], // 员工列表
      total: 0, // 数据总条数
      showDialog: false, //新增员工弹框
      treeData: [],
      allEmployeeList: [],
    };
  },
  created() {
    this.getEmployeesListFn();
    this.getDepartmentsFn();
    this.getAllEmployeeListFn();
  },
  methods: {
    // 表格聘用字段格式化
    formatter(row, column, cellValue, index) {
      const obj = Employees.hireType.find((item) => item.id == cellValue);
      return obj ? obj.value : "未知";
    },
    // 表格时间字段格式化
    timeFormatter(row) {
      return dayjs(row.timeOfEntry).format("YYYY-MM-DD");
    },
    // 获取员工列表
    async getEmployeesListFn() {
      const res = await getEmployeesListAPI(this.query);
      this.employeesList = res.data.rows;
      this.total = res.data.total;
      console.log(res);
    },
    // 获取所有员工列表
    async getAllEmployeeListFn() {
      const res = await getEmployeesListAPI({
        page: 1,
        size: this.total,
      });
      this.allEmployeeList = res.data.rows;
    },
    // 获取部门列表
    async getDepartmentsFn() {
      const res = await getDepartmentsListAPI();
      this.treeData = transTree(res.data.depts, "");
      console.log(this.treeData);
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(newSize) {
      this.query.size = newSize;
      this.getEmployeesListFn();
    },

    // 当前页面发生改变时触发
    handleCurrentChange(newPage) {
      this.query.page = newPage;
      this.getEmployeesListFn();
    },
    // 工号自定义排序
    workNumberSortFn(a, b) {
      return parseInt(a.workNumber) - parseInt(b.workNumber);
    },
    // 新增员工按钮
    addEmployeeFn() {
      this.showDialog = true;
    },
    // 表格确实事件
    async addEmpEv(formData) {
      this.showDialog = false;
      const res = await addEmployeesAPI(formData);
      if (!res.success) return this.$message.error(res.message);
      this.$message.success(res.message);
      this.getEmployeesListFn();
    },
    // 表格取消事件
    cancelFn() {
      this.showDialog = false;
    },
    // 删除员工按钮事件
    async delEmpFn(id) {
      const delRes = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 用户点击了取消，给用户进行提示
      if (delRes === "cancel") return this.$message.info("您取消了删除");
      const res = await delEmployeeAPI(id);
      if (!res.success) return this.$message.error(res.message);
      // 删除成功后的提示
      this.$message.success(res.message);
      // 重新获取数据
      this.getEmployeesListFn();
    },
    // 查看员工事件
    lookDetailFn(id, formOfEmployment) {
      this.$router.push({
        // path: "/employees/detail",
        name: "employeesDetail",
        query: {
          id,
          formOfEmployment,
        },
      });
    },
    // 弹框关闭事件
    addEmpDialogCloseFn() {
      this.$refs.addEmpDialog.$refs.addForm.resetFields();
    },
    // 导入excel按钮方法
    uploadBtnFn() {
      this.$router.push({
        path: "/excel",
      });
    },
    // 导出excel按钮方法
    exportBtnFn() {
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "序号",
          "姓名",
          "头像",
          "手机号",
          "工号",
          "聘用形式",
          "部门",
          "入职时间",
        ];
        const myObj = {
          姓名: "username",
          头像: "staffPhoto",
          手机号: "mobile",
          工号: "workNumber",
          聘用形式: "formOfEmployment",
          部门: "departmentName",
          入职时间: "timeOfEntry",
        };
        this.getAllEmployeeListFn();
        const resultArr = this.allEmployeeList.map((item, index) => {
          const valueArr = [];
          tHeader.forEach((zhKey) => {
            if (zhKey === "序号") {
              valueArr.push(index + 1);
            } else {
              const enKey = myObj[zhKey];
              valueArr.push(item[enKey]);
            }
          });
          return valueArr;
        });
        // export_json_to_excel()方法是vendor/Export2Excel.js文件内封装的导出excel文件的方法
        excel.export_json_to_excel({
          // 表格文件的字段（数组）
          header: tHeader,
          // 正文数据
          data: resultArr,
          // 导出时excel文件的名字
          filename: "文件名",
          // 单元格宽度自适应
          autoWidth: true,
          // 文件类型
          bookType: "xlsx",
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.staffPhoto {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
