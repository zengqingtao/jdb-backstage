import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-11-12
 * @description 消息管理相关 API
 */

export default {
  /**
   * @description 获取系统消息列表
   * @param search: String 搜索关键词
   * @param page: Number 当前页
   * @param size: Number 每页显示条目数
   */
  listNews: data => {
    return http.get('yushu-operation/news/listNews', data)
  },
  /**
   * @description 添加消息
   * @param title: String 消息标题
   * @param content: String 内容
   * @param picture1: File 图片
   * @param picture2: File 图片
   * @param picture3: File 图片
   * @param haveLink: Number 是否跳转 0否 1是
   * @param link: String 跳转地址
   * @param status: Number 状态 0未发送 1已发送 2已撤回
   */
  addNews: data => {
    return http.formData('yushu-operation/news/addNews', data)
  },
  /**
   * @description 编辑消息
   * @param id: Number 列表ID
   * @param title: String 消息标题
   * @param content: String 内容
   * @param picture1: File 图片
   * @param picture2: File 图片
   * @param picture3: File 图片
   * @param haveLink: Number 是否跳转 0否 1是
   * @param link: String 跳转地址
   * @param status: Number 状态 0未发送 1已发送 2已撤回
   */
  changeNews: data => {
    return http.formData('yushu-operation/news/changeNews', data)
  },
  /**
   * @description 操作消息
   * @param id: Number 列表ID
   * @param status: Number 状态 1发送 2撤回
   */
  sendNews: data => {
    return http.get('yushu-operation/news/sendNews', data)
  },
  /**
   * @description 删除消息
   * @param id: Number 列表ID
   */
  deleteNews: data => {
    return http.get('yushu-operation/news/deleteNews', data)
  },
}