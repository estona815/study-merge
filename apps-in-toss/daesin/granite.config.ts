import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "daesin",
  brand: {
    displayName: "대신",
    primaryColor: "#FF72AE",
    icon: "https://static.toss.im/appsintoss/49499/96d40f0c-7e89-4296-b8e1-9bfef86eddc6.png",
  },
  web: {
    host: "localhost",
    port: 4182,
    commands: {
      dev: "node scripts/dev.mjs",
      build: "node scripts/build.mjs",
    },
  },
  webViewProps: {
    type: "partner",
    pullToRefreshEnabled: false,
    overScrollMode: "never",
  },
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
  },
  permissions: [],
  outdir: "dist",
});
