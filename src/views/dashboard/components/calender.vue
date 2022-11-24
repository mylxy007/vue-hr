<template>
  <el-calendar v-model="currentDate">
    <template #dateCell="{ date, data }">
      <div class="date-content">
        <span class="text">{{ getDay(data.day) }}</span>
        <span v-if="isWeek(date)" class="rest">休</span>
      </div>
    </template>
  </el-calendar>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date(),
    };
  },
  methods: {
    getDay(value) {
      const day = value.split("-")[2]; // 11, 02
      return day.startsWith("0") ? day.slice(1) : day;
    },
    // 判断是否周末
    isWeek(date) {
      return date.getDay() === 6 || date.getDay() === 0;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep td.next {
  display: none;
}
::v-deep .current ~ td {
  display: revert !important;
}

::v-deep .next ~ td {
  display: none;
}
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
}
</style>
