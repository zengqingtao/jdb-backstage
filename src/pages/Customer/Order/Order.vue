<template>
    <el-container>
        <el-header class="header">
            <el-row>
                <el-col :span="5">
                    <el-button type="primary" plain size="small" @click="modalStatus = true, editStatus = false">+添加订单
                    </el-button>
                    <el-button type="primary" plain size="small" @click="searchModalStatus = true">订单查询</el-button>
                </el-col>
                <el-col :span="19">
                    <el-row type="flex" justify="end">
                        <el-form inline label-width="100px">
                            <el-form-item label="登录手机号:">
                                <el-input v-model="searchWord" placeholder="请输入要查询的登录手机号" size="small"
                                          clearable></el-input>
                            </el-form-item>
                            <el-form-item label="日期查询:">
                                <el-date-picker v-model="date" value-format="yyyy-MM-dd" type="daterange"
                                                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                                placeholder="请输入要查询充值时间" size="small" clearable></el-date-picker>
                                <el-button class="mg-l-10" type="primary" size="small" @click="Search">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </el-col>
            </el-row>
        </el-header>

        <el-main>
            <el-table :data="tableData">
                <el-table-column prop="name" label="客户姓名">
                </el-table-column>
                <el-table-column prop="phone" label="客户电话">
                </el-table-column>
                <el-table-column prop="weChat" label="客户微信">
                </el-table-column>
                <el-table-column prop="account" label="登录手机号">
                </el-table-column>
                <el-table-column prop="clientType" label="客户类型">
                </el-table-column>
                <el-table-column label="订单号">
                    <template slot-scope="scope">
                        <div class="markParent">
                            <img v-if="scope.row.isPayment === 1" class="markImg" src="../../../assets/img/mark.png">
                            {{ scope.row.orderNumber }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="rechargeTime" label="充值时间">
                </el-table-column>
                <el-table-column prop="rechargeMoney" label="充值金额(元)">
                </el-table-column>
                <el-table-column prop="giveMoney" label="赠送金额">
                    <template slot-scope="scope">
                        <span>{{scope.row.giveMoney ? scope.row.giveMoney : 0 }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="moreGiftMoney" label="加送金额">
                </el-table-column>
                <el-table-column prop="resource" label="充值方式">
                </el-table-column>
                <el-table-column label="计入业绩">
                    <template slot-scope="scope">
                        {{ scope.row.isPerformance === 1 ? '是' : '否' }}
                    </template>
                </el-table-column>
                <el-table-column prop="dbName" label="BD">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="scope.row.disableGift" @click="giveMoney(scope)">赠送
                        </el-button>
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
                            :total="page.total">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-main>

        <el-dialog title="添加订单" :visible.sync="modalStatus" width="30%" center :close-on-click-modal="false"
                   @close="closeModalFn">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="登录手机号:" prop="account" :rules="[ { required: true, message: '登录手机号不能为空'}]">
                    <el-input v-model="form.account" @blur="loadCustomerInfo" placeholder="请输入登录手机号"
                              clearable></el-input>
                </el-form-item>
                <el-form-item label="客户姓名:" prop="name" :rules="[ { required: true, message: '客户姓名不能为空'}]">
                    <el-input :disabled="infoStatus" v-model="form.name" placeholder="请输入客户姓名" clearable></el-input>
                </el-form-item>
                <el-form-item label="客户电话:" prop="phone" :rules="[ { required: true, message: '客户电话不能为空'}]">
                    <el-input :disabled="infoStatus" v-model="form.phone" placeholder="请输入客户电话" clearable></el-input>
                </el-form-item>
                <el-form-item label="客户微信:" prop="weChat" :rules="[ { required: true, message: '客户微信不能为空'}]">
                    <el-input :disabled="infoStatus" v-model="form.weChat" placeholder="请输入客户微信" clearable></el-input>
                </el-form-item>
                <el-form-item label="订单号:" prop="orderNumber" :rules="[ { required: true, message: '订单号不能为空'}]">
                    <el-input v-model="form.orderNumber" placeholder="请输入订单号" clearable></el-input>
                </el-form-item>
                <el-form-item label="充值时间:" prop="rechargeTime" :rules="[ { required: true, message: '充值时间不能为空'}]">
                    <el-date-picker v-model="form.rechargeTime" value-format="yyyy-MM-dd" type="date"
                                    placeholder="请输入充值时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="充值金额:" prop="rechargeMoney"
                              :rules="[ { required: true, message: '充值金额不能为空'}, {type: 'number', message: '充值金额必须为数字'}]">
                    <el-input v-model.number="form.rechargeMoney" placeholder="请输入充值金额" clearable
                              @change="giveMoneyFn"></el-input>
                </el-form-item>
                <el-form-item label="赠送金额:">
                    <el-input v-model="form.giveMoney" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitFn" :loading="btnStatus">确定</el-button>
        <el-button type="primary" size="small" plain @click="modalStatus = false">取消</el-button>
      </span>
        </el-dialog>

        <el-dialog title="订单查询" :visible.sync="searchModalStatus" width="35%" center :close-on-click-modal="false"
                   @close="closeSearchModalFn">
            <el-form ref="searchForm" :model="searchForm" label-width="100px">
                <el-form-item label="登录手机号:" prop="account" :rules="[ { required: true, message: '登录手机号不能为空'}]">
                    <el-input v-model="searchForm.account" placeholder="请输入登录手机号" clearable></el-input>
                </el-form-item>
                <el-form-item label="充值金额:" prop="price"
                              :rules="[ { required: true, message: '充值金额不能为空'}, {type: 'number', message: '充值金额必须为数字'}]">
                    <el-input v-model.number="searchForm.price" placeholder="请输入充值金额" clearable
                              @change="giveMoneyFn"></el-input>
                </el-form-item>
                <el-form-item label="充值时间:" prop="datetime" :rules="[ { required: true, message: '充值时间不能为空'}]">
                    <el-date-picker v-model="searchForm.datetime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                                    placeholder="请输入充值时间"></el-date-picker>
                </el-form-item>
            </el-form>
            <el-row type="flex" justify="center">
                <el-button type="primary" size="small" :loading="btnStatus" @click="OrderSearchFn">查询</el-button>
            </el-row>
            <el-row v-if="OrderNumber" class="mg-t-20" type="flex" justify="center" align="middle">
                <span>订单号：<span ref="orderNum">{{ OrderNumber }}</span></span>
                <el-button class="mg-l-10" type="text" @click="copyFn">复制</el-button>
            </el-row>
        </el-dialog>

    </el-container>
</template>

<script>
    import {mapState} from 'vuex'
    import order from 'api/order'
    import customer from 'api/customer'

    export default {
        name: 'Order',
        data() {
            return {
                btnStatus: false, // 按钮禁用状态
                id: '', // 列表ID
                modalStatus: false, // 弹窗显示状态
                searchModalStatus: false, // 查询订单弹窗显示状态
                searchWord: '', // 搜索登录手机号
                date: [], // 查询充值时间
                tableData: [],
                searchForm: {
                    account: '', // 登录手机号
                    datetime: '', // 充值时间
                    price: '', // 充值金额
                },
                OrderNumber: '', // 查询到的订单号
                form: {
                    name: '', // 客户姓名
                    phone: '', // 客户电话
                    weChat: '', // 客户微信
                    account: '', // 登录手机号
                    orderNumber: '', // 订单号
                    rechargeTime: '', // 充值时间
                    rechargeMoney: '', // 充值金额
                    giveMoney: 0, // 赠送金额
                    userId: '' // 登录用户ID
                },
                page: {
                    pageNo: 1,
                    pageSize: 10,
                    total: null
                },
                infoStatus: false
            }
        },
        computed: {
            ...mapState(['jdb_userInfo'])
        },
        methods: {
            OrderSearchFn() {
                this.$refs['searchForm'].validate(valid => {
                    if (valid) {
                        this.btnStatus = true
                        order.searchOrderId(this.searchForm).then(res => {
                            this.btnStatus = false
                            if (res && res.code === 200) {
                                this.OrderNumber = res.data
                            } else {
                                this.OrderNumber = ''
                            }
                        })
                    }
                })
            },
            copyFn() {
                let oInput = document.createElement('input')
                oInput.value = this.OrderNumber
                document.body.appendChild(oInput)
                oInput.select()
                document.execCommand('Copy')
                document.body.removeChild(oInput)
                this.$message({
                    message: '复制成功！',
                    type: 'success',
                })
            },
            closeSearchModalFn() {
                this.searchForm = {
                    account: '', // 登录手机号
                    datetime: '', // 充值时间
                    price: '', // 充值金额
                }
                this.searchModalStatus = false
                this.OrderNumber = ''
            },
            Search() {
                this.page.pageNo = 1
                this.pageLoad()
            },
            giveMoneyFn(val) { // 判断充值金额大小 改变赠送金额
                if (5000 > val && val >= 2999) {
                    this.form.giveMoney = 400
                } else if (10000 > val && val >= 5000) {
                    this.form.giveMoney = 800
                } else if (20000 > val && val >= 10000) {
                    this.form.giveMoney = 2000
                } else if (30000 > val && val >= 20000) {
                    this.form.giveMoney = 4000
                } else if (val >= 30000) {
                    this.form.giveMoney = 6000
                } else {
                    this.form.giveMoney = 0
                }
            },
            pageLoad() {
                // 获取列表信息
                let startDate = ''
                let endDate = ''
                if (this.date && this.date.length === 2) {
                    startDate = this.date[0]
                    endDate = this.date[1]
                }
                order.getOrderAll({
                    id: this.form.userId,
                    startDate,
                    endDate,
                    page: this.page.pageNo,
                    size: this.page.pageSize,
                    search: this.searchWord
                }).then(res => {
                    if (res && res.code === 200) {
                        this.tableData = res.data
                        this.page.pageNo = res.page
                        this.page.total = res.allCount
                    } else {
                        this.tableData = []
                        this.page.pageNo = 1
                        this.page.total = null
                    }
                })
            },
            closeModalFn() {
                this.infoStatus = false
                this.btnStatus = false
                this.form = {
                    name: '', // 账户
                    phone: '', // 店铺名称
                    weChat: '', // 权限
                    account: '', // 联系人电话
                    orderNumber: '', // 权限
                    rechargeTime: '', // 有效开始时间
                    rechargeMoney: '', // 有效结束时间
                    giveMoney: '', // 有效结束时间
                    userId: this.jdb_userInfo.id // 登录用户ID
                }
            },
            submitFn() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.btnStatus = true
                        order.addOrder(this.form).then(res => {
                            if (res && res.code === 200) {
                                this.modalStatus = false
                                this.btnStatus = false
                                this.pageLoad()
                                this.$message({
                                    message: res.msg,
                                    type: 'success',
                                });
                            } else {
                                this.btnStatus = false
                            }
                        })
                    }
                })
            },
            handleSizeChange(val) {
                this.page.pageSize = val
                this.pageLoad()
            },
            handleCurrentChange(val) {
                this.page.pageNo = val
                this.pageLoad()
            },
            loadCustomerInfo() {
                if (this.form.account !== '') {
                    customer.customerInfo({account: this.form.account}).then(res => {
                        if (res.code === 200 && res.data) {
                            if (res.data.userId !== this.jdb_userInfo.id && Number(res.data.belong) === 1 ) {
                                this.$message({
                                    message: '该客户非本BD客户!',
                                    type: 'error',
                                })
                            } else {
                                this.infoStatus = true
                                this.form.name = res.data.name
                                this.form.phone = res.data.phone
                                this.form.weChat = res.data.weChat
                            }          
                            this.infoStatus = false
                        }
                    })
                } else {
                    this.infoStatus = false
                    this.form.name = ''
                    this.form.phone = ''
                    this.form.weChat = ''
                }
            },
            async giveMoney(scope) {
                const {value} = await this.$prompt('', '赠送', {
                    confirmButtonText: '提交',
                    cancelButtonText: '取消',
                    inputPattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/,
                    inputPlaceholder: "请输入加送金额",
                    inputErrorMessage: '金额格式错误'
                });
                const results = await order.addMoreGiftMoney({orderId: scope.row.orderId, money: value});
                if(results.code === 200){
                    this.$message.success('赠送成功');
                    this.pageLoad()
                }
            }
        },
        mounted() {
            this.form.userId = this.jdb_userInfo.id
            this.pageLoad()
        },
        destroyed() {
            Object.assign(this.$data, {
                btnStatus: false, // 按钮禁用状态
                id: '', // 列表ID
                modalStatus: false, // 弹窗显示状态
                searchModalStatus: false, // 查询订单弹窗显示状态
                date: [], // 查询充值时间
                tableData: [],
                searchForm: {
                    account: '', // 登录手机号
                    datetime: '', // 充值时间
                    price: '', // 充值金额
                },
                OrderNumber: '', // 查询到的订单号
                form: {
                    name: '', // 客户姓名
                    phone: '', // 客户电话
                    weChat: '', // 客户微信
                    account: '', // 登录手机号
                    orderNumber: '', // 订单号
                    rechargeTime: '', // 充值时间
                    rechargeMoney: '', // 充值金额
                    giveMoney: 0, // 赠送金额
                    userId: '' // 登录用户ID
                },
                page: {
                    pageNo: 1,
                    pageSize: 10,
                    total: null
                },
                infoStatus: false
            })
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        padding: 30px;
        margin-bottom: 20px;
        .el-input {
            margin-right: 10px;
        }
    }

    .el-dialog {
        .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 100% !important;
        }
    }

    .markParent {
        position: relative;
        height: 41px;
        line-height: 41px;
        .markImg {
            position: absolute;
            top: 5px;
            left: 20px;
        }
    }
</style>
