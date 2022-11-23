/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string") {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time);
      } else {
        // support safari(支持IOS内置的浏览器，时间字符串只能用/不能用-)
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        // 字符串.replace() 替换方法，把参数1匹配的，直接换成参数2，并返回新的字符串
        // g全局匹配，可以匹配多次，不然智能替换1个
        // m多行匹配，如果字符串里包含回车多行，也能匹配到
        time = time.replace(new RegExp(/-/gm), "/");
      }
    }
    // 如果是数字，并且长度是10位，表示传递的是秒，new Date()传入的是毫秒，需要转换
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  // 要把占位符替换，用replace方法
  // 正则：先匹配左右两侧必须是{}，接着匹配{}中间为([ymdhisa])+任意一个一次到多次
  // replace()参数2，可以直接是一个替换的值，也可以是一个回调函数，用函数return值来进行替换
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    // result 匹配到的字符串（例如：{y}）
    // keypp到的是()正则里的东西（例如：y, m）
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    return value.toString().padStart(2, "0");
  });
  return time_str;
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * url传入，返回查询字符串对象
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  // decodeURIComponent() 内置的，可以把URL编码，转回原来的样子
  // URL编码：例如： %D2%88%D0 (中文和特殊字符在浏览器地址栏里，可能会被自动转化成URL编码)
  // 但是在代码里转回来才能正确使用

  const search = decodeURIComponent(url.split("?")[1]).replace(/\+/g, " ");
  if (!search) {
    return {};
  }
  // 得到参数对象
  const obj = {};
  const searchArr = search.split("&");
  searchArr.forEach((v) => {
    const index = v.indexOf("=");
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * 把扁平结构的数据, 转成树形控件
 * @param {*} list 遍历结构数组
 * @param {*} rootValue 返回数组，第一次对象的pid值
 * @returns 数组+对象的层级结构数据
 */
export function transTree(list, rootValue) {
  // list: 整个数组, rootValue本次要查找的目标id -> 此函数为了找到rootValue目标id的下属们
  const treeData = []; // 装下属对象的
  list.forEach((item) => {
    if (item.pid === rootValue) {
      // 当前对象pid符合, 继续递归调用查找它的下属
      const children = transTree(list, item.id); // 返回item对象下属数组
      if (children.length) {
        item.children = children; // 为item添加children属性保存下属数组
      }
      treeData.push(item); // 把当前对象保存到数组里, 继续遍历
    }
  });
  return treeData; // 遍历结束, rootValue的id对应下属们收集成功, 返回给上一次递归调用children, 加到父级对象的children属性下
}
// 把excel文件中的日期格式的内容转回成标准时间
export function formatExcelDate(numb, format = "/") {
  const time = new Date(
    (numb - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000
  );
  time.setYear(time.getFullYear());
  const year = time.getFullYear() + "";
  const month = time.getMonth() + 1 + "";
  const date = time.getDate() + "";
  if (format && format.length === 1) {
    return year + format + month + format + date;
  }
  return (
    year + (month < 10 ? "0" + month : month) + (date < 10 ? "0" + date : date)
  );
}
