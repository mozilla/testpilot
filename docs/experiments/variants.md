# Variant testing

Test Pilot provides experiments with a framework for deterministically placing users into groups for variant testing.


## Definitions

- `test` - a piece of functionality for which experiments want to test two or more `variants`.
- `variant` - one of an enumeration of options of a `test`. These consist of a `value` and a `weight`.
- `value` - the value returned to an experiment when a `variant` is chosen. This could be a boolean, an integer representing a constant, or a string.
- `weight` - how common, relative to other options, that a `variant` should be chosen for a user. For example, if three variants in a test have values of `1`, `1`, and `2`, then 25%, 25%, and 50% of users will be placed in each, respectively.


## Workflow

### Registering tests with Test Pilot

On startup, an experiment pings the Test Pilot add-on with a representation of the tests it wishes to perform. This should be done using [`nsIObserverService`](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIObserverService), using the `testpilot::register-variants` topic.

**Note:** the exact mechanism by which this happens will vary based on the experiment type. A full working example of a bootstrapped add-on is available in the [`addon-restartless`](https://github.com/mozilla/testpilot/tree/master/docs/examples/addon-restartless) directory of the Test Pilot repository.

Since Firefox does not load add-ons in a predictable order, Test Pilot is not guaranteed to be loaded at the time this message is sent, so it may need to be sent multiple times before a response is received.

The payload should look like this:

```javascript
JSON.stringify({
  someTest: {
    name: "Some Test",
    description: "An example A/B test.",
    variants: [
      {
        value: "a",
        weight: 1,
        description: "Option A."
      },
      {
        value: "b",
        weight: 1,
        description: "Option B."
      }
    ]
  },
  someOtherTest: {}
})
```

The payload consists of an object literal containing one or more items. Keys of that object represent the name of the test, and values are object literals with definitions for that test. Each of those definitions should contain three things:

- `name`: a human-readable name of the test. In the future, this may be surfaced to users.
- `description`: a human-readable description of the test. This may also be surfaced to users.
- `variants`: an array of variants for each test, each containing:
  - `value`: the value to be returned to the experiment if the user is placed in this variant.
  - `weight`: the frequency with which users should be placed in this variant.
  - `description`: a human-readable description of this variant. This may be surfaced to users.

**Note:** `nsIObserverService` payloads must be strings, so it must be passed through `JSON.stringify` before sending.



### Receiving variants from Test Pilot

Using a unique identifier and the test name as seeds, Test Pilot will deterministically place the user into one of the variants for this test. It does so by passing a message with the topic `testpilot::receive-variants` through `nsIObserverService`. The payload of this message will look like this:

```javascript
{
  someTest: "b",
  someOtherTest: true
}
```

Indicating that the user was placed into the variant with the `value` of `"b"` in `someTest`, and the variant with the `value` of `true` in `someOtherTest`. An experiment may use that data like this:

```javascript
function getViewClass(variants) {
  return variants.someTest == 'a' ? SomeViewClass : AnotherViewClass
}
```

**Note:** this will also be a string, so it must be dehydrated with `JSON.parse` for use.


### Segmentation

For easy segmentation, the Test Pilot add-on will store the tests and variants registered by the experiment and include them in any telemetry pings made by `nsIObserverService` messages with the `testpilot::send-metric` topic.
