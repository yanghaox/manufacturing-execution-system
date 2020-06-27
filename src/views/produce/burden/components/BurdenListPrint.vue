<template>
  <el-dialog
    class="burden-list-print"
    :visible.sync="visible"
    append-to-body
    :show-close="false"
    destroy-on-close
    fullscreen
    @open="init"
  >
    <span slot="title" class="dialog-title">
      称量清单打印预览
    </span>

    <div class="print-warpper">
      <!-- 基本信息 -->
      <div class="title-warpper">
        <span class="title-item">称量清单</span>
        <span class="title-item">计划日期：2020-02-02 14:11:11</span>
        <span class="title-item">创建日期：{{ createdTime }}</span>
      </div>
      <div class="detail-warpper">
        <div class="detail-item">
          <div>工单编号：{{ workOrderCode }}</div>
          <div>批次编号：{{ batchCode }}</div>
          <div>配料编号：{{ burdenCode }}</div>
        </div>
        <div class="detail-item">
          <div>
            <barcode :value="list.barcodes" :options="barcode_option" tag="svg" />
          </div>
        </div>
        <div class="detail-item">
          <div>{{ techName }}</div>
        </div>
        <div class="detail-item">
          <div><div style="text-align: right; display: inline-block; width: 56px;">页：</div>{{ page }}</div>
          <div><div style="text-align: right; display: inline-block; width: 56px;">日期：</div>{{ date }}</div>
          <div><div style="text-align: right; display: inline-block; width: 56px;">时间：</div>{{ time }}</div>
          <div>保密/禁止复制</div>
        </div>
      </div>

      <!-- 表格 -->
      <plk-table
        :table-header="printHeader"
        :table-data="printData"
        :table-selection="false"
        :table-border="false"
        :table-stripe="false"
      />

      <!-- 签字 -->
      <div class="autograph-warpper">
        <span class="autograph-item">原料可用：</span>
        <span class="autograph-item">称量区负责人签字：</span>
        <span class="autograph-item">操作员签字：</span>
        <span class="autograph-item">总托盘数：</span>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleFormClose">取 消</el-button>
      <el-button type="primary" size="small" @click="handleFormCommit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import plkTable from '@/components/Table'
import { parseTime } from '@/utils'
export default {
  name: 'BurdenListPrint',

  components: { plkTable },

  props: {
    currProcess: {
      type: Object,
      required: true
    },
    processData: {
      type: Array,
      required: true
    },
    showBurdenListPrintDialog: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      printHeader: [
        { label: '配料时间', prop: 'burdenAt', align: 'center' },
        { label: '原料编号', prop: 'materialCode', align: 'center' },
        { label: '实际重量', prop: 'materialWeight', align: 'center' },
        { label: '投料人', prop: 'feedUserId', align: 'center' },
        { label: '投料时间', prop: 'feedDateAt', align: 'center' }
      ],
      printData: [],

      techName: '',
      workOrderCode: '',
      batchCode: '',
      burdenCode: '',
      createdTime: '',

      page: 1,
      date: parseTime(Date.now(), '{y}-{m}-{d}'),
      time: parseTime(Date.now(), '{h}:{i}:{s}'),

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
      },

      list: { barcodes: '0000006307843' }
    }
  },

  computed: {
    visible: {
      get() {
        return this.showBurdenListPrintDialog
      },
      set(value) {
        if (!value) {
          this.handleFormClose()
        }
      }
    }
  },

  methods: {
    init() {
      this.printData = this.processData
      const { workOrderCode, batchCode, burdenCode, createdTime, techName } = this.currProcess
      this.workOrderCode = workOrderCode
      this.batchCode = batchCode
      this.burdenCode = burdenCode
      this.createdTime = createdTime
      this.techName = techName
    },

    handleFormClose() {
      this.$emit('close')
    },

    handleFormCommit() {
      window.print()
    }
  }
}
</script>
<style lang='scss' scoped>
@media print{
  /deep/ #app {
    display: none;
  }
  .dialog-title {
    display: none;
  }
  .dialog-footer {
    display: none;
  }
}

.burden-list-print {
  .print-warpper {
    width: 800px;
    margin: 0 auto;
    .title-warpper {
      display: flex;
      align-items: center;
      height: 24px;
      font-weight: bolder;
      font-size: 16px;
      .title-item {
        flex: 1 1 auto;
      }
    }

    .detail-warpper {
      display: flex;
      height: 96px;
      font-weight: bolder;
      .detail-item {
        flex: 1 1 auto;
        div {
          height: 24px;
          line-height: 24px;
        }
      }
    }

    .autograph-warpper {
      display: flex;
      align-items: center;
      height: 40px;
      font-weight: bolder;
      .autograph-item {
        flex: 1 1 auto;
      }
    }
  }
}
</style>
