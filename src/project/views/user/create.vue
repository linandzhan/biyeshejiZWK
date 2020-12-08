<template>
  <el-dialog
    title="基本信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="40%"
    :before-close="handleClose"
  >
    <el-form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      label-width="150px"
    >
      <el-form-item label="姓名" prop="userName">
        <el-input
          v-model="formValidate.userName"
          placeholder="输入姓名"
        ></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="formValidate.phone"
          placeholder="输入手机号"
        ></el-input>
      </el-form-item>

      <el-form-item label="首次充值" prop="balance">
        <el-input
          v-model="formValidate.balance"
          placeholder="输入充值金额"
        ></el-input>
      </el-form-item>

      <el-form-item label="会员级别">
        <el-select v-model="formValidate.level" placeholder="请选择">
          <el-option key="l" label="初级" value="low"></el-option>
          <el-option key="m" label="中级" value="middle"></el-option>
          <el-option key="h" label="高级" value="high"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="创建时间" prop="creatTime">
        <el-date-picker
          v-model="formValidate.creatTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          placeholder="选择日期"
        >
          <!-- {{ newDate }} -->
        </el-date-picker>
      </el-form-item>
    </el-form>

    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="handleConfirm('formValidate')"
      >确 定</el-button
    >
  </el-dialog>
</template>

<script>
import emitter from "@/framework/mixins/emitter";
import { save } from "./user-service";

export default {
  name: "create",
  mixins: [emitter],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateBalance = (rule, value, callback) => {
      console.log("sss")
      let numReg = /^[0-9]*$/;
      let numRe = new RegExp(numReg);
      if (!numRe.test(value)) {
        callback(new Error("余额一定要为数字"));
      }else{
          callback();
      } 
    };

    return {
      //  newDate: new Date(),
      model: "userInfo",
      formValidate: {
        //       status: '启用',
        userName: "",
        password: "",
        realname: "",
        phone: "",
        email: "",
        image: "",
        comment: "",
        level: "",
        creatTime: new Date(),
        balance: "",
      },
      ruleValidate: {
        userName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        password: [{ required: true, message: "不能为空", trigger: "blur" }],

        // realname: [
        //   {required: true, message: "姓名不能为空", trigger: "blur"}
        // ],
        phone: [
            { required: true, message: "手机号不能为空", trigger: "blur" },
            { min: 11, max: 11, message: "手机号长度要准确", trigger: "blur" }
            ],
        // email: [
        //   {required: true, message: "邮箱不能为空", trigger: "blur"},
        //   {type: "email", message: "邮箱格式不对", trigger: "blur"}
        // ],
        balance: [
            { required: true, message: "金额不能为空", trigger: "blur" },
            { validator:validateBalance,trigger:"blur"}
        ],
      },
    };
  },

  computed: {},

  methods: {
    handleClose() {
      this.$emit("on-dialog-close");
    },

    handleConfirm(name) {
      this.broadcast("SiUpload", "on-form-submit", () => {});
      this.$nextTick(() => {
        this.$refs[name].validate((valid) => {
          if (valid) {
            console.log(this.formValidate);
            save({ [this.model]: this.formValidate }, (res) => {
              if (res.code == 200) {
                this.$message.success("添加成功");
                this.$emit("on-save-success");
              } else {
                this.$message.success("添加失败");
              }
            });
          }
        });
      });
    },

    // handleBalanceInput(e) {
    //   console.log(e);
    //   let numReg = /^[0-9]*$/;
    //   let numRe = new RegExp(numReg);
    //   if (!numRe.test(this.formValidate.balance)) {
    //     console.log("请输入数字");
    //   }
    // },
  },
};
</script>

<style scoped>
</style>
