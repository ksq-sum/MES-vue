<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="流转卡编号" prop="cardCode">
        <el-input
          v-model="queryParams.cardCode"
          placeholder="请输入流转卡编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产工单编号" prop="workorderCode">
        <el-input
          v-model="queryParams.workorderCode"
          placeholder="请输入生产工单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="批次号" prop="batchCode">
        <el-input
          v-model="queryParams.batchCode"
          placeholder="请输入批次号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品物料编码" prop="itemCode">
        <el-input
          v-model="queryParams.itemCode"
          placeholder="请输入产品物料编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品物料名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入产品物料名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['mes:pro:procard:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['mes:pro:procard:remove']"
        >删除</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="procardList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="流转卡编号" align="center" prop="cardCode" >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleView(scope.row)"
            v-hasPermi="['mes:pro:procard:query']"
          >{{scope.row.cardCode}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="生产工单编号" align="center" prop="workorderCode" />
      <el-table-column label="批次号" align="center" prop="batchCode" />
      <el-table-column label="产品物料编码" align="center" prop="itemCode" />
      <el-table-column label="产品物料名称" align="center" prop="itemName" />
      <el-table-column label="规格型号" align="center" prop="specification" />
      <el-table-column label="单位" align="center" prop="unitOfMeasure" />
      <el-table-column label="流转数量" align="center" prop="quantityTransfered" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
            <printLabel :businessId = "scope.row.cardId" :businessCode = "scope.row.cardCode" businessType = "PROCARD"></printLabel>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改工序流转卡对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="16">
            <el-row>
              <el-col :span="12">
                <el-form-item label="流转卡编号" prop="cardCode">
                  <el-input v-model="form.cardCode" placeholder="请输入流转卡编号" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="生产工单" prop="workorderCode">
                  <el-input v-model="form.workorderCode" placeholder="请选择生产工单" >
                    <el-button slot="append" icon="el-icon-search" @click="handleWorkorderSelect"></el-button>
                  </el-input>
                </el-form-item>
                <WorkorderSelect ref="woSelect" @onSelected="onWorkorderSelected"></WorkorderSelect>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="产品编码" prop="itemCode">
                  <el-input v-model="form.itemCode" readonly placeholder="请输入产品物料编码" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品名称" prop="itemName">
                  <el-input v-model="form.itemName" readonly placeholder="请输入产品物料名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="规格型号" prop="specification">
                  <el-input v-model="form.specification" type="textarea" placeholder="请输入内容" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="流转数量" prop="quantityTransfered">
                  <el-input-number v-model="form.quantityTransfered" :max="99999999" :min="1" placeholder="请输入流转数量" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="单位" prop="unitOfMeasure">
                  <el-input v-model="form.unitOfMeasure" readonly placeholder="请输入单位" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="批次号" prop="batchCode">
                  <el-input v-model="form.batchCode" placeholder="请输入批次号" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <BarcodeImg ref="barcodeImg" :bussinessId="form.cardId" :bussinessCode="form.cardCode" barcodeType="PROCARD"></BarcodeImg>
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
      <el-divider v-if="form.cardId !=null" content-position="center">工序</el-divider>
        <el-card shadow="always" v-if="form.cardId !=null" class="box-card">
          <Procardprocess :cardId="form.cardId" :optType="optType"></Procardprocess>
        </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="optType != 'view'">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listProcard, getProcard, delProcard, addProcard, updateProcard } from "@/api/mes/pro/procard";
import { printBarcodeLabel } from "@/api/print/print";
import printLabel from "@/components/printerLabel/index.vue"
import BarcodeImg from "@/components/barcodeImg/index.vue"
import Procardprocess from "./process.vue"
import WorkorderSelect from "@/components/workorderSelect/single.vue"
export default {
  name: "Procard",
  components: {BarcodeImg,Procardprocess,WorkorderSelect,printLabel},
  data() {
    return {
      optType: null,
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
      // 工序流转卡表格数据
      procardList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cardCode: null,        workorderId: null,        workorderCode: null,        workorderName: null,        batchCode: null,        itemId: null,        itemCode: null,        itemName: null,        specification: null,        unitOfMeasure: null,        barcodeUrl: null,        quantityTransfered: null,        status: null,        attr1: null,        attr2: null,        attr3: null,        attr4: null,      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cardCode: [
          { required: true, message: "请填写流转卡编号", trigger: "blur" },
          { max: 64, message: "字段过长", trigger: "blur" }
        ],
        workorderCode: [
          { required: true, message: "请选择生产工单", trigger: "blur" }
        ],
        specification: [
          { max: 250, message: "字段过长", trigger: "blur" }
        ],
        batchCode: [
          { max: 64, message: "字段过长", trigger: "blur" }
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
    /** 查询工序流转卡列表 */
    getList() {
      this.loading = true;
      listProcard(this.queryParams).then(response => {
        this.procardList = response.rows;
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
        cardId: null,        cardCode: null,        workorderId: null,        workorderCode: null,        workorderName: null,        batchCode: null,        itemId: null,        itemCode: null,        itemName: null,        specification: null,        unitOfMeasure: null,        barcodeUrl: null,        quantityTransfered: null,        status: "0",        remark: null,        attr1: null,        attr2: null,        attr3: null,        attr4: null,        createBy: null,        createTime: null,        updateBy: null,        updateTime: null      };
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.cardId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工序流转卡";
      this.optType = 'add';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const cardId = row.cardId || this.ids
      getProcard(cardId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工序流转卡";
        this.optType = 'edit';
      });
    },
    /** 修改按钮操作 */
    handleView(row) {
      this.reset();
      const cardId = row.cardId || this.ids
      getProcard(cardId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看工序流转卡";
        this.optType = 'view';
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.cardId != null) {
            updateProcard(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProcard(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const cardIds = row.cardId || this.ids;
      this.$modal.confirm('是否确认删除工序流转卡编号为"' + cardIds + '"的数据项？').then(function() {
        return delProcard(cardIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('pro/procard/export', {
        ...this.queryParams
      }, `procard_${new Date().getTime()}.xlsx`)
    },
    //选择生产工单
    handleWorkorderSelect(){
      this.$refs.woSelect.handleOpen(this.form.workorderId)
    },
    onWorkorderSelected(row){
      if(row != undefined && row != null){
        this.form.workorderId = row.workorderId;
        this.form.workorderCode = row.workorderCode;
        this.form.workorderName = row.workorderName;
        this.form.itemId = row.productId;
        this.form.itemCode = row.productCode;
        this.form.itemName = row.productName;
        this.form.specification = row.specification;
        this.form.unitOfMeasure = row.unitOfMeasure;
      }
    },
  }
};
</script>
