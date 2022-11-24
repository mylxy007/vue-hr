<template>
  <div class="permission-container">
    <div class="app-container">
      <page-tools>
        <template #slot-right>
          <el-button
            type="primary"
            size="small"
            @click="addPermissionBtnFn(1, '0')"
            >添加权限</el-button
          >
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-card style="margin-top: 10px">
        <el-table border :data="permissionList" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button
                type="text"
                v-if="row.type === 1"
                @click="addPermissionBtnFn(2, row.id)"
                >添加</el-button
              >
              <el-button type="text" @click="editPermissionBtnFn(row.id)"
                >编辑</el-button
              >
              <el-button type="text" @click="delPermissionBtnFn(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <PerDialog
        ref="perDialog"
        @addPerEv="addPerFn"
        :isEdit="isEdit"
        :originList="originList"
      />
    </div>
  </div>
</template>

<script>
import PerDialog from "./components/perDialog";
import {
  getPermissionListAPI,
  addPermissionAPI,
  getPermissionDetailAPI,
  updatePermissionAPI,
  delPermissionAPI,
} from "@/api";
import { transTree } from "@/utils";
export default {
  components: {
    PerDialog,
  },
  data() {
    return {
      permissionList: [], //权限列表数组
      originList: [], // 在做校验时需要用到的数据
      showPerDialog: false, //弹窗控制
      isEdit: false, //编辑状态
    };
  },
  created() {
    this.getPermissionListFn();
  },
  methods: {
    async getPermissionListFn() {
      const res = await getPermissionListAPI();
      this.originList = res.data;
      // 转成树形结构数组
      this.permissionList = transTree(res.data, "0");
    },
    // 添加按钮点击事件
    // type: 右上角添加按钮为页面访问权限添加,值为1, 页面权限右侧添加按钮为按钮权限添加, 值为2，(type值作为新对象的type使用)
    // pid: 右上角按钮传下来'0', 页面权限右侧添加按钮传下来行id(pid也要给新对象的pid使用)
    addPermissionBtnFn(type, pid) {
      this.isEdit = false;
      this.$refs.perDialog.showDialog = true;
      this.$refs.perDialog.formData.type = type;
      this.$refs.perDialog.formData.pid = pid;
    },
    // 添加/更新权限
    async addPerFn(formData) {
      if (this.isEdit) {
        console.log(formData);
        const res = await updatePermissionAPI(formData);
        if (!res.success) return this.$message.error(res.message);
        this.$message.success(res.message);
      } else {
        const res = await addPermissionAPI(formData);
        if (!res.success) return this.$message.error(res.message);
        this.$message.success(res.message);
      }
      this.getPermissionListFn();
    },
    // 编辑按钮点击事件
    async editPermissionBtnFn(perId) {
      this.isEdit = true;
      const res = await getPermissionDetailAPI(perId);
      this.$refs.perDialog.formData = res.data;
      this.$refs.perDialog.showDialog = true;
    },
    // 删除按钮点击事件
    async delPermissionBtnFn(perId) {
      const res = await delPermissionAPI(perId);
      if (!res.success) return this.$message.error(res.message);
      this.$message.success(res.message);
      this.getPermissionListFn();
    },
  },
};
</script>

<style lang="scss" scoped></style>
