<template>
  <div class="material-container">
    <div class="warpper">
      <div class="container-header">
        <el-input
          v-model="casNo"
          size="small"
          class="search"
          placeholder="请输入国际编号"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="materialCode"
          size="small"
          class="search"
          placeholder="请输入物料代码"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="materialName"
          size="small"
          class="search"
          placeholder="请输入物料名称"
          @keyup.enter.native="handleSearch"
        />
        <el-button type="primary" size="small" @click="handleSearch">搜索</el-button>
        <el-button
          v-permission-key="btnPermission.addMaterial"
          type="primary"
          size="small"
          @click="handleAddMaterial"
        >
          新增
        </el-button>
        <el-button
          v-permission-key="btnPermission.audited"
          type="primary"
          size="small"
          @click.stop="handleMaterialAudited"
        >
          审批通过
        </el-button>
        <el-button
          v-permission-key="btnPermission.pending"
          type="warning"
          size="small"
          @click.stop="handleMaterialPending"
        >
          取消审批
        </el-button>
        <el-button
          v-permission-key="btnPermission.invalid"
          type="danger"
          size="small"
          @click.stop="handleMaterialInvalid"
        >
          作废
        </el-button>
      </div>
      <div class="material-table">
        <plk-table
          :table-header="materialHeader"
          :table-data="materialData"
          table-height="calc(50vh)"
          @rowClick="handleGetMaterialPackageList"
          @selectionChange="handleMaterialSelect"
        >
          <template v-slot:btnSlot="clo">
            <el-button
              v-permission-key="btnPermission.editMaterial"
              type="primary"
              size="mini"
              @click.stop="handleGetMaterialDetail(clo)"
            >
              编辑
            </el-button>
            <el-button
              v-permission-key="btnPermission.deleteMaterial"
              type="danger"
              size="mini"
              @click.stop="handleDelete(clo)"
            >
              删除
            </el-button>
          </template>
        </plk-table>
        <!--  分页  -->
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="currentPage"
          :page-sizes="pageSizes"
          :limit.sync="size"
          @pagination="handleGetMaterialList"
        />
      </div>

      <!--   原料包装库存   -->
      <div class="material-package-stock-warpper">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="child-tabel">
            <div class="material-stock">
              <div class="stock-title">
                <span>物料包装库存</span>
                <!--<div>-->
                <!--<el-button type="primary" size="small" @click.stop="handlePackageNormal">正常</el-button>-->
                <!--<el-button type="warning" size="small" @click.stop="handlePackageMetamorphism">变质</el-button>-->
                <!--<el-button type="warning" size="small" @click.stop="handlePackageExpired">过期</el-button>-->
                <!--<el-button type="danger" size="small" @click.stop="handlePackageInvalid">作废</el-button>-->
                <!--</div>-->
              </div>
              <div class="material-stock-data">
                <plk-table
                  table-height="calc(50vh)"
                  :table-selection="false"
                  :table-header="materialPackageHeader"
                  :table-data="materialPackageList"
                  @selectionChange="handlePackgeSelect"
                  @rowClick="handleGetPackageLog"
                >
                  <template v-slot:btnSlot="clo">
                    <el-button
                      v-permission-key="btnPermission.inventory"
                      type="primary"
                      size="mini"
                      @click.stop="handlePackageinventory(clo)"
                    >
                      盘点
                    </el-button>
                    <el-button
                      v-permission-key="btnPermission.normal"
                      type="primary"
                      size="mini"
                      @click.stop="handlePackageNormal(clo)"
                    >
                      正常
                    </el-button>
                    <el-button
                      v-permission-key="btnPermission.metamorphism"
                      type="warning"
                      size="mini"
                      @click.stop="handlePackageMetamorphism(clo)"
                    >
                      变质
                    </el-button>
                    <el-button
                      v-permission-key="btnPermission.expired"
                      type="warning"
                      size="mini"
                      @click.stop="handlePackageExpired(clo)"
                    >
                      过期
                    </el-button>
                    <el-button
                      v-permission-key="btnPermission.packageInvalid"
                      type="danger"
                      size="mini"
                      @click.stop="handlePackageInvalid(clo)"
                    >
                      作废
                    </el-button>
                  </template>
                </plk-table>
                <!--  分页  -->
                <pagination
                  v-show="packageTotal>0"
                  :auto-scroll="false"
                  :total="packageTotal"
                  :page.sync="packageCurrentPage"
                  :page-sizes="packagePageSizes"
                  :limit.sync="packageSize"
                  @pagination="handlePackagePage"
                />
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="child-tabel">
            <div class="material-stock">
              <div class="stock-title">
                <span>包装库存更新</span>
                <span>入库量：</span>
                <span>损耗量：</span>
              </div>
              <div class="material-stock-data">
                <plk-table
                  table-height="calc(50vh)"
                  :table-selection="false"
                  :table-header="PackageLogHeader"
                  :table-data="packageLogData"
                />
                <!--  分页  -->
                <pagination
                  v-show="packageLogTotal>0"
                  :auto-scroll="false"
                  :total="packageLogTotal"
                  :page.sync="packageLogCurrentPage"
                  :page-sizes="packageLogPageSizes"
                  :limit.sync="packageLogSize"
                  @pagination="handlePackageLogPage"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!--  添加原料    -->
      <el-dialog
        v-if="formDialog.show"
        v-el-drag-dialog
        modal
        lock-scroll
        :title="formDialog.title"
        :close-on-click-modal="false"
        :visible.sync="formDialog.show"
        width="40%"
      >
        <plk-form
          ref="zrf"
          :options="formDialog.options"
          :option-value="formDialog.optionValue"
          class="form-component scrollbar"
          @rolling="handleRolling"
        />

        <div style="text-align: right">
          <el-button size="small" @click="handleCloseDialog">取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="$refs.zrf.handleCheckData() && formDialog.submit($refs.zrf.handleGetFormData())"
          >
            确定
          </el-button>
        </div>
      </el-dialog>

      <!--  盘点弹窗    -->
      <el-dialog
        v-if="inventoryForm.show"
        v-el-drag-dialog
        modal
        lock-scroll
        :title="inventoryForm.title"
        :close-on-click-modal="false"
        :visible.sync="inventoryForm.show"
        width="40%"
      >
        <plk-form
          ref="zrf"
          :options="inventoryForm.options"
          :option-value="inventoryForm.optionValue"
          class="form-component scrollbar"
          @rolling="handleRolling"
        />
        <div style="text-align: right">
          <el-button size="small" @click="inventoryForm.show=false">取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="$refs.zrf.handleCheckData() && inventoryForm.submit($refs.zrf.handleGetFormData())"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import { unset } from 'lodash'
