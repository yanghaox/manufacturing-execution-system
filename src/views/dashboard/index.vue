<template>
  <div class="dashboard-container">
    开发中...
    <div class="dashboard-container" v-if="false">
      <!--  常用功能  -->
      <div class="dashboard-common-function">
        <div class="common-header">常用功能</div>
        <div class="common-function-list">
          <scroll-pane>
            <div class="common-function-item">
              <div class="common-function-delete">×</div>
              <div class="function-icon">
                <svg-icon class-name="search-icon" icon-class="search" />
              </div>
              <div class="function-text">生产管理</div>
            </div>
          </scroll-pane>
        </div>
        <div class="operation-container">
          <div class="add">＋</div>
          <div class="reduce">－</div>
        </div>
      </div>

      <!--  待办消息  -->
      <div class="ready-to-do-container">
        <div class="ready-head">待办消息</div>
        <div class="news-container">
          <el-row class="to-do-header">
            <el-col :xs="22" :sm="23" :md="23" :lg="23" :xl="23">
              <el-checkbox size="mini" class="checkbox" />
              信息标题
            </el-col>
            <el-col :xs="2" :sm="1" :md="1" :lg="1" :xl="1" class="close">
              状态
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in news" :key="index" :class="{'done':item.checked}" class="list-row">
            <el-col :xs="22" :sm="23" :md="23" :lg="23" :xl="23" :class="{'done':item.checked}">
              <el-checkbox v-model="item.checked" size="mini" class="checkbox" />
              <span class="content" @click="handleDetail(item,'news')">{{ item.title }}</span>
            </el-col>
            <el-col :xs="2" :sm="1" :md="1" :lg="1" :xl="1" class="close">
              {{ item.state }}
            </el-col>
          </el-row>

          <div class="pagination">
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="currentPage"
              :limit.sync="size"
              @pagination="handleGetNews"
            />
          </div>
        </div>
      </div>

      <!--备忘录-->
      <div class="memorandum">
        <div class="memorandum-head">
          备忘录
          <el-button class="memorandum-btn" size="small" type="primary" @click="handleAddMemorandum">添加</el-button>
        </div>
        <div class="memorandum-container">
          <el-row class="memorandum-header">
            <el-col :xs="22" :sm="23" :md="23" :lg="23" :xl="23">
              <el-checkbox size="mini" class="checkbox" />
              信息标题
            </el-col>
            <el-col :xs="2" :sm="1" :md="1" :lg="1" :xl="1">
              状态
            </el-col>
          </el-row>
          <el-row v-for="(item, index) in news" :key="index" :class="{'done':item.checked}" class="list-row">
            <el-col :xs="22" :sm="23" :md="23" :lg="23" :xl="23" :class="{'done':item.checked}">
              <el-checkbox v-model="item.checked" size="mini" class="checkbox" />
              <span class="content" @click="handleDetail(item,'memorandum')">{{ item.title }}</span>
            </el-col>
            <el-col :xs="2" :sm="1" :md="1" :lg="1" :xl="1">
              {{ item.state }}
            </el-col>
          </el-row>

          <div class="pagination">
            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="currentPage"
              :limit.sync="size"
              @pagination="handleGetNews"
            />
          </div>
        </div>
      </div>

      <!--  备忘录详情  -->
      <el-dialog
        v-el-drag-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        width="30%"
      >
        <details-pop />
        <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">退 出</el-button>
        <el-button size="small" type="primary" @click="dialogVisible = false">已处理</el-button>
      </span>
      </el-dialog>

      <!--  添加备忘录  -->
      <el-dialog
        v-el-drag-dialog
        modal
        lock-scroll
        :close-on-click-modal="false"
        :visible.sync="memorandumVisible"
        title="添加备忘录"
      >
        <my-form
          ref="jrf"
          :options="formDialog.options"
          :option-value="formDialog.optionValue"
        />
        <div style="text-align: right">
          <el-button size="small" @click="memorandumVisible=fale">取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="$refs.jrf.handleCheckData() && handleSubmitMemorandum($refs.jrf.handleGetFormData())"
          >
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import myForm from '@/components/Form'
import FormFunction from '@/components/Form/FormFunction'
import pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import scrollPane from './components/scrollPane'

