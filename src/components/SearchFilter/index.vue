<template>
  <div class="search-filter">
    <span class="title">快捷过滤</span>
    <!-- 搜索的表头 -->
    <el-select v-model="fieldValue" class="margin-left-8" size="small" placeholder="成品名称">
      <el-option
        v-for="item in fieldOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <!-- 判断条件 -->
    <el-select v-model="judgeValue" class="margin-left-8" size="small">
      <el-option
        v-for="item in judgeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <!-- 输入关键字 -->
    <el-input v-model="input" class="input margin-left-8" size="small" placeholder="请输入或选择关键字" />

    <!-- 下拉 -->
    <el-popover
      placement="bottom"
      width="800"
      trigger="click"
    >
      <div class="field-judge-warpper">
        <!-- 搜索的表头 -->
        <el-select v-model="fieldValue" class="margin-left-8" size="small" placeholder="成品名称">
          <el-option
            v-for="item in fieldOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <!-- 判断条件 -->
        <el-select v-model="judgeValue" class="margin-left-8" size="small">
          <el-option
            v-for="item in judgeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <!-- 输入关键字 -->
        <el-input v-model="input" class="margin-left-8" style="width: 240px;" size="small" placeholder="请输入或选择关键字" />
        <el-button type="text" icon="el-icon-minus" />
      </div>
      <el-button type="text" icon="el-icon-plus" />
      <el-button slot="reference" type="primary" size="mini" icon="el-icon-edit" />
    </el-popover>

    <!-- 搜索 -->
    <el-button class="margin-left-8" type="primary" size="mini" icon="el-icon-search" />

    <!-- 保存重置按钮 -->
    <el-button class="margin-left-8" type="text">保存</el-button>
    <el-button class="margin-left-8" type="text">重置</el-button>
  </div>
</template>

<script>
export default {
  name: 'SearchFilter',

  props: {
    // fieldOptions: {
    //   type: Array,
    //   required: true
    // }
  },

  data() {
    return {
      fieldOptions: [
        { label: '岗位', value: '岗位' }
      ],
      fieldValue: '',

      judgeOptions: [
        { label: '包含', value: '包含' },
        { label: '等于', value: '等于' },
        { label: '不等于', value: '不等于' },
        { label: '大于', value: '大于' }
      ],
      judgeValue: ''

    }
  }
}
</script>

<style lang="scss" scoped>
.search-filter {
  padding: 0 16px;
  height: 40px;
  background: #FFFFFF;
  margin-bottom: 16px;
  font-size: 0px;

  .title {
    font-size: 14px;
  }

  .margin-left-8 {
    margin-left: 8px;
  }

  .input {
    width: 240px;
  }
}
</style>
