<template>
  <el-container>
    <el-header class="header">
      <el-row type="flex" class="row-bg" justify="space-between">
        <el-col :span="6">
          <el-button
            type="primary"
            plain
            size="small"
            @click="modalStatus = true, editStatus = false"
          >+添加角色</el-button>
        </el-col>
      </el-row>
    </el-header>

    <el-main>
      <el-table :data="tableData">
        <el-table-column prop="id" label="Id"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleType" label="分类"></el-table-column>
        <el-table-column prop="roleDescribe" label="角色描述" width="240px"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editFn(scope.row)">修改</el-button>
            <!--<el-button class="red" type="text" size="small" @click="deleteRole(scope.row.id)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" class="row-bg" justify="end">
        <el-col class="page">
          <el-pagination
            v-show="page.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.pageNo"
            :page-sizes="[10, 20, 50]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-main>

    <el-dialog
      :title="editStatus ? '修改角色' : '添加角色'"
      :visible.sync="modalStatus"
      width="30%"
      center
      :close-on-click-modal="false"
      @close="closeModalFn"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item
          label="角色名称:"
          prop="roleName"
          :rules="[ { required: true, message: '用户名称不能为空'}]"
        >
          <el-input v-model="form.roleName" placeholder="请输入角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色分类:" prop="roleType" :rules="[ { required: true, message: '请选择角色'}]">
          <el-input v-model="form.roleType" placeholder="请输入角色分类" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述:"
          prop="roleDescribe"
          :rules="[ { required: true, message: '角色描述不能为空'}]"
        >
          <el-input v-model="form.roleDescribe" placeholder="请输入角色描述" clearable></el-input>
        </el-form-item>
        <el-tree
          ref="tree"
          node-key="id"
          :data="treeData"
          default-expand-all
          show-checkbox
          @check="handleCheckChange"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>{{ node.label.includes('.') ? '父级菜单' : '' }}</span>
          </span>
        </el-tree>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitFn" :loading="btnStatus">确定</el-button>
        <el-button type="primary" size="small" plain @click="modalStatus = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import role from 'api/role'
import { get } from 'http'
import { createHash } from 'crypto'

