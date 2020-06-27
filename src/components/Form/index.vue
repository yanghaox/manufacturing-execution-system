<template>
  <div>
    <el-form ref="form" :model="optionValue" :label-width="labelWidth">
      <el-row class="elrow" :gutter="30" type="flex">
        <!--        :xs="24" :sm="24" :md="12" :lg="12" :xl="8"-->
        <el-col
          v-for="(item, name) in options"
          :key="item.name"
          :xs="item.xs || 24"
          :sm="item.sm || 24"
          :md="item.md || 24"
          :lg="item.lg || 24"
          :xl="item.xl || 24"
        >

          <!--slot-->
          <slot v-if="item.type==='slot'" :name="name" />

          <!--     text/password     -->
          <el-form-item
            v-else-if="item.type === 'text' || item.type === 'password' || !item.type"
            :label="item.label"
            :prop="name"
            :rules="item.rules"
          >
            <span v-if="item.isText" v-text="optionValue[name]" />
            <el-input
              v-else
              v-model="optionValue[name]"
              size="small"
              clearable
              show-word-limit
              :disabled="item.disabled"
              :type="item.type"
              :maxlength="item.maxlength || ''"
              :placeholder="item.placeholder || `请输入${item.label || '内容'}`"
              @blur="item.rolling ? $emit('rolling', name ,optionValue) : undefined"
            >
              <template v-if="item.append" slot="append">
                <div v-html="item.append" />
              </template>
            </el-input>
          </el-form-item>

          <!-- number -->
          <el-form-item
            v-else-if="item.type === 'number'"
            :label="item.label"
            :prop="name"
            :rules="item.rules"
          >
            <el-input
              v-model.number="optionValue[name]"
              size="small"
              show-word-limit
              :maxlength="item.maxlength || ''"
              :disabled="item.disabled"
              :placeholder="item.placeholder || `请输入${item.label || '内容'}`"
              clearable
              @blur="item.rolling ? $emit('rolling', name, optionValue) : undefined"
            >
              <template v-if="item.append" slot="append">
                <div v-html="item.append" />
              </template>
            </el-input>
          </el-form-item>

          <!--    counter      -->
          <el-form-item
            v-else-if="item.type === 'counter'"
            :label="item.label"
            :prop="name"
            :rules="item.rules"
            @blur="item.rolling ? $emit('rolling', name, optionValue) : undefined"
          >
            <el-input-number
              v-model.number="optionValue[name]"
              :disabled="item.disabled"
              size="small"
              controls-position="right"
              :min="item.min || 0"
              :max="item.max"
            />
          </el-form-item>

          <!--select-->
          <el-form-item
            v-else-if="item.type === 'select'"
            :label="item.label"
            :prop="name"
            :rules="item.rules"
          >
            <el-select
              v-model="optionValue[name]"
              :disabled="item.disabled"
              :allow-create="item.create || false"
              size="small"
              :placeholder="item.placeholder || `请选择${item.label || '内容'}`"
              filterable
              default-first-option
              clearable
              @change="item.rolling ? $emit('rolling', name, optionValue) : undefined"
            >
              <el-option
                v-for="option in item.selectItems"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>

          <!--selectObj-->
          <el-form-item
            v-else-if="item.type === 'selectObj'"
            :label="item.label"
            :prop="name"
            :rules="item.rules"
          >
            <el-select
              v-model="optionValue[name]"
              :disabled="item.disabled"
              :allow-create="item.create || false"
              :placeholder="item.placeholder || `请选择${item.label || '内容'}`"
              value-key="value"
              size="small"
              filterable
              default-first-option
              clearable
              @change="item.rolling ? $emit('rolling', name, optionValue) : undefined"
            >
              <el-option
                v-for="option in item.selectItems"
                :key="option.value"
                :label="option.label"
                :value="option"
              />
            </el-select>
          </el-form-item>

          <!--级联选择器-->
          <el-form-item
            v-else-if="item.type === 'cascader'"
            :label="item.label"
            :prop="name"
            :rules="item.rules"
          >
            <el-cascader
              v-model="optionValue[name]"
              :options="item.selectItems"
              :disabled="item.disabled"
              :placeholder="item.placeholder || `请选择${item.label || '内容'}`"
              :props="item.props"
              :collapse-tags="item.collapse"
              size="small"
              clearable
              filterable
              style="width: 100%"
              @change="item.rolling ? $emit('rolling', name, optionValue) : undefined"
            />
          </el-form-item>

          <!--select-multiple -->
          <el-form-item
            v-else-if="item.type === 'multiple'"
            :label="item.label"
            :prop="name"
            :rules="item.rules"
          >
            <el-select
              v-model="optionValue[name]"
              :disabled="item.disabled"
              :allow-create="item.create || false"
              size="small"
              :placeholder="item.placeholder || `请选择${item.label || '内容'}`"
              multiple
              filterable
              clearable
              @change="item.rolling ? $emit('rolling', name, optionValue) : undefined"
            >
              <el-option
                v-for="option in item.selectItems"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>

          <!--textarea-->
          <el-form-item
            v-else-if="item.type === 'textarea'"
            :label="item.label"
            :prop="name"
            :rules="item.rules"
          >
            <el-input
              v-model="optionValue[name]"
              :disabled="item.disabled"
              type="textarea"
              :placeholder="item.placeholder || `请输入${item.label || '内容'}`"
              clearable
              @blur="item.rolling ? $emit('rolling', name, optionValue) : undefined"
            />
          </el-form-item>

          <!-- date -->
          <el-form-item
            v-else-if="item.type === 'date'"
            :label="item.label"
            :prop="name"
            :rules="item.rules"
          >
            <el-date-picker
              v-model="optionValue[name]"
              :disabled="item.disabled"
              size="small"
              align="right"
              type="date"
              :editable="false"
              :placeholder="item.placeholder || `请选择${item.label || '日期'}`"
              :picker-options="pickerOptions"
              @change="item.rolling ? $emit('rolling', name, optionValue) : undefined"
            />
          </el-form-item>

          <!-- dateTime -->
          <el-form-item
            v-else-if="item.type === 'dateTime'"
            :label="item.label"
            :prop="name"
            :rules="item.rules"
          >
            <el-date-picker
              v-model="optionValue[name]"
              :disabled="item.disabled"
              size="small"
              type="datetime"
              :editable="false"
              :placeholder="item.placeholder || `请选择${item.label || '日期和时间'}`"
              @change="item.rolling ? $emit('rolling', name, optionValue) : undefined"
            />
          </el-form-item>

          <!--switch-->
          <el-form-item
            v-else-if="item.type ==='switch'"
            :label="item.label"
            :prop="name"
          >
            <el-switch
              v-model="optionValue[name]"
              :disabled="item.disabled"
              @change="item.rolling ? $emit('rolling', name, optionValue) : undefined"
            />
          </el-form-item>

          <el-form-item v-else-if="item.type='file'" :label="item.label" :prop="name">
            <el-upload
              :action="action"
              multiple
              :file-list="fileList"
              :on-success="handleSuccess"
              :on-error="handleError"
              :before-remove="beforeRemove"
              :on-remove="handleRemove"
              :headers="item.headers"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>

        </el-col>
      </el-row>

      <slot name="formSlot" />

    </el-form>
  </div>
