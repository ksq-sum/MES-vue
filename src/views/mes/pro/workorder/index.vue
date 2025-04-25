<template>
  <div class="app-container">
    <!-- 生产工单 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="148px" style="margin-left:-50px;">
      <el-form-item label="销售订单编号" prop="workorderCode">
        <el-input
          v-model="queryParams.workPlanCode"
          placeholder="请输入销售订单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="工单名称" prop="workorderName">
        <el-input
          v-model="queryParams.workorderName"
          placeholder="请输入工单名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源单据" prop="sourceCode">
        <el-input
          v-model="queryParams.sourceCode"
          placeholder="请输入来源单据"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="产品编号" prop="productCode">
        <el-input
          v-model="queryParams.productCode"
          placeholder="请输入产品编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="客户编码" prop="clientCode">
        <el-input
          v-model="queryParams.clientCode"
          placeholder="请输入客户编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="clientName">
        <el-input
          v-model="queryParams.clientName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工单类型" prop="workorderType">
        <el-input
          v-model="queryParams.workorderType"
          placeholder="请选择工单类型"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="需求日期" prop="requestDate">
        <el-date-picker clearable
                        v-model="queryParams.requestDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择需求日期">
        </el-date-picker>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['mes:pro:workorder:add']"
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
          v-hasPermi="['mes:pro:workorder:edit']"
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
          v-hasPermi="['mes:pro:workorder:remove']"
        >删除</el-button>
      </el-col> -->
   <!--   <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mes:pro:workorder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <div class="table-container">
      <table class="workorder-table">
      <thead>
        <tr>
          <th style="width: 60px">
            <el-checkbox v-model="selectAll" @change="handleSelectAllChange"></el-checkbox>
          </th>
          <th style="width: 180px">生产计划</th>
          <th  style="width: 150px">计划状态</th>
          <!-- <th  style="width: 200px">订单状态</th> -->
          <th  style="width: 200px">生产工单</th>
          <th  style="width: 150px">销售订单</th>
          <th  style="width: 150px">SKU</th>
          <th  style="width: 150px">数量</th>
          <th  style="width: 150px">MSKU</th>
          <th style="width: 150px">产品名称</th>
          <th style="width: 150px">产线</th>
          <th style="width: 150px">工序</th>
          <th style="width: 150px">备注</th>
          <th style="width: 150px">渲染图</th>
          <th style="width: 150px">订单付款时间</th>
          <th style="width: 150px">约定结束时间</th>
          <th style="width: 150px">实际结束时间</th>
          <th style="width: 150px">工单状态</th>
          <th style="width: 150px">是否逾期</th>
          <th style="width: 280px">操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="workorder in workorderList" >
          <!-- 父级行 -->
          <tr class="expandable" :key="workorder.workPlanCode" @click="toggleChildren(workorder.workPlanCode)">
            <td>
              <el-checkbox v-model="workorder.selected" @click.stop @change="handleSelectChange(workorder)"></el-checkbox>
            </td>
            <td>{{ workorder.workPlanCode }}</td>
            <td>
              <span v-if="workorder.planStatu==2">已完成</span>
              <span v-else>进行中</span> <!-- v-if="workorder.planStatu==1" -->
            </td>
            <td ></td>
            <td ></td>
            <td ></td>
            <td ></td>
            <td ></td>
            <td></td>
            <td></td>
            <td></td>
            <td style="color: red;" @click.stop="toggleChildren()">
              <span v-if="workorder.remack!=null && workorder.remack!=''" @click="beizhu.code=workorder.workPlanCode,beizhu.remack=workorder.remack,dialogVisible=true,beizhu.pd='jh'">{{workorder.remack}}</span>
              <span v-else style="color:blue" @click="beizhu.code=workorder.workPlanCode,beizhu.remack=workorder.remack,dialogVisible=true,beizhu.pd='jh'">添加备注</span>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <el-button v-if="workorder.planStatu!=2" type="success" size="small" style="width:80px;font-size:14px" @click="updateorders(workorder.children,workorder.workPlanCode)">完成</el-button>
              <!-- <el-button  type="primary" size="small" style="width:80px;font-size:14px" >上传</el-button> -->
              <el-button  type="warning" size="small" style="width:80px;font-size:14px" >下载</el-button>
            </td>
            <!-- 占位以保持表格结构 -->
          </tr>
          <!-- 子级行 -->
          <template v-if="isExpanded(workorder.workPlanCode)">
            <tr v-for="child in workorder.children" :key="child.id" class="child">
              <td class="child-cell">
                <el-checkbox v-model="child.selected" @change="handleChildSelectChange(child, workorder)"></el-checkbox>
              </td>
              <td class="child-cell"></td>
              <td class="child-cell" ></td>
              <td class="child-cell" >{{ child.productPlanCode }}</td>
              <td class="child-cell" >{{ child.globalOrderNo }}</td>
              <td class="child-cell" >{{ child.sku }}</td>
              <!-- <td class="child-cell" >{{ formatOutTime(child.ifOutTime) }}</td> -->
              <td class="child-cell">{{ child.count }}</td>
              <td class="child-cell">{{ child.msku }}</td>
              <td class="child-cell">{{ child.localName }}</td>
              <td class="child-cell">{{ child.craft }}</td>
              <td class="child-cell">{{ child.depart }}</td>
              <td class="child-cell" style="color:crimson">
                <span v-if="child.remack!=null && child.remack!=''" @click="beizhu.code=child.id,beizhu.remack=child.remack,dialogVisible=true,beizhu.pd='gd'">{{child.remack}}</span>
                <span v-else style="color:blue" @click="beizhu.code=child.id,beizhu.remack=child.remack,dialogVisible=true,beizhu.pd='gd'">添加备注</span>
                <!-- <a :href="child.productImage" target="_blank">
                  <img :src="child.productImage" alt="Product Image" style="max-width: 100%; height: auto;">
                </a> -->
              </td>
              <td class="child-cell">
                <el-upload
                  action="#"
                  :http-request="(params) => img(params, child.id)"
                  :show-file-list="false">
                  <div v-if="imgpd(child.renderingImage)==true">
                    <a :href="child.renderingImage" target="_blank">
                      <img :src="child.renderingImage" alt="Rendering Image" style="max-width: 100%; height: auto;">
                    </a>
                  </div>
                  <div v-if="imgpd(child.renderingImage)==false">
                    <a :href="child.renderingImage" target="_blank">
                      <img :src="imageCache[child.renderingImage]" alt="Rendering Image" style="max-width: 100%; height: auto;">
                    </a>
                  </div>
                </el-upload>

              </td>
              <td>{{ child.orderPayTime }}</td>
              <td>{{ child.planEndTime }}</td>
              <td>{{ child.platformStatu }}</td>
              <td>{{ child.ifOutTime }}</td>
              <td></td>
              <td><el-button v-if="child.platformStatu!=2" type="success" size="small" style="width:100px;font-size:14px" @click="updateorder(child.sku,workorder.workPlanCode)">完成</el-button></td>
            </tr>
          </template>
        </template>
      </tbody>
      </table>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getTableData"
    />
    <el-dialog
      title="添加备注"
      :visible.sync="dialogVisible"
      width="30%"
      center>
       <div style="margin-top: -40px;font-weight: bold;">
          <h3>当前生产计划/工单: <span style="color:red">{{beizhu.code}}</span></h3>
          <el-input  placeholder="请输入备注" v-model="beizhu.remack"></el-input>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertbz()">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { listWorkorder, getWorkorder, delWorkorder, addWorkorder, updateWorkorder ,dofinish,getProductPlan,updateorderWork,
