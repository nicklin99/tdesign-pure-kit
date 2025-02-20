import { parse } from "@babel/parser";
import t from '@babel/types'
import { default as traverser } from "@babel/traverse";
import { generateMarkdown } from "./md.mjs";
import { getArrowFunctionReturn, parseComment, parsePropsObject, parsePropsType } from "./props.mjs";
const { default: traverse } = traverser;
export const rets = new Map()
export const typeDefinitions = new Map();
export function tsxPropsToMarkdown(source) {
  // 处理 TSX 文件
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["typescript", "jsx", "classProperties"],
  });
  const props = [];

  // 第一阶段：收集类型定义
  traverse(ast, {
    TSInterfaceDeclaration(path) {
      typeDefinitions.set(path.node.id.name, path.node);
    },
    TSTypeAliasDeclaration(path) {
      // Table.tsx 有 ListTableProps
      typeDefinitions.set(path.node.id.name, path.node);
    },
  });
  traverse(ast, {
    ArrowFunctionExpression(path) {
        const returnCode = getArrowFunctionReturn(path.node)
        rets.set(path.node, returnCode)
    }
  })
  // 第二阶段：解析组件
  traverse(ast, {
    // 处理 defineComponent 选项式写法
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee, { name: "defineComponent" })) {
        const options = path.get("arguments.0");
        if (options.isObjectExpression()) {
          parseOptionsAPI(options, props);
        }
      }
    },
    // 处理组合式 API 的 defineProps
    VariableDeclarator(path) {
      if (
        t.isCallExpression(path.node.init) &&
        t.isIdentifier(path.node.init.callee, { name: "defineProps" })
      ) {
        parseDefineProps(path.get("init"), props, typeDefinitions);
      }
    },
    ExportNamedDeclaration(path) {
      if (t.isFunctionDeclaration(path.node.declaration)) {
        // 函数组件导出 props
        parsePropsType(
          path.node.declaration.params[0].typeAnnotation.typeAnnotation, 
          props,
          typeDefinitions
        )
      }
    }
  });
  return generateMarkdown(props);
}


// 解析选项式 API
function parseOptionsAPI(optionsPath, props) {
    optionsPath.traverse({
      ObjectProperty(path) {
        if (t.isIdentifier(path.node.key, { name: 'props' })) {
          parsePropsObject(path.node.value, props)
        }
      }
    })
  }
  
  // 解析 defineProps
  function parseDefineProps(definePropsPath, props, typeDefinitions) {
    const typeArg = definePropsPath.get('arguments.0')
  
    if (typeArg.isTSTypeLiteral()) {
      parseTypeLiteral(typeArg.node, props)
    } else if (typeArg.isTSTypeReference()) {
      const typeName = typeArg.node.typeName.name
      const typeDef = typeDefinitions.get(typeName)
      if (typeDef) parseTypeDefinition(typeDef, props)
    } else if (typeArg.isObjectExpression()) {
      parsePropsObject(typeArg, props)
    }
  }
  
  // 解析类型定义
  function parseTypeDefinition(typeDef, props) {
    if (t.isTSInterfaceDeclaration(typeDef)) {
      typeDef.body.body.forEach(member => {
        if (t.isTSPropertySignature(member)) {
          handleTSProperty(member, props)
        }
      })
    }
  }
  
  // 处理 TS 属性签名
  function handleTSProperty(member, props) {
    const propName = member.key.name
    const propInfo = {
      name: propName,
      type: "any",
      tsType: extractTSType(member.typeAnnotation.typeAnnotation),
      required: !member.optional,
      default: 'undefined',
      description: parseComment(member.leadingComments)
    }
    props.push(propInfo)
  }
  
  // 类型提取辅助函数（增强版）
  function extractTSType(typeNode) {
    switch (typeNode.type) {
      case 'TSTypeReference':
        return typeNode.typeName.name
      case 'TSUnionType':
        return typeNode.types.map(t => extractTSType(t)).join(' | ')
      case 'TSLiteralType':
        return typeNode.literal.value
      case 'TSArrayType':
        return `${extractTSType(typeNode.elementType)}[]`
      case 'TSFunctionType':
        return 'Function'
      default:
        return typeNode.type.replace('TS', '')
    }
}