let vmData = {
    btnStatus: false, // 按钮禁用状态
    editStatus: false, // 弹窗是否修改
    modalStatus: false, // 弹窗显示状态
    tableData: [],
    key: ['id', 'roleDescribe', 'roleName', 'roleType'],
    roleMenu: [],
    form: {
        roleName: '', // 角色名称
        roleType: '', // 角色分类
        roleDescribe: '', // 角色描述
        supper: 0, // 超级管理员
        whilelist: 0, //白名单权限
        whilelistClient: 0, //白名单客户权限
        powerTalent: 0, //达人权限
        talentReview: 0, //达人审核
        powerOrder: 0, //DB管理
        clientOrder: 0, //客户订单
        performance: 0, //查看业绩
        popularity: 0, // 人气宝案例
        authority: 0, // 权限管理
        menu: 0, //菜单管理
        powerRole: 0, //角色管理
        jurisdiction: 0, //用户管理
        cps: 0, // 京店联盟管理
        cpsPerformance: 0, // 京店联盟查看业绩
        cpsReview: 0, // 联盟审核
        whilelistAll: 0, // 白名单数据权限
        powerOrderAll: 0, // DB数据权限
        feedBack: 0, // 产品吐槽
        feedBackList: 0, // 吐槽列表
        orderPayment: 0, // 催付订单
        productReport: 0, // 产品报表
        jdbReport: 0, // 京店宝报表
        renqibaoReport: 0, // 人气宝报表
        jkjsReport: 0, // 京客集市报表
        cpsReport: 0, // 京店联盟报表
        qdReport: 0, // 渠道分析
        codeShow: 0, // 二维码显示
        customersInfo: 0, // 客户信息
        tryOneMore: 0, // 试一试管理
        tryOneReview: 0, // 试一试审核
        refund: 0, // 订单退款
        testGuestManege: 0, // 试客宝管理
        testGuestAll: 0, // 试客宝主管
        merberInfo: 0, // 会员信息
        shopInfo: 0, // 店铺信息
        customerInfo: 0, // 客户预留信息
        goodsReleaseReview: 0, // 活动发布审核
        applyBalanceReview: 0, // 申请结算审核
        shopDetailMonitor: 0, // 活动详情监控
        survey: 0, // 问卷调研
        thump: 0, // 咚咚群发
        news: 0, // 消息管理
        notice: 0, // 公告管理
        jingDianBao: 0, // 京店宝案例
        advertisementProject: 0, // 广告宝方案
        linglaBalance: 0, // 领啦提现
        subordinate: 0, // 下级联盟
        skbReport: 0, // 试客宝报表
        currency: 0, // 京币管理
        consumerDetails: 0, // 消费明细
        dataAnalysis: 0, // 数据分析
        ggbReport: 0, // 产品报表-广告宝
        activityDiscount: 0, // 活动优惠
        drawRule: 0, // 抽奖数据
        luck: 0, // 幸运100%
        proportion: 0, // 比例拆分
        jkjsRefund: 0, // 京客集市退款申请
        cpsRegisterNumber: 0, // CPS注册数统计
        vipGrade: 0, // 会员等级
        vipGrade0: 0, // 会员等级-充值记录
        vipGrade1: 0, // 会员等级-订购记录
        vipGrade2: 0, // 会员等级-邀请记录
        vipGrade3: 0, // 会员等级-会员赠送
        settled: 0, // 入驻宝管理
        material: 0, // 入驻宝-资料查看
        region: 0, // 入驻宝-地域管理
        smsReport: 0, // 产品报表-短信宝
        smsManage: 0, // 短信宝管理
        smsSend: 0, // 短信宝管理-发送情况统计
        ggbManage: 0, // 广告宝管理
        ggbCase: 0, // 广告宝管理-成功案例
        ggbPlan: 0, // 广告宝管理-计划优化任务
        ggbWhiteList: 0, // 广告宝管理-白名单管理
        jkjsMeal: 0, // 京客集市-自定义套餐
        customMenus: 0, // 产品运营-京店宝自定义菜单
        adsList: 0, // 产品运营-广告管理
        productPlug: 0, // 产品报表-插件管理
        reseller: 0, //分销商管理
        shareCode: 0, //分销商管理-推荐码查看
        bdCustomer: 0, //分销商管理-BD客户数据
        BdExchange: 0, //分销商管理-BD归属调整
        BdPayment: 0, //分销商管理-BD催付订单
        rqbManage: 0, //人气宝管理
        rqbFlow: 0 ,//人气宝管理-流量任务
        pushGoodsManage:0, // 有品库管理
        pushGoodsList:0, //有品库管理-商品推广审核
        settleList:0, //有品库管理-服务费收款
        merchantList:0, //有品库管理-客户信息
        pickerList:0, //有品库管理-挑客信息
        productManage:0, // 产品库管理
        productList:0, //产品库管理-产品库列表
        searchScholars: 0, // 搜索书生
        contentEdit:0
    },
    page: {
        pageNo: 1,
        pageSize: 10,
        total: null
    },
    treeData: [
        {
            label: '系统管理.',
            name: 'supper',
            children: [
                {
                    label: '产品运营.',
                    name: 'feedBack',
                    children: [
                        {
                            label: '问卷调研',
                            name: 'survey'
                        },
                        {
                            label: '吐槽列表',
                            name: 'feedBackList'
                        },
                        // {
                        //   label: '咚咚群发工具',
                        //   name: 'thump',
                        // },
                        {
                            label: '消息管理',
                            name: 'news'
                        },
                        {
                            label: '公告管理',
                            name: 'notice'
                        },
                        {
                            label: '活动优惠',
                            name: 'activityDiscount'
                        },
                        {
                            label: '比例拆分',
                            name: 'proportion'
                        },
                        {
                            label: '自定义菜单',
                            name: 'customMenus'
                        },
                        {
                            label: '会员等级',
                            name: 'vipGrade',
                            children: [
                                {
                                    label: '充值记录',
                                    name: 'vipGrade0'
                                },
                                {
                                    label: '订购记录',
                                    name: 'vipGrade1'
                                },
                                {
                                    label: '邀请记录',
                                    name: 'vipGrade2'
                                },
                                {
                                    label: '会员赠送',
                                    name: 'vipGrade3'
                                }
                            ]
                        },
                        {
                            label: '广告管理',
                            name: 'adsList'
                        },
                        {
                            label: '搜索书生',
                            name: 'searchScholars',
                        },
                        {
                            label: '文案编辑',
                            name: 'contentEdit',
                        },
                    ]
                },
                {
                    label: '京币管理.',
                    name: 'currency',
                    children: [
                        {
                            label: '消费明细',
                            name: 'consumerDetails'
                        },
                        {
                            label: '数据分析',
                            name: 'dataAnalysis'
                        },
                        {
                            label: '抽奖数据',
                            name: 'drawRule'
                        },
                        {
                            label: '幸运100%',
                            name: 'luck'
                        }
                    ]
                },
                {
                    label: '产品报表.',
                    name: 'productReport',
                    children: [
                        {
                            label: '京店宝',
                            name: 'jdbReport'
                        },
                        {
                            label: '人气宝',
                            name: 'renqibaoReport'
                        },
                        {
                            label: '广告宝',
                            name: 'ggbReport'
                        },
                        {
                            label: '入驻宝',
                            name: 'rzbReport'
                        },
                        // {
                        //     label: '短信宝',
                        //     name: 'smsReport'
                        // },
                        {
                            label: '插件管理',
                            name: 'productPlug'
                        },
                        {
                            label: '京客集市',
                            name: 'jkjsReport'
                        },
                        {
                            label: '京店联盟',
                            name: 'cpsReport'
                        },
                        {
                            label: '试客宝',
                            name: 'skbReport'
                        },
                        {
                            label: '渠道分析',
                            name: 'qdReport'
                        }
                    ]
                },
                {
                    label: '客户管理.',
                    name: 'powerOrder',
                    children: [
                        {
                            label: '催付订单',
                            name: 'orderPayment'
                        },
                        {
                            label: `主管权限`,
                            name: 'powerOrderAll'
                        },
                        {
                            label: '归属商家',
                            name: 'customersInfo'
                        },
                        {
                            label: '客户订单',
                            name: 'clientOrder'
                        },
                        {
                            label: '订单退款',
                            name: 'refund'
                        },
                        {
                            label: '查看业绩',
                            name: 'performance'
                        },
                        {
                            label: '人气宝案例',
                            name: 'popularity'
                        },
                        // {
                        //     label: '京店宝案例',
                        //     name: 'jingDianBao'
                        // }
                    ]
                },
                {
                    label: '广告宝管理.',
                    name: 'ggbManage',
                    children: [
                        {
                            label: '广告宝方案',
                            name: 'advertisementProject'
                        },
                        {
                            label: '成功案例',
                            name: 'ggbCase'
                        },
                        {
                            label: '计划优化任务',
                            name: 'ggbPlan'
                        },
                        {
                            label: '白名单管理',
                            name: 'ggbWhiteList'
                        }
                    ]
                },
                {
                    label: '京客集市.',
                    name: 'powerTalent',
                    children: [
                        {
                            label: '达人审核',
                            name: 'talentReview'
                        },
                        {
                            label: '退款申请',
                            name: 'jkjsRefund'
                        },
                        {
                            label: '自定义套餐管理',
                            name: 'jkjsMeal'
                        }
                    ]
                },
                {
                    label: '京店联盟管理.',
                    name: 'cps',
                    children: [
                        {
                            label: '联盟审核',
                            name: 'cpsReview'
                        },
                        {
                            label: '查看业绩',
                            name: 'cpsPerformance'
                        },
                        {
                            label: '下级联盟',
                            name: 'subordinate'
                        },
                        {
                            label: '注册数统计',
                            name: 'cpsRegisterNumber'
                        }
                    ]
                },
                {
                    label:'人气宝管理',
                    name:'rqbManage',
                    children:[
                        {
                            label:'流量任务',
                            name: 'rqbFlow'
                        }
                    ]
                },
                {
                    label: "产品库管理",
                    name:'productManage',
                    children:[
                        {
                            label:'产品库列表',
                            name:'productList'
                        }
                    ]
                },
                {
                    label: "有品库管理",
                    name:'pushGoodsManage',
                    children:[
                        {
                            label:'商品推广管理',
                            name:'pushGoodsList'
                        },
                        {
                            label:'服务费收款',
                            name:'settleList'
                        },
                        {
                            label:'客户信息',
                            name:'merchantList'
                        },
                        {
                            label:'挑客信息',
                            name:'pickerList'
                        },
                    ]
                },
                {
                    label: '分销商管理.',
                    name: 'reseller',
                    children: [
                        {
                            label: '推荐码查看',
                            name: 'shareCode'
                        },
                        {
                            label: 'BD客户数据',
                            name: 'bdCustomer'
                        },
                        {
                            label: 'BD归属调整',
                            name: 'BdExchange'
                        },
                        {
                            label: 'BD催付订单',
                            name: 'BdPayment'
                        }
                    ]
                },
                {
                    label: '入驻宝管理.',
                    name: 'settled',
                    children: [
                        {
                            label: '资料查看',
                            name: 'material'
                        },
                        {
                            label: '地域管理',
                            name: 'region'
                        }
                    ]
                },
                // {
                //     label: '短信宝管理.',
                //     name: 'smsManage',
                //     children: [
                //         {
                //             label: '发送情况统计',
                //             name: 'smsSend'
                //         }
                //     ]
                // },
                // {
                //     label: '试一试管理.',
                //     name: 'tryOneMore',
                //     children: [
                //         {
                //             label: '试一试审核',
                //             name: 'tryOneReview'
                //         }
                //     ]
                // },
                {
                    label: '试客宝管理.',
                    name: 'testGuestManege',
                    children: [
                        {
                            label: '试客宝主管',
                            name: 'testGuestAll'
                        },
                        {
                            label: '会员信息',
                            name: 'merberInfo'
                        },
                        {
                            label: '店铺信息',
                            name: 'shopInfo'
                        },
                        {
                            label: '客户预留信息',
                            name: 'customerInfo'
                        },
                        {
                            label: '活动发布审核',
                            name: 'goodsReleaseReview'
                        },
                        {
                            label: '申请结算审核',
                            name: 'applyBalanceReview'
                        },
                        {
                            label: '活动详情监控',
                            name: 'shopDetailMonitor'
                        },
                        {
                            label: '领啦提现',
                            name: 'linglaBalance'
                        }
                    ]
                },
                {
                    label: '业务管理.',
                    name: 'whilelist',
                    children: [
                        {
                            label: `主管权限`,
                            name: 'whilelistAll'
                        },
                        {
                            label: `白名单管理`,
                            name: 'whilelistClient'
                        },
                        {
                            label: '二维码管理',
                            name: 'codeShow'
                        }
                    ]
                },
                {
                    label: '权限管理.',
                    name: 'authority',
                    children: [
                        {
                            label: '用户管理',
                            name: 'jurisdiction'
                        },
                        {
                            label: '角色管理',
                            name: 'powerRole'
                        },
                        {
                            label: '菜单管理',
                            name: 'menu'
                        }
                    ]
                }
            ]
        }
    ]
}

