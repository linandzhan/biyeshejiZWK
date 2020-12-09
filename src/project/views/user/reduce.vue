<template>
  <el-dialog
    title="扣费操作"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="40%"
    :before-close="handleClose"
  >
    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="扣费金额" prop="reduceBalance">
        <el-input
          @blur.native.capture="culculate"
          v-model="formValidate.reduceBalance"
          placeholder="输入金额"
        ></el-input>
      </el-form-item>
    </el-form>

    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="折扣" prop="discount">
        <el-input v-model="formValidate.discount" placeholder="折扣" :disabled="true"></el-input>
      </el-form-item>
    </el-form>

    <el-form ref="formValidate" :model="formValidate" :rules="ruleValidate" label-width="150px">
      <el-form-item label="实际扣除金额" prop="actualBalance">
        <el-input v-model="formValidate.actualBalance" placeholder="实际扣除" :disabled="true"></el-input>
      </el-form-item>
    </el-form>

    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="handleConfirm('formValidate')">确 定</el-button>
  </el-dialog>
</template>
  
  <script>
import emitter from "@/framework/mixins/emitter";
import { save, culculateDiscount } from "./user-service";

export default {
  name: "reduce",
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
      model: "reduceInfo",
      formValidate: {
        userId: "",
        reduceBalance: "",
        discount: "",
        actualBalance: ""
      },
      ruleValidate: {}
    };
  },

  computed: {},

  methods: {
    handleClose() {
      this.$emit("on-dialog-close");
    },
    culculate() {
      //    console.log(this.id);
      // console.log(this.formValidate.reduceBalance)
      // this.formValidate.discount = this.formValidate.reduceBalance - 10;
      //   this.$nextTick(() => {
      //     this.$refs[name].validate(valid => {
      //       if (valid) {
      //         console.log(this.formValidate);
      //       }
      //     });
      //   });
      let _t = this;
      this.formValidate.userId = _t.id;
      
      let param = {
        [this.model]:_t.formValidate
      };
      culculateDiscount(param, res => {
        if (res.code == 200) {
        //   console.log(res);
            _t.formValidate.discount = res.data.discount;
            _t.formValidate.actualBalance = res.data.actualBalance;
        }
      });
    },


    // handleConfirm(form){
    //     this.$nextTick(() => {
    //     this.$refs[name].validate(valid => {
    //             if(valid) {
    //                 console.log(this.formValidate)
    //             }
    //         });
    //     });
    // }
  }
};
</script>
  
  <style>
</style>