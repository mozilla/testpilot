
const cssForExperiment = experiment => {
  const gradient = experiment.gradient_center ?
    `linear-gradient(135deg,
      ${experiment.gradient_start},
      ${experiment.gradient_center},
      ${experiment.gradient_stop})`:
    `linear-gradient(135deg,
      ${ experiment.gradient_start },
      ${ experiment.gradient_stop })`;
  return (
    `.experiment-icon-wrapper-${experiment.slug} {
      background-color: ${experiment.gradient_start};
      background-image: ${gradient};
    }

    .experiment-icon-${experiment.slug} {
      background-image: url(${experiment.thumbnail});
    }`
  )
};

module.exports = ({ inputs: { experiments } }) => ({
  "static/styles/experiments.css": experiments
    .map(({ parsed: experiment }) => cssForExperiment(experiment))
    .join("\n")
});
