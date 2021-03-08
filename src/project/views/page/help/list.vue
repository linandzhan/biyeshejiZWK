<template>
  <el-row class="page">
    <!--    搜索-->
    <el-col :span="24">
      <search
        style="width: 95%;margin: 10px auto"
        :search-items="searchItems"
        @on-search="searchBySearchItem"
      ></search>
    </el-col>

    <!--    按钮和分页-->
    <el-col :span="24">
      <div style="width: 95%; margin: 10px auto">
        <el-button
          icon="el-icon-picture-outline-round"
          type="primary"
          @click="toCreate"
          >包场预约
        </el-button>
        <!-- <el-dropdown :trigger="'click'" @command="handleClick" size="medium" @visible-change="onMenuChange"> -->

        <!-- <el-button icon="el-icon-menu" style="background:#3e5265;color: white ">更多操作<i
            :class="menu.visible?'el-icon-caret-top':'el-icon-caret-bottom'"></i></el-button> -->
        <!-- <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              icon="el-icon-edit"
              command="编辑"
              :disabled="selectList.length !== 1"
              :style="(selectList.length !== 1)?{'color':'rgba(255,255,255,0.4)'}:{'color':'#fff'}"
              @click="handleEdit"
            >
              编辑
            </el-dropdown-item>
          </el-dropdown-menu> -->
        <!-- </el-dropdown> -->
        <!-- <div class="pager-group">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, jumper, prev, next"
            :total="total"
          >
          </el-pagination>
        </div> -->
      </div>
    </el-col>

    <el-col :span="24" :data="data">
      <div class="checkBox">
        <el-row>
          <el-col class="header" style="border-radius: 4px;">
            预约查询
          </el-col>
        </el-row>

        <el-row class="mybox">
          <el-col
            :span="6"
            v-for="(item, index) in grounds"
            :key="index"
            class="mygroud"
          >
            <div
              :class="{ red: item.isSpare == false }"
              style="width: 100%; height: 100%; text-align: center"
            >
              {{ item.number }}
              <br />
              <span v-if="item.isSpare == false"> 被预定 </span>
              <span v-if="item.isSpare == true"> 可预定 </span>
              <br />
              {{ item.type }}
              <br />
              <span
                v-if="item.isSpare == false && item.userName != null"
                class="userNameClass"
              >
                预约人：{{ item.userName }}
              </span>
              <span
                v-if="item.isSpare == false && item.userName == null"
                class="userNameClass"
              >
                预约人电话:{{ item.phone }}
              </span>
              <span v-if="item.isSpare == false">
                <el-button
                  style="width: 40%; height: 28%"
                  type="primary"
                  @click="deleteOrder(item.number)"
                  >取消预订
                </el-button>
              </span>
            </div>
            <!-- <div class="grid-content bg-purple" v-for="item in list">{{item}}</div> -->
            <!-- 返回boolean类型，true的话就展示red样式，false的话就不展示red样式 -->
          </el-col>
        </el-row>
      </div>
    </el-col>

    <!--    表格-->
    <!-- <el-col :span="24"> -->
    <el-col :span="24"> </el-col>

    <!--    新建-->
    <i-create
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
      :id="editId"
    />
    <!--    &lt;!&ndash;    编辑&ndash;&gt;-->
    <i-edit
      :dialog-visible="editProps.visible"
      :id="editId"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
    />
  </el-row>
</template>
<script>
import Search from "@/framework/components/search";
import IEdit from "./edit";
import ICreate from "./create";
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
import { search, count, del, periodIdSearch } from "../page-service"; //接口
import { findById } from "../../user/user-service";

