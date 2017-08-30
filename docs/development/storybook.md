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

## Stories

[The Storybook site has good documentation on writing stories][storydocs],
so we won't reproduce them here.

Stories for Test Pilot are located at [`frontend/stories`][storydir]. The
directory structure mostly mirrors what's found under `frontend/src`. For
example, here's the path to the news updates feed and its associated
collection of stories:

* [`frontend/src/app/components/UpdateList.js`](../frontend/src/app/components/UpdateList.js)
* [`frontend/stories/app/components/UpdateList-story.jsx`](../frontend/src/app/components/UpdateList.js)

When making changes to a component, you should ensure that:
1. a module of stories for that component exists; and 
1. that the module contains stories capturing the full range of your component's behavior. 

Storybook is a pretty new technology for us at the time of this writing, so
it's likely that new work will need to backfill both of the above.

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
