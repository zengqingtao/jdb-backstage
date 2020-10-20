<template>
  <el-container>
    <el-main>
      <el-tabs type="card" v-model="authStatus">
        <el-tab-pane label="页面底部" name="1">
          <el-row
            v-if="QRCodeList && QRCodeList.length > 0"
            v-for="(data, type) of QRCodeList"
            :key="type"
          >
            <el-col v-if="![2,3,6,7,9,10,11].includes(type)">
              <h3>{{ data.title }}：</h3>
              <el-row class="rowParent">
                <div
                  v-if="data.List && data.List.length > 0"
                  v-for="item of data.List"
                  :key="item.id"
                >
                  <div @dblclick="edit(item.id, item.name, type)">
                    <img :src="item.img" />
                    <div class="showing" v-if="item.showMe === 1">展示中</div>
                    <div class="tooltip">
                      <span>{{ item.name || '双击编辑归属人员' }}</span>
                    </div>
                  </div>
                  <p @click="QRCodeDel(item.id, type)">删除</p>
                </div>
                <div>
                  <el-upload
                    class="avatar-uploader"
                    :action="upLoadImgUrl"
                    :show-file-list="false"
                    :headers="{ token:jdb_token }"
                    :data="{ type }"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
              </el-row>
              <el-row type="flex" class="row-bg" justify="end">
                <el-col class="page">
                  <el-pagination
                    v-show="pageList[type].total"
                    :page-size="pageSize"
                    @current-change="(index)=>handleCurrentChange(index,data,type)"
                    :current-page="pageList[type].pageNo"
                    layout="total, prev, pager, next, jumper"
                    :total="pageList[type].total"
                  ></el-pagination>
                </el-col>
              </el-row>
              <hr />
            </el-col>
          </el-row>
          <el-row class="tips">
            <p>备注（适用于京客集市/人气宝/试客宝/京店宝）：</p>
            <p>1.可上传多个BD的二维码图片</p>
            <p>2.默认每个BD展示1天，自动切换：</p>
            <p>&nbsp;&nbsp;当只有1个BD时，则一直循环展示这个BD</p>
            <p>&nbsp;&nbsp;当有多个BD时，则一直循环展示多个BD</p>
            <p>3.新增的BD二维码将在已上传的二维码都已展示完1天之后展示</p>
            <p>4.若删除某个BD二维码，自动展示下一个二维码，从次日0点开始计算展示时间</p>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="注册页面" name="2">
          <el-row>
            <el-col>
              <h3>注册页面：</h3>
              <el-row class="rowParent">
                <div
                  v-if="ReQrCodeList && ReQrCodeList.length > 0"
                  v-for="item of ReQrCodeList"
                  :key="item.id"
                >
                  <div @dblclick="edit(item.id, item.name)">
                    <img :src="item.img" />
                    <div class="showing" v-if="item.showMe === 1 || item.showMe === 2">展示中</div>
                    <div class="tooltip">
                      <span>{{ item.name || '双击编辑归属人员' }}</span>
                    </div>
                  </div>
                  <p @click="ReQrCodeDel(item.id)">删除</p>
                </div>
                <div>
                  <el-upload
                    class="avatar-uploader"
                    :action="ReUploadImgUrl"
                    :show-file-list="false"
                    :on-success="SuccessFn"
                    :headers="{ token:jdb_token }"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
              </el-row>
              <el-row type="flex" class="row-bg" justify="end">
                <el-col class="page">
                  <el-pagination
                    v-show="page.total"
                    :page-size="pageSize"
                    @current-change="CurrentFn"
                    :current-page="page.pageNo"
                    layout="total, prev, pager, next, jumper"
                    :total="page.total"
                  ></el-pagination>
                </el-col>
              </el-row>
              <hr />
            </el-col>
          </el-row>
          <el-row class="tips">
            <p>备注：</p>
            <p>1.可上传多个BD的二维码图片</p>
            <p>2.每个BD二维码在网页前端注册页面展示1天，每天自动切换</p>
            <p>3.当只有1个BD时，则一直循环展示这个BD；当有多个BD时，则一直循环展示多个BD</p>
            <p>4.新增的BD二维码将在已上传的二维码都已展示完1天之后展示</p>
            <p>5.若二维码删除，当天自动展示下一个二维码，但是下一个二维码的展示时间是从次日0点开始计算</p>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="有品库" name="3">
          <el-row
            v-if="QRCodeList && QRCodeList.length > 0"
            v-for="(data, type) of QRCodeList"
            :key="type"
          >
            <el-col v-if="[9,10,11].includes(type)">
              <h3>{{ data.title }}：</h3>
              <el-row class="rowParent">
                <div
                  v-if="data.List && data.List.length > 0"
                  v-for="item of data.List"
                  :key="item.id"
                >
                  <div @dblclick="edit(item.id, item.name, type)">
                    <img :src="item.img" />
                    <div class="showing" v-if="item.showMe === 1">展示中</div>
                    <div class="tooltip">
                      <span>{{ item.name || '双击编辑归属人员' }}</span>
                    </div>
                  </div>
                  <p @click="QRCodeDel(item.id, type)">删除</p>
                </div>
                <div>
                  <el-upload
                    class="avatar-uploader"
                    :action="upLoadImgUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :headers="{ token:jdb_token }"
                    :data="{ type }"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
              </el-row>
              <el-row type="flex" class="row-bg" justify="end">
                <el-col class="page">
                  <el-pagination
                    v-show="pageList[type].total"
                    :page-size="pageSize"
                    @current-change="(index)=>handleCurrentChange(index,data,type)"
                    :current-page="pageList[type].pageNo"
                    layout="total, prev, pager, next, jumper"
                    :total="pageList[type].total"
                  ></el-pagination>
                </el-col>
              </el-row>
              <hr />
            </el-col>
          </el-row>
          <el-row class="tips">
            <p>备注：</p>
            <p>1.可上传多个BD的二维码图片</p>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <el-dialog
      title="二维码图片信息"
      :visible.sync="editStatus"
      width="25%"
      center
      :close-on-click-modal="false"
      @close="closeModalFn"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item
          label="二维码名称:"
          prop="name"
          :rules="[ { required: true, message: '二维码名称不能为空'}]"
        >
          <el-input type="text" :rows="3" placeholder="请输入名称" v-model="form.name" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="nameSubmit">确定</el-button>
        <el-button type="primary" size="small" plain @click="editStatus = false">取消</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import qrCode from "api/qrCode";
