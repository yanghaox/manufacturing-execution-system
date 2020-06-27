<template>
  <div>
    <plkTable
      table-height="500"
      col-min-width="100px"
      :table-data="tableData"
      :table-header="tableHeader"
      :tree-props="{children: 'children'}"
      @selectionChange="handleSelection"
    >
      <template v-slot:btnSlot="clo">
        <el-button size="mini" @click="handleEdit(clo)">编辑</el-button>
        <el-button size="mini">删除</el-button>
      </template>
      <template v-slot:switch="clo">
        <el-switch
          v-model="clo.scope.row.switch"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handleChange(clo)"
        >
        </el-switch>
      </template>
    </plkTable>
  </div>
</template>

<script>
import plkTable from '../../components/Table'

export default {
  components: {
    plkTable
  },
  data() {
    return {
      mo: true,
      tableHeader: [
        { label: '部门', prop: 'department' },
        { label: '原料编号', prop: 'materialCode' },
        { label: '原料类型', prop: 'materialType' },
        { label: '状态', prop: 'state' },
        { label: '入库批次', prop: 'ruku' },
        { label: '购买批次', prop: 'buyBatch' },
        { label: '首次入库重量', prop: 'firstInputWeight', minWidth: '130px' },
        { label: '入库重量', prop: 'inputWeight' },
        { label: '入库日期', prop: 'inputDate' },
        { label: '过期日期', prop: 'expireDate' },
        { label: '产品日期', prop: 'productDate' },
        { label: '剩余有效天数', prop: 'remainingValidTime', minWidth: '130px' },
        { label: '包装类型', prop: 'typeOfPackaging' },
        { label: '包装重量', prop: 'packageWeight' },
        { label: '制造商', prop: 'supplierName' },
        { label: '供应商', prop: 'gongying' },
        { label: '价格', prop: 'price' },
        { label: '电话', prop: 'phone' },
        { label: '邮箱', prop: 'email' },
        { label: '创建时间', prop: 'createDate' },
        { label: '创建人', prop: 'createUserName' },
        { label: '更新时间', prop: 'updateTime' },
        { label: '更新人', prop: 'updateUserName' },
        { label: '备注', prop: 'remark' },
        { label: '是否启用', prop: 'switch', type: 'slot' },
        { label: '操作', type: 'btn', minWidth: '150px', fixed: 'right', align: 'center' }
      ],
      tableData: [
        {
          id: 1,
          department: '研发部1111',
          materialCode: 'YLBH01',
          materialType: '原料',
          state: '正常',
          ruku: 'ruku001',
          buyBatch: '购买批次001',
          firstInputWeight: '111 kg',
          inputWeight: '199 kg',
          inputDate: '2020-03-03',
          expireDate: '2020-06-06',
          productDate: '2020-03-04',
          remainingValidTime: '3天',
          typeOfPackaging: '袋子',
          packageWeight: '100 kg/袋',
          supplierName: '制造商',
          gongying: '供应商',
          price: '100',
          phone: '13800138000',
          email: '1254641@qq.com',
          createDate: '2020-03-03',
          createUserName: 'test',
          updateTime: '2020-03-03',
          updateUserName: 'test',
          remark: '备注',
          switch: true,
          children: [{
            id: 2,
            department: '研发部222',
            materialCode: 'YLBH01',
            materialType: '原料',
            state: '正常',
            ruku: 'ruku001',
            buyBatch: '购买批次001',
            firstInputWeight: '111 kg',
            inputWeight: '199 kg',
            inputDate: '2020-03-03',
            expireDate: '2020-06-06',
            productDate: '2020-03-04',
            remainingValidTime: '3天',
            typeOfPackaging: '袋子',
            packageWeight: '100 kg/袋',
            supplierName: '制造商',
            gongying: '供应商',
            price: '100',
            phone: '13800138000',
            email: '1254641@qq.com',
            createDate: '2020-03-03',
            createUserName: 'test',
            updateTime: '2020-03-03',
            updateUserName: 'test',
            remark: '备注',
            switch: false
          }, {
            id: 4,
            department: '研发部444',
            materialCode: 'YLBH01',
            materialType: '原料',
            state: '正常',
            ruku: 'ruku001',
            buyBatch: '购买批次001',
            firstInputWeight: '111 kg',
            inputWeight: '199 kg',
            inputDate: '2020-03-03',
            expireDate: '2020-06-06',
            productDate: '2020-03-04',
            remainingValidTime: '3天',
            typeOfPackaging: '袋子',
            packageWeight: '100 kg/袋',
            supplierName: '制造商',
            gongying: '供应商',
            price: '100',
            phone: '13800138000',
            email: '1254641@qq.com',
            createDate: '2020-03-03',
            createUserName: 'test',
            updateTime: '2020-03-03',
            updateUserName: 'test',
            remark: '备注',
            switch: false
          }]
        },
        {
          id: 3,
          department: '研发部',
          materialCode: 'YLBH01',
          materialType: '原料',
          state: '正常',
          ruku: 'ruku001',
          buyBatch: '购买批次001',
          firstInputWeight: '111 kg',
          inputWeight: '199 kg',
          inputDate: '2020-03-03',
          expireDate: '2020-06-06',
          productDate: '2020-03-04',
          remainingValidTime: '3天',
          typeOfPackaging: '袋子',
          packageWeight: '100 kg/袋',
          supplierName: '制造商',
          gongying: '供应商',
          price: '100',
          phone: '13800138000',
          email: '1254641@qq.com',
          createDate: '2020-03-03',
          createUserName: 'test',
          updateTime: '2020-03-03',
          updateUserName: 'test',
          remark: '备注',
          switch: true
        }
      ]
    }
  },
  methods: {
    handleEdit(clo) {
      console.log(clo)
    },
    handleChange(item) {
      console.log(item.scope.row)
      // item.scope.row.switch = false
    },
    handleSelection(val) {
      console.log('勾选的数据', val)
    }
  }
}
</script>

<style lang="scss">

</style>
