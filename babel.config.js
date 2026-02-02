module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // already handles everything
    // Remove plugins entirely if you are not using decorators or other custom plugins
  };
};