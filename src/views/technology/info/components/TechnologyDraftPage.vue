<template>
  <div class="technology-draft-page">
    <plk-table
      table-height="calc(100vh - 77px - 64px)"
      col-min-width="160px"
      :table-header="draftHeader"
      :table-data="draftData"
      :table-selection="false"
    >
      <template v-slot:btnSlot="row">
        <el-button
          type="primary"
          size="mini"
          @click="handleDraftLoading(row.scope)"
        >
          加载草稿
        </el-button>

        <el-button
          type="danger"
          size="mini"
          @click="deleteDraft(row.scope)"
        >
          删除草稿
        </el-button>
      </template>
    </plk-table>

    <pagination
      :total="pagination.total"
      :page="pagination.pageNum"
      :limit="pagination.pageSize"
      @pagination="handlePagination"
    />
  </div>
</template>

<script>
import PlkTable from '@/components/Table'
import Pagination from '@/components/Pagination'
import {
  getDraftList,
  deleteDraft,
  getDraftDetail
} from '@/api/technology/info'
export default {
  name: 'TechnologyDraftPage',

  components: { PlkTable, Pagination },

  data() {
    return {
      draftHeader: [
        { label: '工艺编号', prop: 'techCode' },
        { label: '工艺名称', prop: 'techName' },
        { label: '配方名称', prop: 'bomName' },
        { label: '设备组编号', prop: 'groupCode' },
        { label: '设备组名称', prop: 'groupName' },
        { label: '草稿备注', prop: 'remark' },
        { label: '产量下限', prop: 'quantityLowLimit', width: '80px' },
        { label: '产量上限', prop: 'quantityUpLimit', width: '80px' },
        { label: '创建时间', prop: 'createdTime' },
        { label: '操作', type: 'btn', fixed: 'right', width: '200px' }
      ],
      draftData: [],

      pagination: {
        total: 0,
        pageNum: 0,
        pageSize: 0
      }

    }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      this.getDraftList()
    },

    /* 获取工艺草稿列表 */
    getDraftList(parmas = {}) {
      getDraftList(parmas).then(res => {
        const { list, total, pageNum, pageSize } = res.data
        this.draftData = list
        this.pagination.total = Number(total)
        this.pagination.pageNum = Number(pageNum)
        this.pagination.pageSize = Number(pageSize)
        console.log('res', res)
      })
    },

    /* 加载草稿 */
    handleDraftLoading({ row }) {
      const {
        draftId,
        bomId,
        bomVersionId,
        departmentId,
        groupId,
        quantityLowLimit,
        quantityUpLimit,
        techCode,
        techId,
        techName,
        techType,
        unit
      } = row
      getDraftDetail(draftId).then(res => {
        const techData = res.data.techData
        const data = {
          bomId,
          bomVersionId,
          departmentId,
          groupId,
          quantityLowLimit,
          quantityUpLimit,
          techCode,
          techId,
          techName,
          techType,
          unit,
          techData
        }
        this.$emit('handle-draft-loading', data)
      })
    },

    /* 删除草稿 */
    deleteDraft({ row }) {
      const { draftId } = row
      deleteDraft(draftId).then(res => {
        this.$message.success(res.message)
        this.init()
      })
    },

    /* 处理分页 */
    handlePagination({ page, limit }) {
      console.log(page, limit)
      this.pagination.pageNum = page
      this.pagination.pageSize = limit
      this.getDraftList({ current: page, size: limit })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
