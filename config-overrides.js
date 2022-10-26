module.exports = function override(config, env) {
  let loaders = config.resolve;
  loaders.fallback = {
    crypto: false,
  };

  return config;
};