updateremack,updateremackWork,updateImg,img1,one} from "@/api/mes/pro/workorder";
import { cgSeller} from "@/api/mes/tm/tooltype";
import Workorderbom from "./bom/bom.vue";
import axios from 'axios';
import WorkorderItemList from "./items/item.vue";
import ItemSelect  from "@/components/itemSelect/single.vue";
import ClientSelect from "@/components/clientSelect/single.vue";
import VendorSelect from "@/components/vendorSelect/single.vue";
import {genCode} from "@/api/system/autocode/rule"
import Treeselect from "@riophae/vue-treeselect";
import BarcodeImg from "@/components/barcodeImg/index.vue"
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Workorder",
  dicts: ['mes_order_status','mes_workorder_sourcetype','mes_workorder_type'],
  components: {
    Treeselect,
    ItemSelect ,
    ClientSelect,
    VendorSelect,
    Workorderbom,
    WorkorderItemList,
    BarcodeImg
  },
  data() {
    return {
      //图片
      fileList:'',
      //备注相关属性
      beizhu:{
        code:'',
        remack:'',
        pd:''
      },
      //备注弹窗
      dialogVisible:false,
      //自动生成编码
      autoGenFlag:false,
      optType: undefined,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 非单个禁用
      single: true,
      // 总条数
      total: 0,
      // 非多个禁用
      multiple: true,
      // 生产工单树选项
      workorderOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        workPlanCode: null,
        workorderName: null,
        orderSource: null,
        sourceCode: null,
        productId: null,
        productCode: null,
        productName: null,
        productSpc: null,
        unitOfMeasure: null,
        quantity: null,
        quantityProduced: null,
        quantityChanged: null,
        quantityScheduled: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        requestDate: null,
        parentId: null,
        ancestors: null,
        status: null,
      },
      // 表单参数
      form: {},
      workorderList:[],
      expandedWorkorders: [],
      path:'',
      imageCache: {},
    };
  },
  created() {
    // this.getList();
    this.getTableData();
  },
  methods: {
    handleSelectChange(){},
    getTableData(){
       this.workorderList=null
      getProductPlan({
        page:this.queryParams.pageNum-1,
        size:this.queryParams.pageSize,
        workPlanCode:this.queryParams.workPlanCode
      }).then(res => {
        console.log(res)
        this.workorderList = [...res.dataList]
        this.workorderList.forEach(f=>{
          if(f.children.length>0){
            f.children.forEach(c=>{
              if (!c.renderingImage.startsWith('http://') && !c.renderingImage.startsWith('https://') && c.renderingImage!=null && c.renderingImage!='') {
                console.log(this.imageCache)
                this.getImageUrl(c.renderingImage)
              }
            })
          }
        })
        this.total = res.total;
        console.log("res:",this.workorderList)
    })
    },
    handleSelectAllChange(){

    },
    selectAll(){

    },
    img(f,response){
      console.log(f)
      const formData = new FormData();
      formData.append('image',f.file);
      img1(formData).then(name=>{
        const data={
          "id":response,
          "img":name
        }
        updateImg(data).then(res=>{
          this.getTableData();
          this.$modal.msgSuccess("渲染图更改成功")
        })
      })
    },
     async getImageUrl(path) {
       if (this.imageCache[path]) {
             return this.imageCache[path];
       }
       // 3. 异步加载并缓存
       try {
         const blob = await one({ o: path });
         const blobUrl = URL.createObjectURL(blob);
         this.$set(this.imageCache, path, blobUrl); // 响应式更新
         this.$forceUpdate();
       } catch (error) {
         console.error('加载失败:', path, error);
       }
      },
      beforeDestroy() {
        // 释放所有 Blob URL
        Object.values(this.imageCache).forEach(url => {
          URL.revokeObjectURL(url);
        });
      },
      imgpd(im){
        if (im.startsWith('http://') || im.startsWith('https://')) {
          return true;
        }else{
          console.log(im)
          return false;
        }
      },
    insertbz(){
      const data={
        "id":this.beizhu.code,
        "remack":this.beizhu.remack
      }
      if(this.beizhu.pd=='jh'){
        updateremack(data).then(res=>{
          this.getTableData();
          this.$modal.msgSuccess("备注更改成功")
          this.dialogVisible=false
        })
      }else if(this.beizhu.pd=='gd'){
        updateremackWork(data).then(res=>{
          this.getTableData();
          this.$modal.msgSuccess("备注更改成功")
          this.dialogVisible=false
        })
      }
    },
    toggleChildren(workPlanCode) {
      const index = this.expandedWorkorders.indexOf(workPlanCode);
      //&& this.qufen!=1
      if (index > -1) {
        console.log("折叠");
        // this.isAnyExpanded = false;
        // 如果已经展开，移除它
        this.expandedWorkorders.splice(index, 1);
      //if(this.qufen!=1)
      } else{
        console.log("展开");
        // this.isAnyExpanded = true;
        this.expandedWorkorders.push(workPlanCode);
      }
    },
    isExpanded(workPlanCode) {
      // 检查给定的工单 ID 是否在展开列表中
      return this.expandedWorkorders.includes(workPlanCode);
    },
    updateorder(a,b){
      console.log(b)
      const arr=[]
      arr.push(a)
      const data={
        "ids":arr,
        "code":b
      }
      updateorderWork(data).then(f=>{
        this.getTableData();
      })
    },
    updateorders(a,b){
      console.log(b)
      const arr=[]
      a.forEach(f=>{
        arr.push(f.sku)
      })
      const data={
        "ids":arr,
        "code":b
      }
      updateorderWork(data).then(f=>{
        this.getTableData();
      })

    },
    /** 查询生产工单列表 */
    getList() {
      this.loading = true;
      listWorkorder(this.queryParams).then(response => {
        this.workorderList = this.handleTree(response.rows, "workorderId", "parentId");
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 转换生产工单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.workorderId,
        label: node.workorderName,
        children: node.children
      };
    },
    /** 查询生产工单下拉树结构 */
    getTreeselect() {
      listWorkorder().then(response => {
        this.workorderOptions = [];
        const data = { workorderId: 0, workorderName: '顶级节点', children: [] };
        data.children = this.handleTree(response.rows, "workorderId", "parentId");
        this.workorderOptions.push(data);
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
        workorderId: null,
        workorderCode: null,
        workorderName: null,
        workorderType: 'SELF',
        orderSource: null,
        sourceCode: null,
        productId: null,
        productCode: null,
        productName: null,
        productSpc: null,
        unitOfMeasure: null,
        quantity: null,
        quantityProduced: null,
        quantityChanged: null,
        quantityScheduled: null,
        clientId: null,
        clientCode: null,
        clientName: null,
        vendorId: null,
        vendorCode: null,
        vendorName: null,
        requestDate: null,
        parentId: null,
        status: "PREPARE",
        remark: null,
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
      this.getTableData();
      this.queryParams.workPlanCode=null
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
      this.queryParams.workPlanCode=null
      this.getTableData();
    },
    //从BOM行中直接新增
    handleSubAdd(row){
      this.open = false;
      this.reset();
      this.getTreeselect();
      if (row != null && row.workorderId) {
        this.form = row;
        this.form.parentId = row.workorderId;
        this.form.workorderId = null;
        this.form.workorderCode = null;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加生产工单";
      this.optType="add";
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.workorderId) {
        this.form.parentId = row.workorderId;
        this.form.orderSource = row.orderSource;
        this.form.sourceCode = row.sourceCode;
        this.form.clientId = row.clientId;
        this.form.clientCode = row.clientCode;
        this.form.clientName = row.clientName;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加生产工单";
      this.optType="add";
    },
    // 查询明细按钮操作
    handleView(row){
      this.reset();
      this.getTreeselect();
      const workorderId = row.workorderId || this.ids;
      getWorkorder(workorderId).then(response => {
        this.form = response.data
        this.open = true;
        this.$nextTick(() => {
          console.log("2232",this.$refs.barcodeImg)
          this.$refs.barcodeImg.getBarcode();

        })
        this.title = "查看工单信息";
        this.optType = "view";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.workorderId;
      }
      getWorkorder(row.workorderId).then(response => {
        this.form = response.data;

        console.log("3232",this.form)
        this.form.workorderCode = response.data.workorderCode
        this.form.workorderId = response.data.workorderId
        this.open = true;
        this.title = "修改生产工单";
        this.optType="edit";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.workorderId != null) {
            updateWorkorder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              //this.open = false;
              this.$refs["bomlist"].getList();
              this.getList();
            });
          } else {
            addWorkorder(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              //this.open = false;
              this.form.workorderId = response.data;
              this.getList();
            });
          }
        }
      });
    },
    handlePreview(row){
      //todo:本地环境报表地址
      window.open(process.env.VUE_APP_REPORT+"/ureport/preview?_u=mysql:生产工单打印模版.ureport.xml&id="+row.workorderId+"&code="+row.workorderCode)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除生产工单编号为"' + row.workorderId + '"的数据项？').then(function() {
        return delWorkorder(row.workorderId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleSelectProduct(){
      this.$refs.itemSelect.handleOpen(this.form.productId)
    },
    handleSelectClient(){
      this.$refs.clientSelect.showFlag = true;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/pro/workorder/export', {
        ...this.queryParams
      }, `workorder_${new Date().getTime()}.xlsx`)
    },
    handleConfirm(){
      let that = this;
      this.$modal.confirm('是确认完成工单编制？【确认后将不能更改】').then(function(){
        that.form.status = 'CONFIRMED';
        that.submitForm();
      });
    },
    handleFinish(row){
      const workorderIds = row.workorderId || this.ids;
      this.$modal.confirm('确认完成工单？一旦完成，此工单将无法继续报工').then(function() {
        return dofinish(workorderIds) //完成工单
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("更改成功");
      }).catch(() => {});
    },
    //物料选择弹出框
    onItemSelected(obj){
      if(obj != undefined && obj != null){
        this.form.productId = obj.itemId;
        this.form.productCode = obj.itemCode;
        this.form.productName = obj.itemName;
        this.form.productSpc = obj.specification;
        this.form.unitOfMeasure = obj.unitName;
      }
    },
    //客户选择弹出框
    onClientSelected(obj){
      if(obj != undefined && obj != null){
        this.form.clientId = obj.clientId;
        this.form.clientCode = obj.clientCode;
        this.form.clientName = obj.clientName;
      }
    },
    //供应商选择
    handleSelectVendor(){
      this.$refs.vendorSelect.showFlag = true;
    },
    //供应商选择弹出框
    onVendorSelected(obj){
      debugger;
      if(obj != undefined && obj != null){
        this.form.vendorId = obj.vendorId;
        this.form.vendorCode = obj.vendorCode;
        this.form.vendorName = obj.vendorName;
      }
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag){
      if(autoGenFlag){
        genCode('WORKORDER_CODE').then(response =>{
          this.form.workorderCode = response;
        });
      }else{
        this.form.workorderCode = null;
      }
    }
  }
};
</script>

<style scoped>
.table-container{
  width: 100%;
  overflow-x: auto;
}
.workorder-table {
  width: 100%;
  table-layout: fixed; /* 固定列宽 */
  border-collapse: collapse; /* 合并边框 */
  background-color: white;

}
.workorder-table th,
.workorder-table td {
  padding: 8px; /* 内边距 */
  overflow: hidden; /* 隐藏溢出 */
  text-align: left; /* 左对齐 */
  text-overflow: ellipsis; /* 显示省略号 */
  white-space: nowrap; /* 不换行 */
  border: 1px solid #cccccc; /* 边框样式 */
}
.workorder-table th {
  background-color: #6696fd4d; /* 表头背景色 */
}
.child {
  background-color: #eeebeb; /* 子项行背景颜色 */
}
.child-cell {
  padding-left: 20px; /* 子项行的左边距，增加缩进 */
}
</style>
