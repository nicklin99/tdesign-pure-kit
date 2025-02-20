
// 生成 Markdown 表格
export function generateMarkdown(props) {
  let md = '### 属性 \n'
  md += '| 名称 | 类型 | 必填 | 默认值 | 描述 |\n'
  md += '|------|------|----------|---------|-------------|\n'
  
  props.forEach(prop => {
    md += `| ${prop.name} ` +
          `| ${prop.type} ` +
          `| ${prop.required ? 'Yes' : 'No'} ` +
          `| ${prop.default || ''} ` +
          `| ${prop.description || ''} |\n`
  })
  
  return md
}