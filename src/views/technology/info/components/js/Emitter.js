/* 触发子组件事件 */
function broadcast(componentName, eventName, params) {
  this.$children.forEach(child => {
    if (child.$options.name === componentName) {
      child.$emit(eventName, params)
    } else {
      broadcast.apply(child, [componentName, eventName, params])
    }
  })
}

export default {
  methods: {
    dispatch(componentName, eventName, params) {
      let parent = this.$parent

      while (parent.$options.name !== componentName && parent !== this.$root) {
        parent = parent.$parent
      }
      if (parent.$options.name === componentName) {
        parent.$emit(eventName, params)
      }
    },

    broadcast(componentName, eventName, params) {
      broadcast.apply(this, [componentName, eventName, params])
    }
  }
}
