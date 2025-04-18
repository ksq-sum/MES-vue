<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="发料单编号" prop="issueCode">
        <el-input
          v-model="queryParams.issueCode"
          placeholder="请输入发料单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="外协工单编码" prop="workorderCode">
        <el-input
          v-model="queryParams.workorderCode"
          placeholder="请输入外协工单编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="供应商名称" prop="vendorName">
        <el-input
          v-model="queryParams.vendorName"
          placeholder="请输入供应商名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发料日期" prop="issueDate">
        <el-date-picker clearable
          v-model="queryParams.issueDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择发料日期">
        </el-date-picker>
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
          v-hasPermi="['mes:wm:outsourceissue:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['mes:wm:outsourceissue:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['mes:wm:outsourceissue:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="outsourceissueList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="发料单编号" align="center" prop="issueCode" >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleView(scope.row)"
            v-hasPermi="['mes:wm:outsourceissue:query']"
          >{{scope.row.issueCode}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="发料单名称" align="center" prop="issueName" />
      <el-table-column label="生产工单编码" align="center" prop="workorderCode" />
      <el-table-column label="供应商名称" align="center" prop="vendorName" />
      <el-table-column label="发料日期" align="center" prop="issueDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.issueDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.mes_order_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            v-if="scope.row.status =='PREPARE'"
            @click="handleExecute(scope.row)"
            v-hasPermi="['mes:wm:outsourceissue:edit']"
          >执行发料</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="scope.row.status =='PREPARE'"
            v-hasPermi="['mes:wm:outsourceissue:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.status =='PREPARE'"
            v-hasPermi="['mes:wm:outsourceissue:remove']"
          >删除</el-button>
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

    <!-- 添加或修改外协领料单头对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="发料单编号" prop="issueCode">
              <el-input v-model="form.issueCode" placeholder="请输入发料单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item  label-width="80">
              <el-switch v-model="autoGenFlag"
                  active-color="#13ce66"
                  active-text="自动生成"
                  @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view' && form.status =='PREPARE'">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发料单名称" prop="issueName">
              <el-input v-model="form.issueName" placeholder="请输入发料单名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
             <el-form-item label="发料日期" prop="issueDate">
              <el-date-picker clearable
                v-model="form.issueDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择发料日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发料仓库">
              <el-cascader v-model="warehouseInfo"
                :options="warehouseOptions"
                :props="warehouseProps"
                @change="handleWarehouseChanged"
              >
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单据状态" prop="status">
              <el-select v-model="form.status" disabled>
                <el-option
                  v-for="dict in dict.type.mes_order_status"
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
            <el-form-item label="外协工单" prop="workorderCode">
              <el-input v-model="form.workorderCode" placeholder="请选择外协工单" >
                <el-button slot="append" icon="el-icon-search" @click="handleWorkorderSelect"></el-button>
              </el-input>
            </el-form-item>
            <WorkorderSelect ref="woSelect" :workorder="workorder" @onSelected="onWorkorderSelected"></WorkorderSelect>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商" prop="vendorCode">
              <el-input v-model="form.vendorCode" readonly="readonly">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商名称" >
              <el-input v-model="form.vendorName" placeholder="请选择外协工单" >
              </el-input>
            </el-form-item>
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
      <el-divider v-if="form.issueId !=null" content-position="center">物料信息</el-divider>
      <el-card shadow="always" v-if="form.issueId !=null" class="box-card">
        <Issueline ref="line" :issueId="form.issueId" :warehouseId="form.warehouseId" :locationId="form.locationId" :areaId="form.areaId" :optType="optType"></Issueline>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="form.status =='PREPARE' && optType !='view' ">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOutsourceissue, getOutsourceissue, delOutsourceissue, addOutsourceissue, updateOutsourceissue, execute } from "@/api/mes/wm/outsourceissue";
