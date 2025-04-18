<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="工作站编码" prop="workstationCode">
            <el-input
              v-model="queryParams.workstationCode"
              placeholder="请输入工作站编码"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工作站名称" prop="workstationName">
            <el-input
              v-model="queryParams.workstationName"
              placeholder="请输入工作站名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所在车间名称" prop="workshopName">
            <el-select v-model="queryParams.workshopId" placeholder="请选择车间">
              <el-option
                v-for="item in workshopOptions"
                :key="item.workshopId"
                :label="item.workshopName"
                :value="item.workshopId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="所属工序" prop="processName">
            <el-select v-model="queryParams.processId" placeholder="请选择工序">
                <el-option
                  v-for="item in processOptions"
                  :key="item.processId"
                  :label="item.processName"
                  :value="item.processId"
                ></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['mes:md:workstation:add']"
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
          v-hasPermi="['mes:md:workstation:edit']"
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
          v-hasPermi="['mes:md:workstation:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mes:md:workstation:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workstationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工作站编号" align="center" prop="workstationCode" >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handleView(scope.row)"
            v-hasPermi="['mes:md:workstation:query']"
          >{{scope.row.workstationCode}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="工作站名称" align="center" prop="workstationName" />
      <el-table-column label="工作站地点" align="center" prop="workstationAddress" />
      <el-table-column label="所在车间名称" align="center" prop="workshopName" />
      <el-table-column label="所属工序" align="center" prop="processName" />
      <el-table-column label="是否启用" align="center" prop="enableFlag">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.enableFlag"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mes:md:workstation:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mes:md:workstation:remove']"
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

    <!-- 添加或修改工作站对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="14">
            <el-row>
              <el-col :span="16">
                <el-form-item label="工作站编号" prop="workstationCode">
                  <el-input v-model="form.workstationCode" placeholder="请输入工作站编码" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item  label-width="80">
                  <el-switch v-model="autoGenFlag"
                      active-color="#13ce66"
                      active-text="自动生成"
                      @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view'">
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="工作站名称" prop="workstationName">
                  <el-input v-model="form.workstationName" placeholder="请输入工作站名称" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="工作站地点" prop="workstationAddress">
                  <el-input v-model="form.workstationAddress" placeholder="请输入工作站地点" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="所在车间" prop="workshopId">
                    <el-select v-model="form.workshopId" placeholder="请选择车间">
                      <el-option
                        v-for="item in workshopOptions"
                        :key="item.workshopId"
                        :label="item.workshopName"
                        :value="item.workshopId"
                      ></el-option>
                    </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="10">
            <BarcodeImg ref="barcodeImg" :bussinessId="form.workstationId" :bussinessCode="form.workstationCode" barcodeType="WORKSTATION"></BarcodeImg>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属工序" prop="processId">
              <el-select v-model="form.processId" placeholder="请选择工序">
                <el-option
                  v-for="item in processOptions"
                  :key="item.processId"
                  :label="item.processName"
                  :value="item.processId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否启用" prop="enableFlag">
              <el-radio-group v-model="form.enableFlag" disabled v-if="optType=='view'">
                <el-radio
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
              <el-radio-group v-model="form.enableFlag" v-else>
                <el-radio
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
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
      <el-divider content-position="center" v-if="form.workstationId !=null">工作站资源</el-divider>
      <MachinerySelectSingle ref="machinerySelect" @onSelected="onMachineryAdd"></MachinerySelectSingle>
      <el-row v-if="form.workstationId !=null">
        <el-col :span=24>
          <el-carousel trigger="click" type="card" :autoplay="false">
            <el-carousel-item>
              <el-card shadow="always" style="width:450px">
                <div slot="header">
                  <span>设备资源</span>
                  <el-button style="float:right; padding: 3px 0" @click="handleMachineryAdd" v-if="optType !='view'" type="text">新增</el-button>
                </div>
                <WorkStationMachine ref="machineryList" :optType="optType" :workstationId="form.workstationId" style="align:center"></WorkStationMachine>
              </el-card>
            </el-carousel-item>
            <el-carousel-item>
              <el-card shadow="always" style="width:400px">
                <div slot="header">
                  <span>人力资源</span>
                  <el-button style="float:right; padding: 3px 0" @click="handlePostAdd" v-if="optType !='view'" type="text">新增</el-button>
                </div>
                <Workstationworker ref="postList" :optType="optType" :workstationId="form.workstationId"></Workstationworker>
              </el-card>
            </el-carousel-item>
            <el-carousel-item>
              <el-card shadow="always" style="width:400px">
                <div slot="header">
                  <span>工装夹具</span>
                  <el-button style="float:right; padding: 5px 0" @click="handleToolTypeAdd" v-if="optType !='view'" type="text">新增</el-button>
                </div>
                <WorkStationTool ref="toolList" :optType="optType" :workstationId="form.workstationId"></WorkStationTool>
              </el-card>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="optType !='view'">保 存</el-button>
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWorkstation, getWorkstation, delWorkstation, addWorkstation, updateWorkstation } from "@/api/mes/md/workstation";
//设备资源选择与保存
import WorkStationMachine from "./components/machine";
import MachinerySelectSingle from "@/components/machinerySelect/single.vue";
import {addWorkstationmachine} from "@/api/mes/md/workstationmachine";
//人力资源选择与保存
import Workstationworker from "./components/worker";

