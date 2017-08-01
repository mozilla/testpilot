module.exports = class ThrowErrorPlugin {
  apply(compiler) {
    compiler.plugin('done', stats => {
      if (
        process.env.NODE_ENV !== 'development' &&
        stats.compilation.errors &&
        stats.compilation.errors.length
      ) {
        // eslint-disable-next-line no-console
        console.error(stats.compilation.errors);
        process.exit(1);
      }
    });
  }
};
