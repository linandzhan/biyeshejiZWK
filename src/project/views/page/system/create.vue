<template>
  <el-dialog
    title="场地信息"
    :visible.sync="dialogVisible"
    :modal-append-to-body="false"
    width="40%"
    :before-close="handleClose"
  >
    <div>
      <el-form
        ref="formValidate"
        :model="formValidate"
        label-width="80px"
      >
        <el-form-item label="场地号" prop="number">
          <el-input
            v-model="formValidate.number"
            placeholder="场地号"
          ></el-input>
        </el-form-item>

        <el-form-item label="场地类型" prop="type">
          <el-select v-model="formValidate.type" placeholder="请选择">
            <el-option key="s" label="小场" value="small"></el-option>
            <el-option key="l" label="标准场" value="standard"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="handleConfirm('formValidate')"
      >确 定</el-button
    >
  </el-dialog>
</template>


<script>
import Emitter from "@/framework/mixins/emitter";
import {saveArea} from "../page-service";

export default {
  mixins: [Emitter],
  name: "create",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      model: "areaInfo",
      formValidate: {
          number:'',
          type: ''
      },
    };
  },

  computed: {},

  methods: {
    handleClose() {
      this.$refs['formValidate'].resetFields();
      this.$emit("on-dialog-close");
    },
    handleConfirm(name) {
      console.log("sdasdwww");
      saveArea(
        {[this.model]:this.formValidate},
        res => {
        if(res.code == 200){
          this.$message.success('添加成功');
          this.$refs['formValidate'].resetFields();
          this.$emit('on-save-success');
        }else{
          let msg = res.msg;
          this.$message.success(msg);
        }
      })
    },
  },
};
</script>

<style scoped>
</style>