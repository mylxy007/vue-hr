<template>
  <div class="setting-container">
    <div class="app-container">
      <!-- 卡片组件 -->
      <el-card class="box-card">
        <!-- 使用 Tabs 组件完成标签页布局 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first" class="tab-pane">
            <!-- 新增角色按钮 -->
            <el-row style="height: 60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="addRoleBtnFn"
                >新增角色</el-button
              >
            </el-row>
            <!-- 使用 Table 组件实现用户角色的渲染 -->
            <el-table :data="rolesList" border style="width: 100%">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column label="角色名" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="small"
                    type="success"
                    @click="setRoles(scope.row.id)"
                    >分配权限</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRoles(scope.row)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="delRoles(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
              :current-page="query.page"
              :page-sizes="[10, 15, 20, 25]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </el-tab-pane>
          <el-tab-pane label="公司信息" class="tab-pane">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form
              :model="companyInfo"
              label-width="120px"
              style="margin-top: 50px"
            >
              <el-form-item label="公司名称">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="companyInfo.name"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="companyInfo.companyAddress"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  disabled
                  style="width: 400px"
                  v-model="companyInfo.mailbox"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                  v-model="companyInfo.remarks"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 新增弹框 -->
      <el-dialog
        :title="`${isEdit ? '编辑' : '新增'}角色`"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :visible.sync="showDialog"
        @close="closeRoleDialog"
      >
        <el-form
          ref="roleForm"
          :model="roleForm"
          :rules="roleRules"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>

        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="cancleRoles">取消</el-button>
            <el-button size="small" type="primary" @click="roleSubmit"
              >确定</el-button
            >
          </el-col>
        </el-row>
      </el-dialog>
      <!-- 分配权限弹框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="showPerDialog"
        width="50%"
        @close="perDialogCloseFn"
      >
        <assign-permission
          :role-id="roleId"
          :showDialog.sync="showPerDialog"
          :permissionList="permissionList"
          :permissionIds="permissionIds"
          @updatePermissionFn="updatePermissionFn"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import AssignPermission from "./assignPermission.vue";
import { transTree } from "@/utils";
import {
  getRoleListAPI,
  getCompanyInfoAPI,
  addRoleAPI,
  getRoleDetailAPI,
  editRoleAPI,
  delRoleAPI,
  getPermissionListAPI,
  assignPermAPI,
} from "@/api";
export default {
  components: {
    AssignPermission,
  },
  data() {
    return {
      activeName: "first",
      query: {
        page: 1, // 当前页面
        pagesize: 10, // 页面显示的条数
      },
      rolesList: [], // 角色列表
      total: 0, // 角色数据总条数
      companyInfo: {},
      showDialog: false, // 控制弹框的隐藏和展示
      // 添加角色
      roleForm: {
        name: "",
        description: "",
      },
      // 添加角色验证
      roleRules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        description: [
          { required: true, message: "角色描述不能为空", trigger: "blur" },
        ],
      },
      isEdit: false,
      showPerDialog: false, //分配权限弹窗控制
      roleId: "", //当前点击的角色id
      permissionList: [], //权限列表数组
      permissionIds: [], //角色权限id数组
    };
  },
  created() {
    // 获取所有角色列表
    this.getRoleListFn();
    // 获取公司详情
    this.getCompanyInfoFn();
    // 获取权限列表
    this.getPermissionListFn();
  },
  methods: {
    // 获取权限列表
    async getPermissionListFn() {
      const res = await getPermissionListAPI();
      this.permissionList = transTree(res.data, "0");
      console.log(this.permissionList);
    },
    // 获取所有角色列表
    async getRoleListFn() {
      const res = await getRoleListAPI(this.query);
      this.rolesList = res.data.rows;
      this.total = res.data.total;
    },
    // 获取公司详情
    async getCompanyInfoFn() {
      const companyId = this.$store.getters.companyId;
      const res = await getCompanyInfoAPI(companyId);
      this.companyInfo = res.data;
    },
    // 每页显示的条数发生改变时触发
    handleSizeChange(size) {
      this.query.pagesize = size;
      this.getRoleListFn();
    },

    // 当前页面发生改变时触发
    handleCurrentChange(page) {
      this.query.page = page;
      this.getRoleListFn();
    },
    // 新增角色按钮->点击事件->dialog出现
    addRoleBtnFn() {
      this.isEdit = false;
      this.showDialog = true;
    },
    // 分配权限按钮点击事件
    async setRoles(roleId) {
      const res = await getRoleDetailAPI(roleId);
      this.permissionIds = res.data.permIds;
      this.showPerDialog = true;
      this.roleId = roleId;
    },
    // 更新角色权限
    async updatePermissionFn(permIds) {
      const res = await assignPermAPI({ id: this.roleId, permIds });
      if (!res.success) return this.$message.error(res.message);
      this.$message.success(res.message);
    },
    // 编辑角色
    async editRoles(roleObj) {
      const res = await getRoleDetailAPI(roleObj.id);
      this.roleForm = res.data;
      this.isEdit = true;
      this.showDialog = true;
    },

    // 删除角色
    async delRoles(roleObj) {
      const delRes = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (delRes === "confirm") {
        const res = await delRoleAPI(roleObj.id);
        if (!res.success) return this.$message.error(res.message);
        this.$message.success(res.message);
        if (this.rolesList.length === 1 && this.query.page > 1) {
          this.query.page--;
        }
        this.getRoleListFn();
      }
    },
    // 角色弹框-> 确定按钮
    roleSubmit() {
      this.$refs.roleForm.validate(async (valid) => {
        if (valid) {
          if (this.isEdit) {
            const res = await editRoleAPI(this.roleForm);
            // 提示信息
            if (!res.success) return this.$message.error(res.message);
            this.$message.success(res.message);
          } else {
            const res = await addRoleAPI(this.roleForm);
            if (!res.success) return this.$message.error(res.message);
            this.$message.success(res.message);
          }
          // 更新列表
          this.getRoleListFn();
          // 关闭弹框
          this.showDialog = false;
        }
      });
    },

    // 角色弹框-> 取消按钮
    cancleRoles() {
      this.showDialog = false;
    },
    // 弹框关闭
    closeRoleDialog() {
      // this.roleForm = {
      //   name: "",
      //   description: "",
      // };
      this.$refs.roleForm.resetFields();
    },
    // 分配权限弹窗关闭回调
    perDialogCloseFn() {
      this.permissionIds = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  padding: 10px 30px;
}

.tab-pane {
  padding: 20px;
}

.el-pagination {
  text-align: center;
  margin-top: 20px;
}
</style>
