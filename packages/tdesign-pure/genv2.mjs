import fs from "node:fs"

import glob from "fast-glob";
import path from "node:path";
import { ensureDir, vuePropsToMarkdown } from "./scripts/sfc.mjs";
import { tsxPropsToMarkdown } from "./scripts/tsc.mjs";
// 配置
const SRC_DIR = "./src/**/*.{vue,tsx}"; // 组件路径
const OUTPUT_DIR = "../md"; // 输出目录
// 递归创建目录

const processComponent = async (filePath) => {
  try {
    const ext = path.extname(filePath)
    var mdContent
    if (ext === ".vue") {
      const source = fs.readFileSync(filePath, 'utf-8')
      mdContent = vuePropsToMarkdown(source)
    }
    if (ext === ".tsx") {
      const source = fs.readFileSync(filePath, 'utf-8')
      mdContent = tsxPropsToMarkdown(source)
    }
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

const main = async () => {
  const vueFiles = await glob(SRC_DIR, {
    absolute: true,
    ignore: ["**/node_modules/**"],
  });

  for (const file of vueFiles) {
    await processComponent(file);
  }
};

main()