</template>

<script>
import { GMTToStr } from '../../utils'

export default {
  props: {
    options: {
      type: Object,
      default: function() {
        return {}
      }
    },
    optionValue: {
      type: Object,
      required: true,
      default: function() {
        return {}
      }
    },
    labelWidth: {
      type: String,
      default: 'auto'
    },
    // :xs="24" :sm="24" :md="12" :lg="12" :xl="8"
    xs: {
      type: Number,
      default: 24
    },
    sm: {
      type: Number,
      default: 24
    },
    md: {
      type: Number,
      default: 24
    },
    lg: {
      type: Number,
      default: 24
    },
    xl: {
      type: Number,
      default: 24
    },
    action: {
      type: String,
      default: '/fbi/common/file/upload'
    },
    cpFileList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },

  data() {
    return {
      select: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      fileList: []
    }
  },

  mounted() {
    this.fileList = this.cpFileList
  },

  methods: {
    handleCheckData() {
      let flag = null
      this.$refs.form.validate((valid) => {
        if (valid) {
          flag = true
        } else {
          flag = false
        }
      })
      return flag
    },

    // 获取表单数据
    handleGetFormData() {
      Object.keys(this.options).map(v => {
        if (this.optionValue[v] && this.options[v].type === 'date') {
          this.optionValue[v] = GMTToStr(this.optionValue[v])
        } else if (this.optionValue[v] && this.options[v].type === 'dateTime') {
          this.optionValue[v] = GMTToStr(this.optionValue[v])
        } else if (this.options[v].type === 'switch' && this.options[v] === '') {
          this.optionValue[v] = true
        } else if (this.options[v].type === 'file') {
          this.optionValue[v] = this.fileList
        }
      })
      return this.optionValue
    },

    // 重置表单
    resetFields() {
      this.$refs['form'].resetFields()
    },

    // 上传文件成功
    handleSuccess(res, file, fileList) {
      if (res.code === '200') {
        this.fileList = fileList
      } else {
        // this.fileList.splice(-1)
        this.$message.error(res.message)
      }
      console.log(this.fileList)
      console.log(file)
      console.log(fileList)
    },

    // 上传失败
    handleError(res) {
      this.$message.error(JSON.parse(res.message).message)
    },

    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    // 移除文件
    handleRemove(file, fileList) {
      this.fileList = fileList
    },

    getOptions() {
      return {
        options: this.options,
        optionValue: this.optionValue
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor.el-input {
  width: 100% !important;
}

.elrow {
  flex-wrap: wrap;
  /*align-items: center;*/
}

.el-select {
  width: 100% !important;
}
</style>
