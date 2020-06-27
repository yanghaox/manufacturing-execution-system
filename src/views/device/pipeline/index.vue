<template>
  <div class="pipeline">
    <toolbar :toolbar-list="toolbarList" />

    <plk-table
      table-height="calc(100vh - 250px)"
      col-min-width="150px"
      :table-header="pipelineHeader"
      :table-data="pipelineData"
      @selectionChange="handleSelectionChange"
    >
      <template v-slot:btnSlot="row">
        <el-button
          v-permission-key="[btnPermission.editPipeline]"
          type="primary"
          size="mini"
          @click="editPipeline(row.scope)"
        >
          编辑
        </el-button>
        <el-button
          v-permission-key="[btnPermission.deletePipeline]"
          type="danger"
          size="mini"
          @click="deletePipeline(row.scope)"
        >
          删除
        </el-button>
      </template>
    </plk-table>

    <pagination :total="pagination.total" @pagination="handlePagination" />

    <!-- 设备单元弹框 -->
    <pipeline-dialog
      v-if="pipelineDialog"
      :pipeline-dialog="pipelineDialog"
      :pipeline-type="pipelineType"
      :current-pipeline-data="currentPipelineData"
      @close-dialog="handlePipelineClose"
    />
  </div>
</template>

<script>
import Toolbar from '@/components/Toolbar'
import PlkTable from '@/components/Table'
import Pagination from '@/components/Pagination'
import PipelineDialog from './components/PipelineDialog.vue'
import btnPermission from './btnPermission.js'
import {
  getPipeline,
  deletePipeline
} from '@/api/device/pipeline'

export default {
  name: 'Pipeline',

  components: {
    Toolbar,
    PlkTable,
    Pagination,
    PipelineDialog
  },

  data() {
    return {
      btnPermission,
      toolbarList: [],
      pipelineHeader: [
        // { label: '物料标识', prop: 'materialId' },
        // { label: '管道标识', prop: 'pipelineId' },
        { label: '管道编号', prop: 'pipelineCode', width: '160px' },
        { label: '管道名称', prop: 'pipelineName', width: '160px' },
        { label: '物料编号', prop: 'materialCode', width: '160px' },
        { label: '物料名称', prop: 'materialName', width: '160px' },
        { label: '备注', prop: 'remark', width: '160px' },
        { label: '创建人', prop: 'createdBy', width: '160px' },
        { label: '创建时间', prop: 'createdTime', width: '160px' },
        { label: '更新人', prop: 'updatedBy', width: '160px' },
        { label: '更新时间', prop: 'updatedTime', width: '160px' },
        { label: '操作', type: 'btn', fixed: 'right', width: '160px' }
      ],
      pipelineData: [],
      pipelineSelection: [],

      pagination: {
        total: 0
      },

      // 设备单元弹出框
      currentPipelineData: {},
      pipelineType: 'add', // add/edit
      pipelineDialog: false
    }
  },

  activated() {
    this.init()
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.getPipeline()
      this.initToolbar()
    },

    /* 初始化工具栏 */
    initToolbar() {
      this.toolbarList = [
        {
          id: '3',
          type: 'dropdown',
          text: '新增',
          dropdownList: [
            {
              id: '1',
              text: '新增',
              disabled: false,
              click: this.addPipeline,
              btnPermission: this.btnPermission.addPipeline
            },
            { id: '2', text: '复制', disabled: true }
          ]
        },
        { id: '13', type: 'button', text: '退出', click: this.quit }
      ]
    },

    /* 获取管道列表 */
    getPipeline() {
      getPipeline().then(res => {
        const { list, total } = res.data
        this.pipelineData = list
        this.pagination.total = Number(total)
      })
    },

    /* 添加管道弹窗 */
    addPipeline() {
      this.pipelineType = 'add'
      this.pipelineDialog = true
    },

    /* 编辑弹窗 */
    editPipeline({ row }) {
      console.log('row', row)
      this.currentPipelineData = row
      this.pipelineType = 'edit'
      this.pipelineDialog = true
    },

    /* 删除管道 */
    deletePipeline({ row }) {
      console.log(row)
      this.$confirm(`确认删除${row.pipelineName}吗？`, '警告', {
        cancelButtonClass: '取消',
        confirmButtonClass: '确定',
        type: 'warning'
      }).then(() => {
        const id = row.pipelineId
        deletePipeline(id).then(res => {
          this.$message.success(res.message)
          this.init()
        })
      })
    },

    /* 处理分页 */
    handlePagination({ page, limit }) {
      console.log(page, limit)
    },

    /* 处理选中框改变 */
    handleSelectionChange(value) {
      this.pipelineSelection = value
    },

    /* 处理管道弹窗关闭 */
    handlePipelineClose() {
      this.pipelineDialog = false
      this.init()
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
