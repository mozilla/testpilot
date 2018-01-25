module.exports = class AfterBuildPlugin {
  constructor (cb) {
    this.cb = cb;
  }

  apply (compiler) {
    compiler.plugin('done', () => {
      this.cb();
    });
  }
};
