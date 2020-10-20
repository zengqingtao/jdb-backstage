import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-11-12
 * @description 公告管理相关 API
 */

export default {
  /**
   * @description 获取系统消息列表
   * @param search: String 搜索关键词
   * @param page: Number 当前页
   * @param size: Number 每页显示条目数
   */
  listNotice: data => {
    return http.get('yushu-operation/notice/listNotice', data)
  },
  /**
   * @description 添加公告
   * @param name: String 公告名称
   * @param content: file 公告图片
   * @param haveLink: Number 0不跳转 1跳转
   * @param link: String 跳转链接
   * @param status: Number 0未上架 1已上架
   */
  addNotice: data => {
    return http.formData('yushu-operation/notice/addNotice', data)
  },
  /**
   * @description 操作公告
   * @param id: Number 列表ID
   * @param status: Number 1上架 2下架 3删除
   */
  changeNotice: data => {
    return http.get('yushu-operation/notice/changeNotice', data)
  },
  /**
   * @description 判断是否有展示中的公告
   */
  showHave: data => {
    return http.get('yushu-operation/notice/showHave', data)
  },
}