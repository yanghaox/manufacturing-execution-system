<template>
  <div class="app-container">
    <el-steps :active="active" finish-status="success">
      <el-step v-for="i in 7" :key="i" :title="step[i]" @click.native="handleClickStep(i)" />
    </el-steps>

    <button @click="enlarge">缩小</button>
    <button @click="narrow">放大</button>
    <button @click="nextPage">下一页</button>

    <div class="container-warpper">
      <div ref="operatingWarpper" class="operating-warpper">
        <div class="operating">
          <div class="header">操作</div>
          <div class="btn-warpper" :class="{scroll: btnWrapperScroll}">
            <div v-for="(item,index) in tasks.data" :key="index" class="btn">
              <el-button size="mini" type="text" @click="handleEdit(item)">{{item.code}}编辑</el-button>
            </div>
          </div>
        </div>
      </div>

      <div ref="gantt" class="gantt-main" />
    </div>
  </div>
</template>

<script>
import { gantt } from 'dhtmlx-gantt'
import PlkForm from '@/components/Form'
import FormFunction from '@/components/Form/FormFunction'
// import formTest from './form'

export default {
  name: 'Index',
  mixins: [FormFunction],

  components: {
    PlkForm,
    // formTest
  },

  data() {
    return {
      show: false,
      step: {
        1: '待审批',
        2: '审批通过',
        3: '已配料',
        4: '已复核',
        5: '已投料',
        6: '已配制',
        7: '已完成'
      },
      btnWrapperScroll: false,
      active: 3,
      tasks: {
        data: [
          {
            code: '1',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '2',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '3',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '4',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '5',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '6',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '7',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '8',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '9',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '10',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '11',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '12',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '13',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '14',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '15',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '16',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '17',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '18',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '19',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '20',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '21',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '22',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '23',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '24',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '25',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '26',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '27',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '28',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '29',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '30',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '31',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '32',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '33',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '34',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '35',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '36',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '37',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '38',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '39',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '40',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '41',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '42',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '43',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '44',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '45',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '46',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '47',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '48',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '49',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '50',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '51',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '52',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '53',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '54',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '55',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '56',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          },
          {
            code: '57',
            name: '名称',
            start_date: '2019-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 3,
            progress: 1
          },
          {
            code: '58',
            name: '名称',
            start_date: '2020-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 2,
            progress: 1
          },
          {
            code: '59',
            name: '名称',
            start_date: '2017-04-20 11:30:10',
            end_date: '2017-04-20 18:30',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            title: '标题'
          },
          {
            code: '60',
            name: '名称',
            start_date: '2018-04-20',
            remark: '标记',
            className: '类名',
            changNeng: '产能',
            duration: 4,
            progress: 2
          }
        ]
      }
    }
  },

  mounted() {
    this.initScroll()
    console.log(gantt)
    this.initGantt()
  },
  methods: {
    initGantt() {
      gantt.clearAll()
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

      // 放大、缩小
      const zoomConfig = {
        levels: [
          {
            name: 'hour',
            scale_height: 50,
            min_column_width: 30,
            scales: [
              { unit: 'day', step: 1, format: '%Y' + '年' + '%m' + '月' + '%d' + '日' },
              { unit: 'hour', step: 3, format: '%H' + '时' }
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
          // {
          //   name: 'year',
          //   scale_height: 50,
          //   min_column_width: 30,
          //   scales: [
          //     { unit: 'year', step: 1, format: '%Y' + '年' }
          //   ]
          // }
        ]
      }
      gantt.ext.zoom.init(zoomConfig)
      gantt.ext.zoom.setLevel('day')

      // 任务条显示的内容
      gantt.templates.task_text = function(start, end, task) {
        return '<b>Text:</b> ' + task.name
      }

      // editor：行内编辑
      gantt.config.columns = [
        { name: 'code', label: '资源代号', align: 'center' },
        { name: 'name', label: '名称', align: 'center' },
        { name: 'start_date', label: '开始时间', width: 200, resize: true, align: 'center' },
        { name: 'end_date', label: '结束时间', width: '*', align: 'center' },
        { name: 'remark', label: '注记', align: 'center' },
        { name: 'className', label: '类名', align: 'center' },
        { name: 'changNeng', label: '时长min', align: 'center' }
      ]

      // 提交修改事件
      gantt.ext.inlineEditors.attachEvent('onBeforeSave', (state) => {
        console.log('修改', state)
      })

      // tooltip
      gantt.plugins({
        tooltip: true
      })
      gantt.templates.tooltip_date_format = function(date) {
        var formatFunc = gantt.date.date_to_str('%Y-%m-%d %H:%i')
        return formatFunc(date)
      }
      gantt.templates.tooltip_text = function(start, end, task) {
        return `<p>任务名：${task.name}</p><p>开始时间：${gantt.templates.tooltip_date_format(start)}</p><p>结束时间：${gantt.templates.tooltip_date_format(end)}</p>`
      }

      // 布局（设置滚动）
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

      gantt.init(this.$refs.gantt)
      gantt.parse(this.tasks)
      console.log(this.tasks)
    },
    initScroll() {
      const _that = this
      this.$nextTick(() => {
        const ganttVerScroll = document.getElementsByClassName('gantt_ver_scroll')[0]
        const operatingWarpper = document.getElementsByClassName('operating-warpper')[0]
        if (ganttVerScroll) {
          this.btnWrapperScroll = true
          ganttVerScroll.addEventListener('scroll', (event) => {
            _that.$refs.operatingWarpper.scrollTop = event.target.scrollTop
          })
          operatingWarpper.addEventListener('scroll', (event) => {
            ganttVerScroll.scrollTop = event.target.scrollTop
          })
        } else {
          this.btnWrapperScroll = false
        }
      })
    },
    handleShow() {
      this.show = true
    },
    handleEdit(item) {
      this.formDialog.show = true
    },

    handleClickStep(item) {
      console.log(item)
    },
    nextPage() {
      gantt.clearAll()
      this.tasks.data = [
        {
          code: '01',
          name: '名称',
          start_date: '2017-04-20 11:30:10',
          end_date: '2017-04-20 18:30',
          remark: '标记',
          className: '类名',
          changNeng: '产能',
          title: '标题'
        }
      ]
      gantt.parse(this.tasks)
      this.initScroll()
    },
    // 缩小 需要配置zoom
    enlarge() {
      gantt.ext.zoom.zoomOut()
    },
    // 放大
    narrow() {
      gantt.ext.zoom.zoomIn()
    }
  }
}
</script>

<style lang="scss" scoped>
/*@import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";*/
@import "~dhtmlx-gantt/codebase/sources/skins/dhtmlxgantt_material.css";

.container-warpper {
  background-color: #fff;

  &:after {
    display: block;
    content: '';
    clear: both;
  }

  .operating-warpper {
    float: left;
    width: 70px;
    height: 70vh;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0;
    }

    .operating {
      .header {
        position: fixed;
        width: 70px;
        height: 51px;
        border-bottom: 1px solid #cecece;
        background-color: #fff;
        line-height: 50px;
        text-align: center;
        font-size: 12px;
        color: #a6a6a6;
      }

      .btn-warpper {
        height: 100%;
        padding-top: 50px;

        &.scroll {
          overflow-x: scroll;
        }

        .btn {
          display: flex;
          height: 35px;
          border-bottom: 1px solid rgb(235, 235, 235);
          align-items: center;
          justify-content: center;
        }
      }
    }
  }

  .gantt-main {
    float: left;
    height: 70vh;
    width: calc(100% - 70px);

    /deep/ .gantt_layout_cell_border_left {
      border-left: none;
    }
  }
}

</style>
