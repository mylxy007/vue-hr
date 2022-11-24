<template>
  <div>
    <el-tree
      ref="theTree"
      :data="permissionList"
      :props="{ label: 'name' }"
      show-checkbox
      default-expand-all
      check-strictly
      node-key="id"
      :default-checked-keys="permissionIds"
      @node-click=""
    >
    </el-tree>
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="cancelButton">取 消</el-button>
        <el-button size="small" type="primary" @click="setRolesBtn"
          >确 定</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "AssignPermission",
  props: {
    // 所有权限数组
    permissionList: {
      type: Array,
      default: () => [],
    },
    // 角色id
    roleId: {
      type: [Number, String],
      required: true,
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    permissionIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  watch: {
    permissionIds() {
      this.$refs.theTree.setCheckedKeys(this.permissionIds);
    },
  },
  methods: {
    // 取消按钮
    cancelButton() {
      this.$emit("update:showDialog", false);
    },
    // 设置权限按钮
    setRolesBtn() {
      // 获取现在已选的key对应值形成的数组
      const clicArray = this.$refs.theTree.getCheckedKeys();
      this.$emit("updatePermissionFn", clicArray);
      this.$emit("update:showDialog", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
