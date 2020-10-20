<template>
    <el-container>
        <el-main class="main">
            <el-row type="flex">
                <el-button @click="addAdsDialogShow(1)" size="small" type="primary">添加广告</el-button>
            </el-row>

            <template>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column label="顺序" prop="seq"></el-table-column>
                    <el-table-column label="产品" prop="productName"></el-table-column>
                    <el-table-column label="页面位置" prop="locationName"></el-table-column>
                    <el-table-column label="图片" prop="imgUrl">
                        <template slot-scope="scope">
                            <pre-view :previewList="[scope.row.imgUrl]">
                                <img :src="scope.row.imgUrl" alt style="width: 80px; height: 80px"/>
                            </pre-view>
                        </template>
                    </el-table-column>
                    <el-table-column label="上线时间" prop="upDate"></el-table-column>
                    <el-table-column label="下线时间" prop="downDate"></el-table-column>
                    <el-table-column label="跳转链接" prop="link">
                        <template slot-scope="scope">
                            <div>{{scope.row.link? scope.row.link : '--'}}</div>
                            <el-button @click="uploadFile('uploadFile',scope.row.id)" type="text">上传营销图</el-button>
                            <input @change="uploadFileChange($event)" ref="uploadFile"
                                   style="display: none" type="file">
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" prop="userName"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="sortAdsFn(scope.row.location)" type="text">排序</el-button>
                            <el-button @click="addAdsDialogShow(2,scope.row)" type="text">修改</el-button>
                            <el-button @click="deleteAds(scope.row.id)" class="red" type="text">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </template>

            <el-row
                    class="row-bg"
                    justify="end"
                    type="flex"
                    v-if="pagination.totalCount > pagination.size"
            >
                <el-pagination
                        :current-page="pagination.page"
                        :page-size="pagination.size"
                        :page-sizes="[10,20,50]"
                        :total="pagination.totalCount"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        layout="total, sizes, prev, pager, next, jumper"
                ></el-pagination>
            </el-row>

            <el-dialog
                    :close-on-click-modal="false"
                    :title="changeAdsType === 1? '添加广告' : '修改广告'"
                    :visible.sync="addAdsDialog"
                    center
                    width="30%"
            >
                <el-form
                        :model="adsForm"
                        :rules="rules"
                        class="demo-adsForm"
                        label-width="100px"
                        ref="adsForm"
                >
                    <el-form-item label="页面位置" prop="location">
                        <el-select placeholder="请选择活动区域" v-model="adsForm.location">
                            <el-option
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    v-for="item in locationOptions"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签">
                        <el-input v-model="adsForm.tag"></el-input>
                    </el-form-item>
                    <el-form-item label="上架时间" prop="upDate">
                        <el-date-picker
                                placeholder="选择日期"
                                style="width: 100%;"
                                type="datetime"
                                v-model="adsForm.upDate"
                                value-format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="下架时间" prop="downDate">
                        <el-date-picker
                                placeholder="选择日期"
                                style="width: 100%;"
                                type="datetime"
                                v-model="adsForm.downDate"
                                value-format="yyyy-MM-dd HH:mm:ss"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="是否跳转" prop="haveLink">
                        <el-radio-group v-model="adsForm.haveLink">
                            <el-radio label="1">是</el-radio>
                            <el-radio label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="跳转链接" prop="link" v-if="adsForm.haveLink === '1'">
                        <el-input v-model="adsForm.link"></el-input>
                    </el-form-item>
                    <el-form-item :class="{'hideAddBtn':adsForm.file.length}" label="图片" prop="file">
                        <el-upload
                                :auto-upload="false"
                                :file-list="adsForm.file"
                                :limit="1"
                                :on-change="handleChange"
                                :on-exceed="handleExceed"
                                :on-remove="handleRemove"
                                action="null"
                                list-type="picture-card"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-button :loading="loading" @click="changeAdsFn" type="primary">确认</el-button>
                        <el-button @click="addAdsDialog = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>

            <el-dialog :close-on-click-modal="false" :visible.sync="sortAdsDialog" center title="排序" width="30%">
                <vuedraggable class="wrapper" v-model="sortImgList">
                    <transition-group>
                        <div :key="item.imageUrl" class="item" v-for="item in sortImgList">
                            <img :src="item.imageUrl" alt="">
                            <i class="el-icon-s-fold"></i>
                        </div>
                    </transition-group>
                </vuedraggable>
                <el-row justify="center" type="flex">
                    <el-button :loading="loading" @click="changSeq" type="primary">确认</el-button>
                    <el-button @click="sortAdsDialog = false">取消</el-button>
                </el-row>
            </el-dialog>
        </el-main>
    </el-container>
