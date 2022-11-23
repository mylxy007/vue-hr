<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :http-request="customRequestFn"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <el-progress
        type="circle"
        :percentage="percentage"
        v-if="showProgress"
        class="progress"
      ></el-progress>
    </el-upload>
  </div>
</template>

<script>
var COS = require("cos-js-sdk-v5");
var cos = new COS({
  SecretId: "AKIDPddOhneGdmiVmrjNn00g9RcbNuGOIzQc",
  SecretKey: "4uUotjOnxsypPq7MM8f06yc2FH5h5Kgr",
});
export default {
  data() {
    return {
      showProgress: false, //环形进度条
      percentage: 0,
    };
  },
  props: {
    imgUrl: {
      type: String,
      default: "",
    },
  },
  methods: {
    handleAvatarSuccess(res, file) {
      // res：后端返回的响应数据
      // file：前端本地磁盘里，上传到浏览器的文件对象信息
      // URL.createObjectURL()方法，此方法会把文件数据，转成blob:临时前端地址
      // 可以用于img临时加载此前端的文件在浏览器显示
      // img标签的src属性（值：图片的base64字符串，外链地址，相对地址，blob临时地址）
      //   this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // upload自定义上传过程
    customRequestFn(obj) {
      this.showProgress = true;
      cos.uploadFile(
        {
          Bucket: "lxy-1315037691" /* 填写自己的bucket，必须字段 */,
          Region: "ap-nanjing" /* 存储桶所在地域，必须字段 */,
          Key: obj.file
            .name /* 存储在桶里的对象键（例如:1.jpg，a/b/test.txt，图片.jpg）支持中文，必须字段 */,
          Body: obj.file, // 上传文件对象
          SliceSize:
            1024 *
            1024 *
            5 /* 触发分块上传的阈值，超过5MB使用分块上传，小于5MB使用简单上传。可自行设置，非必须 */,
          onProgress: (progressData) => {
            // console.log(JSON.stringify(progressData));
            this.percentage = progressData.percent;
          },
        },
        (err, data) => {
          if (err) {
            this.$message.error(err);
          } else {
            const imageUrl = "http://" + data.Location;
            this.$emit("update:imgUrl", imageUrl);
            setTimeout(() => {
              this.showProgress = false;
            }, 1000);
          }
        }
      );
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.progress {
  position: absolute;
  display: flex;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #e4e4e4;
  border-radius: 50%;
  opacity: 0.9;
  z-index: 0;
}
</style>
