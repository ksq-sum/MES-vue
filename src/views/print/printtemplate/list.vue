<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模板编号" prop="templateCode">
        <el-input
          v-model="queryParams.templateCode"
          placeholder="请输入模板编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模板名称" prop="templateName">
        <el-input
          v-model="queryParams.templateName"
          placeholder="请输入模板名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模板类型" prop="templateType">
        <el-select v-model="queryParams.templateType" placeholder="请选择模板类型" clearable>
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="启用状态" prop="enableFlag">
        <el-input
          v-model="queryParams.enableFlag"
          placeholder="请输入启用状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['template:template:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col
        :span="6"
        style="margin-bottom: 10px"
        :offset="1"
      >
        <el-card class="templateCard" >
          <div @click="handleAdd()" style="text-align: center; margin-top: 90px;">
            <svg-icon icon-class="add" style="width: 100px; height: 100px;"></svg-icon>
          </div>
        </el-card>
      </el-col>
      <el-col
        v-for="item in templateList"
        :key="item.templateId"
        :span="6"
        style="margin-bottom: 10px"
        :offset="1"
      >
        <el-card class="templateCard">
          <div slot="header" class="clearfix">
            <span style="margin-left: 5px">{{
              item.templateName
            }}</span>
            <div
              style="display: inline-block; float: right; cursor: pointer"
              @click="handleDelete(item)"
            >
              <el-tooltip effect="dark" content="删除模板" placement="top">
                <i class="el-icon-delete" style="margin-left: 15px" />
              </el-tooltip>
            </div>
            <div
              style="display: inline-block; float: right; cursor: pointer"
              @click="handleEdit(item)"
            >
              <el-tooltip effect="dark" content="编辑模板" placement="top">
                <i class="el-icon-edit-outline" style="margin-left: 15px" />
              </el-tooltip>
            </div>
          </div>
          <div style="margin-bottom: 10px;">
              <el-image :src="item.templatePic" fit="fill">
              </el-image>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 添加或修改打印模板配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="模板编号" prop="templateCode">
              <el-input v-model="form.templateCode" placeholder="请输入模板编号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item  label-width="80">
              <el-switch v-model="autoGenFlag"
                  active-color="#13ce66"
                  active-text="自动生成"
                  @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view'">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span=12>
            <el-form-item label="模板名称" prop="templateName">
              <el-input v-model="form.templateName" placeholder="请输入模板名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="模板类型" prop="templateType">
              <el-select v-model="form.templateType" placeholder="请选择模板类型">
                <el-option
                      v-for="dict in dict.type.print_template_type"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="纸张类型" prop="paperType">
              <el-select v-model="form.paperType" placeholder="请选择纸张类型">
                <el-option
                      v-for="dict in dict.type.print_paper_type"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否默认" prop="isDefault">
              <el-radio-group v-model="form.isDefault">
                  <el-radio
                    v-for="dict in dict.type.sys_yes_no"
                    :key="dict.value"
                    :label="dict.value"
                  >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="启用状态" prop="enableFlag">
              <el-radio-group v-model="form.enableFlag">
                  <el-radio
                    v-for="dict in dict.type.sys_yes_no"
                    :key="dict.value"
                    :label="dict.value"
                  >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTemplate, getTemplate, delTemplate, addTemplate, updateTemplate } from "@/api/print/template";
import {genCode} from "@/api/system/autocode/rule"
export default {
  name: "Template",
  dicts: ['print_template_type','sys_yes_no','print_paper_type'],
  data() {
    return {
      //自动生成编码
      autoGenFlag:false,
      optType: undefined,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 打印模板配置表格数据
      templateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        templateCode: null,        templateName: null,        templateType: null,        templateJson: null, paperType: null,     templateWidth: null, templateHeight: null,   isDefault: null,        enableFlag: null,        templatePic: null      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        templateCode: [
          { required: true, message: "模板编号不能为空", trigger: "blur" }
        ],
        templateName: [
          { required: true, message: "模板名称不能为空", trigger: "blur" }
        ],        templateType: [
          { required: true, message: "模板类型不能为空", trigger: "change" }
        ],      paperType: [
          { required: true, message: "请选择纸张类型", trigger: "change" }
        ],
        remark: [
          { max: 250, message: '长度必须小于250个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询打印模板配置列表 */
    getList() {
      this.loading = true;
      listTemplate(this.queryParams).then(response => {
        debugger;
        this.templateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        templateId: null,        templateCode: null,        templateName: null,        templateType: null,        templateJson: null, paperType: null, templatePic: null,  templateWidth: 1, templateHeight: 1,      isDefault: 'Y',        enableFlag: 'Y',        remark: null,        attr1: null,        attr2: null,        attr3: null,        attr4: null,        createBy: null,        createTime: null,        updateBy: null,        updateTime: null,        templatePic: null      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加打印模板";
    },
    handleEdit(item){
      this.$router.push({name: 'printTemplateEdit', params: item});
    },
    /** 删除按钮操作 */
    handleDelete(item) {
      const templateIds = item.templateId || this.ids;
      this.$modal.confirm('是否确认删除打印模板配置编号为"' + templateIds + '"的数据项？').then(function() {
        return delTemplate(templateIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
            addTemplate(this.form).then(response => {
              debugger;
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.form.templateId = response.data.templateId;
              this.$router.push({name: 'printTemplateEdit', params: this.form});
            });
        }
      });
    },
    //自动生成模板编码
    handleAutoGenChange(autoGenFlag){
      debugger;
      if(autoGenFlag){
        genCode('PRINT_TEMPLATE_CODE').then(response =>{
          this.form.templateCode = response;
        });
      }else{
        this.form.templateCode = null;
      }
    }
  }
};
</script>
<style>

.cardGroup {
  margin-top: 50px;
  display: flex;
  height: 400px;
}



.templateCard {
  border: solid 1px;
  width: 400px;
  height: 300px;
  cursor: pointer;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #666;
  background: #fff;
  box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
  border-color: rgba(0, 0, 0, .05);
  border-radius: 10px;
}

.cardHeader {
  float: right;
  padding: 2px 0;
}

</style>