</template>
<script>
    import advertisement from "api/advertisement";
    import preView from "components/preView";
    import vuedraggable from "vuedraggable";

    export default {
        name: "Advertisement",
        components: {
            preView, vuedraggable
        },
        data() {
            return {
                pagination: {
                    page: 1,
                    size: 10,
                    totalCount: 0
                },
                locationOptions: [],
                adsForm: {
                    location: "",
                    tag: "",
                    upDate: "",
                    downDate: "",
                    haveLink: "1",
                    link: "",
                    file: []
                },
                rules: {
                    location: [
                        {required: true, message: "请选择页面位置", trigger: "change"}
                    ],
                    tag: [{required: true, message: "请输入标签", trigger: "change"}],
                    upDate: [
                        {required: true, message: "请选择上架时间", trigger: "change"}
                    ],
                    downDate: [
                        {required: true, message: "请选择下架时间", trigger: "change"}
                    ],
                    file: [{required: true, message: "请选择图片", trigger: "change"}],
                    haveLink: [
                        {required: true, message: "请选择是否跳转", trigger: "change"}
                    ],
                    link: [{required: true, message: "请输入跳转链接", trigger: "change"}]
                },
                tableData: [],
                currentAdsId: 0,
                addAdsDialog: false,
                loading: false,
                changeAdsType: "",
                updateId: "",
                sortAdsDialog: false,
                productCode: this.$route.query.productCode,
                sortImgList: [],
                location: this.$route.query.location,
            };
        },
        watch: {
            productCode: {
                immediate: true,
                handler(val) {
                    this.getlocationOptions(val);
                    this.getAdsList();
                    this.pagination = {
                        page: 1,
                        size: 10,
                        totalCount: 0
                    };
                }
            },
            addAdsDialog: {
                handler(flag) {
                    if (!flag) {
                        this.initForm();
                    }
                }
            },
        },
        methods: {
            getlocationOptions(val) {
                const JDB = "1";
                const JKJS = "2";
                const RQB = "3";
                const JLJ = "4"
                const actions = {
                    [JDB]: () => {
                        this.locationOptions = [
                            {value: 9, label: "首页上方广告"},
                            {value: 2, label: "首页下方广告"}
                        ];
                    },
                    [JKJS]: () => {
                        this.locationOptions = [
                            {value: 3, label: "首页广告"},
                            {value: 4, label: "内容营销"},
                            {value: 5, label: "抖音营销"}
                        ];
                    },
                    [RQB]: () => {
                        this.locationOptions = [
                            {value: 6, label: "首页广告"},
                            { value: 7, label: "充值中心" },
                            { value: 8, label: "消费明细" },
                            { value: 10, label: "任务记录" },
                        ];
                    },
                    [JLJ]: () => {
                        this.locationOptions = [
                            {value: 12, label: "案例1"},
                            { value: 13, label: "案例2" },
                            { value: 14, label: "案例3" }
                        ];
                    }
                };
                actions[val]();
            },
            async getAdsList() {
                const params = {
                    page: this.pagination.page,
                    size: this.pagination.size,
                    location: this.location
                };
                const {code, data, msg} = await advertisement.getAdsList(params);
                if (code === 200) {
                    const {results, totalCount, pageNo} = data;
                    this.tableData = results;
                    this.pagination.page = pageNo;
                    this.pagination.totalCount = totalCount;
                }else{
                    this.$message.error(msg)
                }
            },
            deleteAds(id) {
                this.$confirm("此操作将删除广告, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(async () => {
                        const {code, data, msg} = await advertisement.deleteAds({id});
                        if (code === 200) {
                            this.pagination.page = 1;
                            this.$message.success(msg);
                            this.getAdsList();
                        }else{
                            this.$message.error(msg)
                        }
                    })
                    .catch(() => {
                        return false;
                    });
            },
            async uploadFile(ref, adsId) {
                this.currentAdsId = adsId;
                await this.$nextTick();
                this.$refs[ref].dispatchEvent(new MouseEvent("click"))
            },
            async uploadFileChange(e) {
                if (!e.target.files || !e.target.files[0]) return;
                let params = new FormData();
                params.append('file', e.target.files[0]);
                params.append('adsId', this.currentAdsId);
                const res = await advertisement.uploadPromotionImage(params);
                this.currentAdsId = 0;
                if (res.code === 200) {
                    this.$message.success('上传营销图成功');
                    this.getAdsList();
                }else{
                    this.$message.error(res.msg)
                }
            },
            handleChange(file, fileList) {
                this.adsForm.file = fileList;
            },
            handleRemove(file, fileList) {
                this.adsForm.file = fileList;
            },
            addAdsDialogShow(type, val) {
                this.addAdsDialog = true;
                this.changeAdsType = type;
                if (type === 2) {
                    this.updateId = val.id;
                    Object.keys(this.adsForm).forEach(key => {
                        if (key === "file") {
                            this.adsForm[key] = [{name: "file", url: val["imgUrl"]}];
                        } else if (key === "haveLink") {
                            this.adsForm[key] = String(val[key]);
                        } else {
                            this.adsForm[key] = val[key];
                        }
                    });
                } else {
                    this.adsForm = {
                        location: "",
                        tag: "",
                        upDate: "",
                        downDate: "",
                        haveLink: "1",
                        link: "",
                        file: []
                    };
                    this.$refs["adsForm"] ? this.$refs["adsForm"].resetFields() : "";
                }
            },
            handleExceed() {
                this.$message.error("当前限制选择 1 个文件");
            },
            changeAdsFn(formName) {
                this.$refs["adsForm"].validate(async valid => {
                    if (valid) {
                        this.loading = true;
                        let list = new FormData();
                        Object.keys(this.adsForm).forEach(key => {
                            if (key === "file") {
                                list.append(key, this.adsForm[key][0].raw || "");
                            } else {
                                list.append(key, this.adsForm[key]);
                            }
                        });
                        list.append("productCode", this.productCode);
                        Number(this.changeAdsType) === 2
                            ? list.append("id", this.updateId)
                            : "";
                        const {data, code, msg} =
                            Number(this.changeAdsType) === 1
                                ? await advertisement.addAds(list)
                                : await advertisement.updateAds(list);
                        code ? (this.loading = false) : "";
                        if (code === 200) {
                            this.$message.success(msg);
                            this.getAdsList();
                            this.addAdsDialog = false;
                        }else{
                            this.$message.error(msg)
                        }
                    } else {
                        return false;
                    }
                });
            },
            handleSizeChange(size) {
                this.pagination.size = size;
                this.pagination.page = 1;
                this.getAdsList();
            },
            handleCurrentChange(page) {
                this.pagination.page = page;
                this.getAdsList();
            },
            initForm() {
                this.adsForm = {
                    location: "",
                    tag: "",
                    upDate: "",
                    downDate: "",
                    haveLink: "1",
                    link: "",
                    file: []
                };
                this.addAdsDialog = false;
            },
            async sortAdsFn(location) {
                const {data, code,msg} = await advertisement.getAllImages({location})
                if (code === 200) {
                    this.sortImgList = data
                    this.sortAdsDialog = true
                }else{
                    this.$message.error(msg)
                }
            },
            async changSeq() {
                this.loading = true
                const {data, code, msg} = await advertisement.changSeq(this.sortImgList)
                if (code === 200) {
                    this.sortAdsDialog = false
                    this.$message.success('修改成功')
                    this.getAdsList()
                    this.loading = false
                } else {
                    this.loading = false
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
    .row-bg {
        padding: 15px 0;
    }

    .el-select {
        width: 100%;
    }

    /deep/ .hideAddBtn .el-upload--picture-card {
        display: none;
    }

    .wrapper {
        margin-bottom: 15px;

        .item {
            border: 1px solid #efefef;
            margin: 5px 0px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;

            img {
                width: 160px;
                height: 90px;
            }

            .el-icon-s-fold {
                font-size: 40px;
                margin-right: 20px;
            }
        }
    }
</style>