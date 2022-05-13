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
    {
      type: "category",
      label: "Overview",
      link: {
        type: "doc",
        id: "intro",
      },
      collapsed: false,
      items: ["overview/key-concepts"],
    },
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
      label: "Data Modeling",
      link: {
        type: "generated-index",
      },
      collapsed: false,
      items: [
        {
          type: "category",
          label: "Schema",
          link: {
            type: "doc",
            id: "datamodels/schema",
          },
          collapsed: false,
          items: ["datamodels/using-go", "datamodels/using-java"],
        },
        "datamodels/json-spec",
        "datamodels/examples",
      ],
    },
    {
      type: "category",
      label: "Client Libraries",
      link: {
        type: "generated-index",
      },
      collapsed: false,
      items: [
        "client-libraries/go",
        {
          type: "category",
          label: "Client Library: Java",
          link: {
            type: "doc",
            id: "client-libraries/java/overview",
          },
          items: [
            "client-libraries/java/sync-client",
            "client-libraries/java/async-client",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Command Line Interface",
      link: {
        type: "doc",
        id: "cli/overview",
      },
      collapsed: false,
      items: [
        "cli/working-locally",
        {
          type: "category",
          label: "Reference",
          items: [
            "cli/reference/alter-collection",
            "cli/reference/completion",
            "cli/reference/create-collection",
            "cli/reference/create-database",
            "cli/reference/delete",
            "cli/reference/describe-collection",
            "cli/reference/describe-database",
            "cli/reference/drop-collection",
            "cli/reference/drop-database",
            "cli/reference/generate-sample-schema",
            "cli/reference/insert",
            "cli/reference/list-collections",
            "cli/reference/list-databases",
            "cli/reference/local-down",
            "cli/reference/local-logs",
            "cli/reference/local-up",
            "cli/reference/ping",
            "cli/reference/read",
            "cli/reference/replace",
            "cli/reference/transact",
            "cli/reference/update",
            "cli/reference/version",
          ],
        },
      ],
    },
  ],
};

module.exports = sidebars;
