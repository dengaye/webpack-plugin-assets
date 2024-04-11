class AssetsPlugin {
  constructor(options) {
    this.options = options;
    this.htmlPages = options.htmlPages || [];
  }

  apply(compiler) {
    compiler.hooks.done.tap('AssetsPlugin', (stats) => {
      const compilation = stats.compilation;
      const pageAssets = {};

      // 遍历每个HTML页面
      this.htmlPages.forEach((page) => {
        const assets = {};

        // 获取页面使用的资源文件的路径，并过滤需要排除的文件
        for (const filename of Object.keys(compilation.assets)) {
          if (!page.excludeFiles.some(fileType => filename.endsWith(fileType))) {
            assets[filename] = compilation.assets[filename].source();
          }
        }

        // 合并页面的资源信息，确保不重复
        Object.assign(pageAssets, { [page.filename]: assets });
      });

      // 将每个页面的资源信息写入JSON文件
      fs.writeFile(this.options.outputPath, JSON.stringify(pageAssets), (err) => {
        if (err) {
          console.error(err);
        }
      });
    });
  }
}
