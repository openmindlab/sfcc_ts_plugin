import * as ts_module from "typescript/lib/tsserverlibrary";

function init({ typescript: ts } : {typescript: typeof ts_module}) {
  function create(info: ts.server.PluginCreateInfo): ts.LanguageService {
    const log = (text: string, level: string = "info") => info.project.projectService.logger[level](`[sfcc_ts_plugin]: ${text}`);
    log("starting plugin");

    const origResolveModuleNames = info.languageServiceHost.resolveModuleNames;
    info.languageServiceHost.resolveModuleNames = (
      moduleNames,
      containingFile,
      reusedNames,
      redirectedReference
    ) => {
      moduleNames = moduleNames.map(moduleName => {
        if (moduleName.startsWith('*/')) {
          const newName = `_star_/${moduleName.substring(2)}`;
          log(`transform "${moduleName}" to "${newName}"`);
          return newName;
        }
        return moduleName;
      });

      // We use the remapped module names to call the original method
      return origResolveModuleNames.call(
        info.languageServiceHost,
        moduleNames,
        containingFile,
        reusedNames,
        redirectedReference
      );
    };

    // We aren't actually proxying the language service, so we just return the
    // original
    return info.languageService;
  }

  return { create };
}

export = init;