export default {
    name: 'Role',
    data() {
        return vmData
    },
    methods: {
        pageLoad() {
            role.getRoleAll({
                page: vmData.page.pageNo,
                size: vmData.page.pageSize
            }).then(res => {
                if (res && res.code === 200) {
                    vmData.tableData = res.data
                    vmData.page.pageNo = res.page
                    vmData.page.total = res.allCount
                } else {
                    vmData.tableData = []
                    vmData.page.pageNo = 1
                    vmData.page.total = null
                }
            })
        },
        closeModalFn() {
            vmData.btnStatus = vmData.modalStatus = false
            vmData.roleMenu = []
            this.$refs.tree.setCheckedKeys([])
            for (let i in vmData.form) {
                if (!vmData.key.includes(i)) {
                    vmData.form[i] = 0
                } else {
                    vmData.form[i] = ''
                }
            }
        },
        editTree(menu = [], typeName, type) {
            menu.forEach(item => {
                if (Array.isArray(item.children)) {
                    this.editTree(item.children, typeName, type)
                } else if (item.name === typeName && type !== 0) {
                    vmData.roleMenu.push(item.id)
                }
            })
        },
        editFn(scope) {
            vmData.modalStatus = vmData.editStatus = true
            for (let i in scope) {
                if (scope[i] === 1 && !vmData.key.includes(i))
                    this.editTree(vmData.treeData, i, scope[i])
            }
            this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys([...vmData.roleMenu])
            })
            vmData.form = { ...scope }
        },
        getKeyValue(keyName, data, paramsForm, firstFloor = true) {
            let obj = {
                feedBack: 'productOperation',
                currency: 'jbManage',
                productReport: 'report',
                powerOrder: 'client',
                ggbManage: 'ggbManage',
                cps: 'cpsManage',
                settled: 'enter',
                smsManage: 'sms',
                tryOneMore: 'haveATry',
                testGuestManege: 'tester',
                whilelist: 'business',
                authority: 'permission',
                powerTalent: 'jingkejishi',
                reseller: 'reseller',
                rqbManage:'rqbManage',
                pushGoodsManage:'pushGoodsManage',
                productManage:'productManage'
            }
            firstFloor ? (paramsForm[obj[keyName]][keyName] = vmData.form[keyName]) : ''
            for (let [index, item] of data.children.entries()) {
                paramsForm[obj[keyName]][item.name] = vmData.form[item.name]
                item.children && item.children.length > 0 ? this.getKeyValue(keyName, item, paramsForm, false) : ''
            }
        },
        submitFn() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    const requst = vmData.editStatus
                        ? role.changeRole
                        : role.addRole
                    vmData.btnStatus = true
                    let paramsForm = {
                        id: vmData.editStatus ? vmData.form.id : '',
                        name: vmData.form.roleName,
                        type: vmData.form.roleType,
                        description: vmData.form.roleDescribe,
                        supper: vmData.form.supper,
                        productOperation: {},
                        jbManage: {},
                        report: {},
                        client: {},
                        ggbManage: {},
                        jingkejishi: {},
                        cpsManage: {},
                        enter: {},
                        sms: {},
                        haveATry: {},
                        tester: {},
                        business: {},
                        permission: {},
                        reseller: {},
                        rqbManage: {},
                        pushGoodsManage: {},
                        productManage: {},
                    }
                    for (let [
                        index,
                        item
                    ] of this.treeData[0].children.entries()) {
                        this.getKeyValue(item.name, item, paramsForm)
                    }
                    requst(paramsForm).then(res => {
                        if (res && res.code === 200) {
                            this.closeModalFn()
                            this.pageLoad()
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            })
                        } else {
                            vmData.btnStatus = false
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            })
                        }
                    })
                }
            })
        },
        deleteRole(id) {
            this.$confirm('是否确定删除此条信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                role.deleteRole({ id }).then(res => {
                    if (res && res.code === 200) {
                        this.pageLoad()
                        this.$message.success('删除成功')
                    } else {
                        this.$message.error('删除失败')
                    }
                })
            })
        },
        handleSizeChange(val) {
            vmData.page.pageSize = val
            this.pageLoad()
        },
        handleCurrentChange(val) {
            vmData.page.pageNo = val
            this.pageLoad()
        },
        handleCheckChange(data, checked) {
            let checkName = []
            let halfChecked = []
            halfChecked = checked.halfCheckedNodes.map(item => item.name)
            checkName = checked.checkedNodes.map(item => item.name)
            for (let i in vmData.form) {
                if (
                    checkName.includes(i) &&
                    !halfChecked.includes(i) &&
                    !vmData.key.includes(i)
                ) {
                    vmData.form[i] = 1
                } else if (
                    !checkName.includes(i) &&
                    halfChecked.includes(i) &&
                    !vmData.key.includes(i) &&
                    i !== 'supper'
                ) {
                    vmData.form[i] = 1
                } else if (!vmData.key.includes(i)) {
                    vmData.form[i] = 0
                }
            }
        },
        treeFn() {
            vmData.treeData.forEach((item, index) => {
                item.id = index.toString()
                item.children.forEach((child, childIndex) => {
                    childIndex = childIndex + 1
                    child.id = childIndex.toString()
                    if (child.children) {
                        child.children.forEach((data, i) => {
                            data.id = `${childIndex}-${i}`
                            if (data.children) {
                                data.children.forEach(
                                    (childData, childDataIndex) => {
                                        childData.id = `${childIndex}-${i}-${childDataIndex}`
                                    }
                                )
                            }
                        })
                    }
                })
            })
        }
    },
    created() {
        this.treeFn()
        this.pageLoad()
    }
}
</script>

<style lang="scss" scoped>
.header {
    padding: 30px;
    margin-bottom: 20px;
    .el-input {
        width: 75%;
        margin-right: 10px;
    }
}

.el-tree {
    border: 3px solid #409eff !important;
    border-radius: 5px;
    padding: 10px;
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
    width: 100% !important;
}
</style>
