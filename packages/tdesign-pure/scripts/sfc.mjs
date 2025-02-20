import { parse as parseVue } from "@vue/compiler-sfc"
import { parse } from '@babel/parser'
import { default as traverser} from "@babel/traverse"
import t from '@babel/types'
import fs from "node:fs"

import path from "node:path";
import { generateMarkdown } from "./md.mjs"
import { parsePropsObject, parseTypeLiteral } from "./props.mjs"

const { default: traverse} = traverser

// 提取 props 信息
function extractPropsFromDescriptor(descriptor) {
  let propsInfo = []
  
  // 处理普通 script
  if (descriptor.script) {
    const scriptContent = descriptor.script.content
    propsInfo = [...propsInfo, ...parseScript(scriptContent)]
  }

  // 处理 setup script
  if (descriptor.scriptSetup) {
    const scriptSetupContent = descriptor.scriptSetup.content
    propsInfo = [...propsInfo, ...parseScript(scriptSetupContent, true)]
  }

  return propsInfo
}

// 解析 script 内容
function parseScript(content, isSetup = false) {
  const ast = parse(content, {
    sourceType: 'module',
    plugins: [
      'typescript',
      'jsx'
    ]
  })

  const props = []

  traverse(ast, {
    ObjectProperty(path) {
      if (!isSetup && 
          path.parentPath.isObjectExpression() &&
          path.parentPath.parentPath.isExportDefaultDeclaration()) {
        if (path.node.key.name === 'props') {
          parsePropsObject(path.node.value, props)
        }
      }
    },

    CallExpression(path) {
      if (isSetup &&
          path.node.callee.name === 'defineProps') {
        const arg = path.node.arguments[0]
        if (t.isObjectExpression(arg)) {
          parsePropsObject(arg, props)
        } else if (t.isTSTypeLiteral(arg)) {
          parseTypeLiteral(arg, props)
        }
      }
    }
  })

  return props
}


// 类型提取辅助函数


function extractTSType(typeAnnotation) {
  if (t.isTSTypeReference(typeAnnotation)) 
    return typeAnnotation.typeName.name
  if (t.isTSUnionType(typeAnnotation))
    return typeAnnotation.types.map(t => extractTSType(t)).join(' | ')
  return 'any'
}

// 主函数
export function vuePropsToMarkdown(source) {
  const { descriptor } = parseVue(source)
  const props = extractPropsFromDescriptor(descriptor)
  return generateMarkdown(props)
}



// 配置
const SRC_DIR = "./src/**/*.{vue,tsx}"; // 组件路径
const OUTPUT_DIR = "./docs"; // 输出目录
// 递归创建目录
export const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
const processComponent = async (filePath) => {
  try {
    const source = fs.readFileSync(filePath, 'utf-8')
    const mdContent = vuePropsToMarkdown(source)
    // 保持目录结构
    const relativePath = path.relative(path.join(process.cwd(), "src"), filePath);
    const outputPath = path.join(
      OUTPUT_DIR,
      relativePath.replace(path.extname(filePath), ".md")
    );
    ensureDir(path.dirname(outputPath));
    fs.writeFileSync(outputPath, mdContent.trim());
    console.log(`✅ 生成文档: ${outputPath}`);
  } catch (e) {
    console.error(`❌ 解析失败: ${filePath}`, e);
  }
};

