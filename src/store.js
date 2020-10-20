import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let jdb_token = ''
let jdb_asideMenuConfig = []
let jdb_userInfo = null

try {
    if (localStorage.jdb_token) {
        jdb_token = localStorage.jdb_token
    }
} catch (e) {}

try {
    if (localStorage.jdb_menu) {
        jdb_asideMenuConfig = JSON.parse(localStorage.jdb_menu)
    }
} catch (e) {}

try {
    if (localStorage.jdb_userInfo) {
        jdb_userInfo = JSON.parse(localStorage.jdb_userInfo)
    }
} catch (e) {}

export default new Vuex.Store({
    state: {
        jdb_token,
        jdb_asideMenuConfig,
        jdb_userInfo,
        currentName: '',
        currentPath: '',
        childName: '',
        childPath: '',
        sonName: '',
        query: null,
    },
    mutations: {
        initLoginInfo(state, info) {
            state.jdb_userInfo = info.userInfo
            localStorage.setItem('jdb_userInfo', JSON.stringify(info.userInfo))
        },
        initToken(state, token) {
            state.jdb_token = token
            localStorage.setItem('jdb_token', token)
        },
        initMenuList(state, list) {
            state.jdb_asideMenuConfig = list
            localStorage.setItem('jdb_menu', JSON.stringify(list))
        },
        clearLoginInfo(state) {
            state.jdb_token = ''
            state.jdb_userInfo = null
            state.jdb_asideMenuConfig = []
            state.currentName = ''
            state.currentPath = ''
            state.childName = ''
            state.sonName = ''
            state.query = null
        },
        initBreadcrumb(state, current) {
            state.currentName = current.name
            state.currentPath = current.path
        },
        initQuery(state, query) {
            state.query = query
        },
        initChildPath(state, child) {
            state.childName = child.name
            state.sonName = child.sonName
            state.childPath = child.childPath
        },
        clearChild(state) {
            state.childName = ''
            state.sonName = ''
            state.childPath = ''
            state.query = null
        }
    }
})