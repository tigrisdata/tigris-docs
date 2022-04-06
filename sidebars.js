/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  //tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],
  docs: [
    "intro",
    {
      type: "category",
      label: "Quickstart",
      link: {
        type: "generated-index",
      },
      collapsed: false,
      items: [
        "quickstart/with-cli",
        "quickstart/with-go",
        "quickstart/with-java",
      ],
    },
    {
      type: "category",
      label: "Data Models",
      link: {
        type: "generated-index",
      },
      items: [
        "datamodels/overview",
        "datamodels/schema",
        "datamodels/types",
        "datamodels/examples",
      ],
    },
  ],
};

module.exports = sidebars;
