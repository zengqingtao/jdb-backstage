## 运营后台项目目录结构
```
|-- commonTemplate
    |-- public // 存储静态文件 public中的静态资源会被复制到打包目录
    |-- src
        |-- api // 后端交互相关方法
            |-- user.js // 用户相关API
            |-- feedback.js // 吐槽模块相关API
        |-- assets // 静态资源存储
        |-- components // 公共组件目录
        |-- layouts // 项目骨架组件
        |-- mixin // 通用方法相关
            |-- getQRCodeImg.js // 获取运营经理二维码相关
        |-- page // 存放页面相关文件
        |-- App.vue // 路由组件顶层路由
        |-- main.js // vue入口文件
        |-- router.js // 路由相关配置文件
        |-- store.js // Vuex 相关配置文件
    |-- .browserslistrc // 浏览器兼容配置 根据提供的目标浏览器的环境来，智能添加css前缀，js的polyfill垫片,来兼容旧版本浏览器
    |-- .env // 在所有环境中都会加载的变量存储文件
    |-- .env.development // 仅在开发环境中会加载的变量存储文件
    |-- .env.staging // 仅在测试环境中会加载的变量存储文件
    |-- .env.production // 仅在生产环境中会加载的变量存储文件
    |-- .gitignore // 配置不提交到git仓库的文件
    |-- .postcssrc.js // 添加浏览器私缀配置文件
    |-- babel.config.js // babel规则配置文件
    |-- package.json // 依赖、命令说明文件
    |-- README.md // 项目描述说明文件
    |-- vue.config.js // webpack配置文件 详情见：https://cli.vuejs.org/zh/
    |-- yarn.lock // 配置不提交到git仓库的文件

```
## 后缀env文件说明
```
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略

NODE_ENV = 'development' // 环境名称 环境名称仅能设置三种: 'development', 'test', 'production'
development 模式用于 vue-cli-service serve
production 模式用于 vue-cli-service build 和 vue-cli-service test:e2e
test 模式用于 vue-cli-service test:unit

VUE_APP_API = 'https://t.api.jingdianbao.cn/' // 请求api默认地址
outputDir = 'dev' // 打包输出目录名称
```
## 运行服务、打包、命令说明
```
"serve": "vue-cli-service serve"
"stagingBuild": "vue-cli-service build --mode staging --modern",
"build": "vue-cli-service build --modern",

vue-cli-service serve: 运行服务（默认为开发环境）
vue-cli-service build: 运行打包 (默认为生产环境)

以"--mode XXX" （XXX为.env.XXX）为特定环境名称，则仅加载特定.env环境变量 打包文件同理
"--modern" 开启现代模式打包 以适配不同浏览器兼容问题 Vue CLI 会产生两个应用的版本：一个现代版的包，面向支持 ES modules 的现代浏览器，另一个旧版的包，面向不支持的旧浏览器。

参考资料： 'https://cli.vuejs.org/zh/guide/mode-and-env.html#%E6%A8%A1%E5%BC%8F' 
```

## 新增页面与权限
```
1.创建vue文件
2.去到routerConfig创建路由
    如果是三级页面则需新增：
    {
        path: '/TryOneMore',
        layout: HeaderAsideLayout,
        component: TryOneReview,
        meta: { requireLogin: true },
        children: [
          {
            path: '/TryOneMore/TryOneReview',
            layout: HeaderAsideLayout,
            component: TryOneReview,
            meta: { requireLogin: true, name: '试一试审核', level: 1}
          },
          {
            path: '/TryOneMore/TryOneReview/Details',
            layout: HeaderAsideLayout,
            component: TryOneReviewDetails,
            meta: { requireLogin: true, name: '审核详情', parentPath: '/TryOneMore/TryOneReview', level: 2}
          }
        ],
      },
      
3.后端新增左侧菜单json，前端需要提供给后端前端路由url 如果是菜单则需要加多icon
   例如：
        {
            "name": "京币管理",
        	"path": "/Currency",
        	"icon": "iconfont icon-qianbi-",
        	"children": [
                {
                    "name": "消费明细",
                    "path": "/ConsumerDetails"
                }, {
        			"name": "数据分析",
        			"path": "/DataAnalysis"
        		}, {
        			"name": "抽奖数据",
        			"path": "/DrawRule"
        		}, {
        			"name": "幸运100%",
        			"path": "/Lucky"
        		}]
        }
4. 去到src/system/Role/Role.vue 新增后端新增的页面权限参数到树状图        
```

## 下载依赖
```
npm install   
```

### 运行服务
```
yarn start
```

### 文件打包
```
yarn run build
```
