<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="类型编码" prop="globalOrderNo">
        <el-input
          v-model="queryParams.globalOrderNo"
          placeholder="请输入类型编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型名称" prop="platformOrderName">
        <el-input
          v-model="queryParams.platformOrderName"
          placeholder="请输入类型名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="保养维护类型" prop="remark">
        <el-select v-model="queryParams.remark" placeholder="请选择保养维护类型" clearable>
          <el-option
            v-for="dict in dict.type.mes_mainten_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-button @click="click_create" style="margin-left:8px;height:35px;font-size:13px;color:white;background-color: lightskyblue;border: 1px solid cornflowerblue;">生产工单</el-button>
      <el-button v-if="qufen==1" style="margin-left:8px;height:35px;font-size:14px;color:gray;background-color: gainsboro;border: 1px solid lightslategrey;" @click="returnxs">返回</el-button>
      <el-button style="color:white;background-color:blue;height:35px;" v-if="qufen==1" @click="click_works">
        创建生产工单</el-button>
      <el-col :span="1.5">
        <el-button
          style="height:35px;background-color: lightgreen;color: green;font-size:14px;"
          size="mini"
          plain
          icon="el-icon-check"
          @click="handleAdds"
        >
        <span v-if="qufen==1">批量完成</span><span v-else>批量通过</span>
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
        style="height:35px;"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['mes:tm:tooltype:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
        style="height:35px;"
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['mes:tm:tooltype:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
        style="height:35px;"
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['mes:tm:tooltype:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
        style="height:35px;"
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mes:tm:tooltype:export']"
        >导出</el-button>
      </el-col> -->

      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <div class="table-container">
      <table class="workorder-table"  v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)">
      <thead>
        <tr>
          <th style="width: 60px">
            <el-checkbox v-model="selectAll" @change="handleSelectAllChange"></el-checkbox>
          </th>
          <th style="width: 180px">订单编号</th>
          <th v-if="!isAnyExpanded" style="width: 150px">店铺订单号</th>
          <th v-if="!isAnyExpanded" style="width: 200px">订单状态</th>
          <th v-if="!isAnyExpanded" style="width: 200px">订单备注</th>
          <th v-if="!isAnyExpanded" style="width: 150px">预计结束时间</th>
          <th v-if="!isAnyExpanded" style="width: 150px">实际结束时间</th>
          <th v-if="!isAnyExpanded" style="width: 150px">是否逾期</th>
          <th style="width: 150px">SKU</th>
          <th style="width: 150px">MSKU</th>
          <th style="width: 150px">数量</th>
          <th style="width: 150px">物料</th>
          <th style="width: 150px">生产图</th>
          <th style="width: 150px">渲染图</th>
          <th style="width: 150px">产线</th>
          <th style="width: 150px">工序</th>
          <th style="width: 150px">操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="workorder in workorderList" >
          <!-- 父级行 -->
          <tr class="expandable" @click="toggleChildren(workorder.globalOrderNo)" :key="workorder.globalOrderNo">
            <td>
              <el-checkbox v-model="workorder.selected" @click.stop @change="handleSelectChange(workorder)"></el-checkbox>
            </td>
            <td>{{ workorder.globalOrderNo }}</td>
            <td v-if="!isAnyExpanded">{{ workorder.platformOrderName }}</td>
            <td v-if="!isAnyExpanded">{{ formatOrderStatus(workorder.requestStatus) }}</td>
            <td v-if="!isAnyExpanded">{{ workorder.remark }}</td>
            <td v-if="!isAnyExpanded">{{ workorder.planEndTime }}</td>
            <td v-if="!isAnyExpanded">{{ workorder.realEndTime }}</td>
            <td v-if="!isAnyExpanded">{{ formatOutTime(workorder.ifOutTime) }}</td>
            <td>{{ workorder.sku }}</td>
            <td>{{ workorder.msku }}</td>
            <td>{{ workorder.count }}</td>
            <td>{{ workorder.wuliao }}</td>
            <td>{{ workorder.proImg }}</td>
            <td>{{ workorder.scImg }}</td>
            <td></td>
            <td></td>
            <td>
              <div v-if="workorder.platformStatus === 0 && [4, 5].includes(workorder.requestStatus)">
                <el-button type="success" size="small" @click.stop="passEdit(workorder,1)">通过</el-button>
                <el-button  type="danger" size="small">未通过</el-button>
              </div>
             <!-- <div v-if="qufen==1">
                <el-button type="success" size="small" >完成</el-button>
              </div> -->
            </td>
            <!-- 占位以保持表格结构 -->
          </tr>
          <!-- 子级行 -->
          <template v-if="isExpanded(workorder.globalOrderNo)">
            <tr v-for="child in workorder.children" :key="child.globalOrderNo" class="child">
              <td class="child-cell">
                <!-- <el-checkbox v-model="child.selected" @change="handleChildSelectChange(child, workorder)"></el-checkbox> -->
              </td>
              <td class="child-cell">{{ child.globalOrderNo }}</td>
              <td class="child-cell" v-if="!isAnyExpanded">{{ child.platformOrderName }}</td>
              <td class="child-cell" v-if="!isAnyExpanded">{{ formatOrderStatus(child.requestStatus) }}</td>
              <td class="child-cell" v-if="!isAnyExpanded">{{ child.remark }}</td>
              <td class="child-cell" v-if="!isAnyExpanded">{{ child.planEndTime }}</td>
              <td class="child-cell" v-if="!isAnyExpanded">{{ child.realEndTime }}</td>
              <td class="child-cell" v-if="!isAnyExpanded">{{ formatOutTime(child.ifOutTime) }}</td>
              <td class="child-cell">{{ child.sku }}</td>
              <td class="child-cell">{{ child.msku }}</td>
              <td class="child-cell">{{ child.count }}</td>
              <td class="child-cell">{{ child.local_product_name }}</td>
              <td class="child-cell">

                <!-- {{child.product_image}} -->
                <a :href="child.product_image" target="_blank">

                  <img :src="child.product_image" alt="Product Image" style="max-width: 100%; height: auto;">
                </a>
                <!-- 下载图片按钮 -->
                <div style="display:flex;">
                  <span @click="downloadImage(child.product_image)" class="download-text">下载图片</span>
                  <!-- 上传图片的按钮 -->
                  <el-upload
                    class="upload-text"
                    action="http://localhost/dev-api/upload"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    :headers="headers"
                    :before-upload="beforeUpload"
                    multiple
                  >
                    <span class="upload-text-link">点击上传</span>
                  </el-upload>
                </div>

              </td>
              <td class="child-cell">
                <a :href="child.rendering_image" target="_blank">
                  <img :src="child.rendering_image" alt="Rendering Image" style="max-width: 100%; height: auto;">
                </a>
              </td>
              <td>{{ child.craft }}</td>
              <td>{{ child.depart }}</td>
              <td></td>
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
        @pagination="getWorkorderList"
      />

    <!-- 添加或修改工装夹具类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="类型编码" prop="globalOrderNo">
              <el-input v-model="form.globalOrderNo" placeholder="请输入类型编码" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-switch v-model="autoGenFlag"
                active-color="#13ce66"
                active-text="自动生成"
                @change="handleAutoGenChange(autoGenFlag)" v-if="optType != 'view'">
            </el-switch>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型名称" prop="platformOrderName">
              <el-input v-model="form.platformOrderName" placeholder="请输入类型名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否编码管理" prop="requestStatus">
              <el-radio-group v-model="form.requestStatus" disabled v-if="optType=='view'">
                    <el-radio
                      v-for="dict in dict.type.sys_yes_no"
                      :key="dict.value"
                      :label="dict.value"
                    >{{dict.label}}</el-radio>
                  </el-radio-group>
                  <el-radio-group v-model="form.requestStatus" v-else>
                    <el-radio
                      v-for="dict in dict.type.sys_yes_no"
                      :key="dict.value"
                      :label="dict.value"
                    >{{dict.label}}</el-radio>
                </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.requestStatus=='Y'">
            <el-form-item label="保养维护类型" prop="remark">
              <el-select v-model="form.remark" placeholder="请选择保养维护类型">
                <el-option
                  v-for="dict in dict.type.mes_mainten_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.requestStatus=='Y'">
            <el-form-item label="保养周期" prop="planEndTime">
              <el-input v-model="form.planEndTime" placeholder="请输入保养周期" />
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="optType !='view'">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTooltype, getTooltype, delTooltype, addTooltype, updateTooltype,getSaleOrders,downImage,cgSeller,createOrders ,updateState} from "@/api/mes/tm/tooltype";
import { getToken } from "@/utils/auth";
import {genCode} from "@/api/system/autocode/rule"
import { Message } from 'element-ui';
export default {
  name: "Tooltype",
  dicts: ['mes_mainten_type','sys_yes_no'],
  data() {
    return {
      //表格选中框
      tablech:[],
      //销售和生产按钮
      qufen:0,
      //批量通过选中数据
      arrs:[],
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
      // 工装夹具类型表格数据
      tooltypeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        globalOrderNo: null,
        platformOrderName: null,
        requestStatus: null,
        remark: null,
        planEndTime: null,
      },
      isAnyExpanded:false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        globalOrderNo: [
          { required: true, message: "类型编码不能为空", trigger: "blur" },
          { max: 64, message: "字段过长", trigger: "blur" }
        ],
        platformOrderName: [
          { required: true, message: "类型名称不能为空", trigger: "blur" },
          { max: 100, message: "字段过长", trigger: "blur" }
        ],
        requestStatus: [
          { required: true, message: "是否启用不能为空", trigger: "blur" }
        ],
        remark: [
          { max: 250, message: '长度必须小于250个字符', trigger: 'blur' }
        ],
        planEndTime: [
          { pattern: /^-?\d+(\.\d+)?$/, message: '输入必须为数字类型', trigger: 'blur' }
        ]
      },
      workorderList: [],
      expandedWorkorders: [],
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      click_create_if:false,
      selectAll:false
    };
  },
  created() {
    // this.getList();
    this.getSaleOrders();
  },
  methods: {
    click_works(){
      console.log(this.workorderList)
      const filteredArray = this.workorderList.filter(item => item.selected === true);
      console.log("filteredArray:",JSON.stringify(filteredArray))
      createOrders(JSON.stringify(filteredArray)).then(res=>{
        filteredArray.forEach(f=>{
          const data = {
             "globalOrderNo":f.globalOrderNo,
             "platformStatus":2
           }
           cgSeller(data).then(res=>{
             if(res.action=='success'){
               this.getSaleOrders(1,4,5)
               this.$message.success('生产工单创建成功!!');
               this.qufen=1
             }
           })
        })
      })
    },
    returnxs(){
      this.queryParams.pageNum=1
      this.queryParams.pageSize=10
      this.getSaleOrders(null)
    },
    handleSelectAllChange(val) {
      // 设置所有主工单的选中状态
      this.workorderList.forEach(workorder => {
        workorder.selected = val;
        if(workorder.selected==true){
          this.gouxuanAdd(workorder.globalOrderNo)
        }
        // // 如果有子工单，也设置子工单的选中状态
        // if (workorder.children && workorder.children.length) {
        //   workorder.children.forEach(child => {
        //     child.selected = val;
        //   });
        // }
      });
    },
    //多选框判断选中未选中
    handleSelectChange(workorder){
      console.log(this.arrs.length,this.workorderList.length)
      if(workorder.selected==true){
        this.gouxuanAdd(workorder.globalOrderNo)
        if(this.arrs.length==this.workorderList.length){
          this.selectAll=true
        }
      }else{
        this.selectAll=false
        const index = this.arrs.findIndex(item => item === workorder.globalOrderNo);
          if (index !== -1) {
            this.arrs.splice(index, 1);
          }
      }
    },
    getWorkorderList(){
     if(this.qufen==1){
       this.getSaleOrders(1,4,5)
     }else{
       this.getSaleOrders()
     }
    },
    click_create(){
      this.queryParams.pageNum=1
      this.queryParams.pageSize=10
      this.loading=true
      // 筛选
      this.getSaleOrders(1,4,5)
      // platformStatus
      this.click_create_if = true;
      this.qufen=1
    },
    passEdit(workorder,state){
      console.log(workorder)
      const data = {
        "globalOrderNo":workorder.globalOrderNo,
        "platformStatus":state
      }
      // 调用http://localhost/dev-api/sales-orders/updatePlatformStatus接口
      cgSeller(data).then(res=>{
        console.log("res:",res)
        if(res.action=='success'){
          this.getSaleOrders()
          console.log("刷新")
        }
      })
    },
    handleUploadSuccess(response, file) {
      Message.success("图片上传成功！");
      console.log("上传成功:", response);
    },
    handleUploadError(err, file) {
      Message.error("图片上传失败，请重试。");
      console.log("上传失败:", err);
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        Message.error('上传图片只能是 JPG 或 PNG 格式!');
      }
      return isJpgOrPng ;
    },
    async downloadImage(url) {
      downImage(url).then(response =>{
        console.log("res:",response.图片下载成功)
        if (response.图片下载成功) {
          Message.success("图片下载成功！");
        }else{
          Message.error("图片下载失败，请重试。");
        }
      })
    },
    getFileNameFromUrl(url) {
      try {
        return new URL(url).pathname.split('/').pop()
      } catch {
        return `download_${Date.now()}`
      }
    },
    formatOrderStatus(status) {
      const statusMap = {
        1: "同步中",
        2: "已同步",
        3: "未付款",
        4: "待审核",
        5: "待发货",
        6: "已发货",
        7: "已取消/不发货",
        8: "不显示",
        9: "平台发货"
      };
      return statusMap[status] || "未知状态"; // 默认返回 '未知状态'
    },
    toggleChildren(globalOrderNo) {
      console.log(globalOrderNo)
      const index = this.expandedWorkorders.indexOf(globalOrderNo);
      if (index > -1) {
        console.log("折叠");
        // this.isAnyExpanded = false;
        // 如果已经展开，移除它
        this.expandedWorkorders.splice(index, 1);
      } else {
        console.log("展开");
        // this.isAnyExpanded = true;
        this.expandedWorkorders.push(globalOrderNo);
      }
    },
    formatOutTime(ifOutTime) {
      return ifOutTime === 0 ? "未逾期" : "有逾期";
    },
    isExpanded(globalOrderNo) {
      // 检查给定的工单 ID 是否在展开列表中
      return this.expandedWorkorders.includes(globalOrderNo);
    },
    // get isAnyExpanded() {
    //   // 检查是否有任何工单被展开
    //   return this.expandedWorkorders && this.expandedWorkorders.length > 0;
    // },
    cleanUrl(url) {
      // console.log("url",url)
      if (url != null) {
        // 检查 URL 是否以 '/' 结尾，如果是则去掉
        if (url.endsWith('\\n')) {
          // console.log(url.slice(0, -1))
          // url = url.slice(0, -1)
          return url.slice(0, -1); // 去掉最后一个字符
        }
      }
      return url; // 如果没有以 '/' 结尾，则原样返回
    },
    getSaleOrders(a,state,state1){
      this.total =0
      this.tooltypeList = []
      this.workorderList = this.tooltypeList
      this.qufen=0
      this.loading = true;
      getSaleOrders(
      {
        page: this.queryParams.pageNum-1,           // 页码，从0开始
        size: this.queryParams.pageSize,          // 每页大小
        platformStatus:a,
        a:state,
        b:state1,
        timeout: 12000     // 超时时间(ms)
      }
      ).then(response => {
        // 遍历响应数据，并处理 product_image 字段
        if(Object.keys(response).length != 0 && response.data.length>0){
          response.data.forEach(item => {
            if (item.children) {
              item.children.forEach(child => {
                  let productImage = child.product_image
                  productImage = String(productImage);
                  // 检查最后一个字符是否为 'n'，如果是，则替换为 'a'
                  if (productImage.endsWith('n')) {
                      productImage = productImage.slice(0, -1) + ''; // 替换最后一个字符

                      if (productImage.endsWith('\\')) {
                        productImage = productImage.slice(0, -1) + ''; // 替换最后一个字符
                      }
                  }
                  if (productImage.endsWith('/')) {
                    productImage = productImage.slice(0, -1) + ''; // 替换最后一个字符
                  }

                  child.product_image = productImage

                  let renderImage = child.rendering_image;
                  if (renderImage) {
                    if (renderImage.endsWith('n')) {
                        renderImage = renderImage.slice(0, -1) + ''; // 替换最后一个字符

                        if (renderImage.endsWith('\\')) {
                          renderImage = renderImage.slice(0, -1) + ''; // 替换最后一个字符
                        }
                    }
                    if (renderImage.endsWith('/')) {
                      renderImage = renderImage.slice(0, -1) + ''; // 替换最后一个字符
                    }
                  }
                  child.rendering_image = renderImage
              });
            }
          });
          this.total =response.pages;
          this.tooltypeList = response.data;
          console.log(response)
          this.workorderList = this.tooltypeList
        }
        this.loading = false;
      })
      a=null
    },
    /** 查询工装夹具类型列表 */
    getList() {
      this.loading = true;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        toolTypeId: null,
        globalOrderNo: null,
        platformOrderName: null,
        requestStatus: 'Y',
        remark: null,
        planEndTime: null,
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
      this.ids = selection.map(item => item.toolTypeId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    // 多选框选中数据----批量通过
    gouxuanAdd(arr) {
      this.arrs.push(arr)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加工装夹具类型";
      this.optType = "add";
    },
    /** 批量生产工单 */
    handleAdds() {
      //将勾选中的数组传过去
     if(this.arrs.length>0){
       updateState(this.arrs).then(res=>{
        this.getSaleOrders()
        this.arrs.length=0
        this.selectAll=false

       })
     }else{
        this.$message.warning('请选择相应订单再次点击哦');
     }


    },
    // 查询明细按钮操作
    handleView(row){
      this.reset();
      const toolTypeId = row.toolTypeId || this.ids;
      getTooltype(toolTypeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看类型信息";
        this.optType = "view";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const toolTypeId = row.toolTypeId || this.ids
      getTooltype(toolTypeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工装夹具类型";
        this.optType = "edit";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.toolTypeId != null) {
            updateTooltype(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTooltype(this.form).then(response => {
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
      const toolTypeIds = row.toolTypeId || this.ids;
      this.$modal.confirm('是否确认删除工装夹具类型编号为"' + toolTypeIds + '"的数据项？').then(function() {
        return delTooltype(toolTypeIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/tm/tooltype/export', {
        ...this.queryParams
      }, `tooltype_${new Date().getTime()}.xlsx`)
    },
    //自动生成编码
    handleAutoGenChange(autoGenFlag){
      if(autoGenFlag){
        genCode('TOOL_TYPE_CODE').then(response =>{
          this.form.globalOrderNo = response;
        });
      }else{
        this.form.globalOrderNo = null;
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
.expandable {
  cursor: pointer; /* 鼠标指针变为手指 */
}
.child {
  background-color: #eeebeb; /* 子项行背景颜色 */
}
.child-cell {
  padding-left: 20px; /* 子项行的左边距，增加缩进 */
}
.upload-text {
  margin-left: 10px;
  cursor: pointer;
  color: #409eff; /* 可以根据需要调整颜色 */
  text-decoration: underline; /* 添加下划线样式 */
}

.upload-text-link {
  font-size: 16px; /* 根据需要调整字体大小 */
}
.download-text{
  color: #409eff;
}
</style>
