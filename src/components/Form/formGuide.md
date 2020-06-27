###使用说明<br/>
1、参数 Object

| 参数名 | 类型 | 说明 | 可选值| 默认值 |
| :------| :------ | :------ | :------ | :------ |
| labelWidth | String | label宽度 | — | auto |
| options | Array | form表单选项 | — | — |
| optionValue | Object | form双向绑定值 | — | — |
| cpFileList | Array | 编辑时文件回显 | — | — |

2、options

| 参数名 | 类型 | 说明 | 可选值| 默认值 |
| :------| :------ | :------ | :------ | :------ |
| label | String | label | — | — |
| type | String | 类型 |  | text |
| rules | Array | 规则,参考elementUi | — | — |
| rolling | Boolean | 是否回调 | true、false | false |
| selectItems | Array | select的options,参考elementUi | — | — |
| append | html/string/number | 在input后面添加内容，如：添加单位提示 | — | — |
| disabled | Boolean | 是否禁用 | true/false | false |
| isText | Boolean | 是否将input显示为文本 | true、false | false |
| headers | Object | 当类型为file时（上传文件）的头 | — | — |
| create | Boolean | select是否允许创建条目 | true、false | false |
| placeholder | String | 输入框的placeholder提示，不输入默认选择label | — | — |
| xs/sm/md/lg/xl | Number | 删格化 | 1--24 | 24 |
| props | Object | type为cascader的属性，详情查看[elementUI](https://element.eleme.cn/#/zh-CN/component/cascader) | — | — |

* type可选值：text、password、number、counter、select、multiple、textarea、date、dateTime、switch、file、cascader
* type为number时如果先输入字母、文字，如果先输入数字，就不能输入字母文字了，所以要给rules验证
* 注意：options参数类型Object，键需要和optionValue的键保持一致，如： 

```javascript
optionValue:{
  location: ''
}
options: {
  location: {}
}
```
