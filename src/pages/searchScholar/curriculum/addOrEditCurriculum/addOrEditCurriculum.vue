<!--添加或者编辑课程-->
<template>
  <div class="addOrEditCurriulum-container">
    <div class="currilumn-info">
      <div class="currilumn-info-title">课程信息</div>
      <div class="currilumn-info-item">
        <span>课程名称:</span>
        <el-input placeholder="请输入课程名称" v-model="form.curriculumName"></el-input>
      </div>
      <div class="currilumn-info-item">
        <span>页面位置:</span>
        <el-input placeholder="请输入页面位置" v-model="form.pageLocation"></el-input>
      </div>
      <div class="currilumn-info-item">
        <span>页面链接:</span>
        <el-input placeholder="请输入页面链接" v-model="form.pageLink"></el-input>
      </div>
    </div>
    <div class="curriulum-chapter">
      <div>
        <span class="curriulum-chapter-title">课程章节</span>
        <el-button
          type="primary"
          class="add-curriulum-button"
          @click="curriculumDialogVisible = true"
        >添加课程</el-button>
      </div>
      <ul class="chapter-level-item-ul">
        <li v-for="(item,i) in chapterLevelList" :key="i">
          <div class="title">{{item.levelName}}</div>
          <ul class="chapter-ul">
            <li v-for="(element,j) in item.chapterList" :key="j">
              <div class="chapter-number">第{{element.section}}节</div>
              <div class="chapter-name">章节名称：{{element.chapterName}}</div>
              <div class="buy-link" :title="element.buyLink">购买链接：{{element.buyLink}}</div>
              <div @click="delChapter(i,j)">
                <i class="iconfont icon-wuuiconsuoxiao"></i>
              </div>
            </li>
            <li v-if="!item.chapterList||item.chapterList.length===0" class="empty-li">请添加章节</li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="resources">
      <div class="resources-title">
        <span>资源</span>
        <el-button type="primary" @click="resourcesDialogVisible=true">添加资源</el-button>
      </div>
      <ul class="resources-item-ul">
        <li v-for="(item,i) in chapterLevelList" :key="i">
          <div class="title">{{item.levelName}}</div>
          <ul class="resources-ul">
            <li v-for="(element,j) in item.resourcesList" :key="j">
                <div class="sort">{{j+1}}</div>
                <div class="icon-box">
                  <span>icon：</span>
                  <img :src="element.iconImg" alt />
                </div>
                <div class="resources-name">资源名称：{{element.sourceName}}</div>
                <div class="resources-description">简介：{{element.sourceDesc}}</div>
                <i class="iconfont icon-wuuiconsuoxiao" @click="delResources(i,j)"></i>
            </li>
            <li v-if="!item.resourcesList||item.resourcesList.length===0" class="empty-li">请添加资源</li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="saveAll-btn-box">
      <el-button @click="saveAll" type="primary">保存</el-button>
    </div>
    <curriculum-dialog
      v-if="curriculumDialogVisible"
      :chapterLevelList="chapterLevelList"
      @insertSuccess="insertCurriculum"
      @closeDialog="curriculumDialogVisible=false"
    ></curriculum-dialog>
    <resources-dialog
      v-if="resourcesDialogVisible"
      :chapterLevelList="chapterLevelList"
      @insertSuccess="insertResources"
      @closeDialog="resourcesDialogVisible = false"
    ></resources-dialog>
  </div>
