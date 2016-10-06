## How to build a new experiment

1. Copy the `template.yaml` file below into `./content-src/experiments`
2. Rename your file to match the eventual slug of your experiment eg `tab-center.yaml`
3. You'll need a place to put image assets for your experiment. Make a new directory './frontend/src/images/experiments' to match the name of your yaml file
4. In the directory you've created, `mkdir details social avatars tour icon`. You'll put various image assets into these folders.
5. As you add images, you'll need to manually compress them. You can use an [app](https://imageoptim.com/mac) or a [command line tool](https://www.npmjs.com/package/image-min).

### What goes in the image directories

* `icon` 192px x 192px png icon, all white & transparent - experiment icon
* `avatars` 64px x 64px jpg images - creator avatars
* `details` 1280px x 720-1080px jpg images - appear on the experiment details page
* `tour` 1280px x 720px jpg images - the experiment tour
* `social` 1200px × 630px jpg image for Facebook & 560px × 300px image for Twitter

### Building your YAML file

Inline comments in the [template](./template.yaml). Look at existing experiment files if you need more info.