import Pagination from '@/components/Pagination'
import PlkTable from '@/components/Table'
import PlkForm from '@/components/Form'
import FormFunction from '@/components/Form/FormFunction'
import { validNumber } from '@/utils/formRules'
import * as requestFunction from '@/api/stock/material'
import btnPermission from './btnPermission'

export default {
  name: 'Index',

  components: {
    PlkTable,
    Pagination,
    PlkForm
  },

  mixins: [FormFunction],

  data() {
    return {
      casNo: '',
      materialCode: '',
      materialName: '',
      tableHeader: [],
      materialHeader: [
        { label: '原料名称', prop: 'materialName' },
        { label: '原料代码', prop: 'materialCode' },
        { label: '国际代码', prop: 'casNo' },
        { label: '入库批次', prop: 'enterBatch' },
        { label: '状态', prop: '_status' },
        { label: '生产日期', prop: 'productionDate' },
        { label: '失效日期', prop: 'expirationDate' },
        { label: '重量（kg）', prop: 'amount', minWidth: '100px' },
        { label: '包装规格（kg）', prop: 'specification', minWidth: '130px' },
        { label: '存放位置', prop: 'storageLocation' },
        { label: '采购日期', prop: 'purchaseDate' },
        { label: '体积', prop: 'volume' },
        { label: '单位', prop: 'unit' },
        { label: '密度', prop: 'density' },
        { label: '操作', type: 'btn', fixed: 'right', minWidth: '150px' }
      ],
      // 物料包装库存
      materialPackageHeader: [
        { label: '原料代码', prop: 'materialCode' },
        { label: '编号', prop: 'packageCode' },
        { label: '当前库存量（kg）', prop: 'amount', width: '150px' },
        { label: '操作', type: 'btn', fixed: 'right', width: '380px' }
      ],
      // 包装库存更新
      PackageLogHeader: [
        { label: '物料代码', prop: 'materialCode' },
        { label: '当前剩余量（kg）', prop: 'surplusAmount', width: '150px' },
        { label: '当前使用量（kg）', prop: 'usageAmount', width: '150px' },
        { label: '状态', prop: '_status' },
        { label: '绝对重量', prop: 'absoluteWeight' },
        { label: '创建人', prop: 'createdBy' },
        { label: '创建时间', prop: 'createdTime' },
        { label: '备注', prop: 'remark' }
      ],
      stockId: '', // 原料id
      packageInfo: {}, // 单条包装库存信息
      materialData: [], // 原料库存
      packageLogData: [], // 原料包装库存日志数据
      materialPackageList: [], // 原料包装库存
      selectMaterialList: [], // 勾选的原料列表
      packageSelectList: [], // 勾选物料包装库存

      pageSizes: [10, 20, 30],
      currentPage: 1, // 当前页
      size: 10, // 每页显示多少条
      total: 0, // 总数

      packagePageSizes: [10, 20, 30],
      packageCurrentPage: 1, // 当前页
      packageSize: 10, // 每页显示多少条
      packageTotal: 0, // 总数

      packageLogPageSizes: [10, 20, 30],
      packageLogCurrentPage: 1, // 当前页
      packageLogSize: 10, // 每页显示多少条
      packageLogTotal: 0, // 总数

      formOptions: {},
      formOptionValue: {},
      STATUS: {},
      inventoryForm: {
        show: false,
        title: '',
        optionValue: '',
        options: ''
      }
    }
  },

  computed: {
    btnPermission() {
      return btnPermission
    }
  },

  mounted() {
    this.STATUS = this.$store.state.status
    this.handleGetMaterialList()
    this.initFormOption()
  },

  methods: {
    // form表单选项
    async initFormOption() {
      this.formOptionValue = {
        amount: '',
        casNo: '',
        density: '',
        enterBatch: '',
        expirationDate: '',
        materialCode: '',
        material: '',
        productionDate: '',
        purchaseDate: '',
        storageLocation: '',
        unit: 'kg',
        volume: '',
        specification: 0
      }
      this.formOptions = {
        material: {
          label: '物料名称',
          type: 'selectObj',
          selectItems: await this.handleGetMaterialInfoList(),
          rules: [
            { required: true, message: '请选择物料名称', trigger: 'change' }
          ],
          rolling: true
        },
        materialCode: {
          label: '物料代码',
          disabled: true
        },
        casNo: {
          label: '国际编号',
          disabled: true
        },
        enterBatch: {
          label: '入库批次',
          rules: [
            { required: true, message: '请输入入库批次', trigger: 'blur' }
          ]
        },
        density: {
          label: '密度',
          rules: [
            { required: true, message: '请输入密度', trigger: 'blur' },
            { message: '请输入实数', trigger: 'blur', validator: validNumber }
          ]
        },
        volume: {
          label: '体积',
          rules: [
            { required: true, message: '请输入体积', trigger: 'blur' },
            { message: '请输入实数', trigger: 'blur', validator: validNumber }
          ]
        },
        productionDate: {
          label: '生产日期',
          type: 'date',
          rules: [
            { required: true, message: '请选择生产日期', trigger: 'change' }
          ]
        },
        expirationDate: {
          label: '失效日期',
          type: 'date',
          rules: [
            { required: true, message: '请选择失效日期', trigger: 'change' }
          ]
        },
        purchaseDate: {
          label: '采购日期',
          type: 'date'
        },
        storageLocation: {
          label: '存放位置'
        },
        amount: {
          label: '重量',
          rules: [
            { message: '请输入实数', trigger: 'blur', validator: validNumber }
          ],
          append: 'kg'
        },
        specification: {
          label: '包装规格',
          rules: [
            { message: '请输入实数', trigger: 'blur', validator: validNumber }
          ],
          append: 'kg'
        },

        unit: {
          label: '单位',
          disabled: true
        }
      }
    },

    // 获取原料信息列表
    handleGetMaterialList() {
      const data = {
        casNo: this.casNo,
        current: this.currentPage,
        materialCode: this.materialCode,
        materialName: this.materialName,
        size: this.size
      }
      requestFunction.getMaterialList(data).then(res => {
        if (res.code === '200') {
          this.materialData = res.data.list.map(item => ({
            ...item,
            _status: this.STATUS[item.status]
          }))
          this.total = Number(res.data.total)
          // this.handleGetMaterialPackageList(this.materialData[0])
        }
      })
    },

    // 搜索
    handleSearch() {
      this.current = 1
      this.handleGetMaterialList()
    },

    // 获取原料信息列表
    async handleGetMaterialInfoList() {
      const materialInfoList = await requestFunction.getMaterialInfoList()
      return materialInfoList.data.map(item => ({
        ...item,
        value: item.materialId,
        label: item.materialName
      }))
    },

    // 添加原料信息弹窗
    async handleAddMaterial() {
      await this.initFormOption()
      const formDialog = {
        title: '新增原料',
        show: true,
        optionValue: this.formOptionValue,
        options: this.formOptions,
        submit: this.handleSubmitMaterial
      }
      Object.assign(this.formDialog, formDialog)
    },

    // rolling
    handleRolling(item, optionValue) {
      console.log(optionValue)
      this.formDialog.optionValue.materialCode = optionValue.material.materialCode
      this.formDialog.optionValue.materialId = optionValue.material.materialId
      this.formDialog.optionValue.casNo = optionValue.material.casNo
    },

    // 提交原料信息
    handleSubmitMaterial(value) {
      const data = {
        ...value,
        materialName: value.material.materialName,
        materialId: value.material.materialId
      }
      unset(data, 'material')
      requestFunction.postMaterial(data).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.$message.success(res.message)
          this.handleGetMaterialList()
        }
      })
    },

    // 获取原料信息详情
    handleGetMaterialDetail(item) {
      console.log(item.scope.row)
      requestFunction.getMaterialDetail(item.scope.row.stockId).then(res => {
        console.log(res)
        if (res.code === '200') {
          const formDialog = {
            show: true,
            title: `修改原料信息：${res.data.materialName || ''}`,
            optionValue: {
              specification: 1,
              id: res.data.stockId,
              material: { label: res.data.materialName, value: res.data.materialId }, // res.data.material,
              ...res.data
            },
            options: this.formOptions,
            submit: this.handlePutMaterial
          }
          this.formDialog = { ...formDialog }
          console.log(this.formDialog)
        }
      })
    },

    // 提交修改
    handlePutMaterial(value) {
      const data = {
        ...value,
        materialName: value.material.label,
        materialId: value.material.value
      }
      unset(data, 'material')
      requestFunction.putMaterial(data, data.id).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.handleGetMaterialList()
          this.$message.success(res.message)
          this.stockId ? this.handleGetMaterialPackageList(this.stockId) : ''
        }
      })
    },

    // 删除
    handleDelete(item) {
      this.$confirm(`确定删除${item.scope.row.materialCode}吗？`, '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      })
        .then(() => {
          requestFunction.deleteMaterial(item.scope.row.stockId)
            .then(res => {
              if (res.code === '200') {
                this.$message.success(res.message)
                this.handleGetMaterialList()
              }
            })
        })
    },

    // 勾选原料
    handleMaterialSelect(materialList) {
      this.selectMaterialList = materialList
      console.log(this.selectMaterialList)
    },

    // 原料审批通过
    handleMaterialAudited() {
      if (!this.selectMaterialList.length) return
      this.$confirm('确定审批通过吗？', '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        const selectMaterialList = this.selectMaterialList
        const selectId = []
        for (const value of selectMaterialList) {
          selectId.push(value.stockId)
        }
        requestFunction.audited({ stockIdList: selectId }).then(res => {
          if (res.code === '200') {
            this.handleGetMaterialList()
            this.selectMaterialList.length = 0
            this.$message.success(res.message)
          }
        })
      })
    },

    // 原料取消审核
    handleMaterialPending() {
      if (!this.selectMaterialList.length) return
      this.$confirm('确定取消审批吗？', '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        const selectMaterialList = this.selectMaterialList
        const selectId = []
        for (const value of selectMaterialList) {
          selectId.push(value.stockId)
        }
        requestFunction.pending({ stockIdList: selectId }).then(res => {
          if (res.code === '200') {
            this.handleGetMaterialList()
            this.selectMaterialList.length = 0
            this.$message.success(res.message)
          }
        })
      })
    },

    // 原料作废
    handleMaterialInvalid() {
      if (!this.selectMaterialList.length) return
      this.$confirm('确定作废吗？', '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        const selectMaterialList = this.selectMaterialList
        const selectId = []
        for (const value of selectMaterialList) {
          selectId.push(value.stockId)
        }
        requestFunction.invalid({ stockIdList: selectId }).then(res => {
          if (res.code === '200') {
            this.handleGetMaterialList()
            this.selectMaterialList.length = 0
            this.$message.success(res.message)
          }
        })
      })
    },

    // 包材包装库存分页请求
    handlePackagePage() {
      this.handleGetMaterialPackageList(this.stockId)
    },

    // （点击原料触发）获取原料包装库存列表
    handleGetMaterialPackageList(stock) {
      let stockId
      if (typeof stock === 'object') {
        stockId = stock.stockId
        this.packageCurrentPage = 1
      } else {
        stockId = stock
      }
      this.stockId = stockId
      const data = {
        current: this.packageCurrentPage,
        size: this.packageSize
      }
      requestFunction.getMaterialPackageList(data, stockId).then(res => {
        if (res.code === '200') {
          this.materialPackageList = res.data.list
          this.packageTotal = Number(res.data.total)
          this.packageLogCurrentPage = 1
          this.packageLogData = []
          // this.handleGetPackageLog(this.materialPackageList[0])
        }
      })
    },

    // 盘点
    handlePackageinventory(clo) {
      this.inventoryForm = {
        show: true,
        title: `盘点：${clo.scope.row.materialCode}`,
        optionValue: {
          packageId: clo.scope.row.packageId,
          amount: '',
          status: '',
          remark: ''
        },
        options: {
          amount: {
            label: '当前库存量',
            rules: [
              { required: true, message: '请输入当前库存量', trigger: 'blur' }
            ]
          },
          status: {
            label: '状态',
            type: 'select',
            selectItems: [
              { label: '正常', value: 'normal' },
              { label: '变质', value: 'metamorphism' },
              { label: '作废', value: 'Invalid' },
              { label: '过期', value: 'expired' }
            ],
            rules: [
              { required: true, message: '请选择状态', trigger: 'change' }
            ]
          },
          remark: {
            label: '备注'
          }
        },
        submit: this.handlePostInventory
      }
    },

    // 提交盘点
    handlePostInventory(value) {
      requestFunction.inventory(value, value.packageId).then(res => {
        if (res.code === '200') {
          this.inventoryForm.show = false
          this.$message.success(res.message)
          this.handleGetMaterialPackageList(this.stockId)
          this.packageLogData = []
          this.packageLogCurrentPage = 1
        }
      })
    },

    // 勾选包装库存
    handlePackgeSelect(packageList) {
      this.packageSelectList = packageList
    },

    // 包装库存正常
    handlePackageNormal(clo) {
      this.$confirm(`确定修改${clo.scope.row.packageCode}为正常吗？`, '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        requestFunction.packageNormal(clo.scope.row.packageId).then(res => {
          if (res.code === '200') {
            this.handleGetMaterialPackageList(this.stockId)
            this.$message.success(res.message)
          }
        })
      })
    },

    // 包装库存变质
    handlePackageMetamorphism(clo) {
      this.$confirm(`确定修改${clo.scope.row.packageCode}为变质吗？`, '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        requestFunction.packageMetamorphism(clo.scope.row.packageId).then(res => {
          if (res.code === '200') {
            this.handleGetMaterialPackageList(this.stockId)
            this.$message.success(res.message)
          }
        })
      })
    },

    // 包装库存过期
    handlePackageExpired(clo) {
      this.$confirm(`确定修改${clo.scope.row.packageCode}为过期吗？`, '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        requestFunction.packageExpired(clo.scope.row.packageId).then(res => {
          if (res.code === '200') {
            this.handleGetMaterialPackageList(this.stockId)
            this.$message.success(res.message)
          }
        })
      })
    },

    // 包装库存作废
    handlePackageInvalid(clo) {
      this.$confirm(`确定修改${clo.scope.row.packageCode}为作废吗？`, '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        requestFunction.packageInvalid(clo.scope.row.packageId).then(res => {
          if (res.code === '200') {
            this.handleGetMaterialPackageList(this.stockId)
            this.$message.success(res.message)
          }
        })
      })
    },

    // (点击包装库存触发)获取原料包装库存日志
    handleGetPackageLog(packageInfo) {
      this.packageInfo = packageInfo
      const data = {
        current: this.packageLogCurrentPage,
        size: this.packageLogSize
      }
      requestFunction.getPackageLog(data, packageInfo.packageId).then(res => {
        if (res.code === '200') {
          this.packageLogTotal = Number(res.data.total)
          this.packageLogData = res.data.list.map(item => ({
            ...item,
            _status: this.STATUS[item.status]
          }))
        }
      })
    },

    // 日志分页请求
    handlePackageLogPage() {
      this.handleGetPackageLog(this.packageInfo)
    }
  }
}
</script>

<style lang="scss" scoped>

.container-header {
  div, button {
    margin-bottom: 16px;
  }
}

.search {
  width: 160px;
  margin-right: 10px;
}

.form-component {
  max-height: 50vh;
  margin-bottom: 22px;
  padding-right: 16px;
  overflow-y: auto;
  overflow-x: hidden;
}

.material-table {
  margin-bottom: 32px;
}

.material-package-stock-warpper {
  .material-stock {
    .stock-title {
      min-height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  }
}
</style>
