import UploadImg from "@/components/UploadImg";
import PageTools from "@/components/PageTools";
import ImageHolder from "@/components/ImageHolder";
export default {
  install(Vue) {
    Vue.component("PageTools", PageTools);
    Vue.component("UploadImg", UploadImg);
    Vue.component("ImageHolder", ImageHolder);
  },
};
