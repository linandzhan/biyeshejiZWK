<template>
  <el-dialog
    title="扣费操作"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="40%"
    :before-close="handleClose"
  >
    <el-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      label-width="80px"
      label-position="labelPosition"
    >
      <el-form-item label="充值金额" prop="rechargeMoney">
        <el-input
          v-model="formValidate.rechargeMoney"
          placeholder="输入金额"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="handleConfirm">确 定</el-button>
  </el-dialog>
</template>

<script>
import emitter from "@/framework/mixins/emitter";
import { rechargeBalance } from "./user-service";

export default {
  name: "recharge",
  mixins: [emitter],
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
      model: "rechargeInfo",
      formValidate: {
        userId: "",
        rechargeMoney: ""
      },

      ruleValidate: {}
    };
  },

  computed: {},

  methods: {
    handleClose() {
      console.log("ssss");
      this.$emit("on-dialog-close");
    },

    handleConfirm() {
      let _t = this;
      let param = {
        userId: _t.id + "",
        rechargeMoney: _t.formValidate.rechargeMoney + ""
      };

      rechargeBalance(param, res => {
        this.$message.success("充值成功");
        this.$refs['formValidate'].resetFields();
        this.$emit("on-save-success");
      });
    }
  }
};
</script>


<style>
</style>
