<template>
  <el-dialog
    title="包场信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="30%"
    :before-close="handleClose"
  >
    <!--    <div style="overflow: auto;height:40vh;padding: 10px 0 40px;">-->
    <el-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      label-width="150px"
    >
      <el-form-item label="订场人电话" prop="phone">
        <el-input
          @blur.native.capture="isUser"
          v-model="formValidate.phone"
          placeholder="电话"
        ></el-input>
      </el-form-item>

      <el-form-item label="会员类型" prop="level">
        <el-input
          v-model="formValidate.level"
          placeholder="类型"
          :disabled="true"
        ></el-input>
      </el-form-item>

      <el-form-item label="预定日期" prop="playDay">
        <el-date-picker
          v-model="formValidate.playDay"
          type="date"
          placeholder="预定日期"
          value-format="yyyy-MM-dd"
          style="width: 150px"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="预定时间段" prop="periodId">
        <el-select v-model="formValidate.periodId" placeholder="时间段" @change='isSelectArea'>
          <el-option
            v-for="(item, i) in periodOptions"
            :key="i"
            :label="item.periodTime"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择场地" prop="areaId">
        <el-select v-model="formValidate.areaId" placeholder="场地">
          <el-option
            v-for="(item, i) in areaOptions"
            :key="i"
            :label="item.name"
            :value="item.id"
            :disabled="item.disabled"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!--    </div>-->

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        type="primary"
        @click="handleConfirm('formValidate')"
        style="margin-left:15px"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import Upload from "@/framework/components/upload";
import Editor from "@/framework/components/editor";
import {
  save,
  areaSearch,
  searchUserType,
  periodIdSearch,
  search
} from "../page-service"; //接口
import Emitter from "@/framework/mixins/emitter";

export default {
  mixins: [Emitter],
  name: "creat",
  components: {
    Upload,
    Editor
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      categoryList: [],
      radio: "1", //1是启用的意思
      show: false,

      formValidate: {
        areaId: "",
        phone: "",
        level: "",
        playDay: new Date(),
        periodId: ""
      },
      ruleValidate: {
        // title: [{ required: true, message: "不能为空", trigger: "blur" }],
        // position: [{ required: true, message: "不能为空", trigger: "blur" }],
        // content: [{ required: true, message: "不能为空", trigger: "blur" }]
      },
      model: "orderInfo",
      areaSearchModel:"searchAreaInfo",
      areaOptions: [],
      periodOptions: [],
      areaSearchParam:{}
    };
  },
  computed: {},
  methods: {
    onChangeEditor(val) {
      this.formValidate.content = val.html;
    },
    handleClose() {
      // this.visible = false;
      this.$emit("on-dialog-close");
    },
    isUser() {
      let _t = this;
      let phone = _t.formValidate.phone;
      let param = {
        userPhone: phone
      };
      searchUserType(param, res => {
        if (res.msg === "no-level") {
          _t.formValidate.level = "非会员";
        } else if (res.msg === "have-level") {
          if (res.data.level == "low") {
            _t.formValidate.level = "初级";
          } else if (res.data.level == "middle") {
            _t.formValidate.level = "中级";
          } else if (res.data.level == "high") {
            _t.formValidate.level = "高级";
          }
        }
      });
    },
    handleConfirm(name) {
      console.log(this.formValidate);
      this.$nextTick(() => {
        this.$refs[name].validate(valid => {
          if (valid) {
            save({ [this.model]: this.formValidate }, res => {
              this.$message.success("成功扣费"+res.data);
              this.$refs['formValidate'].resetFields();
              this.$emit("on-save-success");
            });
          }
        });
      });


    },
    handleTransportFileList(e) {
      console.log(e);
      this.formValidate.thumbnail = e[0].response.data;
    },
    handleTransportFileList2(e) {
      console.log(e);
      this.formValidate.blueprint = e[0].response.data;
    },
    searchOptions() {
      let param = {};

      // areaSearch(param, res => {
      //   res.data.forEach(element => {
      //     this.areaOptions.push({
      //       id: element.areaId,
      //       name: element.number
      //     });
      //   });
      // });

      periodIdSearch(param, res => {
        res.data.forEach(element => {
          this.periodOptions.push({
            id: element.periodId,
            periodTime: element.periodTime
          });
        });
      });

      this.isSelectArea();

      // console.log(this.areaOptions);
    },

    isSelectArea() {
      this.areaOptions = [];
      let _t = this;
      _t.areaSearchParam.periodId = this.formValidate.periodId;
      _t.areaSearchParam.playDay = this.formValidate.playDay;
      let param = {
        [this.areaSearchModel]: _t.areaSearchParam,
      };

      search(param, res => {
        let data = res.data;
        //areaOptions为false需要将对应的选择置为灰色
        data.forEach(element => {
          this.areaOptions.push({
            id: element.areaId,
            name: element.number,
            disabled: !element.isSpare
          });
        });
      });
    }
  },
  mounted() {
    this.searchOptions();
  },

  created() {
    // this.findById()
  }
};
</script>

<style scoped>
</style>
