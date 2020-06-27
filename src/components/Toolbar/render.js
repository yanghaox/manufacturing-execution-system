export default {
  functional: true,
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  render(h, context) {
    let ret
    if (context.props.item.type === 'dropdown') {
      ret = h('el-dropdown', { attrs: { trigger: 'click' }}, [
        h('span', { class: 'el-dropdown-link' }, [
          context.props.item.text,
          h('i', { class: ['el-icon-arrow-down', 'el-icon--right'] })
        ]),
        h('el-dropdown-menu', { slot: 'dropdown' }, context.props.item.dropdownList.map(inner => {
          const { id: key, disabled, divided, click, text } = inner
          return h('el-dropdown-item', { attrs: { key, disabled: disabled || false, divided: divided || false }, nativeOn: { click: click || (() => {}) }}, [text])
        }))
      ])
    } else if (context.props.item.type === 'button') {
      const { id: key, disabled, click, text } = context.props.item
      ret = h('el-button', { attrs: { key, type: 'text', disabled: disabled || false }, class: { 'el-button-link': !disabled }, on: { click: click || (() => {}) }}, [text])
    }
    return ret
  }
}
