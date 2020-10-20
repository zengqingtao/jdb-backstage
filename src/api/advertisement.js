import http from './http'

export default {
  /**
   * @description 广告管理获取广告列表
   * @param productCode: Number 产品标码
   * @param page: Number 当前页
   * @param size: Number 一页数量
   */
  getAdsList: data => {
    return http.get('yushu-operation/adsManage/getAdsList', data)
  },
  /**
   * @description 广告管理获取广告列表
   * @param id: Number 广告id
   */
  deleteAds: data => {
    return http.get('yushu-operation/adsManage/deleteAds', data)
  },
  /**
   * @description 广告管理新增广告
   * @param productCode: Number 产品标码
   * @param location: Number 广告位置标码
   * @param seq: Number 顺序
   * @param upDate: String 上架时间
   * @param downDate: String 下架时间
   * @param haveLink: String 是否跳转
   * @param link: String 链接
   * @param file: file 图片
   */
  addAds: data => {
    return http.formData('yushu-operation/adsManage/addAds', data)
  },
  /**
   * @description 广告管理修改广告
   * @param productCode: Number 产品标码
   * @param location: Number 广告位置标码
   * @param seq: Number 顺序
   * @param upDate: String 上架时间
   * @param downDate: String 下架时间
   * @param haveLink: String 是否跳转
   * @param link: String 链接
   * @param file: file 图片
   * @param id: NUmber 广告id
   */
  updateAds: data => {
    return http.formData('yushu-operation/adsManage/updateAds', data)
  },
  /**
   * @description 广告管理获取图片
   * @param location: Number 广告位置标码
   */
  getAllImages: data => {
    return http.get('yushu-operation/adsManage/getAllImages', data)
  },
  /**
   * @description 广告修改图片顺序
   * @param list: Array 图片数组
   */
  changSeq: data => {
    return http.jsonPost('yushu-operation/adsManage/changSeq', data, { 'Content-Type': 'application/json;charset=utf-8' })
  },
    /**
     * @description 上传广告营销图
     * @params adsId: Number 广告ID
     * @params file: File 图片文件
     */
    uploadPromotionImage: data => {
        return http.jsonPost('yushu-operation/adsManage/uploadPromotionImage', data, { 'Content-Type': 'multipart/form-data;charset=utf-8' })
    },
}