export default {
  name: "commodityAudit",
  mixins: [Emitter],

  data() {
    return {
      categoryListName: [],
      categoryListId: [],
      model: "searchAreaInfo",
      createProps: {
        visible: false,
      },
      editProps: {
        visible: false,
      },
      menu: {
        visible: false,
      },
      editId: 0, //编辑id
      data: [],
      selectList: [],
      sort: { desc: ["id"] },
      pageSize: 10,
      page: 1,
      total: 0,
      extraParam: {},
      periodList: [],
      searchItems: [
        {
          name: "时间段",
          key: "periodId",
          type: "select",
          displayValue: [],
          value: [],
        },
        {
          name: "预约日期",
          key: "playDay",
          type: "date",
        },
      ],
      periodIdList: [],
      grounds: [],
    };
  },
  // created() {
  //   this.search(1);
  // },
  computed: {
    route() {
      return this.$route;
    },
    isRed(item) {
      return true;
    },
  },
  components: {
    Search,
    ICreate,
    IEdit,
  },
  methods: {
    findById() {
      findById({ storeId: this.id }, (res) => {
        this.data = res;
      });
    },
    handleEdit() {
      this.editId = this.selectList[0].id;
      this.editProps.visible = true;
    },
    handleStatusChange(row) {
      let status;
      let _t = this;
      if (row.status.indexOf("启用") >= 0) {
        status = "禁用";
      } else {
        status = "启用";
      }
      this.$confirm(`确定${status}选中内容？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (status === "禁用") {
            disable({ id: row.id }, (res) => {
              _t.$message({
                type: "success",
                message: "已禁用!",
              });
              _t.search(_t.page);
            });
          } else {
            enable({ id: row.id }, (res) => {
              _t.$message({
                type: "success",
                message: "已启用!",
              });
              _t.search(_t.page);
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.search(1);
    },
    handlePageChange(page) {
      this.search(page);
    },
    handleSortChange(sort) {
      let order = sort.order;
      if (order === "ascending") {
        this.sort = {
          asc: [sort.prop],
        };
      } else {
        this.sort = {
          desc: [sort.prop],
        };
      }
      this.search(1);
    },
    searchBySearchItem(searchItems) {
      let keys = [];
      // console.log(searchItems)
      for (
        let i = 0,
          searchItemList = this.searchItems,
          len = searchItemList.length;
        i < len;
        i++
      ) {
        keys.push(searchItemList[i].key);
      }

      for (let i in keys) {
        if (searchItems[keys[i]]) {
          this.extraParam[keys[i]] = searchItems[keys[i]];
        } else {
          delete this.extraParam[keys[i]];
        }
      }

      //有时间段搜索进行转化字段
      if (this.extraParam.periodId) {
        let periodList = this.periodList;
        for (let i in periodList) {
          if (periodList[i].periodTime === this.extraParam.periodId) {
            this.extraParam.periodId = periodList[i].id;
          }
        }
        // console.log(this.extraParam.periodId)
        //      console.log(this.extraParam.playDay)
      } else {
        delete this.extraParam.periodId;
      }

      this.search(1);
    },

    search(page) {
      let _t = this;
      _t.page = page;
      _t.extraParam.label = "help";
      let param = {
        [this.model]: _t.extraParam,
      };

      search(param, (res) => {
        let data = res;
        _t.grounds = data.data; //赋值给data  改为_t.list = data
        //     _t.getTotal();
        _t.setGroundsType();
      });
    },

    setGroundsType() {
      let grounds = this.grounds;
      //     console.log(grounds);
      for (let key in grounds) {
        if (grounds[key].type === "standard") {
          grounds[key].type = "标准场";
        } else if (grounds[key].type === "small") {
          grounds[key].type = "小场";
        }
      }
    },

    deleteOrder(number) {
      // console.log(number);
      let _t = this;
      let extraParam = this.extraParam;
      let params = {
        number: number,
        periodId: extraParam.periodId,
        playDay: extraParam.playDay,
      };
      post("/api/orders/del", params, (res) => {
        _t.search(1);
        this.$message({
          type: "success",
          message: "取消预约成功!",
        });
      });
    },

    getTotal() {
      let _t = this;
      let param = {
        page: {},
      };
      for (let key in _t.extraParam) {
        param.page[key] = _t.extraParam[key];
      }
      count(param, (res) => {
        _t.total = parseInt(res);
      });
    },
    handleTransportSelectList(list) {
      this.selectList = list;
    },

    //批量启用
    batchEnable() {
      let _t = this;
      let selectList = this.selectList;
      this.$confirm("确定启用所选的记录吗?", "启用提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          selectList.map((s) => {
            enable({ id: s.id }, (res) => {
              _t.search(_t.page);
              // this.$message({
              //   type: 'success',
              //   message: '删除成功!'
              // });
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    //批量禁用
    batchDisable() {
      let _t = this;
      let selectList = this.selectList;
      this.$confirm("确定禁用所选的记录吗?", "启用提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          selectList.map((s) => {
            disable({ id: s.id }, (res) => {
              _t.search(_t.page);
              // this.$message({
              //   type: 'success',
              //   message: '删除成功!'
              // });
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },

    delete(id) {
      let _t = this;
      del({ id: id }, (res) => {
        _t.search(_t.page);
      });
    },
    enable(id, url) {
      let _t = this;
      post(url, { id: id }, (res) => {
        _t.search(_t.page);
      });
    },
    handleClose() {
      this.createProps.visible = false;
      this.editProps.visible = false;
    },
    handleSave() {
      this.createProps.visible = false;
      this.editProps.visible = false;
      this.search(this.page);
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    handleRowClick(row) {
      // print(this.id);
      this.editId = row.id;
      this.editProps.visible = true;
    },
    toDetail(row) {
      this.$router.push({ path: `show/` + row.id });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.search(this.page);
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;

      this.search(this.page);
    },
    onMenuChange(val) {
      //  console.log(val);
    },
    handleClick(command) {
      switch (command) {
        case "编辑":
          console.log("编辑");
          this.editId = this.selectList[0].id;
          this.createProps.visible = true;
          break;
      }
    },
    toCreate() {
      this.createProps.visible = true;
    },

    periodIdSearch() {
      let param = {};

      periodIdSearch(param, (res) => {
        res.data.forEach((element) => {
          //  console.log(element);
          this.searchItems[0].displayValue.push(element.periodTime);
          this.searchItems[0].value.push(element.periodTime);
          this.periodList.push({
            id: element.periodId,
            periodTime: element.periodTime,
          });
        });
      });
    },
  },

  mounted() {
    this.search(1);
    this.periodIdSearch();
  },
};
</script>
<style lang="less" scoped>
.page {
  overflow-y: auto;
  overflow-x: hidden;
}

.el-button + .el-button {
  margin-left: 2px;
}

.el-button--default:hover {
  color: #00a16c;
  border: 1px solid #00a16c;
  background: white;
}

.footor {
  margin: 10px 30px;
  width: 90%;
  text-align: right;
}

.mybox {
  width: 80%;
  display: flex;
  flex-wrap: wrap;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.item {
  flex: 0 0 25%;
  width: 25%;
}

.header {
  width: 80%;
  border: 1px solid #dcdfe6;
  text-align: center;
  line-height: 200%;
  height: 60px;
  font-size: 25px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.bg-purple {
  background: #d3dce6;
}

.mygroud {
  line-height: 150%;
  border: 1px solid #dcdfe6;
  height: 100px;
}
.red {
  background-color: rgba(28, 118, 236, 0.12);
}
.userNameClass {
  font-size: 5px;
  text-align: right;
}
.checkBox {
  margin: 50px 0px 0px 35px;
}
</style>
