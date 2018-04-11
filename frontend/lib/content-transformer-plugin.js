const fs = require("fs");
const path = require("path");
const util = require("util");
const globby = require("globby");
const mkdirp = util.promisify(require("mkdirp"));
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class ContentTransformerPlugin {
  constructor(options = {}) {
    // Assemble options with defaults.
    this.options = {
      inputs: {},
      parser: () => {},
      transforms: [],
      ...options
    };

    // Resolve configured input globs into file tracking records
    this.inputs = {};
    Object.entries(this.options.inputs).forEach(([key, patterns]) => {
      this.inputs[key] = globby.sync(patterns).map(filename => ({
        filename,
        content: null,
        parsed: null,
        lastModified: null,
        modified: true
      }));
    });
  }

  apply(compiler) {
    compiler.plugin("emit", (compilation, callback) => {
      (async () => {
        const inputs = await this.updateInputs(compiler, compilation);
        const result = await this.runTransforms(compiler, compilation);
        return result;
      })().then(() => callback(), err => callback(err));
    });
  }

  // Quick and dirty method to run the transformer outside of Webpack
  applyOnce(outputBase) {
    const compiler = {
      context: "."
    };
    const compilation = {
      fileDependencies: [],
      fileTimestamps: {},
      assets: {}
    };
    const writeAsset = async ([filepath, asset]) => {
      const fullpath = path.join(outputBase, filepath);
      const result = await mkdirp(path.dirname(fullpath));
      return writeFile(fullpath, asset.source());
    };
    return (async () => {
      const inputs = await this.updateInputs(compiler, compilation);
      const result = await this.runTransforms(compiler, compilation);
      return Promise.all(
        Object.entries(compilation.assets).map(writeAsset)
      ).then(() => compilation.assets);
    })();
  }

  updateInputs(compiler, compilation) {
    const updateFile = async (file, key) => {
      // Update full file path from current compiler.
      file.path = path.join(compiler.context, file.filename);

      // Add the file to the dependency watch list
      compilation.fileDependencies.push(file.path);

      // Work out whether this file has been modified.
      const currentModified = compilation.fileTimestamps[file.path];
      file.modified = !file.lastModified || file.lastModified < currentModified;
      file.lastModified = currentModified;

      if (file.modified) {
        // If modified, load & parse the file.
        file.content = await readFile(file.filename);
        file.parsed = await this.options.parser({
          key,
          file,
          compiler,
          compilation
        });
      }
    };

    // Return a promise with a flat set of all pending file updates.
    return Promise.all(
      Object.entries(this.inputs).reduce(
        (pending, [key, files]) =>
          pending.concat(files.map(file => updateFile(file, key))),
        []
      )
    );
  }

  runTransforms(compiler, compilation) {
    const runTransform = async transform => {
      // Transform can be async, so await.
      const pending = await transform({
        inputs: this.inputs,
        compiler,
        compilation
      });

      // Each object property from transform can be async, so await those too.
      const result = await Promise.all(
        Object.entries(pending).map(async ([key, value]) => [key, await value])
      );

      // Finally, add the generated assets to the compilation.
      result.forEach(([name, contentIn]) => {
        const content =
          typeof contentIn === "string"
            ? contentIn
            : JSON.stringify(contentIn, null, " ");
        compilation.assets[name] = {
          source: () => content,
          size: () => content.length
        };
      });
    };

    // Return a promise to run all the transforms.
    return Promise.all(this.options.transforms.map(runTransform));
  }
}

module.exports = ContentTransformerPlugin;
