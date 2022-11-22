<template>
  <div>
    <el-dialog
      :title="`${isEdit ? '编辑' : '添加'}子部门`"
      :visible="dialogVisible"
      width="50%"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-class="false"
      @update:visible="(val) => $emit('update:dialogVisible', false)"
      @close="dialogCloseFn"
    >
      <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="form.name"
            style="width: 80%"
            placeholder="1-50个字符"
          />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="form.code"
            style="width: 80%"
            placeholder="1-50个字符"
          />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="form.manager"
            style="width: 80%"
            placeholder="请选择"
          >
            <el-option
              v-for="item in employeesSimpleList"
              :key="item.id"
              :value="item.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="form.introduce"
            style="width: 80%"
            placeholder="1-300个字符"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { logger } from "runjs/lib/common";
export default {
  name: "departDialog",
  props: {
    // 弹出框状态
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    // 员工简单列表数组
    employeesSimpleList: {
      type: Array,
      default: () => [],
    },
    // 部门列表数组
    originList: {
      type: Array,
      default: () => [],
    },
    clickDepartId: {
      type: String,
      default: "",
    },
    // 添加编辑状态
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validCode = (rule, value, callback) => {
      // 新增部门：code部门编码，不能和所有人相同
      let codeList = this.originList.map((item) => item.code);
      // 编辑部门：
      // 自己编码和自己冲突了,编辑时,需要排除自身
      if (this.isEdit) {
        const newArr = this.originList.filter(
          (item) => item.id !== this.clickDepartId
        );
        codeList = newArr.map((item) => item.code);
      }
      codeList.includes(value)
        ? callback(new Error(`部门编码 ${value} 已经存在`))
        : callback();
    };
    const validName = (rule, value, callback) => {
      let newArr = this.originList.filter(
        (item) => item.pid === this.clickDepartId
      );
      if (this.isEdit) {
        const clickDepartObj = this.originList.find(
          (item) => item.id === this.clickDepartId
        );
        newArr = this.originList.filter(
          (item) =>
            item.pid === clickDepartObj.pid && item.id !== this.clickDepartId
        );
      }
      const nameList = newArr.map((item) => item.name);
      nameList.includes(value)
        ? callback(new Error(`同级部门名称 ${value} 已经存在`))
        : callback();
    };
    return {
      showDialog: false,
      form: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          { validator: validName, trigger: "blur" },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          { validator: validCode, trigger: "blur" },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "部门介绍要求1-300个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    dialogVisible(newValue) {
      this.showDialog = newValue;
    },
  },
  methods: {
    // 添加子部门dialog->关闭前的回调函数
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 取消点击事件
    cancelFn() {
      // 第一种方法：自定义事件
      // this.$emit("dialogShowEV", false);
      // 第二种方法：sync
      this.$emit("update:dialogVisible", false);
    },
    // 确认点击事件
    confirmFn() {
      this.$refs.deptForm.validate((valid) => {
        if (valid) {
          console.log(valid);
          this.$emit("addDepartEV", { ...this.form });
          this.$emit("update:dialogVisible", false);
        }
      });
    },
    // 弹窗关闭后的回调事件
    dialogCloseFn() {
      // 清空表单，清空校验提示
      (this.form = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      }),
        this.$refs.deptForm.resetFields();
    },
  },
};
</script>

<style></style>
