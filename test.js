const assert = require("assert");

const plugin = require("./index");

console.log("Testing sfccrequirestar_ts_plugin...");

const { create } = plugin();

const languageService = {};
const loggerInfoStack = [];
const moduleNamesStack = [];
const info = {
  languageService: languageService,
  languageServiceHost: {
    resolveModuleNames(moduleNames) {
      moduleNamesStack.push(moduleNames);
      return [];
    }
  },
  project: {
    projectService: {
      logger: {
        info(text) {
          loggerInfoStack.push(text);
        }
      }
    }
  }
};

const proxy = create(info);

assert.strictEqual(proxy, languageService);
assert.deepEqual(loggerInfoStack, ["sfccrequirestar_ts_plugin: setup"]);

info.languageServiceHost.resolveModuleNames(["*/foo", "~/bar"]);

assert.deepEqual(moduleNamesStack, [["_star_/foo", "~/bar"]]);
assert.deepEqual(loggerInfoStack, [
  "sfccrequirestar_ts_plugin: setup",
  'sfccrequirestar_ts_plugin: transform "*/foo" to "_star_/foo"'
]);

console.log("Tests passed.");
