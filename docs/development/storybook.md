[👈 Back to README](../../README.md)

# Storybook

[Storybook][] is an "interactive development & testing environment for React".
It provides an environment where we can demonstrate & iterate on user
interface elements in isolation from the rest of the site.

We can rig up UI components with pre-configured state & data to
capture particular scenarios - i.e. *stories* - without having to manually
interact with the site until we get to the right conditions.

Some examples of what Storybook enables:

* Demonstrate the appearance of a button to enable an experiment, without having
  to go through all the steps to enable an experiment (e.g. add-on
  installation, button clicks, etc)

* Preview the state of an experiment page after graduation, without having to
  wait for an experiment to graduate

* Show how the news updates feed looks with no updates, many updates, and even
  month-old updates 
  
All of these are conditions that are difficult or tedious to reproduce, so
Storybook offers us a way to preview how components work without having to do
the manual steps.

## Local development

If you've got a local development environment working [per the quickstart
instructions][quickstart], you should also be able to start a local Storybook
server like so:
```
npm run storybook
```

This should fire up a server that you can view at `http://localhost:6006/`.
Storybook also depends on the local dev server running, too, so you should
have this running in another terminal window:
```
npm start
```

With these two commands running, you should be able to see your Storybook
content updated live as you make edits to JS & CSS associated with components.

## Shared deployments

As part of the automated testing we run via CircleCI, we can also build and
deploy snapshots of Storybook that can be shared and viewed by many people on
the team to preview component work in progress.

The main prerequisite is that this work needs to happen on branches in the 
[`mozilla/testpilot`][repo] repository on Github. Branches in personal fork
repositories cannot participate in automated Storybook deployment. This runs
counter to our usual process, and limits participation to core team members
with commit access to the main repository.

Pull Requests submitted based on branches in [this repo][repo] will receive
comments pointing to the URLs where Storybook deployments are located. For
example:

* http://testpilot-storybook.dev.mozaws.net/pull/2811/index.html
* http://testpilot-storybook.dev.mozaws.net/aa927564f0e522b436bb8848627e35734f5d8563/

Commits to branches not submitted as Pull Requests will also have Storybook
deployments, but the URLs must be manually constructed (pending 
[Issue #2819](https://github.com/mozilla/testpilot/issues/2819) like so:

* http://testpilot-storybook.dev.mozaws.net/{git-commit-id}/

Where `{git-commit-id}` is the hash of the latest commit to the branch.

[Storybook]: https://github.com/storybooks/storybook
[storydocs]: https://storybook.js.org/basics/writing-stories/
[storydir]: ../../frontend/stories/
[quickstart]: quickstart.md
[repo]: https://github.com/mozilla/testpilot/

## Definitions

- **Component** - an independent, reusable piece of UI. May contain additional components.
- **Story** - A variation of a component’s state, such as a hover, loading, or error state.
- **Container** - a component that is [`connect`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)ed to the Redux store.
- **Dependent components** - components that are only used in the context of a parent component. For example, a `ListItem` component may only be used by a `List` component. 

## Changes to code

In order to idiomatically accommodate a shift to use Storybook, substantial pieces of the Test Pilot site will be refactored. The following changes will be made:

- Components will be refactored to be more self-containing (see Appendix 1).
	- Dependent components will be defined in the same file as the parent component.
		- The parent component should be the default export for the module, but dependent components should also be exported.
	- CSS will be tightly coupled with components.
		- Each component will have its own CSS file that is imported into the component source.
		- Each component’s styles will be namespaced with a single CSS class, which will be used as a prefix for any children classes.
		- Any reuse of styles will be implemented as SCSS mix-ins, rather than with utility CSS classes.
	- Stories will be tightly coupled with components.
		- Each component will have its own `stories.js` file in the component directory.
		- That file will contain each story for the component itself, as well as any dependent components.
	- Connected versions of container components will be their default export.
		- Unconnected versions will also be exported, for use in stories.
- There will be a single top-level `<App>` component that serves as the entry point to the application. It will contain any static components (such as the header and footer), and exactly one store-connected component for the current view.
	- All connected components will live in `src/containers`.
	- Each container will have its own `mapStateToProps` and `mapDispatchToProps` that provide the bare minimum state and actions required for the view to function, eliminate any potentially-expensive changes to the DOM from irrelevant changes to the store.
	- All other components will live in `src/components`.

## Changes to process

This change will necessitate changes to both the deployment process and in how UX and engineering interact.

### Deployment and release

In addition to [other, unrelated changes](https://public.etherpad-mozilla.org/p/testpilot-new-branch-process) to our build and deployment processes, Storybook will be deployed for most commits to the `mozilla/testpilot` repository.

It will work like this:

1. For each commit on any branch of `mozilla/testpilot`, CircleCI will build the site.
2. If the tests pass, CI will deploy a static copy of the Storybook for that commit to a special S3 bucket.
3. If there is an associated pull request for the commit, a bot will comment on the pull requests with links to both the Storybook for the commit and for the latest commit for the pull request.

A dashboard will be built with links to the Storybook for each pull request and commit. Deployed Storybooks will be pruned every 3 months.

### UX and engineering

With the UX and engineering teams on opposite sides of the globe, a process to work on UX changes or new features is designed to minimize back-and-forth between teams. It works like this:

1. UX proposes new designs and delivers them will full-page mocks highlighting any implied changes.
	- This includes any variations at smaller breakpoints (especially for containers).
	- This includes a set of suggested states: hovers, errors, loading, etc. These do not need to be visually specified at this stage, just indicated as desired.
2. Engineering reviews the mocks, and delivers back to UX:
	- A list of all existing components and stories that are changed by the mocks.
	- A list of any new components implied by the mockups.
	- A list of all the stories to be defined for each new component, including the ones suggested
3. UX provides redline-level specifications for each component and story that is either new or affected by the proposed change, in isolation.
	- This will allow UX to create and maintain an accurate component of source files for each component.
	- Each component and story should be clearly named.
4. Engineering builds the proposed components and stories and opens a pull request with them.
	- The names of each component (i.e. `storiesOf(‘a component name’)` and story (`.add(‘story name’)` should match the ones provided in the UX source material for easy cross-referencing.
	- The UX contact should be marked as a reviewer for the pull request.
5. UX reviews the storybook for the pull requests, requesting any appropriate changes before signing off on and merging the new feature.

## Appendix 1: Example component structure.

```
src
└ containers
| └ homepage
| | └ index.js
| | └ index.scss
| | └ stories.js
| | └ tests.js
└ components
| └ install-button
| | └ index.js
| | └ index.scss
| | └ stories.js
| | └ tests.js
└ util.scss
```

### `components/install-button/index.js`

``` javascript
import './index.scss';

export default class InstallButton extends Component {
  renderIcon() {
    const { icon } = this.props;
    if (icon) {
      return (
        <span className={`install-button--icon install-button--icon--${icon}`} />
      );
    }
    return null;
  }

  render() {
    const { text } = this.props;
    return (
      <button className="install-button">{this.renderIcon()}{text}</button>
    );
  }
}
```

### `components/install-button/index.scss`

``` css
@import '../../util.scss'; 

.install-button {
  @include button();

  background: #000;
  color: #FFF;

  .install-button--icon {
    display: inline-block;
    margin-right: 4px;
  }
}
```

### `containers/homepage/index.js`

``` javascript
export class Homepage extends Component {
  render() {
    return <p>Hi!</p>
  }
}

export default connect(Homepage)(mapStateToProps, mapDispatchToProps);
```


