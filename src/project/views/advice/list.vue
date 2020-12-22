<template>
  <el-row class="page">
    <!--    搜索-->
    <el-col :span="24">
      <search
        style="width:100%;margin: 20px auto auto 100px;"
        :search-items="searchItems"
        @on-search="searchBySearchItem"
      ></search>
      <!-- <div class="block">
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button icon="el-icon-search" type="primary" @click="onSearch"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="onReset">重置</el-button>
      </div> -->
    </el-col>

    <!-- 统计表格 -->
    <el-col :span="24">
      <div>
        <el-col :span="5" v-for="(item, index) in statistics" :key="index">
          <div class="tongji">
            <div
              style="font-weight:bold; font-size:25px; padding-top:10px; padding-left:10px "
            >
              {{ item.name }}
            </div>
            <div style="font-size:30px; text-align:center;">
              {{ item.data }}
              <span
                style="font-size:20px;"
                v-if="item.name == '收入增长金额' || item.name == '总收入'"
              >
                元
              </span>

              <span
                style="font-size:20px;"
                v-if="item.name == '订单增长数量' || item.name == '总订单'"
              >
                条
              </span>
            </div>
          </div>
        </el-col>
      </div>
    </el-col>

    <el-col :span="24">
      <div
        style="background:linear-gradient(to left,#FFFFFF,#b6b6b6,#FFFFFF);height:1px;"
      ></div>
    </el-col>

    <!--    按钮和分页-->
    <el-col :span="24">
      <div style="width: 99%;margin: 125px 0 0 10px;">
        <div class="pager-group">
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
        </div>
      </div>
    </el-col>
    <!--    表格-->
    <el-col :span="24">
      <el-table
        :data="data"
        style="width: 100%;margin:0px auto auto 100px;"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowClick"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="orderId" label="订单号"> </el-table-column>
        <el-table-column prop="phone" label="订场人手机号">
          <!-- <template slot-scope="scope">
            <el-button
              @click.native.prevent="toDetail(scope.row)"
              type="text"
              size="small"
            >
              {{ scope.row.advisorPhone }}
            </el-button>
          </template> -->
        </el-table-column>

        <el-table-column prop="employeeName" label="处理人"> </el-table-column>
        <el-table-column prop="areaName" label="场地" sortable>
        </el-table-column>
        <el-table-column prop="createTime" label="订单创建时间">
        </el-table-column>
        <el-table-column prop="periodTime" label="订场时间段">
        </el-table-column>
        <el-table-column prop="playDay" label="订场日期" sortable>
        </el-table-column>
        <!-- <el-table-column
          prop="updateAt"
          label="处理时间"
        >
        </el-table-column> -->
        <!-- <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button @click.stop="handleStatusChange(scope.row)" type="text" size="small" v-if="scope.row.status === '待处理'">标记已处理</el-button>
            <el-button @click.stop="handleStatusChange(scope.row)" type="text" size="small" v-else disabled>已处理</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
import Search from "@/framework/components/search";
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
import {
  search,
  count,
  del,
  batchDelete,
  enable,
  close,
  batchClose,
  searchStatisticsData
} from "./advice-service";

