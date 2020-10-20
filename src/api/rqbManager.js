/*
 * @Author: chenzhenjin
 * @email: BrotherStudy@163.com
 * @Date: 2020-08-28 14:31:05
 * @LastEditTime: 2020-08-28 16:11:48
 * @Descripttion: 人气宝管理api
 */
import http from './http'
const operation = 'yushu-operation/renqibao'
const contentType = { 'Content-Type': 'application/json;charset=utf-8' }
function listManageTaskList(params) {
  return http.get(operation + '/listManageTaskList', params)
}
function listManagePopErrorTask(params) {
  return http.get(operation + '/listManagePopErrorTask', params)
}
function getPopDetail(params) {
  return http.get(operation + '/getPopDetail', params)
}
function listDateTask(params) {
  return http.get(operation + '/listDateTask', params)
}
export default {
  listManageTaskList,
  listManagePopErrorTask,
  getPopDetail,
  listDateTask
};
