<template>
    <div style="paddingTop:20px">
        <el-tabs v-model="activeIndex" type="card">
            <el-tab-pane label="待审核" name="1"></el-tab-pane>
            <el-tab-pane label="推广中" name="2"></el-tab-pane>
            <el-tab-pane label="已下架" name="4"></el-tab-pane>
        </el-tabs>

        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="任务ID"></el-table-column>
            <el-table-column prop="jdbAccount" label="京店宝账号"></el-table-column>
            <el-table-column prop="sku" label="商品SKU">
                <template slot-scope="scope">
                    <el-link type="primary" :href="scope.row.materialUrl" target="_blank">{{scope.row.sku}}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="couponUrl" label="优惠券链接">
                <template slot-scope="scope">
                    <el-link type="primary" :href="scope.row.couponUrl" target="blank">优惠券链接</el-link>
                </template>
            </el-table-column>
            <el-table-column label="商品封面">
                <template slot-scope="scope">
                    <el-image :src="scope.row.goodsImage"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="京东价">
                <template slot-scope="scope">
                    <span>￥{{ scope.row.goodsPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column label="优惠券金额">
                <template slot-scope="scope">
                    <span>￥{{ scope.row.couponMoney }}</span>
                </template>
            </el-table-column>
            <el-table-column label="券后价">
                <template slot-scope="scope">
                    <span>￥{{ scope.row.discountPrice }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="commission" label="佣金金额"></el-table-column>
            <el-table-column prop="serviceRatio" label="服务费"></el-table-column>
            <el-table-column prop="couponTime" label="优惠券领取时间"></el-table-column>
            <el-table-column prop="couponCount" label="优惠券数量"></el-table-column>
            <el-table-column prop="releaseType" label="任务类型"></el-table-column>
            <el-table-column prop="createTime" label="发布时间"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div v-if="activeIndex === '1'">
                        <el-button type="text" @click="argreeFn(scope.row)"
                        >同意
                        </el-button
                        >
                        <el-button
                                type="text"
                                style="color: red"
                                @click="rejectVisibleFn(scope.row.id)"
                        >拒绝
                        </el-button
                        >
                    </div>
                    <div v-if="activeIndex === '2'">
                        <el-button type="text" @click="downsGoods(scope.row.id)"
                        >下架商品
                        </el-button
                        >
                        <el-button type="text" style="color: red"
                                   @click="checkPromotionContent(scope.row.promotionContent)">查看文案
                        </el-button>
                        <el-button
                                type="text"
                                v-if="!scope.row.hot"
                                @click="updateGoodsHot(scope.row.id)"
                        >爆款
                        </el-button
                        >
                    </div>
                    <div v-if="activeIndex === '4'">
                        <el-button type="text" @click="checkPromotionContent(scope.row.promotionContent)">查看文案
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-row justify="end" type="flex" class="pagination" v-if="totalCount > 10">
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="page"
                    :page-size="size"
                    layout="prev, pager, next, jumper"
                    :total="totalCount"
            >
            </el-pagination>
        </el-row>
        <el-dialog
                title="拒绝原因"
                :visible.sync="rejectVisible"
                width="30%"
                center
        >
            <el-input
                    type="textarea"
                    placeholder="请输入拒绝原因"
                    v-model="reason"
            ></el-input>
            <span slot="footer" class="dialog-footer">
        <el-button @click="rejectVisible = false">取 消</el-button>
        <el-button type="primary" @click="verifyReject">确 定</el-button>
      </span>
        </el-dialog>

        <el-dialog title="审核" :visible.sync="examineVisible" width="30%" center>
            <el-form ref="form" :model="examineForm" label-width="90px">
                <el-form-item label="审核结果：">
                    <span>同意</span>
                </el-form-item>
                <el-form-item label="推广文案："></el-form-item>
            </el-form>
            <div style="padding: 0 8px">
                <el-input
                        type="textarea"
                        rows="10"
                        placeholder="请输入推广文案（非必填）"
                        v-model="examineForm.content"
                ></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button @click="examineVisible = false">取 消</el-button>
        <el-button type="primary" @click="verifyPass">确 定</el-button>
      </span>
        </el-dialog>

        <el-dialog
                title="推荐文案"
                :visible.sync="promotionVisible"
                width="30%"
                center
        >
            <p>{{promotionContent}}</p>
            <span slot="footer" class="dialog-footer">
        <el-button @click="promotionVisible = false">关 闭</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    import extendManage from "api/extendManage";

    export default {
        data() {
            return {
                tableData: [],
                page: 1,
                size: 10,
                totalCount: 0,
                rejectVisible: false,
                reason: "",
                goodsId: "",
                activeIndex: "1",
                examineVisible: false,
                examineForm: {
                    content: ""
                },
                promotionVisible: false,
                promotionContent: ""
            };
        },
        watch: {
            rejectVisible: {
                handler(val) {
                    if (!val) {
                        this.reason = "";
                    }
                }
            },
            activeIndex: {
                immediate: true,
                handler(val) {
                    this.listOperationManageGoods();
                }
            }
        },
        methods: {
            async listOperationManageGoods() {
                const params = {
                    page: this.page,
                    size: this.size,
                    status: this.activeIndex
                };
                const {data, code} = await extendManage.listOperationManageGoods(
                    params
                );
                const {results, pageNo, totalCount} = data;
                if (code === 200) {
                    this.tableData = results;
                    this.page = pageNo;
                    this.totalCount = totalCount;
                } else {
                    this.tableData = [];
                }
            },
            argreeFn(row) {
                this.goodsId = row.id;
                this.examineForm.content = row.promotionContent;
                this.examineVisible = true;
            },
            async verifyPass() {
                const params = {
                    goodsId: this.goodsId,
                    content: this.examineForm.content,
                };
                const {code} = await extendManage.verifyPass(params);
                if (code === 200) {
                    this.$message.success("审核成功");
                    this.listOperationManageGoods();
                    this.examineVisible = false;
                }
            },
            rejectVisibleFn(goodsId) {
                this.goodsId = goodsId;
                this.rejectVisible = true;
            },
            async verifyReject() {
                if (!this.reason) {
                    return this.$message.error("拒绝原因不能为空");
                }
                const params = {goodsId: this.goodsId, reason: this.reason};
                const {code, data} = await extendManage.verifyReject(params);
                if (code === 200) {
                    this.$message.success("操作成功");
                    this.rejectVisible = false;
                    this.listOperationManageGoods();
                }
            },
            handleCurrentChange(page) {
                this.page = page;
                this.listOperationManageGoods();
            },
            downsGoods(goodsId) {
                this.$confirm("是否下架商品", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(async () => {
                        const {code} = await extendManage.downGoods({goodsId});
                        if (code === 200) {
                            this.$message.success("操作成功");
                            this.listOperationManageGoods();
                        }
                    })
                    .catch(() => {
                        return false;
                    });
            },
            updateGoodsHot(goodsId) {
                this.$confirm("是否确认将商品设定为爆款商品", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(async () => {
                        const {code} = await extendManage.updateGoodsHot({goodsId});
                        if (code === 200) {
                            this.$message.success("操作成功");
                            this.listOperationManageGoods();
                        }
                    })
                    .catch(() => {
                        return false;
                    });
            },
            checkPromotionContent(content) {
                if (!content) return this.$message.error(`暂无推荐文案`)
                this.promotionContent = content
                this.promotionVisible = true
            }
        }
    };
</script>
<style lang="scss" scoped>
    /deep/ .el-textarea__inner {
        min-height: 100px !important;
    }

    .pagination {
        padding: 20px 50px 0 0;
    }

    /deep/ .el-form-item {
        margin-bottom: 0px;
    }
</style>
