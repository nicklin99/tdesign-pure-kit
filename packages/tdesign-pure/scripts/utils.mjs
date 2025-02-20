import t from '@babel/types'

/**
 * vue props类型
 * @param {import("@babel/types").Node} node 
 * @returns 
 */
export function extractPropType(node) {
  /**
   * rules: {
      type: Array as PropType<FormRule[]>, // node
      default: () => [],
    },
    返回 Array
   */
  if (t.isTSAsExpression(node)) {
    return node.expression.name
  }
  if (t.isTSNumberKeyword(node)) {
    return "Number"
  }
  if (t.isTSStringKeyword(node)) {
    return "String"
  }
  // rules: Array
  if (t.isIdentifier(node)) return node.name
  return "unkonwn"
}