export default {
  name: 'Dashboard',
  directives: { elDragDialog },

  components: {
    scrollPane,
    pagination,
    myForm
  },

  mixins: [FormFunction],

  data() {
    return {
      currentPage: 1, // 当前页
      size: 30, // 每页显示多少条
      total: 100, // 总数
      news: [
        { checked: false, title: '信息标题', state: '1' },
        { checked: true, title: '设备清洗消毒/GOO8清洗模式待审批', state: '1' },
        { checked: false, title: '信息标题', state: '1' },
        { checked: false, title: '信息标题', state: '1' },
        { checked: true, title: '设备清洗消毒/GOO8清洗模式待审批', state: '1' },
        { checked: false, title: '信息标题', state: '1' },
        { checked: false, title: '信息标题', state: '1' },
        { checked: true, title: '设备清洗消毒/GOO8清洗模式待审批', state: '1' },
        { checked: false, title: '信息标题', state: '1' }
      ],
      dialogTitle: '待办消息详情',
      dialogVisible: false,
      memorandumVisible: false
    }
  },

  computed: {
    ...mapGetters([
      'name'
    ])
  },
  methods: {
    handleGetNews() {},
    handleDetail(item, type) {},
    handleAddMemorandum() {
      this.formDialog = {
        optionValue: {
          title: ''
        },
        options: {
          title: {
            label: '标题',
            type: 'text',
            rules: [
              { required: true, message: '请输入标题', trigger: 'blur' }
            ]
          },
          content: {
            label: '内容',
            type: 'textarea',
            rules: [
              { required: true, message: '请输入内容', trigger: 'blur' }
            ]
          }
        }
      }
      this.memorandumVisible = true
    },
    handleSubmitMemorandum(val) {
      console.log(val)
      this.memorandumVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin-top: 8px;
  }

  &-common-function {
    margin-bottom: 8px;
    background-color: #fff;

    &:after {
      display: block;
      content: '';
      clear: both;
    }

    .common-header {
      padding: 19px 0 15px 17px;
      margin-bottom: 24px;
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #ECECEC;
    }

    .common-function-list {
      float: left;
      width: calc(100% - 194px);
      height: 126px;
      padding-left: 17px;
      padding-right: 20px;
      white-space: nowrap;
      position: relative;
      box-sizing: border-box;

      &:after {
        display: block;
        content: '';
        clear: both;
      }

      .scroll-container /deep/ .el-scrollbar__wrap {
        height: 125px;
      }

      .common-function-item {
        position: relative;
        /*float: left;*/
        display: inline-block;
        width: 118px;
        margin-right: 44px;
        text-align: center;
        cursor: pointer;
        overflow: hidden;

        &:hover {
          .common-function-delete {
            right: 0;
          }

          .function-icon {
            background-color: #ececec;
          }
        }

        .common-function-delete {
          position: absolute;
          top: 0;
          right: -25px;
          width: 25px;
          height: 25px;
          background-color: #fff;
          border-radius: 50%;
          font-size: 16px;
          line-height: 25px;
          overflow: hidden;
          transition: all 0.2s;
        }

        .function-icon {
          padding: 15px 0;
          background-color: #F2F2F2;
          transition: all 0.2s;

          .svg-icon {
            width: 2em;
            height: 2em;
          }
        }

        .function-text {
          margin-top: 11px;
          font-size: 14px;
          color: #333333;
        }
      }
    }

    .operation-container {
      float: left;
      width: 174px;
      padding-right: 24px;
      box-sizing: border-box;

      &:after {
        display: block;
        content: "";
        clear: both;
      }

      .add, .reduce {
        float: left;
        width: 64px;
        height: 64px;
        border: 1px solid #ECECEC;
        color: #999;
        text-align: center;
        line-height: 64px;
        cursor: pointer;
        transition: all 0.5s;

        &:hover {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1)
        }

        &.add {
          margin-right: 22px;
        }
      }
    }
  }
}

.ready-to-do-container, .memorandum {
  background-color: #fff;

  &.ready-to-do-container {
    margin-bottom: 8px;
  }

  .ready-head, .memorandum-head {
    padding: 19px 0 15px 17px;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #ECECEC;

    &:after {
      display: block;
      content: '';
      clear: both;
    }

    .memorandum-btn {
      float: right;
      margin-right: 20px;
    }
  }

  .news-container, .memorandum-container {
    .to-do-header, .memorandum-header {
      padding: 7px 0 7px 17px;
      background-color: #F2F2F2;
      color: #666666;
      font-size: 16px;

      .checkbox {
        margin-right: 3px;
      }

      .content {
        cursor: pointer;
      }
    }

    .list-row {
      padding: 14px 0 14px 17px;
      color: #248FFF;
      font-size: 14px;
      border-bottom: 1px solid #ECECEC;

      .checkbox {
        margin-right: 3px;
      }

      .content {
        cursor: pointer;
      }
    }

    .done {
      color: #999999;
      text-decoration: line-through;
    }

    .pagination {
      text-align: center;
    }
  }
}
</style>
