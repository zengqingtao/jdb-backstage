import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-09-11
 * @description 二维码相关 API
 */

export default {
  /**
   * @description 页面底部-获取二维码列表
   * @param type: Number 二维码类型 0、京客集市 1、人气宝 2、试客宝 3、砍价宝 4、广告宝 5、入驻宝
   */
  getQRCodeList: data => {
    return http.get('yushu-operation/qrCode/getQRCodeList', data)
  },
  /**
   * @description 页面底部-删除二维码
   * @param id: Number 二维码列表ID
   */
  deleteQRCode: data => {
    return http.get('yushu-operation/qrCode/deleteQRCode', data)
  },
  /**
   * @description 页面底部-上传二维码
   * @param file: fromData 二维码图片
   * @param name: String 二维码名称
   * @param type: Number 二维码类型 0、京客集市 1、人气宝 2、试客宝 3、砍价宝 4、广告宝 5、入驻宝
   */
  uploadImg: 'yushu-operation/qrCode/uploadImg',
  /**
   * @description 页面底部-修改二维码名称
   * @param id: Number 二维码列表ID
   * @param name: String 二维码名称
   */
  changeName: data => {
    return http.get('yushu-operation/qrCode/changeName', data)
  },
  /**
   * @description 注册页面-获取二维码列表
   * @param page: Number 页码
   * @param size: Number 每页条目数
   */
  ReList: data => {
    return http.get('yushu-operation/qrCodeInvication/list', data)
  },
  /**
   * @description 注册页面-修改二维码名称
   * @param id: Number 二维码列表ID
   * @param name: String 二维码名称
   */
  ReChange: data => {
    return http.get('yushu-operation/qrCodeInvication/changeName', data)
  },
  /**
   * @description 注册页面-删除二维码
   * @param id: Number 二维码列表ID
   */
  ReDelete: data => {
    return http.get('yushu-operation/qrCodeInvication/delete', data)
  },
  /**
   * @description 注册页面-上传二维码
   * @param file: fromData 二维码图片
   */
  ReUploadImg: 'yushu-operation/qrCodeInvication/uploadImg'
}