import WorkorderSelect from "@/components/workorderSelect/single.vue"
import {getTreeList} from "@/api/mes/wm/warehouse"
import {genCode} from "@/api/system/autocode/rule"
import Issueline from "./line.vue";
export default {
  name: "Outsourceissue",
  dicts: ['mes_order_status'],
  components: {Issueline,WorkorderSelect},
  data() {
    return {
      autoGenFlag:false,
      optType: undefined,
      warehouseInfo:[],
      warehouseOptions:[],
      warehouseProps:{
        multiple: false,
        value: 'pId',
        label: 'pName',
      },
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
      // 外协领料单头表格数据
      outsourceissueList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //工单弹出框结果过滤参数
      workorder: { workorderType: 'OUTSOURCE'},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        issueCode: null,
        issueName: null,
        workorderId: null,
        workorderCode: null,        vendorId: null,        vendorCode: null,        vendorName: null,        vendorNick: null,        warehouseId: null,        warehouseCode: null,        warehouseName: null,        locationId: null,        locationCode: null,        locationName: null,        areaId: null,        areaCode: null,        areaName: null,        issueDate: null,        status: null,      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        issueCode: [
          { required: true, message: "发料单编号不能为空", trigger: "blur" },
          { max: 64, message: "字段过长", trigger: "blur" }
        ],
        issueName: [
          { required: true, message: "发料单名称不能为空", trigger: "blur" },
          { max: 100, message: "字段过长", trigger: "blur" }
        ],
        workorderCode: [
          { required: true, message: "请选择外协工单", trigger: "blur" }
        ],
        remark: [
          { max: 250, message: '长度必须小于250个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getWarehouseList();
  },
  methods: {
    /** 查询外协领料单头列表 */
    getList() {
      this.loading = true;
      listOutsourceissue(this.queryParams).then(response => {
        this.outsourceissueList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getWarehouseList(){
      getTreeList().then( response =>{
        if(response.data){
          this.warehouseOptions = response.data.filter((el) =>{
              return el.warehouseCode.indexOf('VIR') == -1;
          });;
        }
        this.warehouseOptions.map(w =>{
          w.children.map(l =>{
                  let lstr =JSON.stringify(l.children).replace(/locationId/g,'lId').replace(/areaId/g, 'pId').replace(/areaName/g,'pName');
                  l.children = JSON.parse(lstr);
          });

          let wstr = JSON.stringify(w.children).replace(/warehouseId/g,'wId').replace(/locationId/g, 'pId').replace(/locationName/g,'pName');
          w.children =  JSON.parse(wstr);

        });
        let ostr=JSON.stringify(this.warehouseOptions).replace(/warehouseId/g,'pId').replace(/warehouseName/g, 'pName');
        this.warehouseOptions = JSON.parse(ostr);
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
        issueId: null,
        issueCode: null,
        issueName: null,
        workorderId: null,
        workorderCode: null,
        vendorId: null,
        vendorCode: null,
        vendorName: null,
        vendorNick: null,
        warehouseId: null,
        warehouseCode: null,
        warehouseName: null,
        locationId: null,
        locationCode: null,
        locationName: null,
        areaId: null,
        areaCode: null,
        areaName: null,
        issueDate: new Date(),
        status: "PREPARE",
        remark: null,
        attr1: null,
        attr2: null,
        attr3: null,
        attr4: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.autoGenFlag = false;
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
      this.ids = selection.map(item => item.issueId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加外协发料单头";
      this.optType = "add";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const issueId = row.issueId || this.ids
      getOutsourceissue(issueId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改外协发料单头";
        this.optType = "edit";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.issueId != null) {
            updateOutsourceissue(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOutsourceissue(this.form).then(response => {
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
      const issueIds = row.issueId || this.ids;
      this.$modal.confirm('是否确认删除外协发料单头编号为"' + issueIds + '"的数据项？').then(function() {
        return delOutsourceissue(issueIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    // 查询明细按钮操作
    handleView(row){
      this.reset();
      const issueIds = row.issueId
      getOutsourceissue(issueIds).then(response => {
        this.form = response.data;
        this.warehouseInfo[0] = response.data.warehouseId;
        this.warehouseInfo[1] = response.data.locationId;
        this.warehouseInfo[2] = response.data.areaId;
        this.open = true;
        this.title = "查看外协发料单信息";
        this.optType = "view";
      });
    },
    //执行发料
    handleExecute(row){
      const issueIds = row.issueId || this.ids;
      this.$modal.confirm('确认执行发料？').then(function() {
        return execute(issueIds)
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("出库成功");
      }).catch(() => {});
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
        this.form.vendorId = row.vendorId;
        this.form.vendorCode = row.vendorCode;
        this.form.vendorName = row.vendorName;
      }
    },
    //供应商选择
    handleSelectVendor(){
      this.$refs.vendorSelect.showFlag = true;
    },
    //供应商选择弹出框
    onVendorSelected(obj){
        if(obj != undefined && obj != null){
          this.form.vendorId = obj.vendorId;
          this.form.vendorCode = obj.vendorCode;
          this.form.vendorName = obj.vendorName;
          this.form.vendorNick = obj.vendorNick;
        }
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag){
      if(autoGenFlag){
        genCode('OUTSOURCE_ISSUE_CODE').then(response =>{
          this.form.issueCode = response;
        });
      }else{
        this.form.issueCode = null;
      }
    }
  }
};
</script>
