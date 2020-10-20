import Vue from 'vue';
import Router from 'vue-router';
import routerConfig from './routerConfig';

/**
 * 将路由配置扁平化
 * @param {Array} config 路由配置
 * @return {Route}
 * @example
 * const routes = [
 *   {
 *     path: '/dashboard/analysis',
 *     component: HeaderAsideLayout,
 *     children: [
 *       {
 *         path: '',
 *         component: WhiteList,
 *       },
 *     ],
 *   },
 * ];
 */

const routerMap = [];

const recursiveRouterConfig = (config = []) => {
    config.forEach((item) => {
        const route = {
            path: item.path,
            component: item.layout,
            children: [{
                path: '',
                component: item.component,
            }, ],
        };
        if ('meta' in item) {
            route.meta = item.meta
        }

        if (Array.isArray(item.children)) {
            recursiveRouterConfig(item.children);
        }
        routerMap.push(route);
    });

    return routerMap;
};

const routes = recursiveRouterConfig(routerConfig);

Vue.use(Router);

export default new Router({
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
});