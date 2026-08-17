const path = require('path');

module.exports = {
  projectRoot: path.resolve(__dirname),

  watchFolders: [
    path.resolve(__dirname, '../../node_modules'), // root node_modules
    path.resolve(__dirname, '../components'), // components directory
    path.resolve(__dirname, '../blocks'), // blocks directory
    path.resolve(__dirname, '../framework'), // framework directory
  ],

  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'], // allow all extensions
    extraNodeModules: {
      // fallback to root node_modules if not found locally
      'react-native-gesture-handler': path.resolve(
        __dirname,
        '../../node_modules/react-native-gesture-handler'
      ),
      react: path.resolve(__dirname, '../../node_modules/react'),
      'react-native': path.resolve(__dirname, '../../node_modules/react-native'),
    },
    alias: {
      '@components': path.resolve(__dirname, '../components/src'),
      '@blocks': path.resolve(__dirname, '../blocks'),
      '@framework': path.resolve(__dirname, '../framework/src'),
    },
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