import { mapState } from "vuex";

export default {
  name: "CodeShow",
  data() {
    return {
      codeType: 11,
      authStatus: "1",
      editStatus: false,
      upLoadImgUrl: process.env.VUE_APP_API + qrCode.uploadImg,
      ReUploadImgUrl: process.env.VUE_APP_API + qrCode.ReUploadImg,
      imageUrl: "",
      QRCodeList: [],
      pageList: [],
      type: "",
      form: {
        id: "",
        name: ""
      },
      ReQrCodeList: [],
      page: {
        pageNo: 1,
        total: null
      },
      pageSize: 5
    };
  },
  computed: {
    ...mapState(["jdb_token"])
  },
  methods: {
    SuccessFn(res) {
      if (res.code === 200) {
        this.$message({
          message: "上传成功！",
          type: "success"
        });
        if (this.authStatus === "1" || this.authStatus === "3") {
          for (let i = 0; i <= this.codeType; i++) {
            this.loadQRCodeList(i);
          }
        } else if (this.authStatus === "2") {
          this.loadReCodeListFn();
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    ReQrCodeDel(id) {
      this.$confirm(
        "若您删除当前二维码，网页将自动展示下一个二维码，请问是否确定？",
        "温馨提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        }
      ).then(() => {
        qrCode.ReDelete({ id }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: "二维码删除成功！",
              type: "success"
            });
            this.loadReCodeListFn();
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    CurrentFn(val) {
      this.page.pageNo = val;
      this.loadReCodeListFn();
    },
    async loadReCodeListFn() {
      const { data, page, allCount } = await qrCode.ReList({
        page: this.page.pageNo,
        size: this.pageSize
      });
      this.ReQrCodeList = data;
      this.page = {
        pageNo: page,
        total: allCount
      };
    },
    closeModalFn() {
      this.type = "";
      this.form = { id: "", name: "" };
    },
    edit(id, name, type) {
      type ? (this.type = type) : "";
      this.form = { id, name: name || "" };
      this.editStatus = true;
    },
    nameSubmit() {
      const request =
        this.authStatus === "1" || this.authStatus === "3"
          ? qrCode.changeName
          : qrCode.ReChange;
      request({ id: this.form.id, name: this.form.name }).then(res => {
        if (res.code === 200) {
          this.editStatus = false;
          this.$message({
            message: "二维码名称修改成功！",
            type: "success"
          });
          this.authStatus === "2"
            ? this.loadReCodeListFn()
            : this.loadQRCodeListCreated();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    QRCodeDel(id, type) {
      this.$confirm("是否确定删除此条二维码?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      }).then(() => {
        qrCode.deleteQRCode({ id }).then(res => {
          if (res.code === 200) {
            this.$message({
              message: "二维码删除成功！",
              type: "success"
            });
            this.loadQRCodeList(type);
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    handleAvatarSuccess(res) {
      if (res.code === 200) {
        this.$message({
          message: "上传成功！",
          type: "success"
        });
        for (let i = 0; i <= this.codeType; i++) {
          this.loadQRCodeList(i);
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    beforeAvatarUpload(file) {
      const isImage =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "image/jpg" ||
        file.type === "image/bmp";
      if (!isImage) {
        this.$message.error("二维码图片格式错误!");
      }
      return isImage;
    },
    handleCurrentChange(index, data, type) {
      this.pageList[type].pageNo = index;
      this.loadQRCodeList(type);
    },
    loadQRCodeList(type) {
      console.log("type:", type);
      qrCode
        .getQRCodeList({ type, page: this.pageList[type].pageNo, size: 5 })
        .then(res => {
          if (res.code === 200 && res.data.length > 0) {
            this.QRCodeList[type].List = res.data;
            this.pageList[type].pageNo = res.page;
            this.pageList[type].total = res.allCount;
          } else if (
            res.code === 200 &&
            res.data.length === 0 &&
            this.pageList[type].pageNo > 1
          ) {
            this.pageList[type].pageNo = this.pageList[type].pageNo - 1;
            this.loadQRCodeList(type);
          } else {
            this.QRCodeList[type].List = [];
            this.pageList[type].pageNo = 1;
            this.pageList[type].total = null;
          }
        });
    },
    loadQRCodeListCreated() {
      for (let i = 0; i <= this.codeType; i++) {
        let list = {};
        list.pageNo = 1;
        list.total = null;
        this.pageList.push(list);
        let info = {};
        const service = [
          "京客集市",
          "人气宝",
          "试客宝",
          "砍价宝",
          "广告宝",
          "入驻宝",
          "短信宝",
          "服务宝",
          "京店宝",
          "普通推品客服",
          "免单推品客服",
          "流量主入驻"
        ];
        info.title = service[i];
        info.List = [];
        this.QRCodeList.push(info);
        this.loadQRCodeList(i);
      }
    }
  },
  created() {
    this.loadQRCodeListCreated();
    this.loadReCodeListFn();
  }
};
</script>

<style lang="scss" scoped>
.rowParent {
  overflow: hidden;

  div {
    margin-right: 20px;
    width: 150px;
    text-align: center;
    float: left;

    div {
      position: relative;

      img {
        width: 150px;
        height: 150px;
      }

      .showing {
        position: absolute;
        top: 0;
        left: 0;
        width: 50px;
        height: 22px;
        line-height: 22px;
        background-color: #3489fe;
        font-size: 12px;
        color: #ffffff;
      }

      .tooltip {
        position: absolute;
        bottom: 4px;
        left: 0;
        width: 150px;
        height: 30px;
        line-height: 30px;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.5);
        font-size: 14px;
        border: none;
      }
    }

    p {
      color: red;
      cursor: pointer;
    }
  }

  div:last-child {
    border: 1px dashed #eeeeee;
    border-radius: 6px;
  }

  .avatar-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
}

.tips {
  p {
    font-size: 14px;
    color: #666666;

    &:first-child {
      color: #333333;
      font-size: 17px;
    }
  }
}
</style>
