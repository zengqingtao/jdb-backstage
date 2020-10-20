import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2019-04-25
 * @description 入驻宝相关 API
 */

export default {
  /**
   * @description 入驻宝资料查看的列表
   * @param page: Number 页码 默认1
   * @param size: Number 每页展示数据 默认10
   * @param phone: String 手机号
   * @param type: Number 类型 0 POP 1自营 默认0
   */
  listInfo: data => {
    return http.get('yushu-operation/enter/listInfo', data)
  },
  /**
   * @description 资料查看-录入、修改入驻信息
   * @param shopUrl: String 店铺链接
   * @param shopName: String 店铺名
   * @param id: Number 表id
   */
  changeInfo: data => {
    return http.get('yushu-operation/enter/changeInfo', data)
  },
  /**
   * @description 地域管理-列表
   * @param page: Number 页码 默认1
   * @param size: Number 每页展示数据 默认10
   * @param name: String 地域名称
   */
  listPolicy: data => {
    return http.get('yushu-operation/enter/listPolicy', data)
  },
  /**
   * @description 地域管理-添加、修改
   * @param name: String 地域名称
   * @param url: String 图片地址
   * @param content: String 园区政策
   * @param sort: String 排列顺序
   * @param id: String 表id 修改时需传入
   * @param file: file 图片 url和file必须传入一个
   * @param tips: String 温馨提示
   */
  savePolicy: data => {
    return http.formData('yushu-operation/enter/savePolicy', data)
  },
  /**
   * @description 地域管理-删除
   * @param id: String 表id
   */
  deletePolicy: data => {
    return http.get('yushu-operation/enter/deletePolicy', data)
  },
  /**
   * @description 产品报表-入驻宝下-资料提交来源
   */
  getCommitEnterNumber: data => {
    return http.get('yushu-operation/enter/getCommitEnterNumber', data)
  },
  /**
   * @description 产品报表-入驻宝的折线图数据
   * @param startDate: String 开始时间
   * @param endDate: String 结束时间
   */
  listSummary: data => {
    return http.get('yushu-operation/enter/listSummary', data)
  },
  /**
   * @description 入驻宝-资料查看-入驻驳回
   * @param id: Number 表id
   * @param reason: String 驳回原因
   */
  changeLive: data => {
    return http.get('yushu-operation/enter/changeLive', data)
  }
}
