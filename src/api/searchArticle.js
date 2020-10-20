import http from './http'



export default {

    /**
     * @description 搜索书生获取文章列表
     * @param page: Number 页码
     */
    getArticleList: data => {
        return http.get('yushu-operation/searchArticle/getArticleList2', data)
    },
    /**
     * @description 删除文章列表
     * @param id: Number 文章id
     */
    deleteOneSearchArticleById: data => {
        return http.get('yushu-operation/searchArticle/deleteOneSearchArticleById', data)
    },
    /**
     * @description 查看文章
     * @param id: Number 文章id
     */
    getOneSearchArticleById: data => {
        return http.get('yushu-operation/searchArticle/getOneSearchArticleById', data)
    },
    /**
     * @description 搜索书生-上传图片
     * @param file: file 文件
     */
    uploadImage: 'yushu-operation/searchArticle/uploadImage',
    /**
     * @description 新增或修改文章
     * @param articleTitle: String 标题
     * @param articleLink: String 链接
     * @param imageUrl: String 图片url
     * @params id: Number id 
     */
    saveOrUpdateSearchArticle: data => {
        return http.jsonPost('yushu-operation/searchArticle/saveOrUpdateSearchArticle', data, { 'Content-Type': 'application/json;charset=utf-8' })
    },
    /**
     * @description 运营攻略列表  
     * @param pageNo: Number 当前页 
     * @param pageSize: Number 每页条数
     * @param isTheLatest: Bool 默认排序还是最新发布，默认为默认排序false，最新发布为true
     */
    getStrategyList2: data => {
        return http.get('yushu-operation/operatingStrategy/getStrategyList2', data)
    },
    /**
     * @description 运营攻略-根据id查看
     * @param id: Number 运营策略文章Id
     */
    getOneStrategyById: data => {
        return http.get('yushu-operation/operatingStrategy/getOneStrategyById', data)
    },
    /**
     * @description 运营攻略-删除文章
     * @param id: Number 运营策略文章Id
     */
    deleteOneStrategyById: data => {
        return http.get('yushu-operation/operatingStrategy/deleteOneStrategyById', data)
    },
    /**
     * @description 运营攻略-上传文章
     * @param id:Number 运营策略文章编号，修改时要传
     * @param articleTitle:String 标题
     * @param articleLink:String 文章链接
     * @param imageUrl:String 图片链接
     */
    saveOrUpdateStrategy: data => {
        return http.jsonPost('yushu-operation/operatingStrategy/saveOrUpdateStrategy', data, { 'Content-Type': 'application/json;charset=utf-8' })
    },
    /**
     * @description 运营攻略的图片-上传二维码
     * @param file: fromData 二维码图片
     */
    strategyUploadImage: 'yushu-operation/operatingStrategy/uploadImage',
}