import http from './http'

/**
 * @author yanbenyuan@yushutec.com
 * @date 2018-10-29
 * @description 问卷调研相关 API
 */

export default {
    /**
     * @description 回复意见
     * @param id: Number 列表ID
     * @param surveyId: Number 上级列表ID
     * @param jb: Number 赠送京币
     * @param reply: String 回复文案
     */
    reply: data => {
        return http.get('yushu-operation/survey/reply', data)
    },
}