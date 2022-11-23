<template>
  <div class="app-container">
    <!-- 封装的表格上传组件 -->
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
    <!-- 展示读取的表格数据 -->
    <el-table
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column
        v-for="item of tableHeader"
        :key="item"
        :prop="item"
        :label="item"
      />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import { importEmployeeAPI } from "@/api";
import { formatExcelDate } from "@/utils";
export default {
  name: "UploadExcel",
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
    };
  },
  methods: {
    // 在上传之前，做一个判断，只能上传1MB的数据
    beforeUpload(file) {
      // file->上传的文件对象(excel文件对象) -> size的单位是Byte
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (isLt1M) {
        return true;
      }

      this.$message({
        message: "Please do not upload files larger than 1m in size.",
        type: "warning",
      });
      return false;
    },
    // 接收UploadExcel组件内，读取表格成功的头部数据和表格体的数据
    async handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
      // 中英文字段映射关系
      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
        聘用形式: "formOfEmployment",
      };
      // 遍历数组
      const newArr = results.map((item) => {
        const newObj = {};
        // 拿到中文字段的数组
        const keyArr = Object.keys(item);
        // 遍历中文字段数组，替换成英文字段
        keyArr.forEach((zhKey) => {
          const enKey = userRelations[zhKey];
          if (enKey === "correctionTime" || enKey === "timeOfEntry") {
            newObj[enKey] = formatExcelDate(item[zhKey]);
          } else {
            newObj[enKey] = item[zhKey];
          }
        });
        return newObj;
      });
      const res = await importEmployeeAPI(newArr);
      if (!res.success) return this.$message.error(res.message);
      this.$message.success(res.message);
    },
  },
};
</script>