//工装夹具资源选择与保存
import WorkStationTool from "./components/tool";
import {getTreeList} from "@/api/mes/wm/warehouse"
import {listAllProcess} from "@/api/mes/pro/process";
import {genCode} from "@/api/system/autocode/rule";
import { listAllWorkshop } from "@/api/mes/md/workshop";
import { getBarcodeUrl } from "@/api/mes/wm/barcode";
import BarcodeImg from "@/components/barcodeImg/index.vue";
export default {
  name: "Workstation",
  dicts: ['sys_yes_no'],
  components: {WorkStationMachine,MachinerySelectSingle,Workstationworker,WorkStationTool,BarcodeImg},
  data() {
    return {
      //自动生成编码
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
      // 工作站表格数据
      workstationList: [],
      //车间选项
      workshopOptions:[],
      //工序选项
      processOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        workstationCode: null,
        workstationName: null,
        workstationAddress: null,
        workshopId: null,
        workshopCode: null,
        workshopName: null,
        processId: null,
        processCode: null,
        processName: null,
        warehouseId: null,
        locationId: null,
        areaId: null,
        enableFlag: null,
      },
      //二维码查询参数
      barcodeParams: {
        bussinessId: null,
        bussinessCode: null,
        barcodeFormart: 'QR_CODE', //模式二维码
        barcodeType: 'WORKSTATION' //类型
      },
      // 表单参数
      form: {
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        workstationAddress: null,
        workshopId: null,
        workshopCode: null,
        workshopName: null,
        processId: null,
        processCode: null,
        processName: null,
        warehouseId: null,
        locationId: null,
        areaId: null,
        enableFlag: 'Y',
        remark: null,
        barcodeUrl: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      },
      // 表单校验
      rules: {
        workstationCode: [
          { required: true, message: "工作站编号不能为空", trigger: "blur" },
          { max: 64, message: "字段过长", trigger: "blur" }
        ],
        workstationName: [
          { required: true, message: "工作站名称不能为空", trigger: "blur" },
          { max: 100, message: "字段过长", trigger: "blur" }
        ],
        workstationAddress: [
          { max: 100, message: "字段过长", trigger: "blur" }
        ],
        enableFlag: [
          { required: true, message: "是否启用不能为空", trigger: "blur" }
        ],
        workshopId: [
          { required: true, message: "请选择所属车间", trigger: "blur" }
        ],
        processId: [
          { required: true, message: "请选择所属工序", trigger: "blur" }
        ],
        remark: [
          { max: 250, message: '长度必须小于250个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getWorkshops();
    this.getProcess();
    this.getWarehouseList();
  },
  methods: {
    /** 查询工作站列表 */
    getList() {
      this.loading = true;
      listWorkstation(this.queryParams).then(response => {
        this.workstationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //查询车间信息
    getWorkshops(){
      listAllWorkshop().then( response => {
        this.workshopOptions = response.data;
      });
    },
    //查询工序信息
    getProcess(){
      listAllProcess().then( response =>{
        this.processOptions = response.data;
      });
    },
    //获取仓库
    getWarehouseList(){
      getTreeList().then( response =>{
        this.warehouseOptions = response.data;
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
        //选择默认的仓库、库区、库位
    handleWarehouseChanged(obj){
      if(obj !=null){
        this.form.warehouseId = obj[0];
        this.form.locationId = obj[1];
        this.form.areaId = obj[2];
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        workstationId: null,
        workstationCode: null,
        workstationName: null,
        workstationAddress: null,
        workshopId: null,
        workshopCode: null,
        workshopName: null,
        processId: null,
        processCode: null,
        processName: null,
        warehouseId: null,
        locationId: null,
        areaId: null,
        enableFlag: 'Y',
        remark: null,
        barcodeUrl: null,
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
      this.queryParams ={
        pageNum: 1,
        pageSize: 10,
        workstationCode: null,
        workstationName: null,
        workstationAddress: null,
        workshopId: null,
        workshopCode: null,
        workshopName: null,
        processId: null,
        processCode: null,
        processName: null,
        warehouseId: null,
        locationId: null,
        areaId: null,
        enableFlag: null,
      };
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.workstationId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getWorkshops();
      this.open = true;
      this.title = "添加工作站";
      this.optType = "add";
    },
    // 查询明细按钮操作
    handleView(row){
      this.reset();
      this.getWorkshops();
      const workstationId = row.workstationId || this.ids;
      getWorkstation(workstationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看工作站信息";
        this.optType = "view";
        this.$nextTick(()=>{
          this.$refs.barcodeImg.getBarcode();
        })
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getWorkshops();
      const workstationId = row.workstationId || this.ids
      getWorkstation(workstationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工作站";
        this.optType = "edit";
        this.$nextTick(()=>{
          this.$refs.barcodeImg.getBarcode();
        })
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.workstationId != null) {
            updateWorkstation(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWorkstation(this.form).then(response => {
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
      const workstationIds = row.workstationId || this.ids;
      this.$modal.confirm('是否确认删除工作站？').then(function() {
        return delWorkstation(workstationIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/md/workstation/export', {
        ...this.queryParams
      }, `workstation_${new Date().getTime()}.xlsx`)
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag){
      if(autoGenFlag){
        genCode('WORKSTATION_CODE').then(response =>{
          this.form.workstationCode = response;
        });
      }else{
        this.form.workstationCode = null;
      }
    },
    //设备资源选择弹出
    handleMachineryAdd(){
      this.$refs.machinerySelect.showFlag = true;
    },
    //设备资源选择回调
    onMachineryAdd(rows){
      debugger
      this.loading = true;
      rows.workstationId = this.form.workstationId;
      addWorkstationmachine(rows).then(response =>{
        this.$refs.machineryList.getList();
        this.loading = false;
      });
    },
    //人力资源-岗位新增
    handlePostAdd(){
      this.$refs.postList.handleAdd();
    },
    //工装夹具资源新增
    handleToolTypeAdd(){
      this.$refs.toolList.handleAdd();
    },
    //获取某个工作站的二维码地址
    getBarcodeUrl(){
      this.barcodeParams.bussinessId = this.form.workstationId;
      this.barcodeParams.bussinessCode = this.form.workstationCode;
      getBarcodeUrl(this.barcodeParams).then( response =>{
        if(response.data != null){
          this.$set(this.form,'barcodeUrl',response.data.barcodeUrl);//强制刷新DOM
        }
      });
    },
  }
};
</script>
<style scoped>
  .barcodeClass {
    width: 200px;
    height: 200px;
    border: 1px dashed;
    position: relative;
    display: inline-block;
  }

  .flex-container{
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
  }
</style>
