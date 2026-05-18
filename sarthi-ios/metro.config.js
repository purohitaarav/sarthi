const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Completely isolate the project from parent directory
config.watchFolders = [];

// Override resolver to prevent any parent directory access
config.resolver = {
  ...config.resolver,
  nodeModules: [path.resolve(__dirname, 'node_modules')],
  // Block any attempts to resolve from parent directories
  resolveRequest: (context, moduleName, platform) => {
    // Prevent resolving any modules that would go to parent directory
    if (moduleName.includes('dotenv') || moduleName.includes('../node_modules')) {
      throw new Error(`Module ${moduleName} is not allowed in this project`);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

// Block any file watching outside the project
config.server = {
  ...config.server,
  watch: false,
};

module.exports = config;
