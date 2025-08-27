import { setUserConfig, setGenerateSidebar, addChangelog2doc } from "@ruan-cat/vitepress-preset-config/config";

export default setUserConfig({
  title: "RPG Maker MV 核心库文档",
  description: "RPG Maker MV 核心 JavaScript 库的 API 文档",
  
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "JSDoc API", link: "/jsdoc/" },
      { text: "代码示例", link: "/examples/" }
    ],

    sidebar: setGenerateSidebar({
      documentRootPath: "./docs",
      collapsed: true,
      useTitleFromFileHeading: true,
      useFolderTitleFromIndexFile: true,
      useFolderLinkFromIndexFile: true,
      sortMenusByFrontmatterOrder: true,
      debugPrint: false,
    }),

    socialLinks: [
      { 
        icon: "github", 
        link: "https://github.com/ruan-cat/monorepo" 
      }
    ],

    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "搜索文档",
                buttonAriaLabel: "搜索文档"
              },
              modal: {
                noResultsText: "无法找到相关结果",
                resetButtonTitle: "清除查询条件",
                footer: {
                  selectText: "选择",
                  navigateText: "切换"
                }
              }
            }
          }
        }
      }
    },

    docFooter: {
      prev: "上一页",
      next: "下一页"
    },

    outline: {
      label: "页面导航"
    }
  },

  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: "提示",
      warningLabel: "警告", 
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详情"
    }
  }
});