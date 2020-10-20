// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称
// 添加不在左侧菜单的详情页路由时 应前往main.js 在 DetailsRouterList 数组里添加 路由白名单 以及DetailsRouter 添加父级跳转页面

import HeaderAsideLayout from "./layouts/HeaderAsideLayout";

const routerConfig = [{
        path: "/",
        layout: () =>
            import ("./pages/Login"),
        component: () =>
            import ("./pages/Login"),
        meta: { requireLogin: false }
    },
    {
        path: "/Currency",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/Currency/ConsumerDetails"),
        meta: { requireLogin: true },
        children: [{
                path: "/Currency/ConsumerDetails",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Currency/ConsumerDetails"),
                meta: { requireLogin: true }
            },
            {
                path: "/Currency/DataAnalysis",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Currency/DataAnalysis"),
                meta: { requireLogin: true }
            },
            {
                path: "/Currency/DrawRule",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Currency/DrawRule"),
                meta: { requireLogin: true }
            },
            {
                path: "/Currency/Lucky",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Currency/Lucky"),
                meta: { requireLogin: true }
            }
        ]
    },
    {
        path: "/WhiteList",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/business/WhiteList"),
        meta: { requireLogin: true },
        children: [{
                path: "/WhiteList/Customer",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/business/WhiteList"),
                meta: { requireLogin: true }
            },
            {
                path: "/WhiteList/CodeShow",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/business/CodeShow"),
                meta: { requireLogin: true }
            },
            // 京挑客白名单
            {
                path: "/WhiteList/JtkWhiteList",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/business/JingPickGuest"),
                meta: { requireLogin: true }
            }
        ]
    },
    {
        path: "/Audits",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/Market/Audits"),
        meta: { requireLogin: true },
        children: [{
                path: "/Audits/Examine",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Market/Audits"),
                meta: { requireLogin: true }
            },
            {
                path: "/Audits/AuditsRefund",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Market/Refund"),
                meta: { requireLogin: true }
            },
            {
                path: "/Audits/CustomMeal",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("@/pages/Market/CustomMeal"),
                meta: { requireLogin: true }
            }
        ]
    },
    {
        path: "/Cps",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/Cps/CpsReview"),
        meta: { requireLogin: true },
        children: [{
                path: "/Cps/CpsReview",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Cps/CpsReview"),
                meta: { requireLogin: true }
            },
            {
                path: "/Cps/CpsPerformance",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Cps/CpsPerformance"),
                meta: { requireLogin: true, name: "查看业绩", level: 1 }
            },
            {
                path: "/Cps/CpsPerformance/Details",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Cps/CpsPerformance/Details"),
                meta: {
                    requireLogin: true,
                    name: "操作详情",
                    parentPath: "/Cps/CpsPerformance",
                    level: 2
                }
            },
            {
                path: "/Cps/CpsSubordinate",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Cps/CpsSubordinate"),
                meta: { requireLogin: true, name: "查看下级联盟业绩", level: 1 }
            },
            {
                path: "/Cps/CpsSubordinate/SubordinateDetails",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Cps/CpsSubordinate/Details"),
                meta: {
                    requireLogin: true,
                    name: "查看详情",
                    parentPath: "/Cps/CpsSubordinate",
                    level: 2
                }
            },
            {
                path: "/Cps/CpsRegisterNumber",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Cps/CpsRegisterNumber"),
                meta: { requireLogin: true, name: "注册数统计", level: 1 }
            },
            {
                path: "/Cps/CpsRegisterNumber/CpsRegisterNumberDetails",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Cps/CpsRegisterNumber/Details"),
                meta: {
                    requireLogin: true,
                    name: "操作详情",
                    parentPath: "/Cps/CpsRegisterNumber",
                    level: 2
                }
            }
        ]
    },
    {
        path: "/FeedBack",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/FeedBack/FeedBackList/FeedBackList"),
        meta: { requireLogin: true },
        children: [{
                path: "/FeedBack/adsList",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/Advertisement"),
                meta: { requireLogin: true, name: "广告管理", level: 1 }
            },
            {
                path: "/FeedBack/advertisemenList",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/Advertisement/AdsList"),
                meta: {
                    requireLogin: true,
                    name: "广告列表",
                    parentPath: "/FeedBack/adsList",
                    level: 2
                }
            },
            {
                path: "/FeedBack/FeedBackList",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/FeedBackList/FeedBackList"),

                meta: { requireLogin: true }
            },
            {
                path: "/FeedBack/searchScholars",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/ConsultingArticles/ConsultingArticles"),
                meta: { requireLogin: true }
            },
            {
                path: "/FeedBack/contentEdit",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/CopyEditor/CopyEditor"),
                meta: { requireLogin: true, name: "文案编辑", level: 1 },
            },
            // 编辑文案
            {
                path: "/FeedBack/contentEdit/EditCopywriting",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/CopyEditor/Copywriting"),
                meta: {
                    requireLogin: true,
                    name: "编辑文案",
                    parentPath: "/FeedBack/contentEdit",
                    level: 2
                }
            },
            // 新增文案
            {
                path: "/FeedBack/contentEdit/NewAddCopywriting",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/CopyEditor/Copywriting"),
                meta: {
                    requireLogin: true,
                    name: "新增文案",
                    parentPath: "/FeedBack/contentEdit",
                    level: 2
                }
            },
            // 编辑下单说明
            {
                path: "/FeedBack/contentEdit/EditOrderDescription",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/CopyEditor/OrderDescription"),
                meta: {
                    requireLogin: true,
                    name: "编辑文案",
                    parentPath: "/FeedBack/contentEdit",
                    level: 2
                }
            },
            // 新增下单说明
            {
                path: "/FeedBack/contentEdit/NewAddOrderDescription",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/CopyEditor/OrderDescription"),
                meta: {
                    requireLogin: true,
                    name: "新增文案",
                    parentPath: "/FeedBack/contentEdit",
                    level: 2
                }
            },
            // 编辑任务说明
            {
                path: "/FeedBack/contentEdit/EditTaskBrief",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/CopyEditor/TaskBrief"),
                meta: {
                    requireLogin: true,
                    name: "编辑文案",
                    parentPath: "/FeedBack/contentEdit",
                    level: 2
                }
            },
            // 新增任务说明
            {
                path: "/FeedBack/contentEdit/NewAddTaskBrief",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/CopyEditor/TaskBrief"),
                meta: {
                    requireLogin: true,
                    name: "新增文案",
                    parentPath: "/FeedBack/contentEdit",
                    level: 2
                }
            },
            {
                path: "/FeedBack/Thump",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/Thump"),
                meta: { requireLogin: true }
            },
            {
                path: "/FeedBack/News",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/News"),
                meta: { requireLogin: true }
            },
            {
                path: "/FeedBack/Notice",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/Notice"),
                meta: { requireLogin: true }
            },
            {
                path: "/FeedBack/Proportion",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/Proportion"),
                meta: { requireLogin: true }
            },
            {
                path: "/FeedBack/Level",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/Level"),
                meta: { requireLogin: true }
            },
            { //店铺诊断
                path: "/FeedBack/shopDiagnosis",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/shopDiagnosis"),
                meta: { requireLogin: true, name: "店铺诊断", level: 1 }
            },
            { //新增店铺指标
                path: "/FeedBack/shopDiagnosis/newAddShopIndicator",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/shopDiagnosis/newAddOrUpdate"),
                meta: {
                    requireLogin: true,
                    name: "新增店铺指标",
                    parentPath: "/FeedBack/shopDiagnosis",
                    level: 2
                }
            },
            { //新增商品指标
                path: "/FeedBack/shopDiagnosis/newAddGoodsIndicator",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/shopDiagnosis/newAddOrUpdate"),
                meta: {
                    requireLogin: true,
                    name: "新增商品指标",
                    parentPath: "/FeedBack/shopDiagnosis",
                    level: 2
                }
            },
            { //编辑商品指标
                path: "/FeedBack/shopDiagnosis/updateGoodsIndicator",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/shopDiagnosis/newAddOrUpdate"),
                meta: {
                    requireLogin: true,
                    name: "编辑商品指标",
                    parentPath: "/FeedBack/shopDiagnosis",
                    level: 2
                }
            },
            { //编辑店铺指标
                path: "/FeedBack/shopDiagnosis/updateShopIndicator",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/FeedBack/shopDiagnosis/newAddOrUpdate"),
                meta: {
                    requireLogin: true,
                    name: "编辑店铺指标",
                    parentPath: "/FeedBack/shopDiagnosis",
                    level: 2
                }
            }
        ]
    },
    // { //搜索书生
    //     path: '/searchScholar',
    //     layout: HeaderAsideLayout,
    //     omponent: () =>
    //         import ("./pages/searchScholar/activationCode"),
    //     meta: { requireLogin: true },
    //     children: [{ //激活码
    //             path: '/searchScholar/activationCode',
    //             layout: HeaderAsideLayout,
    //             component: () =>
    //                 import ("./pages/searchScholar/activationCode"),
    //             meta: { requireLogin: true }
    //         },
    //         { //课程
    //             path: '/searchScholar/curriculum',
    //             layout: HeaderAsideLayout,
    //             component: () =>
    //                 import ("./pages/searchScholar/curriculum"),
    //             meta: { requireLogin: true, name: '搜索书生课程', level: 1 }
    //         },
    //         { //添加课程
    //             path: '/searchScholar/addCurriculum',
    //             layout: HeaderAsideLayout,
    //             component: () =>
    //                 import ("./pages/searchScholar/curriculum/addOrEditCurriculum"),
    //             meta: { requireLogin: true, name: '添加课程', parentPath: '/searchScholar/curriculum', level: 2 }
    //         },
    //         { //编辑课程
    //             path: '/searchScholar/addCurriculum',
    //             layout: HeaderAsideLayout,
    //             component: () =>
    //                 import ("./pages/searchScholar/curriculum/addOrEditCurriculum"),
    //             meta: { requireLogin: true, name: '编辑课程', parentPath: '/searchScholar/curriculum', level: 2 }
    //         },
    //         { //白名单
    //             path: '/searchScholar/whiteList',
    //             layout: HeaderAsideLayout,
    //             component: () =>
    //                 import ("./pages/searchScholar/whiteList"),
    //             meta: { requireLogin: true }
    //         }
    //     ]
    // },
    {
        path: "/Customer",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/Customer/OrderPayment"),
        meta: { requireLogin: true },
        children: [{
                path: "/Customer/OrderPayment",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Customer/OrderPayment"),
                meta: { requireLogin: true }
            },
            {
                path: "/Customer/CustomersInfo",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Customer/CustomersInfo"),
                meta: { requireLogin: true }
            },
            {
                path: "/Customer/Order",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Customer/Order"),
                meta: { requireLogin: true }
            },
            {
                path: "/Customer/Refund",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Customer/Refund"),
                meta: { requireLogin: true }
            },
            {
                path: "/Customer/Achievement",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Customer/Achievement"),
                meta: { requireLogin: true }
            },
            {
                path: "/Customer/AchievementBD",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Customer/AchievementBD"),
                meta: { requireLogin: true, name: "查看业绩", level: 1 }
            },
            {
                path: "/Customer/AchievementBD/Details",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Customer/Achievement"),
                meta: {
                    requireLogin: true,
                    name: "操作详情",
                    parentPath: "/Customer/AchievementBD",
                    level: 2
                }
            },
            {
                path: "/Customer/Popularity",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Customer/Popularity"),
                meta: { requireLogin: true, name: "人气宝案例", level: 1 }
            },
            {
                path: "/Customer/Popularity/Details",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Customer/Popularity/Details"),
                meta: {
                    requireLogin: true,
                    name: "投放效果详情",
                    parentPath: "/Customer/Popularity",
                    level: 2
                }
            },
            {
                path: "/Customer/JdbCase",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Customer/JdbCase"),
                meta: { requireLogin: true }
            },
            { //手动退款
                path: "/Customer/ManualRefund",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Customer/ManualRefund"),
                meta: { requireLogin: true }
            }
        ]
    },
    {
        path: "/ProductReport",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/ProductReport/ProductJDB"),
        meta: { requireLogin: true },
        children: [{
                path: "/ProductReport/ProductJDB",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ProductReport/ProductJDB"),
                meta: { requireLogin: true }
            },
            {
                path: "/ProductReport/ProductRQB",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ProductReport/ProductRQB"),
                meta: { requireLogin: true }
            },
            {
                path: "/ProductReport/ProductGGB",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ProductReport/ProductGGB"),
                meta: { requireLogin: true }
            },
            {
                path: "/ProductReport/ProductJKJS",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ProductReport/ProductJKJS"),
                meta: { requireLogin: true }
            },
            {
                path: "/ProductReport/ProductCPS",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ProductReport/ProductCPS"),
                meta: { requireLogin: true }
            },
            {
                path: "/ProductReport/ProductLine",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ProductReport/ProductLine"),
                meta: { requireLogin: true }
            },
            {
                path: "/ProductReport/ProductSKB",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ProductReport/ProductSKB"),
                meta: { requireLogin: true }
            },
            {
                path: "/ProductReport/ProductRZB",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ProductReport/ProductRZB"),
                meta: { requireLogin: true }
            },
            {
                path: "/ProductReport/ProductSMS",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ProductReport/ProductSMS"),
                meta: { requireLogin: true }
            },
            {
                path: "/ProductReport/ProductPlug",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("@/pages/ProductReport/ProductPlug"),
                meta: { requireLogin: true }
            }
        ]
    },
    {
        path: "/TryOneMore",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/TryOneReview"),
        meta: { requireLogin: true },
        children: [{
                path: "/TryOneMore/TryOneReview",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/TryOneReview"),
                meta: { requireLogin: true, name: "试一试审核", level: 1 }
            },
            {
                path: "/TryOneMore/TryOneReview/Details",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/TryOneReview/Details"),
                meta: {
                    requireLogin: true,
                    name: "审核详情",
                    parentPath: "/TryOneMore/TryOneReview",
                    level: 2
                }
            }
        ]
    },
    {
        path: "/ggbManage",
        layout: HeaderAsideLayout,
        component: () =>
            import ("@/pages/GgbManage/GgbCase"),
        meta: { requireLogin: true },
        children: [{
                path: "/ggbManage/ggbCase",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("@/pages/GgbManage/GgbCase"),
                meta: { requireLogin: true }
            },
            {
                path: "/ggbManage/ggbPlan",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("@/pages/GgbManage/GgbPlan"),
                meta: { requireLogin: true }
            },
            {
                path: "/ggbManage/ggbWhiteList",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("@/pages/GgbManage/GgbWhiteList"),
                meta: { requireLogin: true }
            },
            {
                path: "/ggbManage/AdsCase",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("@/pages/GgbManage/AdsCase"),
                meta: { requireLogin: true, name: "广告宝方案", level: 1 }
            },
            {
                path: "/ggbManage/AdsCase/Details",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("@/pages/GgbManage/AdsCase/Details"),
                meta: {
                    requireLogin: true,
                    name: "查看详情",
                    parentPath: "/ggbManage/AdsCase",
                    level: 2
                }
            }
        ]
    },
    {
        path: "/SkbManage",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/SkbManage/MemberInfo"),
        meta: { requireLogin: true },
        children: [{
                path: "/SkbManage/MemberInfo",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/SkbManage/MemberInfo"),
                meta: { requireLogin: true }
            },
            {
                path: "/SkbManage/ShopInfo",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/SkbManage/ShopInfo"),
                meta: { requireLogin: true }
            },
            {
                path: "/SkbManage/CustomerObligate",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/SkbManage/CustomerObligate"),
                meta: { requireLogin: true }
            },
            {
                path: "/SkbManage/ItemReview",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/SkbManage/ItemReview"),
                meta: { requireLogin: true, name: "活动发布审核", level: 1 }
            },
            {
                path: "/SkbManage/ItemReview/Details",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/SkbManage/ItemReview/Details"),
                meta: {
                    requireLogin: true,
                    name: "操作详情",
                    parentPath: "/SkbManage/ItemReview",
                    level: 2
                }
            },
            {
                path: "/SkbManage/Settlement",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/SkbManage/Settlement"),
                meta: { requireLogin: true }
            },
            {
                path: "/SkbManage/ItemDetails",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/SkbManage/ItemDetails"),
                meta: { requireLogin: true }
            },
            {
                path: "/SkbManage/LinglaBalance",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/SkbManage/LinglaBalance"),
                meta: { requireLogin: true }
            }
        ]
    },
    {
        path: "/Settled",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/Settled/Material"),
        meta: { requireLogin: true },
        children: [{
                path: "/Settled/Material",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Settled/Material"),
                meta: { requireLogin: true }
            },
            {
                path: "/Settled/Region",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Settled/Region"),
                meta: { requireLogin: true }
            }
        ]
    },
    {
        path: "/SmsManage",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/SmsManage/SendingReport"),
        meta: { requireLogin: true },
        children: [{
                path: "/SmsManage/SendingReport",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/SmsManage/SendingReport"),
                meta: { requireLogin: true, name: "发送情况统计", level: 1 }
            },
            {
                path: "/SmsManage/SendingReport/Details",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/SmsManage/SendingReport/Details"),
                meta: {
                    requireLogin: true,
                    name: "查看详情",
                    parentPath: "/SmsManage/SendingReport",
                    level: 2
                }
            }
        ]
    },
    {
        path: "/Reseller",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/Reseller/ShareCode"),
        meta: { requireLogin: true },
        children: [{
                path: "/Reseller/ShareCode",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Reseller/ShareCode"),
                meta: { requireLogin: true }
            },
            {
                path: "/Reseller/BdCustomer",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/Reseller/BdCustomer"),
                meta: { requireLogin: true }
            },
            {
                path: "/Reseller/BdExchange",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("@/pages/Reseller/BdExchange/BdExchange"),
                meta: { requireLogin: true }
            },
            {
                path: "/Reseller/BdPayment",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("@/pages/Reseller/OrderPayment/OrderPayment"),
                meta: { requireLogin: true }
            }
        ]
    },
    {
        path: "/Rqb",
        layout: HeaderAsideLayout,
        component: () =>
            import ("@/pages/RqbManage/FlowTask"),
        meta: { requireLogin: true },
        children: [{
                path: "/Rqb/rqbFlow",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("@/pages/RqbManage/FlowTask"),
                meta: { requireLogin: true, name: "流量任务", level: 1 }
            },
            {
                path: "/Rqb/rqbFlow/todayTask",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("@/pages/RqbManage/FlowTask/todayTask"),
                meta: {
                    requireLogin: true,
                    name: "每日任务",
                    parentPath: "/Rqb/rqbFlow",
                    level: 2
                }
            },
            {
                path: "/Rqb/rqbFlow/Details",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("@/pages/RqbManage/FlowTask/Details"),
                meta: {
                    requireLogin: true,
                    name: "查看详情",
                    parentPath: "/Rqb/rqbFlow",
                    // parentPath: "/Rqb/rqbFlow/todayTask",
                    level: 2
                }
            }
        ]
    },
    {
        path: "/pushGoodsManage",
        layout: HeaderAsideLayout,
        component: () =>
            import ("@/pages/RqbManage/FlowTask"),
        meta: { requireLogin: true },
        children: [{
                path: "/pushGoodsManage/pushGoodsList",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ExtendManage/ExamineProduct"),
                meta: { requireLogin: true, name: "商品推广审核", level: 1 }
            },
            {
                path: "/pushGoodsManage/settleList",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ExtendManage/ExamineService"),
                meta: { requireLogin: true, name: "服务费收款核", level: 1 }
            },
            {
                path: "/pushGoodsManage/merchantList",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ExtendManage/CustomerInfo"),
                meta: { requireLogin: true, name: "客户信息", level: 1 }
            },
            {
                path: "/pushGoodsManage/pickerList",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ExtendManage/PickerInfo"),
                meta: { requireLogin: true, name: "挑客信息", level: 1 }
            }
        ]
    },
    {
        path: "/System",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/System/Jurisdiction"),
        meta: { requireLogin: true },
        children: [{
                path: "/System/Jurisdiction",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/System/Jurisdiction"),
                meta: { requireLogin: true }
            },
            {
                path: "/System/Role",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/System/Role"),
                meta: { requireLogin: true }
            },
            {
                path: "/System/AppMenu",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/System/AppMenu"),
                meta: { requireLogin: true }
            }
        ]
    },
    {
        path: "/productManage",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/ProductLibrary/ProductList"),
        meta: { requireLogin: true },
        children: [{
                path: "/productManage/productList",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ProductLibrary/ProductList"),
                meta: { requireLogin: true, name: "商品", level: 1 }
            },
            {
                path: "/productManage/productList/Details",
                layout: HeaderAsideLayout,
                component: () =>
                    import ("./pages/ProductLibrary/ProductList/Detail"),
                meta: {
                    requireLogin: true,
                    name: "商品详情",
                    parentPath: "/productManage/productList",
                    level: 2
                }
            }
        ]
    },
    { //权限不足
        path: "/NoPermission",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/NoPermission/NoPermission"),
        meta: { requireLogin: true }
    },
    {
        path: "*",
        layout: HeaderAsideLayout,
        component: () =>
            import ("./pages/NotFound"),
        meta: { requireLogin: false }
    }
];

export default routerConfig;