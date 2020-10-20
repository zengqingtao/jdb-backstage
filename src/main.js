import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import './assets/styles/iconfont.css'
import './assets/styles/index.scss'
import App from './App.vue'
import router from './router'
import store from './store'
import VeLine from 'v-charts/lib/line.common.min'
import VePie from 'v-charts/lib/pie.common.min'
import 'v-charts/lib/style.css'
import { Message } from 'element-ui'
import directive from './directive'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.component(VeLine.name, VeLine)
Vue.component(VePie.name, VePie)
Vue.use(ElementUI)
Vue.use(directive)
Vue.config.productionTip = false

const DetailsRouter = [] // (内含有二级详情路由的 一级路由)
const DetailsRouterList = [] // 不在左侧菜单中的详情路由(路由白名单 二级路由)
const DetailsRouterListChild = [] // 不在左侧菜单中的详情路由(路由白名单 三级路由)

router.options.routes.forEach(item => {
    if (item.meta.level === 1) {
        DetailsRouter.push(item.path)
    } else if (item.meta.level === 2) {
        DetailsRouterList.push(item.path)
    } else if (item.meta.level === 3) {
        DetailsRouterListChild.push(item.path)
    }
})

// 路由拦截  面包屑
// 由于某些页面需要鉴权，在路由meta添加一个字段requireLogin, 设置为true的时候必须走鉴权,否则返回登录页
router.beforeEach((to, from, next) => {
    if (to.matched.some(res => res.meta.requireLogin)) {
        // 检测该页面是否需要鉴别权限
        const routerList = [] // 左侧权限菜单路由
        store.state.jdb_asideMenuConfig.forEach(item => {
            if (item.children && item.children.length > 0) {
                // 当此路由拥有子级路由时判断子级路由
                item.children.forEach(route => {
                    // 循环遍历子级路由
                    const url = item.path + route.path
                    routerList.push(url)
                })
            } else {
                routerList.push(item.path)
            }
        })
        let match = false
        routerList.forEach(item => {
            DetailsRouter.forEach(route => {
                if (item === route) {
                    match = true
                }
            })
        })

        if (
            routerList.includes(to.path) ||
            (DetailsRouterList.includes(to.path) && match) || DetailsRouterListChild.includes(to.path)
        ) {
            //  与现状的权限进行匹配 是否拥有相符条件的path 有则让行
            if (localStorage.jdb_token && localStorage.jdb_userInfo && localStorage.jdb_menu) {
                // 判断是否含有登录凭证
                if (DetailsRouter.includes(to.path)) {
                    store.commit('clearChild')
                } else if (DetailsRouterList.includes(to.path)) {
                    const parentPath = to.matched[0].meta.parentPath
                    const parentName = router.options.routes.filter(
                        item => item.path === parentPath
                    )
                    const current = { name: parentName[0].meta.name, path: parentPath }
                    store.commit('initBreadcrumb', current)
                    const child = { name: to.matched[0].meta.name, query: null }
                    store.commit('initChildPath', child)
                } else if (DetailsRouterListChild.includes(to.path)) {
                    const parentPath = to.matched[0].meta.parentPath
                    const parentName = router.options.routes.filter(item => item.path === parentPath)
                    const firstPath = router.options.routes.map(item => {
                        if (item.path === parentPath) {
                            return item.meta.parentPath
                        }
                    }).filter(Boolean)[0]
                    const firstName = router.options.routes.filter(item => item.path === firstPath)[0].meta.name
                    const child = { name: parentName[0].meta.name, query: null, sonName: to.matched[0].meta.name, childPath: parentName[0].path }
                    store.commit('initBreadcrumb', { name: firstName, path: firstPath })
                    store.commit('initChildPath', child)
                }
                next()
            } else {
                Message({
                    message: '登录失效，请重新登录！',
                    type: 'error'
                })
                next({ path: '/' })
            }
        } else {
            Message({
                message: '尚未登录或无权限访问该页面',
                type: 'error'
            })
        }
    } else if (to.path === '/') {
        // 不需要则让行
        next()
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')