import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-11-06
 * @description 咚咚群发消息相关 API
 */

export default {
    /**
     * @description 添加任务
     * @param name: String 任务名称
     * @param label: String 任务标签
     * @param content: String 消息内容
     * @param picture1: file 图片
     * @param picture2: file 图片
     * @param picture3: file 图片
     * @param userId: Number 登录用户ID
     */
    addTask: data => {
        return http.formData('yushu-operation/task/addTask', data)
    },
    /**
     * @description 获取咚咚群发消息任务列表
     * @param page: Number 当前页码
     * @param size: Number 每页条目数
     * @param search: String 搜索关键词
     */
    listTask: data => {
        return http.get('yushu-operation/task/listTask', data)
    },
    /**
     * @description 咚咚任务删除
     * @param id: Number 任务列表ID
     */
    deleteTask: data => {
        return http.get('yushu-operation/task/deleteTask', data)
    },
    /**
     * @description 查看任务详情
     * @param taskListId: Number 任务详情列表ID
     */
    taskDetail: data => {
        return http.get('yushu-operation/task/taskDetail', data)
    },
    /**
     * @description 获取任务失败店铺信息
     * @param taskId: 任务详情ID
     * @param page: Number 当前页码
     * @param size: Number 每页条目数
     * @param search: String 搜索关键词
     */
    listTaskFail: data => {
        return http.get('yushu-operation/task/listTaskFail', data)
    },
    /**
     * @description 添加京店账号
     * @param file: Array 京东账户
     */
    addJDAccount: process.env.VUE_APP_API + 'yushu-operation/jingdong/readText',
    // addJDAccount: data => {
    //   return http.formData('yushu-operation/jingdong/readText', data)
    // },
    /**
     * @description 添加京店账号
     * @param page: Number 当前页码
     * @param size: Number 每页条目数
     * @param search: String 搜索关键词
     */
    listJDAccount: data => {
        return http.get('yushu-operation/jingdong/list', data)
    },
}