const cssForExperiment = experiment => `
.experiment-icon-wrapper-${experiment.slug} {
  background-color: ${experiment.gradient_start};
  background-image: linear-gradient(135deg, ${experiment.gradient_start}, ${experiment.gradient_stop});
}

.experiment-icon-${experiment.slug} {
  background-image: url(${experiment.thumbnail});
}
`;

module.exports = ({ inputs: { experiments } }) => ({
  "static/styles/experiments.css": experiments
    .map(({ parsed: experiment }) => cssForExperiment(experiment))
    .join("\n")
});
