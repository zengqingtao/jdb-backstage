// 搜索书生
import http from './http'



export default {
    /**
     * @description 激活码-生成激活码
     */
    createActiveCode: data => {
        return http.get('yushu-operation/code/generateActiveCode', data)
    },
    /**
     * @description 激活码-获取激活码列表
     * @param pageNo: Number 页码
     * @param pageSize: Number 每页大小
     */
    getActiveCodeList: data => {
        return http.get('yushu-operation/code/getActivedCodeList', data)
    },
    /**
     * @description 搜索书生白名单-获取百名当列表
     * @param pageNo: Number 页码
     * @param pageSize: Number 每页大小
     */
    getSaWhiteListList: data => {
        return http.get('yushu-operation/saWhiteList/getSaWhiteListList', data)
    },
    /**
     * @description 搜索书生白名单-添加白名单
     * @param account: Number 京店宝账号
     * @param day: Number 有效天数
     */
    addWhiteList: data => {
        return http.post('yushu-operation/saWhiteList/saveOrUpdate', data)
    },
    /**
     * @description 搜索书生课程-获取课程列表
     * @param pageNo Number 
     * @param pageSize Number 
     */
    getCurriculumList: data => {
        return http.get('yushu-operation/saCourse/getSaCourseList', data)
    },
    /**
     * @description 搜索书生课程-获取章节级别列表
     */
    getChapterLevelList: data => {
        return http.get('yushu-operation/saCourse/getSaLevelList', data)
    },
    /**
     * @description 搜索书生课程-添加/编辑
     */
    saveOrEditCurriculum: data => {
        return http.jsonPost('yushu-operation/saCourse/saveOrUpdate', data, { 'Content-Type': 'application/json;charset=utf-8' })
    },
    /**
     * @description 搜索书生课程-添加资源图片
     *@param file: fromData 二维码图片
     */
    uploadImage: 'yushu-operation/saCourse/uploadImage',
    /**
     * @description 搜索书生课程-根据课程id获取课程相关信息
     * @param courseId 课程编号
     */
    getCurriculumInfo: data => {
        return http.get('yushu-operation/saCourse/getSaCourseInfo', data)
    },
}