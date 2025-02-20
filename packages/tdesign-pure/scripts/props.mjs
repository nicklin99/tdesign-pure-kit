import t from '@babel/types'
import generator from '@babel/generator'
import { rets } from './tsc.mjs';
import { extractPropType } from './utils.mjs';

/**
 * props对象节点 提取 props
 * @param {import('@babel/types').Node} node 
 * @param {*} props 
 */
export function parsePropsObject(node, props) {
  node.properties.forEach((prop) => {
    const propName = prop.key.name;
    const propInfo = {
      name: propName,
      type: "any",
      required: false,
      default: undefined,
      description: parseComment(prop.leadingComments),
    };

    if (t.isObjectExpression(prop.value)) {
      prop.value.properties.forEach((attr) => {
        const key = attr.key.name;
        switch (key) {
          case "type":
            propInfo.type = extractPropType(attr.value);
            break;
          case "required":
            propInfo.required = attr.value.value;
            break;
          case "default":
            propInfo.default = extractDefaultValue(attr.value);
            break;
        }
      });
    } else {
      propInfo.type = prop.value.name;
    }

    props.push(propInfo);
  });
}

export function parseComment(comments) {
  if (!comments || comments.length === 0) return ''
  return comments
    .map(c => c.value
      .split('\n')
      .map(line => line.replace(/^\s*\*?\s?/, '').trim())
      .join(' ')
    )
    .join(' ')
    .trim()
}

export function matchCommentDefault(node) {
  let ret = ""
  node.leadingComments.forEach(c => {
    const match = c.value.match(/@default\s*(.*)/)
    if (match) {
        // 移除默认值注释
        c.value = c.value.replace(match[0], '')
        ret = match[1]
    }
  })
  return ret
}

export function extractDefaultValue(node) {
  if (node.leadingComments) {
    const v = matchCommentDefault(node)
    if (v) {
      return v
    }
  }
  if (t.isArrowFunctionExpression(node)) {
    return rets.get(node)
  }
  if (t.isLiteral(node)) return node.value

  return node.value || '' // undefined 不显示
}


// 提取函数返回值的核心逻辑
function getFunctionReturnString(node) {
  if (!t.isFunctionExpression(node)) return null

  // 查找 return 语句
  let returnStatement = null
  traverse(node.body, {
    ReturnStatement(path) {
      returnStatement = path.node
      path.stop() // 找到第一个 return 后停止
    }
  }, node.body)

  if (!returnStatement || !returnStatement.argument) return null

  // 生成返回值的代码字符串
  const { code } = generator(returnStatement.argument, {
    retainLines: false,
    concise: true,
    minified: true
  })

  // 清理尾部分号
  return code.replace(/;\s*$/, '')
}

export function getArrowFunctionReturn(node) {
  if (t.isBlockStatement(node.body)) {
    // 处理带有 {} 的箭头函数
    return getFunctionReturnString({ body: node.body })
  }
  // 直接返回表达式
  return generator.default(node.body).code
}

// 解析typescript类型属性 提取 props
export function parsePropsType(typeNode, props, typeDefinitions) {
  // 处理交叉类型
  if (t.isTSIntersectionType(typeNode)) {
    typeNode.types.forEach(node => {
      parsePropsType(node, props, typeDefinitions)
    })
    return
  }

  // 处理类型引用
  if (t.isTSTypeReference(typeNode)) {
    const typeDef = typeDefinitions.get(typeNode.typeName.name)
    if (typeDef) {
      return parsePropsType(typeDef.typeAnnotation, props, typeDefinitions)
    }
  }

  if (t.isTSTypeLiteral(typeNode)) {
    parseTypeLiteral(typeNode, props)
  }

  // 处理接口类型
  // if (t.isTSInterfaceType(typeNode)) {
  //   typeNode.body.body.forEach(member => {
  //     if (t.isTSPropertySignature(member)) {
  //       const propInfo = {
  //         name: member.key.name,
  //         type: extractTSType(member.typeAnnotation.typeAnnotation),
  //         required: !member.optional,
  //         description: parseComment(member.leadingComments)
  //       }
  //       props.push(propInfo)
  //     }
  //   })
  // }
}


// 从 TypeScript 类型字面量 提取 props
export function parseTypeLiteral(node, props) {
  node.members.forEach(member => {
    const propName = member.key.name
    const propInfo = {
      name: propName,
      type: extractPropType(member.typeAnnotation.typeAnnotation),
      required: !member.optional,
      default: extractDefaultValue(member),
      description: parseComment(member.leadingComments)
    }
    props.push(propInfo)
  })
}