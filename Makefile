tdesign_repo = "https://raw.githubusercontent.com/Tencent/tdesign-vue-next/refs/heads/develop/packages/components/"

# 构建组件库
build_lib:
	cd packages/tdesign-plus && pnpm run build && pnpm run dts

# 发布 tdesign-plus 到 npm 公共仓库
# 该目标会：
# 1. 进入子包目录 packages/tdesign-plus
# 2. 使用 pnpm 执行发布命令（需提前登录 npm 账号）
# 3. --access public 确保发布为公共包（避免组织作用域包的私有限制）
publish_npm:
	cd packages/tdesign-plus && pnpm publish --access public

# 开发文档
dev_docs:
	cd packages/docs && pnpm run docs:dev

# 下载联合属性md文件
td_md:
	curl -s -L ${tdesign_repo}/table/table.md | sed 's/:: BASE_DOC :://g' > packages/md/table.md 
	

.PHONY: build_lib publish_npm dev_docs td_md