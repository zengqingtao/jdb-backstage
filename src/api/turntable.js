import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2019-02-14
 * @description 转盘相关 API
 */

export default {
    /**
     * @description 转盘数据列表
     * @param search: String 搜索关键词
     * @param page: Number 当前页
     * @param size: Number 每页显示条目数
     * @param type: Number 0今天新增 1近7天新增 2近15天新增 3近1月新增 4近3月新增 5累计新增 6签到次数 7转盘次数
     * @param orderBy: Number 0升序 1降序
     */
    turntableList: data => {
        return http.get('yushu-operation/turntable/list', data)
    },
    /**
     * @description 中奖明细
     * @param page: Number 当前页
     * @param size: Number 每页显示条目数
     * @param startTime: Number 开始时间
     * @param post: Number 派发情况
     * @param phone: String 手机号
     */
    listDrawPrizeForManage: data => {
        return http.get('yushu-operation/turntable/listDrawPrizeForManage', data)
    },
    /**
     * @description 更新派发状态
     * @param id: Number id
     * @param manageId: Number 操作人id
     */
    postPrize: data => {
        return http.get('yushu-operation/turntable/postPrize', data)
    },
    /**
     * @description 转盘广告列表
     * @param search: String 搜索关键词
     * @param page: Number 当前页
     * @param size: Number 每页显示条目数
     */
    advertisementList: data => {
        return http.get('yushu-operation/advertisement/list', data)
    },
    /**
     * @description 新增转盘所展示的广告
     * @param name: String 广告语
     * @param haveLink: Number 是否跳转 0否 1是
     * @param link: String 跳转链接
     */
    addAdvertisement: data => {
        return http.get('yushu-operation/advertisement/add', data)
    },
    /**
     * @description 修改转盘所展示的广告
     * @param id: Number 广告表id
     * @param name: String 广告语
     * @param haveLink: Number 是否跳转 0否 1是
     * @param link: String 跳转链接
     */
    changeAdvertisement: data => {
        return http.get('yushu-operation/advertisement/change', data)
    },
    /**
     * @description 删除转盘所展示的广告
     * @param id: Number 广告表id
     */
    deleteAdvertisement: data => {
        return http.get('yushu-operation/advertisement/delete', data)
    },
    /**
     * @description 获取展示转盘广告
     */
    showAdvertisement: data => {
        return http.get('yushu-operation/advertisement/show', data)
    },
    /**
     * @description 新增抽奖规则
     * @param file: file 抽奖背景图
     * @param choose(n): String 选项n 赠送内容 n为1~6
     * @param probability(n): String 选项n 中奖几率 n为1~6
     */
    addDrawRule: data => {
        return http.formData('yushu-operation/drawRule/add', data)
    },
}