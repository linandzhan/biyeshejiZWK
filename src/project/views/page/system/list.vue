<template>
  <el-row class="page">
    <!--    搜索-->
    <el-col :span="24">
      <search
        style="width: 95%; margin: 10px auto"
        :search-items="searchItems"
        @on-search="searchBySearchItem"
      ></search>
    </el-col>
    <!--    按钮和分页-->
    <el-col :span="24">
      <div style="width: 95%; margin: 10px auto">
        <el-button icon="el-icon-plus" type="primary" @click="toCreate"
          >新建场地</el-button
        >
 <!--       <el-button icon="el-icon-delete" @click="batchDelete"
          >删除场地</el-button
        > -->

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
    <!-- <el-col :span="24">
      <el-table
        :data="data"
        style="width: 95%; margin: 0 auto"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowClick"
        @sort-change="handleSortChange"
      > -->
    <el-col :span="24">
      <el-table
        :data="data"
        style="width: 100%; margin: 0 auto"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowClick"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="number" label="场地号"></el-table-column>

        <el-table-column prop="rentalPrice" label="租场价格"> </el-table-column>
        <el-table-column prop="type" label="场地类型" sortable>
        </el-table-column>
        <!-- <el-table-column prop="status" label="场地状态"> </el-table-column> -->
      </el-table>
    </el-col>

    <i-create
      :dialog-visible="createProps.visible"
      @on-dialog-close="handleClose"
      @on-save-success="handleSave"
    />
    <!--       :id="editId" -->
  </el-row>
</template>
<script>
import Search from "@/framework/components/search";
import ICreate from "./create";
import { post } from "@/framework/http/request";
import Emitter from "@/framework/mixins/emitter";
import { search, count, del, searchArea } from "../page-service"; //接口

export default {
  name: "commodityAudit",
  mixins: [Emitter],

  data() {
    return {
      categoryListName: [],
      categoryListId: [],
      // storeName: JSON.parse(decodeURIComponent(this.$route.params.storeName)),
      model: "page",
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
      searchItems: [
        {
          name: "球馆查询",
          key: "number",
          type: "string",
        },
        // {
        //   name: "更新时间",
        //   key: "updateAt",
        //   type: "datetimerange",
        // },
      ],
    };
  },
  // created() {
  //   this.search(1);
  // },
  computed: {
    route() {
      return this.$route;
    },
  },
  components: {
    Search,
    ICreate,
  },
  methods: {
    handleEdit() {
      this.editId = this.selectList[0].id;
      this.editProps.visible = true;
    },
    toCreate() {
      //       console.log("sadasd")
      this.createProps.visible = true;
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
      // //有时间段搜索进行转化字段
      // if (this.extraParam.updateAt) {
      //   this.extraParam.startUpdateAt = this.extraParam.updateAt[0];
      //   this.extraParam.endUpdateAt = this.extraParam.updateAt[1];
      //   delete this.extraParam.updateAt;
      // } else {
      //   delete this.extraParam.startUpdateAt;
      //   delete this.extraParam.endUpdateAt;
      // }
      this.search(1);
    },
    search(page) {
      let _t = this;
      _t.page = page;
      console.log(_t.extraParam.number);
      let param = {
        searchInfo: {
          page: page,
          size: _t.pageSize,
          sort: _t.sort,
          number: _t.extraParam.number,
        },
      };

      searchArea(param, (res) => {
        let data = res;
        _t.data = data.data.items;
        //        _t.getTotal();
        _t.total = data.data.total;
        _t.setProp();
      });
    },

    setProp() {
      console.log("sdada");
      let data = this.data;

      for (let i in data) {
        // console.log(data[i].type)
        if (data[i].type === "small") {
          data[i].type = "小场";
        } else if (data[i].type == "standard") {
          data[i].type = "标准场";
        }
      }

      if (type === "small") {
        console.log("sssaas");
        _t.data.type = "小场";
      } else if (type == "standard") {
        _t.data.type = "标准场";
      }
    },

    getTotal() {
      // let _t = this;
      // let param = {
      //   page: {},
      // };
      // for (let key in _t.extraParam) {
      //   param.page[key] = _t.extraParam[key];
      // }
      // count(param, (res) => {
      //   _t.total = parseInt(res);
      // });

      let _t = this;
      let type = this.data.type;
      if (type === "small") {
        console.log("sssaas");
        _t.data.type = "小场";
      } else if (type == "standard") {
        _t.data.type = "标准场";
      }
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
      this.search(this.page);
    },
    handleSelectionChange(val) {
      this.selectList = val;
    },
    // handleRowClick(row) {
    //   // print(this.id);
    //   this.editId = row.id;
    //   this.createProps.visible = true;
    // },
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
      console.log(val);
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

    batchDelete() {
      this.editId = row.id;
      console.log(row.id);
    }
  },
  mounted() {
    this.search(1);
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
  border: 1px solid#00a16c;
  background: white;
}
.footor {
  margin: 10px 30px;
  width: 90%;
  text-align: right;
}
</style>
