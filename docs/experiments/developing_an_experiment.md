[👈 Back to README](../../README.md)

# Test Pilot Recommended Development Process for Experiments

The following process has proven to be the most streamlined in the Test Pilot
world.  You're not required to follow it, but if you do things will probably
move more smoothly and it'll be easier to get help for your experiment because
it's a familiar process.

## Sprints
We're fans of sprinting.  The standard two weeks is a good balance of feature
development and shipping.

## Communication
Yay meetings. :)

- Pick Slack or IRC.  Having a channel on each just makes it harder to decide
  where to talk.  Now that contributors can be invited to Slack, most
  experiments choose that.
- Schedule stand-ups at least twice a week.  Most experiments can fit a new-bug
  triage into the stand-up if they do it consistently so the bugs don't build
  up.
- Schedule a sprint planning meeting.
- Schedule a product and analysis meeting.  This meeting is focused on
  reviewing the analytics and talking about actions we should take based on
  them.
- Test Pilot's [public calendar](https://wiki.mozilla.org/Test_Pilot#Come_to_our_meetings.21)
  would be a great place to track these meetings to make sure everyone knows
  about them.
- Every Test Pilot experiment has a [forum on discourse](https://discourse.mozilla.org/c/test-pilot).
  Be sure to visit regularly and engage with your users.


## Development
Using GitHub is the easiest way to get going and includes several useful tools
for free.  Test Pilot already has teams organized on GitHub so adding them to
your experiment is easy if you use the `Mozilla` organization.

Test Pilot currently uses CircleCI for automated testing on request of our
operations team.  If you already something else set up, let's talk.  If you
weren't planning on writing automated tests, we should talk too. :)  (please
write tests)

### Code

Follow the [requirements for hosting an add-on on Test Pilot](../development/hosting.md).

Test Pilot is all about measuring and analyzing data.  Make sure you're
[using Google Analytics to it's full potential](https://github.com/mozilla/testpilot/blob/master/docs/experiments/ga.md).

If you're writing JavaScript, use [Mozilla's ESLint rules](https://www.npmjs.com/package/eslint-plugin-mozilla).

You should be writing Web Extensions, if possible.  You may need to write a
[Web Extension Experiment](https://webextensions-experiments.readthedocs.io/en/latest/)
with some custom APIs.  Under very few circumstances should you write any other
type of add-on and please bring up your plans early.


### Triage and Milestones
It's handy to start a new experiment with a couple of milestones:
  * `Stretch 🙆`: For issues that you aren't going to get to soon but that you'd
    like to do.
  * `Sprint 0`: The first sprint.  New sprints simply increment.  You probably
    want to make a few at a time to help scheduling future milestones.

New issues get filed on GitHub as usual.  During the triage meeting search for
issues with no milestone (`no:milestone`).  Review each issue and put it in a
future sprint, `Stretch`, or another milestone that works for your experiment.
The key is to keep all issues in a milestone and then it's easy to find and
review any new issues.

If you're waiting on more information for an issue, leave it without a
milestone and it will pop up in your next triage.


### Labels
This is a good set of generic labels.  Use the ones that are useful but don't
feel you need to use them all.  Don't be afraid to add more if your experiment
calls for it.  For example, a `Firefox` label if you depend on bugs in Firefox,
or `Sentry` if you use Sentry.

Take the time to color coordinate your labels when you make them and they'll be
easier to see at a glance later.  For example, make all the `skill:` labels
light blue, or all the `needs:` labels different shades of green.

Bug Types:
* `unconfirmed`
* `defect`
* `enhancement`

Categories:
* `code quality`
* `perf`
* `security`

Contributors:
* `good first issue` These will show up on [the Test Pilot contribution site](https://contribute.testpilot.firefox.com/)
* `good first issue (taken)` Since you can't assign an issue to someone who
  isn't in the organization

Skill labels should accompany any `good first issue` label:
* `skill:css`
* `skill:html`
* `skill:js`
* `skill:react`
* `skill:swift`
* `skill:webextension`

Blocked on something:
* `needs:break down` This issue is too large to implement and needs to
  be either made into a checklist or split into smaller issues
* `needs:discussion` There is an open question blocking this issue from moving
  forward
* `needs:legal`
* `needs:product`
* `needs:qa`
* `needs:ux`

Priority lables are based on [bugzilla's triage process](https://wiki.mozilla.org/Bugmasters/Process/Triage#Weekly_or_More_Frequently_.28depending_on_the_component.29):
* `p1`
* `p2`
* `p3`
* `p5`