export default {
  mixins: [Emitter],
  data() {
    return {
      model: "dateTimeRange",
      menu: {
        visible: false
      },
      editId: 0, //编辑id
      data: [],
      selectList: [],
      sort: { asc: [], desc: [] },
      pageSize: 10,
      page: 1,
      total: 0,
      extraParam: {},
      searchItems: [
        // {
        //   name: "手机号",
        //   key: "advisorPhone",
        //   type: "string"
        // },
        {
          name: "时间查询",
          key: "startAndEnd",
          type: "datetimerange"
        }
      ],
      // grounds: ["订单总数","总收入","散场订单数量","散场收入"]
      statistics: [
        {
          name: "收入增长金额",
          key: "increaseIncome",
          data: ""
        },
        {
          name: "订单增长数量",
          key: "increaseOrders",
          data: ""
        },
        {
          name: "总收入",
          key: "allIncome",
          data: ""
        },
        {
          name: "总订单",
          key: "allOrders",
          data: ""
        }
      ]
      //   statisticsName: ["收入增长金额", "订单增长数量", "总收入", "总订单"]
    };
  },
  computed: {
    route() {
      return this.$route;
    }
  },
  components: {
    Search
  },
  methods: {
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.search(1);
    },
    handlePageChange(page) {
      this.search(page);
    },
    handleSortChange(sort) {
      let key = sort.key;
      let order = sort.order;
      let asc = this.sort.asc;
      let desc = this.sort.desc;
      if (asc.indexOf(key) > -1) {
        let idx = asc.indexOf(key);
        asc.splice(idx, 1);
      }
      if (desc.indexOf(key) > -1) {
        let idx = desc.indexOf(key);
        desc.splice(idx, 1);
      }
      if (order !== "normal") {
        this.sort[order].push(key);
      }
      this.search(1);
    },
    searchBySearchItem(searchItems) {
      let keys = [];
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
      if (this.extraParam.startAndEnd) {
        this.extraParam.start = this.extraParam.startAndEnd[0];
        this.extraParam.end = this.extraParam.startAndEnd[1];
        delete this.extraParam.startAndEnd;
      } else {
        delete this.extraParam.start;
        delete this.extraParam.end;
      }
      this.setStatisticsData();
      //    this.search(1);
    },
    search(page) {
      let _t = this;
      _t.page = page;
      let param = {
        pageable: {
          page: page,
          size: _t.pageSize,
          sort: _t.sort
        }
        // [this.model]: _t.extraParam
      };
      if (
        param.pageable.sort.asc.length === 0 &&
        param.pageable.sort.desc.length === 0
      ) {
        delete param.pageable.sort;
      }
      search(param, res => {
        let data = res;
        _t.data = data.data.items;
        _t.total = data.data.total;
        //    _t.getTotal();
      });
    },
    getTotal() {
      let _t = this;
      let param = { [this.model]: _t.extraParam };
      count(param, res => {
        _t.total = parseInt(res);
      });
    },
    handleTransportSelectList(list) {
      this.selectList = list;
    },
    //批量删除
    batchDelete() {
      this.broadcast("SiTable", "on-get-selectList");
      this.$nextTick(() => {
        let selectList = this.selectList;
        if (selectList.length === 0) {
          this.$notify.warning({
            title: "至少选择一条数据"
          });
          return;
        }
        this.$confirm("确定删除所选记录吗?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let idList = selectList.map(s => {
              return s.id;
            });
            batchDelete({ idList: idList }, res => {
              this.$message.success("删除成功");
              this.search(this.page);
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      });
    },
    //批量处理
    batchDeal() {
      let _t = this;
      let selectList = this.selectList;
      this.$confirm("确定处理所选的记录吗?", "启用提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let idList = selectList.map(s => {
            return s.id;
          });
          batchClose({ idList: idList }, res => {
            _t.$message.success("已处理");
            _t.search(this.page);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    delete(id) {
      let _t = this;
      del({ id: id }, res => {
        _t.search(_t.page);
      });
    },
    enable(id, url) {
      let _t = this;
      post(url, { id: id }, res => {
        _t.search(_t.page);
      });
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    handleRowClick(row) {},
    toDetail(row) {
      this.$router.push({ path: "/advice/show/" + row.id });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.search(this.page);
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;

      this.search(this.page);
    },
    handleStatusChange(row) {
      close({ id: row.id }, res => {
        this.$message.success("已处理");
        this.search(this.page);
      });
    },
    setStatisticsName() {
      // this.statisticsName.forEach(element => {
      //   this.statistics.push({
      //     name: element
      //   });
      // });
    },

    setStatisticsData() {
      let _t = this;
      let param = {
        [this.model]: _t.extraParam
      };

      searchStatisticsData(param, res => {
        let _t = this;

        let keys = [];
        for (
          let i = 0, statistics = _t.statistics, len = statistics.length;
          i < len;
          i++
        ) {
          // console.log(statistics[i].key)
          if (statistics[i].key == "increaseIncome") {
            statistics[i].data = res.data.increaseIncome;
          }
          if (statistics[i].key == "increaseOrders") {
            statistics[i].data = res.data.increaseOrdersQuantity;
          }
          if (statistics[i].key == "allIncome") {
            statistics[i].data = res.data.allIncome;
          }
          if (statistics[i].key == "allOrders") {
            statistics[i].data = res.data.allOrdersQuantity;
          }
        }
      });
    }
  },

  mounted() {
    this.search(1);
    this.setStatisticsName();
    // this.findAllRoles();
    this.setStatisticsData();
  }
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
  border: 1px solid#00a16c;
  background: white;
}
.footor {
  margin: 10px 30px;
  width: 90%;
  text-align: right;
}
.tongji {
  width: 80%;
  height: 130px;
  border: 1px solid #bbc7d8;
  border-radius: 10px;
  margin: 120px 0 0 250px;
}
</style>
