<template>
  <div>
    <!-- 渲染角色列表 -->
    <el-checkbox-group v-model="roleIdList">
      <el-checkbox v-for="item in roleList" :label="item.id" :key="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <el-row class="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="confirmFn"
          >确定</el-button
        >
        <el-button size="small" @click="cancelFn">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "AssignRole",
  props: {
    // 用户的id 用来查询当前用户的角色信息
    userId: {
      type: String,
      default: null,
    },
    roleList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      roleIdList: [], //收集选中的角色id数组
    };
  },
  methods: {
    // 确认按钮点击事件
    confirmFn() {
      this.$emit("addRoleEV", this.roleIdList);
      this.$emit("update:show", false);
    },
    // 取消弹框
    cancelFn() {
      this.$emit("update:show", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  margin-top: 30px;
}
</style>
