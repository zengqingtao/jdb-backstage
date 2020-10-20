import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-08-31
 * @description 京店联盟报表相关 API
 */

export default {
    /**
     * @description 产品报表-广告宝-获取列表数据
     * @param page: Number 当前页码
     */
    getThirtyDayDataAndPage: data => {
        return http.get('yushu-operation/report/getThirtyDayDataAndPage', data)
    },
    /**
     * @description 产品报表-广告宝-获取30天内图表数据
     */
    getThirtyDayData: data => {
        return http.get('yushu-operation/report/getThirtyDayData', data)
    },
    /**
     * @description 产品报表-广告宝-15天数据折线图
     */
    get15DaysDailyCountGgb: data => {
        return http.get('yushu-operation/report/get15DaysDailyCountGgb', data)
    },
    /**
     * @description 产品报表-广告宝
     * @param page: Number 当前页码
     */
    daliySuccessStatictis: data => {
        return http.get('yushu-operation/report/daliySuccessStatictis', data)
    },
    /**
     * @description 产品报表-网站流量-今日流量
     */
    getOutLine: data => {
        return http.get('yushu-operation/report/getOutline', data)
    },
    /**
     * @description 产品报表-网站流量-趋势图
     * @param metrics 单选：pv_count(浏览量(PV))
     *                      visitor_count(访客数(UV))
     *                      ip_count(IP数)
     *                      bounce_ratio(跳出率，%)
     *                      avg_visit_time(平均访问时长，秒)
     *                      trans_count(转化次无数)
     *                      contri_pv(百度推荐贡献浏览量)
     * @param contrast Number 0当前选择日期 1对比前一日 2对比上周
     * @param date 0今天 1昨天 2最近7天 3最近30天
     */
    getTimeTrendRpt: data => {
        return http.get('yushu-operation/report/getTimeTrendRpt', data)
    },
    /**
     * @description 产品报表-网站流量-新老访客
     * @param date Number 0：今天 1：昨天 2：最近7天 3：最近30天
     */
    getVisitorType: data => {
        return http.get('yushu-operation/report/getVisitorType', data)
    },
    /**
     * @description 产品报表-京店宝-用户注册（近30天折线图）
     */
    getTotalRegisterCount: data => {
        return http.get('yushu-operation/report/getTotalRegisterCount', data)
    },
    /**
     * @description 产品报表-京店宝-用户注册（每天）
     * @param page: Number 当前页
     */
    getUserRegisterCount: data => {
        return http.get('yushu-operation/report/getUserRegisterCount', data)
    },
    /**
     * @description 产品报表-京店宝-商品监控（近30天折线图）
     */
    get30DaysDailyCount: data => {
        return http.get('yushu-operation/report/get30DaysDailyCount', data)
    },
    /**
     * @description 产品报表-京店宝-商品监控（每天）
     * @param page: Number 当前页
     */
    getMonitorDailyCount: data => {
        return http.get('yushu-operation/report/getMonitorDailyCount', data)
    },
    /**
     * @description 产品报表-京店宝-分享注册（近30天折线图）
     */
    getTotalShareRegisterCount: data => {
        return http.get('yushu-operation/report/getTotalShareRegisterCount', data)
    },
    /**
     * @description 产品报表-京店宝-分享注册（每天）
     * @param page: Number 当前页
     */
    getUserShareRegisterCount: data => {
        return http.get('yushu-operation/report/getUserShareRegisterCount', data)
    },
    /**
     * @description 产品报表-京客集市-消费情况（近30天折线图）
     */
    getJiShi30DayCount: data => {
        return http.get('yushu-operation/report/getJiShi30DayCount', data)
    },
    /**
     * @description 产品报表-京客集市-消费情况（每天）
     * @param page: Number 当前页
     */
    getJiShiDailyCount: data => {
        return http.get('yushu-operation/report/getJiShiDailyCount', data)
    },
    /**
     * @description 产品报表-京客集市-达人入驻（近30天折线图）
     */
    get30DaysDarenDailyCount: data => {
        return http.get('yushu-operation/report/get30DaysDarenDailyCount ', data)
    },
    /**
     * @description 产品报表-京客集市-达人入驻（每天）
     * @param page: Number 当前页
     */
    getDarenDailyCount: data => {
        return http.get('yushu-operation/report/getDarenDailyCount', data)
    },
    /**
     * @description 产品报表-京店联盟-用户注册（近30天折线图）
     */
    reportFromRegister: data => {
        return http.get('yushu-operation/report/reportFromRegister', data)
    },
    /**
     * @description 产品报表-京店联盟-用户注册（每天）
     * @param page: Number 当前页
     * @param size: Number 每页条目数
     */
    reportFromRegisterEveryDay: data => {
        return http.get('yushu-operation/report/reportFromRegisterEveryDay', data)
    },
    /**
     * @description 产品报表-京店联盟-消费情况（近30天折线图）
     */
    reportOrder: data => {
        return http.get('yushu-operation/report/reportOrder', data)
    },
    /**
     * @description 产品报表-京店联盟-消费情况（每天）
     * @param page: Number 当前页
     * @param size: Number 每页条目数
     */
    reportOrderEveryDay: data => {
        return http.get('yushu-operation/report/reportOrderEveryDay', data)
    },
    /**
     * @description 产品报表-人气宝-任务完成情况15天折线图
     * @param: type: Number 1、第一家供应商 2、第二家供应商
     */
    get15DaysDailyCount: data => {
        return http.get('yushu-operation/report/get15DaysDailyCount', data)
    },
    /**
     * @description 产品报表-人气宝-任务完成情况列表
     * @param: type: Number 1、第一家供应商 2、第二家供应商
     * @param: page: NUmber 当前页
     */
    getFlowDailyCount: data => {
        return http.get('yushu-operation/report/getFlowDailyCount', data)
    },
    /**
     * @description 产品报表-获取日期列表
     */
    getDateList: data => {
        return http.get('yushu-operation/report/getList', data)
    },
    /**
     * @description 产品报表-渠道分析
     * @param: date: String yyyy-mm 年月
     */
    channelAnalysis: data => {
        return http.get('yushu-operation/report/channelAnalysis', data)
    },
    /**
     * @description 产品报表-获取个性化流量15天统计折现图数据
     */
    get15DayBiTaskDailyCount: data => {
        return http.get('yushu-operation/report/get15DayBiTaskDailyCount', data)
    },
    /**
     * @description 产品报表-获取个性化流量统计数据
     * @param: page Number 页码
     */
    listBiTaskDailyCount: data => {
        return http.get('yushu-operation/report/listBiTaskDailyCount', data)
    },
    /**
     * @description 产品报表-获取能量宝15天统计折现图数据
     */
    get15DayPowerTaskDailyCount: data => {
        return http.get('yushu-operation/report/get15DayPowerTaskDailyCount', data)
    },
    /**
     * @description 产品报表-获取能量宝流量统计数据
     * @param: page Number 页码
     */
    listDailyCountByType: data => {
        return http.get('yushu-operation/report/listDailyCountByType', data)
    },
    /**
     * @description 京店联盟结算数据报表
     * @param: page Number 页码
     * @param: size Number 每页条码
     * @param: search String 京店联盟用户手机号码 模糊匹配
     * @param: date yyyy-MM 默认为上月的年月
     */
    reckonReport: data => {
        return http.get('yushu-operation/report/reckonReport', data)
    },
    /**
     * @description 比例拆分-获取比例列表
     * @param: page Number 页码
     */
    listAllocateRatio: data => {
        return http.get('yushu-operation/report/listAllocateRatio', data)
    },
    /**
     * @description 比例拆分-新增分配比例
     * @param: ratio Number 百分比
     */
    setJbhAllocateRatio: data => {
        return http.get('yushu-operation/report/setJbhAllocateRatio', data)
    },
    /**
     * @description 运营后台获取邀请记录
     * @params page Number 页码
     * @params username String 京店宝账户
     */
    listInviteAccount: data => {
        return http.get('yushu-operation/report/listInviteAccount', data)
    },
    /**
     * @description 运营后台获取邀请注册总数
     * @params username String 京店宝账户
     */
    getInviteCount: data => {
        return http.get('yushu-operation/report/getInviteCount', data)
    },
    /**
     * @description 运营后台获取充值记录
     * @params page Number 页码
     * @params username String 京店宝账户
     */
    listChargeMoreThan2W: data => {
        return http.get('yushu-operation/report/listChargeMoreThan2W', data)
    },
    /**
     * @description 运营后台获取总充值数
     * @params username String 京店宝账户
     */
    getChargeMoreThan2WAmount: data => {
        return http.get('yushu-operation/report/getChargeMoreThan2WAmount', data)
    },
    /**
     * @description 运营后台获取订购记录
     * @params page Number 页码
     * @params username String 京店宝账户
     */
    listChargeForVip: data => {
        return http.get('yushu-operation/report/listChargeForVip', data)
    },
    /**
     * @description 运营后台获取订购总金额
     * @params username String 京店宝账户
     */
    getChargeForVipAmount: data => {
        return http.get('yushu-operation/report/getChargeForVipAmount', data)
    },
    /**
     * @description 运营后台获取邀请列表
     * @params page Number 页码
     * @params username String 京店宝账户
     */
    listUserInviteRecordForManage: data => {
        return http.get('yushu-operation/report/listUserInviteRecordForManage', data)
    },
    /**
     * @description 运营后台获取兑换列表
     * @params page Number 页码
     * @params username String 京店宝账户
     */
    listUserInviteConsumeRecordForManage: data => {
        return http.get('yushu-operation/report/listUserInviteConsumeRecordForManage', data)
    },
    /**
     * @description 运营后台获取十日每日邀请数
     */
    listDailyInvite: data => {
        return http.get('yushu-operation/report/listDailyInvite', data)
    },
    /**
     * @description 运营后台获取赠送会员信息列表
     * @params page Number 页码
     * @params username String 京店宝账户
     */
    listPresentVipRecord: data => {
        return http.get('yushu-operation/report/listPresentVipRecord', data)
    },
    /**
     * @description 运营后台赠送会员信息
     * @params username String 京店宝账户
     * @params endTime String 有效期
     * @params vipType Number 3、金牌 4、钻石
     */
    addUserVipByUsername: data => {
        return http.get('yushu-operation/report/addUserVipByUsername', data)
    },
    /**
     * @description 运营后台查询用户会员信息
     * @params username String 京店宝账户
     */
    getUserVipByUsername: data => {
        return http.get('yushu-operation/report/getUserVipByUsername', data)
    },
    /**
     * @description 短信宝-产品报表-15天数据
     */
    listSummary15: data => {
        return http.get('yushu-operation/report/listSummary15', data)
    },
    /**
     * @description 短信宝-产品报表-表格数据
     * @params page Number 页码
     * @params size Number 每页条目数
     */
    listSummary: data => {
        return http.get('yushu-operation/report/listSummary', data)
    },
    /**
     * @description 短信宝-查看详情
     * @params page Number 页码
     * @params size Number 每页条目数
     * @params search String 京店宝账号
     */
    listMerchant: data => {
        return http.get('yushu-operation/report/listMerchant', data)
    },
    /**
     * @description 短信宝-发送情况统计-查看详情
     * @params userId Number 用户id
     * @params page Number 页码
     * @params size Number 每页条目数
     * @params search String 任务名称、短信内容
     */
    FailTaskList: data => {
        return http.get('yushu-operation/report/FailTaskList', data)
    },
    /**
     * @description 产品报表-插件使用人数统计
     */
    getPluginUseCount: data => {
        return http.get('/yushu-monitor/plugin/getPluginUseCount', data)
    },
    /**
     * @description 产品报表-插件下载次数统计
     */
    PluginDownloadCount: data => {
        return http.get('/yushu-operation/report/listPluginDownloadCount', data)
    },
    /**
     * @description 充值记录-对公充值-获取客户信息
     * @param account: String 京店宝账号
     */
    getCustomerByAccount: data => {
        return http.get('yushu-operation/customer/getCustomerByAccount', data)
    },
    /**
     * @description 充值记录-对公充值-获取BD列表
     * @param type: Number BD 类型 1公司所BD 2分销商BD
     */
    listAddBd: data => {
        return http.get('yushu-operation/customer/listAllBd', data)
    },
    /**
     * @description 充值记录-对公充值-对公充值录入订单
     * @param account: String 京店宝账号
     * @param amount: Number 金额
     * @param giftAmount: Number 赠送金额
     * @param chargeTime: String 充值时间 yyyy-MM-dd HH:mm:ss
     * @param chargeTime: String 充值时间 yyyy-MM-dd HH:mm:ss
     * @param type: Number BD 类型 1公司所BD 2分销商BD
     * @param bdId: Number bdId
     * @param username: String 客户姓名 
     * @param phone: String 手机号码 
     * @param weChat: String 微信号 
     */
    bdLoadCharge: data => {
        return http.jsonPost('yushu-operation/customer/bdLoadCharge', data, { 'Content-Type': 'application/json' })
    },
    /**
     * @description 获取会员购买最近10天统计数
     */
    listLast10Count: data => {
        return http.get('yushu-operation/report/listLast10Count', data, { 'Content-Type': 'application/json' })
    },
    /**
     * @description 获取会员购买统计列表
     */
    listJdbUserVipOrderCount: data => {
        return http.get('yushu-operation/report/listJdbUserVipOrderCount', data, { 'Content-Type': 'application/json' })
    },
}