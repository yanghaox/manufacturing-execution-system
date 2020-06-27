const context = require.context('./', true, /\.js$/)
const requireAll = function(requireContext) {
  const modules = []
  requireContext.keys().forEach(key => {
    if (key !== './index.js') {
      const mod = requireContext(key)
      modules.push(mod.__esModule && mod.default ? mod.default : mod)
    }
  })
  return modules
}
export default requireAll(context)
