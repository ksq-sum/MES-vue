<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--分类数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="itemTypeName"
            placeholder="请输入分类名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="itemTypeOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--物料数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="物料编码" prop="itemCode">
            <el-input
              v-model="queryParams.itemCode"
              placeholder="请输入物料编码"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="物料名称" prop="itemName">
            <el-input
              v-model="queryParams.itemName"
              placeholder="请输入物料名称"
              clearable
              style="width: 240px"
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
              v-hasPermi="['mes:md:mditem:add']"
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
              v-hasPermi="['mes:md:mditem:edit']"
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
              v-hasPermi="['mes:md:mditem:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['mes:md:mditem:import']"
            >导入</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['mes:md:mditem:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="itemList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="sku" width = "200" align="center" key="sku" prop="sku" v-if="columns[0].visible" >
          </el-table-column>
          <el-table-column label="产品名称" min-width="120" align="left" key="localName" prop="localName" v-if="columns[1].visible" :show-overflow-tooltip="true" />
          <el-table-column label="产线" align="left" key="craft" prop="craft" v-if="columns[2].visible" :show-overflow-tooltip="true" />
          <el-table-column label="工序" align="center" key="depart" prop="depart" v-if="columns[3].visible" :show-overflow-tooltip="true" >
          </el-table-column>
          <!-- <el-table-column label="是否启用" align="center" key="enableFlag" v-if="columns[6].visible">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.enableFlag"/>
            </template>
          </el-table-column> -->
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['mes:md:mditem:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['mes:md:mditem:remove']"
              >删除</el-button>
              <!-- <printLabel :businessId="scope.row.itemId" :businessCode="scope.row.itemCode" labelText="标签打印" businessType = "ITEM"></printLabel> -->
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
      </el-col>
    </el-row>

    <!-- 添加或修改物料产品编码对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="960px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="14">
            <el-row>
              <el-col :span="16">
                <el-form-item label="物料编码" prop="itemCode">
                  <el-input v-model="form.itemCode" readonly="readonly" maxlength="64" v-if="optType == 'view'"/>
                  <el-input v-model="form.itemCode" placeholder="请输入物料编码" maxlength="64" v-else/>
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
                <el-form-item label="物料名称" prop="itemName">
                  <el-input v-model="form.itemName"  maxlength="255" readonly="readonly" v-if="optType=='view'" />
                  <el-input v-model="form.itemName" placeholder="请输入物料名称" maxlength="255" v-else/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="规格型号" prop="specification">
                  <el-input v-model="form.specification" type="textarea" maxlength="500" readonly="readonly" v-if="optType=='view'" />
                  <el-input v-model="form.specification" type="textarea" placeholder="请输入规格型号" maxlength="500" v-else/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="单位" prop="unitOfMeasure">
                  <el-select v-model="form.unitOfMeasure" disabled v-if="optType=='view'">
                    <el-option
                      v-for="item in measureOptions"
                      :key="item.measureCode"
                      :label="item.measureName"
                      :value="item.measureCode"
                      :disabled="item.enableFlag == 'N'"
                    ></el-option>
                  </el-select>

                  <el-select v-model="form.unitOfMeasure" placeholder="请选择单位" v-else>
                    <el-option
                      v-for="item in measureOptions"
                      :key="item.measureCode"
                      :label="item.measureName"
                      :value="item.measureCode"
                      :disabled="item.enableFlag == 'N'"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="10">
            <BarcodeImg ref="barcodeImg" :bussinessId="form.itemId" :bussinessCode="form.itemCode" barcodeType="ITEM"></BarcodeImg>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item  label="物料/产品分类" prop="itemTypeId">
              <treeselect v-model="form.itemTypeId" :options="itemTypeOptions" :show-count="true" disabled v-if="optType=='view'"  />
              <treeselect v-model="form.itemTypeId" :options="itemTypeOptions" :show-count="true" placeholder="请选择所属分类" v-else :disable-branch-nodes="true"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item  label="高价值/易被盗物品" label-width="150px" prop="highValue">
              <el-checkbox v-model="form.highValue" :true-label="'Y'" :false-label="'N'"></el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否启用">
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
          <el-col :span="8">
            <el-form-item label="批次管理">
              <el-switch
                v-model="form.batchFlag"
                active-text="是"
                inactive-text="否"
                active-value="Y"
                inactive-value="N"
              ></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安全库存">
              <el-radio-group v-model="form.safeStockFlag" disabled v-if="optType=='view'">
                <el-radio
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>

              <el-radio-group v-model="form.safeStockFlag" v-else>
                <el-radio
                  v-for="dict in dict.type.sys_yes_no"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="form.safeStockFlag == 'Y'">
          <el-col :span="12">
            <el-form-item label="最小库存量">
              <el-input-number v-model="form.minStock" :percision="2" :step="1" disabled v-if="optType=='view'" />
              <el-input-number v-model="form.minStock" :percision="2" :step="1" placeholder="请输入最小安全库存量" v-else />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大库存量">
              <el-input-number v-model="form.maxStock" :percision="2" :step="1" disabled v-if="optType=='view'" />
              <el-input-number v-model="form.maxStock" :percision="2" :step="1" placeholder="请输入最大安全库存量" v-else/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" readonly v-if="optType=='view'"></el-input>
              <el-input v-model="form.remark" type="textarea" maxlength="500" placeholder="请输入内容" v-else></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-tabs type="border-card" v-if="form.itemId != null">
        <el-tab-pane label="BOM组成">
          <ItemBom :optType="optType" :itemId="form.itemId"></ItemBom>
        </el-tab-pane>
        <el-tab-pane v-if="form.batchFlag =='Y'" label="批次属性"></el-tab-pane>
        <el-tab-pane label="替代品"></el-tab-pane>
        <el-tab-pane label="SIP">
          <SIPTab :itemId="form.itemId" :optType="optType"></SIPTab>
        </el-tab-pane>
        <el-tab-pane label="SOP">
          <SOPTab :itemId="form.itemId" :optType="optType"></SOPTab>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="optType !='view'">确 定</el-button>
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-dialog>

    <!-- 物料导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="sku信息修改"
      :visible.sync="dialogVisible"
      width="30%"
      center>
       <div style="margin-top: -40px;font-weight: bold;">
          <h3>当前sku: <span style="color:red">{{getsku.sku}}</span></h3>
          <el-input  placeholder="请输入工序" v-model="getsku.depart"></el-input>
          <el-input  placeholder="请输入产线" style="margin-top:20px" v-model="getsku.craft"></el-input>
        </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="skuupdate()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { listMdItem, getMdItem, delMdItem, addMdItem, updateMdItem,getSkuActiveItems,updateActiveItems} from "@/api/mes/md/mdItem";

import ItemBom from "./components/itembom.vue";
import SOPTab from  "./components/sop.vue"
import SIPTab from  "./components/sip.vue"
import { listAllUnitmeasure} from "@/api/mes/md/unitmeasure";
import {genCode} from "@/api/system/autocode/rule"
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/mes/md/itemtype";
import Treeselect from "@riophae/vue-treeselect";
import { getBarcodeUrl } from "@/api/mes/wm/barcode";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import BarcodeImg from "@/components/barcodeImg/index.vue"
import printLabel from "@/components/printerLabel/index.vue"
export default {
  name: "MdItem",
  dicts: ['sys_yes_no','mes_item_product'],
  components: { Treeselect,ItemBom,SOPTab,SIPTab,BarcodeImg,printLabel },
  data() {
    return {
      //选中sku
      getsku:{
        sku:'',
        craft:'',
        depart:''
      },
      //修改弹窗
      dialogVisible:false,
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
      // 物料产品表格数据
      itemList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      itemTypeOptions: undefined,
      // 是否显示弹出层
      open: false,
      //弹框的操作类型 view add edit
      optType: undefined,
      // 部门名称
      itemTypeName: undefined,
      //自动生成物料编码标识
      autoGenFlag: false,
      // 日期范围
      dateRange: [],
      //单位列表
      measureOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/mes/md/mditem/importData"
      },
      //二维码查询参数
      barcodeParams: {
        bussinessId: null,
        bussinessCode: null,
        barcodeFormart: 'QR_CODE', //模式二维码
        barcodeType: 'ITEM' //类型
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemCode: undefined,
        itemName: undefined,
        itemTypeId: 0
      },
      // 列信息
      columns: [
        { key: 0, label: `物料/产品编码`, visible: true },
        { key: 1, label: `物料/产品名称`, visible: true },
        { key: 2, label: `规格型号`, visible: true },
        { key: 3, label: `单位`, visible: true },
        { key: 4, label: `物料/产品`, visible: true },
        { key: 5, label: `物料分类`, visible: true },
        { key: 6, label: `是否启用`, visible: true },
        { key: 7, label: `是否设置安全库存`, visible: true },
        { key: 8, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        itemCode: [
          { required: true, message: "物料/产品编码不能为空", trigger: "blur" },
          { max: 64, message: '物料/产品编码长度必须小于64个字符', trigger: 'blur' }
        ],
        itemName: [
          { required: true, message: "物料/产品名称不能为空", trigger: "blur" }
        ],
        unitOfMeasure: [
          { required: true, message: "单位不能为空",trigger: "blur"}
        ],
        itemTypeId: [
          { required: true, message: "物料分类不能为空", trigger: "blur" },
        ],
        remark: [
          { max: 250, message: '长度必须小于250个字符', trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    // 根据名称筛选分类树
    itemTypeName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    // this.getList();
    this.getTreeselect();
    this.getUnits();
    this.getSkuActive()
  },
  methods: {
    //修改
    skuupdate(){
      const data={
        craft:this.getsku.craft,
        sku:this.getsku.sku,
        depart:this.getsku.depart,
      }
      console.log(data)
      updateActiveItems(data).then(res=>{
        this.$message.success('修改成功!!');
        this.dialogVisible=false
        this.getSkuActive()
      })
    },
    getSkuActive(){
      getSkuActiveItems().then(res =>{
        this.itemList = res;
        this.loading = false;
      })
    },
    /** 查询物料编码列表 */
    getList() {
      this.loading = true;
      listMdItem(this.queryParams).then(response => {
          // this.itemList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    getUnits(){
      listAllUnitmeasure().then(response =>{
        this.measureOptions = response.data;
      });
    },
    /** 查询分类下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.itemTypeOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.itemTypeId = data.id;
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        itemId: undefined,
        itemTypeId: undefined,
        itemCode: undefined,
        itemName: undefined,
        specification: undefined,
        unitOfMeasrue: undefined,
        unitName: undefined,
        enableFlag: undefined,
        itemOrProduct: undefined,
        enableFlag: 'Y',
        safeStockFlag: 'N',
        highValue: 'N',
        batchFlag: 'Y',
        barcodeUrl: null,
        minStock: 0,
        maxStock: 0,
        optType: undefined,
        remark: undefined
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
      this.ids = selection.map(item => item.itemId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 查询明细按钮操作
    handleView(row){
      this.reset();
      this.getTreeselect();
      const itemId = row.itemId || this.ids;
      getMdItem(itemId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "查看物料/产品";
        this.optType = "view";
        this.$nextTick(()=>{
          this.$refs.barcodeImg.getBarcode();
        })
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      if(this.queryParams.itemTypeId != 0){
        this.form.itemTypeId = this.queryParams.itemTypeId;
      }
      this.optType = "add";
      this.open = true;
      this.title = "新增物料/产品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
    console.log(row)
    this.getsku={...row}
    this.dialogVisible=true


      // this.reset();
      // this.getTreeselect();
      // const itemId = row.itemId || this.ids;
      // getMdItem(itemId).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.optType = "edit";
      //   this.title = "修改物料/产品";
      //   this.$nextTick(()=>{
      //     this.$refs.barcodeImg.getBarcode();
      //   })
      // });

    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.itemId != undefined) {
            updateMdItem(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            debugger;
            addMdItem(this.form).then(response => {
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
      const itemIds = row.itemId || this.ids;
      this.$modal.confirm('确认删除数据项？').then(function() {
        return delMdItem(itemIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('mes/md/mditem/export', {
        ...this.queryParams
      }, `md_item_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "物料/产品导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('mes/md/mditem/importTemplate', {
      }, `md_item_template${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    //获取二维码地址
    getBarcodeUrl(){
      this.barcodeParams.bussinessId = this.form.itemId;
      this.barcodeParams.bussinessCode = this.form.itemCode;
      getBarcodeUrl(this.barcodeParams).then( response =>{
        if(response.data != null){
          this.$set(this.form,'barcodeUrl',response.data.barcodeUrl);//强制刷新DOM
        }
      });
    },
    //自动生成物料编码
    handleAutoGenChange(autoGenFlag){
      debugger;
      if(autoGenFlag){
        genCode('ITEM_CODE').then(response =>{
          this.form.itemCode = response;
        });
      }else{
        this.form.itemCode = null;
      }
    }
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
