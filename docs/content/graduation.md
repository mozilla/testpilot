[👈 Back to README](../../README.md)

# Graduation

To graduate an experiment, an `eol_warning` should be added and deployed at least a few weeks before the experiment is due to graduate. Set the `completed` field to the date on which the experiment will graduate.

Once the graduation date has passed, the following fields should be removed from the experiment yaml file, so that localizers don't do work translating strings which will never be shown again:

- eol_warning
- measurements
- pre_feedback_image
- pre_feedback_copy
- tour_steps
