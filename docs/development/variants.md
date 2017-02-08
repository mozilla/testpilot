[👈 Back to README](../../README.md)

# Variants

Test Pilot has the ability to run variant tests on both the Test Pilot
site and for individual experiments. Information about testing experiments
is [here](../experiments/variants.md).

To add a variant test to Test Pilot itself, edit the
[frontend/src/app/reducers/varianttests.js](../../frontend/src/app/reducers/varianttests.js) file. Add another object to the
`tests` array, setting the name of your test and providing a getValue
function which will be used each time a new user loads the Test Pilot
website to select a variant for that test. Here is an example test object
function, showing choosing the default value if the browser's language
is not English and choosing a random value otherwise:

    {
      name: 'installButtonBorder',
      getValue: function getValue() {
        if (!window.navigator.language.startsWith('en')) {
          return false;  // User gets whatever the DefaultCase is.
        }
        return random({
          bigBorder: 1,
          default: 1
        });
      }
    }

To provide variant ui for your test, import the `VariantTests`,
`VariantTestCase`, and `VariantTestDefault` react components from the
`components/VariantTests` module. Then define your variants as so:

    <VariantTests name="installButtonBorder">
      <VariantTestCase value="bigBorder">
        <button style="border: 3px solid white">Click me!</button>
      </VariantTestCase>
      <VariantTestDefault>
        <button>Click me!</button>
      </VariantTestDefault>
    </VariantTests>

When a user visits the Test Pilot site, they are assigned a random
variant id, `testpilot-varianttests-id`, which is stored in localStorage.
This id will be loaded on future visits to the site and used to seed
the random number generator that selects a variant, so the user will
always be placed in the same cohort for a test.

To get a new id and try to get placed into another cohort for testing,
you can bring up the console and use `localStorage.clear()` to clear
the id, then reload the page.
