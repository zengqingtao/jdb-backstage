import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2019-05-27
 * @description 广告宝管理模块相关 API
 */

export default {
  /**
   * @description 广告宝BD列表
   * @param page: Number 当前页码 默认值1
   * @param size: Number 每页大小 默认值10
   * @param search: String BD名字
   */
  specialCustomerList: data => {
    return http.get('yushu-operation/specialCustomer/list', data)
  },
  /**
   * @description 添加广告宝BD
   * @param userId: Number BDid
   * @param id: Number 修改表id 修改时传入
   */
  specialCustomerChange: data => {
    return http.get('yushu-operation/specialCustomer/change', data)
  },
  /**
   * @description 获取需要审核的子账号列表
   * @param page: Number 页码
   */
  getBypassAccount: data => {
    return http.get('yushu-operation/specialCustomer/getBypassAccount', data)
  },
  /**
   * @description 子账号审核
   * @param id: Number id
   * @param status: Number 2：审核成功 3：审核失败
   * @param message: Number 审核失败的原因，status为3时必须传入
   */
  updateBypassAccount: data => {
    return http.get('yushu-operation/specialCustomer/updateBypassAccount', data)
  },
  /**
   * @description 上传图片
   * @param files: File 图片
   */
  uploadImages: data => {
    return http.jsonPost('yushu-operation/specialCustomer/uploadImages', data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
  /**
   * @description 添加案例
   * @param status: Number 0：下架 1：上架
   * @param sortNum: Number 排序顺序
   * @param dbId: Number 运营后台操作人员id
   * @param exampleName: String 案例名称
   * @param homePicture: String 创意图
   * @param homeFirstCategory: String 首页一级类目
   * @param homeSecondCategory: String 	首页二级类目
   * @param homeThirdCategory: String 首页三级类目
   * @param homeTime: String 首页投放时间
   * @param homeDay: String 首页时间周期
   * @param homeMoney: String 首页成交金额
   * @param homePoi: String 首页POI值
   * @param detailPicture: String 详情页创意图
   * @param detailTitle: String 详情页标题
   * @param detailContent: String 详情页内容
   * @param detailFirstCategory: String 详情页一级类目
   * @param detailSecondCategory: String 详情页二级类目
   * @param detailFirstCategory: String 详情页三级类目
   * @param detailTime: String 详情页投放时间
   * @param detailShowNum: String 详情页总展现量
   * @param detailClickNum: String 详情页总点击数
   * @param detailAverageTransform: String 详情页平均转化
   * @param detailMarketingBackground: String 营销背景html
   * @param detailMarketingTarget: String 营销目标html
   * @param detailMarketingStrategy: String 营销策略html
   * @param detailMarketingLightspot: String 营销亮点html
   * @param jingdongData: Array 京准通数据
   */
  addExample: data => {
    return http.jsonPost('yushu-operation/specialCustomer/addExample', data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
  /**
   * @description 修改案例
   * @param id: Number id
   * @param status: Number 0：下架 1：上架
   * @param sortNum: Number 排序顺序
   * @param dbId: Number 运营后台操作人员id
   * @param exampleName: String 案例名称
   * @param homePicture: String 创意图
   * @param homeFirstCategory: String 首页一级类目
   * @param homeSecondCategory: String 	首页二级类目
   * @param homeThirdCategory: String 首页三级类目
   * @param homeTime: String 首页投放时间
   * @param homeDay: String 首页时间周期
   * @param homeMoney: String 首页成交金额
   * @param homePoi: String 首页POI值
   * @param detailPicture: String 详情页创意图
   * @param detailTitle: String 详情页标题
   * @param detailContent: String 详情页内容
   * @param detailFirstCategory: String 详情页一级类目
   * @param detailSecondCategory: String 详情页二级类目
   * @param detailFirstCategory: String 详情页三级类目
   * @param detailTime: String 详情页投放时间
   * @param detailShowNum: String 详情页总展现量
   * @param detailClickNum: String 详情页总点击数
   * @param detailAverageTransform: String 详情页平均转化
   * @param detailMarketingBackground: String 营销背景html
   * @param detailMarketingTarget: String 营销目标html
   * @param detailMarketingStrategy: String 营销策略html
   * @param detailMarketingLightspot: String 营销亮点html
   * @param jingdongData: Array 京准通数据
   */
  updateExample: data => {
    return http.jsonPost('yushu-operation/specialCustomer/updateExample', data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
  /**
   * @description 获取案例列表
   * @param page: Number 页码
   */
  selectExampleList: data => {
    return http.get('yushu-operation/specialCustomer/selectExampleList', data)
  },
  /**
   * @description 根据Id获取案例列表
   * @param id: Number id
   */
  selectExampleById: data => {
    return http.get('yushu-operation/specialCustomer/selectExampleById', data)
  },
  /**
   * @description 案例上下架
   * @param id: Number id
   * @param status: Number 0：下架 1：上架
   */
  updateExampleStatus: data => {
    return http.get('yushu-operation/specialCustomer/updateExampleStatus', data)
  },
  /**
   * @description 删除案例
   * @param id: Number id
   */
  deleteExample: data => {
    return http.get('yushu-operation/specialCustomer/deleteExample', data)
  },
  /**
   * @description 计划优化记录
   * @param page: Number 页码
   * @param search: String 搜索参数
   */
  getTaskOptimize: data => {
    return http.get('yushu-operation/specialCustomer/getTaskOptimize', data)
  },
  /**
   * @description 获取白名单
   * @param page: Number 页码
   * @param search: String 搜索参数
   * @param size: Number 页大小
   */
  listByAccount: data => {
    return http.get('yushu-operation/adsTask/listByAccount', data)
  },
  /**
   * @description 添加白名单
   * @param account: String  账户
   * @param deadline: String 截止时间
   */
  saveWhiteList: data => {
    return http.get('yushu-operation/adsTask/save', data)
  },
  /**
   * @description 修改白名单
   * @param id: String  账户id
   * @param deadline: String 截止时间
   */
  changeWhiteList: data => {
    return http.get('yushu-operation/adsTask/change', data)
  },
  /**
   * @description 删除白名单
   * @param id: String  账户id
   */
  deleteWhiteList: data => {
    return http.get('yushu-operation/adsTask/delete', data)
  },
}
