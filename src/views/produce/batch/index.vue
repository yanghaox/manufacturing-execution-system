<template>
  <div class="material-container">
    <div class="warpper">
      <div class="container-header">
        <el-input
          v-model="batchCode"
          size="small"
          class="search"
          placeholder="请输入批次编号"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="batchName"
          size="small"
          class="search"
          placeholder="请输入批次名"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="workOrderCode"
          size="small"
          class="search"
          placeholder="请输入工单编号"
          @keyup.enter.native="handleSearch"
        />
        <el-input
          v-model="workOrderName"
          size="small"
          class="search"
          placeholder="请输入工单名"
          @keyup.enter.native="handleSearch"
        />
        <el-date-picker
          v-model="planStartTime"
          type="datetime"
          size="small"
          class="search"
          placeholder="计划开始时间"
        />
        <el-date-picker
          v-model="planEndTime"
          type="datetime"
          size="small"
          class="search"
          placeholder="计划结束时间"
        />

        <el-button type="primary" size="small" class="search-button" @click="handleSearch">搜索</el-button>
        <el-button
          v-permission-key="btnPermission.addBatch"
          type="primary"
          size="small"
          class="search-button"
          @click="handleAdd"
        >
          新增
        </el-button>
      </div>
      <div class="batch-table">
        <plk-table
          :table-selection="false"
          :table-header="tableHeader"
          :table-data="batchList"
          table-height="calc(100vh - 266px)"
        >
          <template v-slot:btnSlot="clo">
            <el-button type="primary" size="small" @click="batchReportShow = true">打印批次报告</el-button>
            <el-button
              v-permission-key="btnPermission.audited"
              type="primary"
              size="mini"
              @click="handleAudited(clo)"
            >
              审批通过
            </el-button>
            <el-button
              v-permission-key="btnPermission.failure"
              type="warning"
              size="mini"
              @click="handleAuditedFailure(clo)"
            >
              审批拒绝
            </el-button>
            <el-button
              v-permission-key="btnPermission.invalid"
              type="danger"
              size="mini"
              @click="handleInvalid(clo)"
            >
              批次作废
            </el-button>
          </template>
        </plk-table>
      </div>
      <Pagination
        v-show="total>0"
        :total="total"
        :page.sync="currentPage"
        :limit.sync="size"
        @pagination="handleGetBatchList"
      />
      <!--   甘特图   -->
      <div class="gantt-btn-warpper">
        <el-button size="small" type="primary" icon="el-icon-zoom-in" @click="handleEnlarge" />
        <el-button size="small" type="primary" icon="el-icon-zoom-out" @click="handleNarrow" />
      </div>
      <div class="container-warpper">
        <div ref="gantt" class="gantt-main" />
      </div>
    </div>

    <!--  新增批次  -->
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
        @rolling="formDialog.rolling"
      />
      <div style="text-align: right">
        <el-button size="small" @click="formDialog.show=false">取消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="$refs.zrf.handleCheckData() && formDialog.submit($refs.zrf.handleGetFormData())"
        >
          确定
        </el-button>
      </div>
    </el-dialog>

    <!--  批次报告  -->
    <el-dialog title="批次报告打印预览" :visible.sync="batchReportShow" width="840px">
      <div id="batch-report">
        <div class="flex-container">
          <div class="batch-report-flex-item">
            <div>批次 - 报告</div>
            <br>
            <div>
              <span style="margin-right: 150px;">
                NART:
                <strong>-40001-00 </strong>
              </span>
              <span>0231-2310-2030-030,1</span>
            </div>
            <br>
            <div>
              <strong style="margin-left: 106px;">舒蕾波卡香果漾鸢尾香氛滋养洗发露/乳</strong>
            </div>
            <br>
            <div>
              <span style="margin-right: 140px">批号:</span>
              <span>84901736</span>
            </div>
            <br>
            <div>
              <span style="margin-right: 140px">生产日期:</span>
              <div class="batch-report-underline" />
            </div>
            <br>
            <div>
              <span style="margin-right: 140px">乳化线:</span>
              <div class="batch-report-underline" />
            </div>
            <br>
            <div class="flex-div">
              <span style="margin-right: 140px">场线清洗:</span>
              <div class="batch-report-check-box" style="margin-left: 0" />
              <strong class="batch-report-check-box-text">清洗</strong>
              <div class="batch-report-check-box" />
              <strong class="batch-report-check-box-text">冲洗</strong>
              <div class="batch-report-check-box" style="margin-left:180px;" />
              <strong class="batch-report-check-box-text">连续生产</strong>
            </div>
            <br>
            <div class="flex-div">
              <span style="margin-right: 47px">生产线准备就绪:</span>
              <div class="batch-report-check-box" />
              <strong class="batch-report-check-box-text">是</strong>
              <div class="batch-report-check-box" style="margin-left: 64px;" />
              <strong class="batch-report-check-box-text">否</strong>
              <br>
              <div style="margin-top: 20px;">
                <span style="margin-left: 131px;">备注:</span>
                <div class="batch-report-underline" />
              </div>
            </div>
            <div class="flex-div">
              <table>
                <tr>
                  <th>设备\时间</th>
                  <th>开始时间</th>
                  <th>结束时间</th>
                </tr>
                <tr>
                  <td>乳化锅</td>
                  <td />
                  <td />
                </tr>
                <tr>
                  <td>排空料体</td>
                  <td />
                  <td />
                </tr>
              </table>
            </div>
            <div class="flex-div">
              <div class="batch-report-check-box" style="margin-left: 0" />
              <strong class="batch-report-check-box-text">生产执行过程中基本无偏差/错误</strong>
            </div>
            <div class="flex-div">
              <div class="batch-report-check-box" style="margin-left: 0" />
              <strong class="batch-report-check-box-text">生产执行过程中出现偏差（内容及原因）</strong>
            </div>
            <div class="flex-div">
              <table style="width: 800px;">
                <tr>
                  <th style="width: 500px">偏差描述</th>
                  <th>开始</th>
                  <th>结束</th>
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                </tr>
              </table>
            </div>
            <div class="flex-div">
              <table style="width: 800px;">
                <tr>
                  <th>储罐号</th>
                  <th>重量(kg)</th>
                  <th>储罐号</th>
                  <th>重量(kg)</th>
                  <th>储罐号</th>
                  <th>重量(kg)</th>
                  <th>储罐号</th>
                  <th>重量(kg)</th>
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
                <tr>
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td />
                </tr>
              </table>
            </div>
            <div class="flex-div">
              <div class="print-list-foot-child" style="margin-left: 20px; width: 34%">总罐数：</div>
              <div class="print-list-foot-child" style="width: 33%">实际重量______kg</div>
              <div class="print-list-foot-child" style="width: 33%">产率______%</div>
            </div>
            <div class="flex-div">
              <div style="margin-top: 20px;">
                <span>
                  <strong>生产注释:</strong>
                </span>
                <div class="batch-report-underline" style="width: 700px;margin-left: 74px;" />
                <br>
                <div class="batch-report-underline" style="width: 774px;margin-left: 0;" />
                <br>
                <div class="batch-report-underline" style="width: 774px;margin-left: 0;" />
                <br>
                <div class="batch-report-underline" style="width: 774px;margin-left: 0;" />
              </div>
            </div>
          </div>
          <div class="batch-report-flex-item2">
            <barcode :value="list.barcodes" :options="barcode_option" tag="svg" />
          </div>
        </div>
        <div class="print-list-data" />
        <div class="print-list-foot batch-report-foot" style="padding-top: 54px;text-align: center;">
          <div class="print-list-foot-child" style="width: 24%">签字：</div>
          <div class="print-list-foot-child" style="width: 34%">
            <span>_____________</span>
            <br>
            <span>1.设备操作员</span>
          </div>
          <div class="print-list-foot-child" style="width: 34%">
            <span>_____________</span>
            <br>
            <span>2.设备操作员</span>
            <br>
            <span>(换班时)</span>
          </div>
          <div class="print-list-foot-child" style="width: 34%">
            <span>_____________</span>
            <br>
            <span>复核</span>
          </div>
          <div class="print-list-foot-child" style="width: 34%">
            <span>_____________</span>
            <br>
            <span>化验员</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="batchReportShow = false">取 消</el-button>
        <el-button
          v-print="'#batch-report'"
          size="small"
          type="primary"
          @click="listenPrintList = false"
        >
          打 印
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import btnPermission from './btnPermission.js'
import { gantt } from 'dhtmlx-gantt'
import Pagination from '@/components/Pagination'
import PlkTable from '@/components/Table'
import PlkForm from '@/components/Form'
import FormFunction from '@/components/Form/FormFunction'
import { GMTToStr } from '@/utils'
import { validNumber, checkZh } from '@/utils/formRules'
import * as requestFun from '@/api/produce/batch'

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
      batchCode: '',
      batchName: '',
      workOrderCode: '',
      workOrderName: '',
      planStartTime: '',
      planEndTime: '',
      STATUS: '',
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 0, // 总数
      formOptions: {},
      batchList: [],
      tableHeader: [
        { label: '批次编号', prop: 'batchCode' },
        { label: '批次名', prop: 'batchName' },
        { label: '所属部门', prop: 'belongDepartment' },
        { label: '状态', prop: '_status' },
        { label: '工单编号', prop: 'workOrderCode' },
        { label: '工艺编号', prop: 'techCode' },
        { label: '工艺版本', prop: 'techVersion' },
        { label: '产量(kg)', prop: 'yield' },
        { label: '计划开始时间', prop: 'planStartTime', width: '110px' },
        { label: '计划结束时间', prop: 'planEndTime', width: '110px' },
        { label: '开始时间', prop: 'startTime' },
        { label: '完成时间', prop: 'endTime', width: '110px' },
        { label: '创建人', prop: 'createdBy' },
        { label: '创建时间', prop: 'createdTime', width: '110px' },
        { label: '混合进程', prop: 'mixProcess' },
        { label: '工作类型', prop: 'type' },
        { label: '备注', prop: 'remark' },
        { label: '操作', type: 'btn', fixed: 'right', width: '410px' }
      ],
      btnWrapperScroll: true,
      tasks: { // 甘特图数据
        data: []
      },

      // 打印批次报告配置
      batchReportShow: false,
      list: { barcodes: '0000006307843' },
      barcode_option: {
        displayValue: true, // 是否默认显示条形码数据
        // textPosition: 'top', // 条形码数据显示的位置
        background: '#fff', // 条形码背景颜色
        valid: function(valid) {
          console.log(valid)
        },
        width: '1px', // 单个条形码的宽度
        height: '55px',
        fontSize: '16px' // 字体大小
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
    this.handleGetBatchList()
    window.clickGridButton = (id) => {
      console.log(id)
      this.handleEditBatch(id)
    }
  },

  methods: {

    /**
     * 初始化甘特图
     */
    initGantt() {
      gantt.clearAll() // 清除甘特图的数据
      this.handleGanttSetting()
      this.handleGanttZoomDate()
      this.handleGanttColumns()
      this.handleGanttTooltip()
      this.handleGanttLayout()
      gantt.init(this.$refs.gantt)
      gantt.parse(this.tasks)
    },

    /**
     * 甘特图基础配置
     */
    handleGanttSetting() {
      gantt.i18n.setLocale('cn')
      gantt.config.duration_unit = 'minute'
      gantt.config.drag_move = false // 禁止拖动任务条改变时间
      gantt.config.drag_progress = false // 禁止拖动改变进度
      gantt.config.drag_resize = false // 禁止拖拽改变任务宽度
      gantt.config.details_on_dblclick = false // 双击查看详情
      gantt.config.show_links = false // 禁止连线
      // 数据中处理时间 2015-08-07  时间戳需要onTemplatesReady处理
      gantt.config.xml_date = '%Y-%m-%d %H:%i'
      // 设置甘特图的表头高度
      gantt.config.scale_height = 60
      gantt.templates.task_cell_class = function(item, date) { // 周末添加weekend类名
        // debugger;
        if (date.getDay() === 0 || date.getDay() === 6) {
          return 'weekend'
        }
      }
    },

    /**
     * 甘特图左侧数据
     */
    handleGanttColumns() {
      // 编辑按钮
      // const colContent = function(task) {
      //   return ('<i class="el-icon-edit gantt-button " ' + 'onclick="clickGridButton(' + task.batchId + ')">编辑</i>')
      // }
      // editor：行内编辑
      gantt.config.columns = [
        // { name: 'buttons', label: '操作', min_width: 80, template: colContent, align: 'center' },
        { name: 'batchCode', label: '批次编号', min_width: 100, align: 'center' },
        { name: 'start_date', label: '计划开始', min_width: 100, align: 'center' },
        { name: 'end_date', label: '计划结束', min_width: 100, align: 'center' },
        { name: 'workOrderCode', label: '工单编号', min_width: 100, align: 'center' },
        { name: 'techCode', label: '工艺编号', min_width: 100, align: 'center' }
      ]
    },

    /**
     * 甘特图Layout
     */
    handleGanttLayout() {
      // 布局（设置左右两侧分开左右滚动）
      gantt.config.layout = {
        css: 'gantt_container',
        cols: [
          {
            width: 400,
            min_width: 300,
            rows: [
              {
                view: 'grid',
                scrollX: 'gridScroll',
                scrollable: true,
                scrollY: 'scrollVer'
              },
              {
                view: 'scrollbar',
                id: 'gridScroll',
                group: 'horizontal'
              }
            ]
          },
          {
            resizer: true,
            width: 1
          },
          {
            rows: [
              {
                view: 'timeline',
                scrollX: 'scrollHor',
                scrollY: 'scrollVer'
              },
              {
                view: 'scrollbar',
                id: 'scrollHor',
                group: 'horizontal'
              }
            ]
          },
          {
            view: 'scrollbar',
            id: 'scrollVer'
          }
        ]
      }
    },

    /**
     * 甘特图Tooltip
     */
    handleGanttTooltip() {
      // 任务条显示的内容
      gantt.templates.task_text = function(start, end, task) {
        return '<b>批次:</b> ' + task.batchCode
      }
      // tooltip
      gantt.plugins({
        tooltip: true
      })
      gantt.templates.tooltip_date_format = function(date) {
        const formatFunc = gantt.date.date_to_str('%Y-%m-%d %H:%i')
        return formatFunc(date)
      }
      gantt.templates.tooltip_text = function(start, end, task) {
        return `<p>批次编号：${task.batchCode}</p>
        <p>工单编号：${task.workOrderCode}</p>
        <p>工艺编号：${task.techCode}</p>
        <p>计划开始：${gantt.templates.tooltip_date_format(start)}</p>
        <p>计划结束：${gantt.templates.tooltip_date_format(end)}</p>
        <p></p>
        `
      }
    },

    /**
     * 甘特图放大、缩小时时间刻度
     */
    handleGanttZoomDate() {
      // 放大、缩小
      const zoomConfig = {
        levels: [
          {
            name: 'hour',
            scale_height: 30,
            min_column_width: 15,
            scales: [
              { unit: 'day', step: 1, format: '%Y' + '年' + '%m' + '月' + '%d' + '日' },
              { unit: 'hour', step: 1, format: '%H' + '时' }
            ]
          },
          {
            name: 'day',
            scale_height: 50,
            min_column_width: 40,
            scales: [
              { unit: 'month', format: '%M' },
              { unit: 'day', step: 1, format: '%d' + '日' }
            ]
          },
          {
            name: 'month',
            height: 50,
            min_column_width: 50,
            scales: [
              { unit: 'month', step: 1, format: '%M' },
              { unit: 'year', step: 1, format: '%Y' + '年' }
            ]
          }
        ]
      }
      gantt.ext.zoom.init(zoomConfig)
      gantt.ext.zoom.setLevel('hour')
    },

    /**
     * 初始化form选项
     */
    async handleInitForm() {
      const techList = await this.handlegetTech()
      const workOrder = await this.handleGetWorkOrder()
      const department = await this.handleGetDepartment()
      const type = await this.handleGetType()
      this.formOptions = {
        workOrder: {
          label: '工单',
          type: 'selectObj',
          selectItems: workOrder,
          rules: [
            { required: true, message: '请选择工单', trigger: 'change' }
          ]
        },
        tech: {
          label: '工艺',
          type: 'selectObj',
          selectItems: techList,
          rolling: true,
          rules: [
            { required: true, message: '请选择工艺', trigger: 'change' }
          ]
        },
        techVersionId: {
          label: '工艺版本',
          type: 'select',
          selectItems: [],
          disabled: true,
          rules: [
            { required: true, message: '请选择工艺版本', trigger: 'change' }
          ]
        },
        yield: {
          label: '产量',
          append: 'kg',
          rules: [
            { required: true, message: '请输入产量', trigger: 'blur' },
            { message: '请输入实数', trigger: 'blur', validator: validNumber }
          ]
        },
        batchName: {
          label: '批次名',
          rules: [
            { required: true, message: '请输入批次名', trigger: 'blur' }
          ]
        },
        batchCode: {
          label: '批次编号',
          rules: [
            { required: true, message: '请输入批次编号', trigger: 'blur' },
            { message: '禁止输入中文字符', trigger: 'blur', validator: checkZh }
          ]
        },
        department: {
          label: '所属部门',
          type: 'selectObj',
          selectItems: department,
          rules: [
            { required: true, message: '请选择部门', trigger: 'change' }
          ]
        },
        workType: {
          label: '工作类型',
          type: 'selectObj',
          selectItems: type,
          rules: [
            { required: true, message: '请选择工作类型', trigger: 'change' }
          ]
        },
        planStartTime: {
          label: '计划开始时间',
          type: 'dateTime',
          rules: [
            { required: true, message: '请选择计划开始时间', trigger: 'change' }
          ]
        },
        planEndTime: {
          label: '计划结束时间',
          type: 'dateTime',
          rules: [
            { required: true, message: '请选择计划结束时间', trigger: 'change' }
          ]
        },
        remark: {
          label: '备注'
        }
      }
    },

    /**
     * 获取批次列表
     */
    handleGetBatchList() {
      const data = {
        batchCode: this.batchCode,
        batchName: this.batchName,
        workOrderCode: this.workOrderCode,
        workOrderName: this.workOrderName,
        planStartTime: this.planStartTime ? GMTToStr(this.planStartTime) : '',
        planEndTime: this.planEndTime ? GMTToStr(this.planEndTime) : '',
        current: this.currentPage,
        size: this.size
      }
      requestFun.getBatch(data).then(res => {
        if (res.code === '200') {
          this.batchList = res.data.list.map(item => ({
            ...item,
            _status: this.STATUS[item.status]
          }))
          gantt.clearAll() // 先清除甘特图数据
          this.tasks.data = res.data.list.map(item => ({
            ...item,
            start_date: item.planStartTime,
            end_date: item.planEndTime
          }))
          this.total = Number(res.data.total)
          // gantt.parse(this.tasks)
          // this.initScroll()
          this.initGantt()
        }
      })
    },

    /**
     * 搜索
     */
    handleSearch() {
      this.currentPage = 1
      this.handleGetBatchList()
    },

    /**
     * 添加
     */
    async handleAdd() {
      await this.handleInitForm()
      this.formDialog = {
        show: true,
        title: '新增批次',
        optionValue: {
          workOrder: '',
          techVersionId: '',
          yield: '',
          batchName: '',
          batchCode: '',
          department: '',
          workType: '',
          planStartTime: '',
          planEndTime: '',
          remark: '',
          tech: ''
        },
        options: this.formOptions,
        submit: this.handlePostBatch,
        rolling: this.handleRolling
      }
    },

    async handleRolling(item, optionValue) {
      if (item === 'tech' && optionValue.tech) {
        this.formDialog.options.techVersionId.disabled = false
        this.formDialog.options.techVersionId.selectItems = await this.handleGetTechVersion(optionValue.tech.techId)
      } else if (item === 'tech' && !optionValue.tech) {
        this.formDialog.options.techVersionId.disabled = true
        this.formDialog.optionValue.techVersionId = ''
        this.formDialog.options.techVersionId.selectItems = []
      }
    },

    /**
     * 获取工艺列表
     */
    async handlegetTech() {
      const { data: techList } = await requestFun.getTech()
      return techList.map(item => ({
        ...item,
        label: item.techName,
        value: item.techId
      }))
    },

    /**
     * 获取工艺版本
     * @param techId
     */
    async handleGetTechVersion(techId) {
      if (techId !== undefined) {
        let { data: versionList } = await requestFun.getTechVersion(techId)
        versionList = versionList.map(item => ({
          ...item,
          label: item.version,
          value: item.techVersionId
        }))
        return versionList
      }
    },

    /**
     * 获取工单列表
     */
    async handleGetWorkOrder() {
      const { data: workOrder } = await requestFun.getWorkOrder()
      return workOrder.map(item => ({
        ...item,
        label: item.workOrderCode,
        value: item.workOrderId
      }))
    },

    /**
     * 获取部门列表
     */
    async handleGetDepartment() {
      const { data: department } = await requestFun.getDepartment()
      return department.map(item => ({
        ...item,
        label: item.departmentName,
        value: item.departmentId
      }))
    },

    /**
     * 获取类型
     */
    async handleGetType() {
      const { data: type } = await requestFun.getType()
      return type.map(item => ({
        ...item,
        label: item.typeName,
        value: item.typeId
      }))
    },

    /**
     * 提交批次
     */
    handlePostBatch(value) {
      value.workOrderId = value.workOrder.value
      value.belongDepartmentId = value.department.value
      value.belongDepartment = value.department.label
      value.typeId = value.workType.value
      Reflect.deleteProperty(value, 'department')
      Reflect.deleteProperty(value, 'workOrder')
      Reflect.deleteProperty(value, 'workType')
      Reflect.deleteProperty(value, 'tech')

      requestFun.postBatch(value).then(res => {
        if (res.code === '200') {
          this.formDialog.show = false
          this.$message.success(res.message)
          this.handleGetBatchList()
        }
      })
    },

    /**
     * 审批通过
     * @param clo
     */
    handleAudited(clo) {
      console.log(clo)
      this.$confirm(`确定审批通过${clo.scope.row.batchCode}吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestFun.audited(clo.scope.row.batchId).then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
            this.handleGetBatchList()
          }
        })
      })
    },

    /**
     * 审批拒绝
     * @param clo
     */
    handleAuditedFailure(clo) {
      this.$confirm(`确定审批拒绝${clo.scope.row.batchCode}吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestFun.auditedFailure(clo.scope.row.batchId).then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
            this.handleGetBatchList()
          }
        })
      })
    },

    /**
     * 批次作废
     * @param clo
     */
    handleInvalid(clo) {
      this.$confirm(`确定作废${clo.scope.row.batchCode}吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestFun.invalid(clo.scope.row.batchId).then(res => {
          if (res.code === '200') {
            this.$message.success(res.message)
            this.handleGetBatchList()
          }
        })
      })
    },

    /**
     * 甘特图缩小 需要配置zoom
     */
    handleEnlarge() {
      gantt.ext.zoom.zoomOut()
    },

    /**
     * 甘特图放大
     */
    handleNarrow() {
      gantt.ext.zoom.zoomIn()
    },

    /**
     * TODO
     * 编辑批次
     */
    async handleEditBatch(item) {
      console.log(item)
      await this.handleInitForm()
      this.formOptions.techVersionId.disabled = false
      this.formOptions.selectItems = await this.handleGetTechVersion(item.techId)
      this.formDialog = {
        show: true,
        title: `修改批次：${item.batchCode}`,
        optionValue: {
          workOrder: { value: item.workOrderId },
          techVersionId: item.techVersionId,
          yield: item.yield,
          batchName: item.batchName,
          batchCode: item.batchCode,
          department: item.belongDepartmentId,
          workType: item.typeId,
          planStartTime: item.planStartTime,
          planEndTime: item.planEndTime,
          remark: item.remark
        },
        options: this.formOptions,
        submit: this.handlePostBatch,
        rolling: this.handleRolling
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~dhtmlx-gantt/codebase/sources/skins/dhtmlxgantt_material.css";

.search {
  width: 160px;
  margin-right: 10px;
  margin-bottom: 16px;
}

.search-button {
  margin-bottom: 16px;
}

.form-component {
  max-height: 50vh;
  margin-bottom: 22px;
  padding-right: 16px;
  overflow-y: auto;
  overflow-x: hidden;
}

.gantt-btn-warpper {
  margin-top: 16px;
  margin-bottom: 16px;
}

.gantt-main {
  height: 70vh;

  /deep/ .gantt-button {
    color: #409eff;
    cursor: pointer;
  }

  /deep/ .weekend {
    background: #f4f7f4;
  }
}

// 打印样式
table {
  height: 100px;
  width: 400px;
  text-align: center;
  //去除双线表格外框
  border-collapse: collapse;
}

tr {
  height: 25px;
}

table, td, th {
  border: 1px solid black;
}

.batch-report-check-box-text {
  padding-top: 6px;
  margin-left: 10px;
}

.batch-report-check-box {
  width: 25px;
  height: 25px;
  border: 1px solid;
  margin-left: 50px;
}

/*//弹性盒子，加上之后div不换行*/
.flex-div {
  margin-top: 5px;
  width: 780px;
  display: -webkit-flex;
  display: flex;
}

.batch-report-underline {
  border-bottom: 1px solid #000000;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  width: 149px;
  margin-left: 168px;
}

.print-list-foot {
  display: -webkit-flex;
  display: flex;
  height: 100px;
  padding-top: 83px;
  margin-bottom: 82px;
}

.batch-report /deep/ .el-table__fixed-body-wrapper {
  top: 100% !important;
}

.print-list-data {
  background-color: aqua;
}

.batch-report /deep/ .el-dialog {
  width: 850px !important;
  min-height: 1000px;
}

.batch-report /deep/ .el-dialog__footer {
  position: absolute;
  bottom: 0;
  right: 20px;
}

.flex-container {
  display: -webkit-flex;
  display: flex;
  width: 800px;
  /*height: 110px;*/
  /*background-color: lightgrey;*/
}

.batch-report-flex-item {
  /*background-color: #d5adad;*/
  width: 600px;
  margin: 10px;
}

.flex-item {
  background-color: red;
  width: 203px;
  margin: 10px;
}

.batch-report-flex-item2 {
  /*background-color: cornflowerblue;*/
  /*width: 400px;*/
  margin: 10px;
  display: inline
}

.flex-ite2m {
  background-color: cornflowerblue;
  width: 400px;
  margin: 10px;
  display: inline
}

.flex-ite3m {
  background-color: rgba(227, 84, 105, 0.23);
  width: 100px;
  margin: 10px;
  display: inline;
}

.flex-item-page {
  background-color: #ea8a15;
  width: 111px;
  margin: 10px;
}
</style>
