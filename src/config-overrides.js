// config-overrides.js
const { addWebpackResolve } = require('customize-cra');

module.exports = {
  webpack: function (config, env) {
    // Agregar resolución para 'crypto' y 'fs'
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
      fs: false  // Si no se necesita 'fs' directamente, se puede configurar como false
    };

    return config;
  },
};