</template>
<script>
import searchScholar from "../../../../api/searchScholar";
import curriculumDialog from "./curriculumDialog";
import resourcesDialog from "./resourcesDialog";
import { numberConversion } from "../../../../utils/numberConversion";
export default {
  data() {
    return {
      chapterLevelList: [],
      form: {
        curriculumName: "",
        pageLocation: "",
        pageLink: "",
      },
      curriculumDialogVisible: false,
      resourcesDialogVisible: false,
      errorMsg: "",
    };
  },
  components: {
    curriculumDialog,
    resourcesDialog,
  },
  mounted() {
    if (this.$route.query.id) {
      this.getCurriculumInfo(this.$route.query.id);
    }
    this.getChapterLevelList();
  },
  methods: {
    getChapterLevelList() {
      searchScholar.getChapterLevelList().then((res) => {
        if (res.code === 200) {
          this.chapterLevelList = res.data;
        }
      });
    },
    getCurriculumInfo(id) {
      searchScholar.getCurriculumInfo({ courseId: id }).then((res) => {
        if (res.code === 200) {
          this.form.curriculumName = res.data.courseName;
          this.form.pageLocation = res.data.pageLocation;
          this.form.pageLink = res.data.pageLink;
          this.chapterLevelList.forEach((element, index) => {
            element.chapterList =
              res.data.saChapterInfoVOList[index].saChapterVOList;
            element.resourcesList =
              res.data.saSourceInfoVOList[index].saSourceVOList;
            element.chapterList.forEach((item, j) => {
              item.section = numberConversion(j + 1);
            });
          });
        }
      });
    },
    insertCurriculum(obj) {
      this.chapterLevelList.forEach((element) => {
        if (element.id === obj.level) {
          element.chapterList ? "" : (element.chapterList = []);
          if (element.chapterList.length >= 30) {
            this.$message.error("该级别章节数量不可超出30个");
            return;
          }
          let item = {
            levelId: obj.level,
            chapterName: obj.chapterName,
            buyLink: obj.buyLink,
            sort: element.chapterList.length + 1,
            section: numberConversion(element.chapterList.length + 1),
          };
          element.chapterList.push(item);
        }
      });
      this.curriculumDialogVisible = false;
    },
    insertResources(obj) {
      this.chapterLevelList.forEach((element) => {
        if (element.id === obj.level) {
          element.resourcesList ? "" : (element.resourcesList = []);
          if (element.resourcesList.length >= 10) {
            this.$message.error("该级别资源数量不可超出10个");
            return;
          }
          let item = {
            levelId: obj.level,
            iconImg: obj.imgUrl,
            sourceName: obj.resourcesName,
            sourceDesc: obj.description,
            sort: element.resourcesList.length + 1,
          };
          element.resourcesList.push(item);
        }
      });
      this.resourcesDialogVisible = false;
    },
    delChapter(i, j) {
      if (this.chapterLevelList[i].chapterList.length === 1) {
        this.$message.error("每个级别都必须有一节课程");
      } else {
        this.chapterLevelList[i].chapterList.splice(j, 1);
        this.$set(this.chapterLevelList, this.chapterLevelList);
      }
    },
    delResources(i, j) {
      this.chapterLevelList[i].resourcesList.splice(j, 1);
      this.$set(this.chapterLevelList, this.chapterLevelList);
    },
    validateForm() {
      if (this.form.curriculumName === "") {
        this.errorMsg = "课程名称不能为空";
      } else if (this.form.curriculumName.length > 25) {
        this.errorMsg = "课程名称必须在25个字以内";
      } else if (this.form.pageLocation.length > 25) {
        this.errorMsg = "页面位置必须在25个字以内";
      } else if (this.form.pageLink.length > 50) {
        this.errorMsg = "页面链接必须在50个字以内";
      } else {
        this.chapterLevelList.forEach((element) => {
          if (!element.chapterList || element.chapterList.length === 0) {
            this.errorMsg = "每个章节级别必须有一节课程";
            return;
          } else {
            this.errorMsg = "";
          }
        });
      }
    },
    dealParams() {
      let chapterList = [];
      let resourcesList = [];
      this.chapterLevelList.forEach((element) => {
        chapterList = chapterList.concat(element.chapterList);
        if (element.resourcesList) {
          element.resourcesList.forEach((item) => {
            if (!item) {
              item = {};
            }
          });
        }else{
          element.resourcesList = []
        }
        resourcesList = resourcesList.concat(element.resourcesList);
      });
      let params = {
        id: this.$route.query.id ? this.$route.query.id : "",
        courseName: this.form.curriculumName,
        pageLocation: this.form.pageLocation,
        pageLink: this.form.pageLink,
        saChapterParamList: chapterList,
        saSourceParamList: resourcesList,
      };
      return params;
    },
    async saveAll() {
      await this.validateForm();
      if (this.errorMsg !== "") return this.$message.error(this.errorMsg);
      let params = await this.dealParams();
      searchScholar.saveOrEditCurriculum(params).then((res) => {
        if (res.code === 200) {
          this.$router.go(-1);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.addOrEditCurriulum-container {
  padding: 30px;
  color: #333;
  .currilumn-info {
    .currilumn-info-title {
      font-size: 18px;
      padding-bottom: 10px;
    }
    .currilumn-info-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      height: 30px;
      line-height: 30px;
      padding-left: 35px;
      span {
        width: 80px;
        font-size: 16px;
      }
      /deep/ .el-input {
        margin: 0;
      }
      /deep/ .el-input__inner {
        width: 300px;
        height: 30px;
      }
    }
  }
  .curriulum-chapter {
    margin-top: 20px;
    .curriulum-chapter-title {
      font-size: 18px;
    }
    .add-curriulum-button {
      width: 80px;
      height: 30px;
      padding: 0;
      margin-left: 20px;
    }
    .chapter-level-item-ul {
      list-style-type: none;
      padding: 0 0 0 35px;
      margin: 0;
      li {
        .title {
          padding: 10px 0;
          font-size: 18px;
        }
        .chapter-ul {
          list-style-type: none;
          padding: 0 0 0 20px;
          margin: 0;
          li {
            display: flex;
            align-items: center;
            height: 30px;
            line-height: 30px;
            .chapter-number {
              width: 100px;
            }
            .chapter-name {
              width: 300px;
              padding-right: 20px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            .buy-link {
              width: 320px;
              padding-right: 50px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            .iconfont {
              font-size: 18px;
              cursor: pointer;
            }
          }
          .empty-li {
            color: #333;
            font-size: 14px;
          }
        }
      }
    }
  }
  .resources {
    padding-top: 20px;
    .resources-title {
      span {
        font-size: 18px;
        padding-right: 20px;
      }
      /deep/ .el-button {
        width: 80px;
        height: 30px;
        padding: 0;
      }
    }
    .resources-item-ul {
      list-style-type: none;
      padding: 0 0 0 35px;
      margin: 0;
      li {
        .title {
          padding: 10px 0;
          font-size: 18px;
        }
        .resources-ul {
          list-style-type: none;
          padding: 0 0 0 20px;
          margin: 0;
          li {
            display: flex;
            align-items: center;
            height: 30px;
            line-height: 30px;
            .sort {
              width: 60px;
            }
            .icon-box {
              width: 180px;
              display: flex;
              align-items: center;
              img {
                width: 30px;
                height: 30px;
              }
            }
            .resources-name {
              width: 300px;
              padding-right: 20px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            .resources-description {
              width: 300px;
              padding-right: 50px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }
            .iconfont {
              font-size: 18px;
              cursor: pointer;
            }
          }
          .empty-li {
            color: #333;
            font-size: 14px;
          }
        }
      }
    }
  }
  .saveAll-btn-box {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
