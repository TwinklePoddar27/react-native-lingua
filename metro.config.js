const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ignore problematic build artifact directories that cause watch errors.
config.resolver.blockList = [
  /node_modules\/.*\.cxx/,
  /node_modules\/.*\.cxx\/.*/,
  /node_modules\/.*\.react-native-worklets.*/,
  /android\/app\/build\/.*/,
];

module.exports = withNativewind(config, { input: "./global.css" });
