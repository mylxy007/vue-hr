import UploadImg from "@/components/UploadImg";
import PageTools from "@/components/PageTools";
import ImageHolder from "@/components/ImageHolder";
import UploadExcelComponent from "@/components/UploadExcel";
import ScreenFull from "./ScreenFull";
import Lang from "./Lang";
export default {
  install(Vue) {
    Vue.component("PageTools", PageTools);
    Vue.component("UploadImg", UploadImg);
    Vue.component("ImageHolder", ImageHolder);
    Vue.component("UploadExcelComponent", UploadExcelComponent);
    Vue.component("Lang", Lang);
    Vue.component("ScreenFull", ScreenFull);
  },
};
