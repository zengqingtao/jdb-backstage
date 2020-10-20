const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
*/
const formatTime = timestamp => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

/**
 * 时间戳转化为年 月 日
 * number: 传入时间戳
 */
const formatDay = timestamp => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month, day].map(formatNumber).join('-')
};

/**
 * 时间戳转化为年 月
 * number: 传入时间戳
 */
const formatMonth = timestamp => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return [year, month].map(formatNumber).join('-')
};

/**
 * 时间戳转化为时分秒
 * number: 传入时间戳
 */

const getTime = (integer) =>{
  let time =null;
  if( integer!= null){
    let second = integer;
    let h = second / 3600;
    h = Math.floor(h)
    second = second % 3600;

    let m = second / 60;
    m = Math.floor(m)
    second = second % 60;

    let hs
    let ms
    let ss

    if(h < 10){
      hs = '0'+h
    }else {
      hs = h
    }

    if(m<10){
      ms = '0' + m
    }else {
      ms = m
    }

    if(second<10){
      ss = "0"+second;
    }else {
      ss = second;
    }
    time = hs + ':' + ms + ':' + ss;
  }
  return time;
}

export default {
  formatTime,
  formatDay,
  formatMonth,
  getTime
}