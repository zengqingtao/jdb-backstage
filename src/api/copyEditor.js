import http from './http'

export default {
    /**
     * @description 文案编辑
     * @param page: Number 页码
     */
    getContentList: data => {
        return http.get('yushu-operation/content/getContentList', data)
    },
    /**
     * @description 文案编辑-新增-内容位置
     */
    getContentTypeList: data => {
        return http.get('yushu-operation/content/getContentTypeList', data)
    },
    /**
     * @description 文案编辑-新增-保存
     */
    saveOrUpdateContent: data => {
        return http.jsonPost('yushu-operation/content/saveOrUpdateContent', data, { 'Content-Type': 'application/json;charset=utf-8' })
    },
    /**
     * @description 文案编辑-编辑-获取某个功能说明文案
     * @param id: Number 文案编号
     */
    getOneContentById: data => {
        return http.get('yushu-operation/content/getOneContentById', data)
    },
    /**
     * @description 文案编辑-编辑-富文本上传图片
     */
    uploadImage: data => {
        return http.formData('yushu-operation/content/uploadImage', data)
    },
    /**
     * @description 下单说明列表
     * @param page: Number 页码
     */
    getOrderDescriptionList: data => {
        return http.get('yushu-operation/orderDescription/getOrderDescriptionList', data)
    },
    /**
     * @description 下单说明-新增/编辑
     * @param page: Number 页码
     */
    saveOrUpdateOrderDescription: data => {
        return http.jsonPost('yushu-operation/orderDescription/saveOrUpdateOrderDescription', data, { 'Content-Type': 'application/json;charset=utf-8' })
    },
    /**
     * @description 下单说明-获取某个下单说明文章
     * @param page: Number 页码
     */
    getOneOrderDescriptionById: data => {
        return http.get('yushu-operation/orderDescription/getOneOrderDescriptionById', data)
    },
    /**
     * @description 下单说明-图片上传
     * @param page: Number 页码
     */
    orderDescriptionUploadImage: data => {
        return http.formData('yushu-operation/orderDescription/uploadImage', data)
    },
    /**
     * @description 任务简介列表
     * @param page: Number 页码
     */
    getTaskDescriptionList: data => {
        return http.get('yushu-operation/taskDescription/getTaskDescriptionList', data)
    },
    /**
     * @description 任务简介-新增/编辑
     * @param page: Number 页码
     */
    saveOrUpdateTaskDescription: data => {
        return http.jsonPost('yushu-operation/taskDescription/saveOrUpdateTaskDescription', data, { 'Content-Type': 'application/json;charset=utf-8' })
    },
    /**
     * @description 任务简介-获取某个任务简介文章
     * @param page: Number 页码
     */
    getOneTaskDescriptionById: data => {
        return http.get('yushu-operation/taskDescription/getOneTaskDescriptionById', data)
    },
    /**
     * @description 任务简介-图片上传
     * @param page: Number 页码
     */
    taskDescriptionUploadImage: data => {
        return http.formData('yushu-operation/taskDescription/uploadImage', data)
    },

}