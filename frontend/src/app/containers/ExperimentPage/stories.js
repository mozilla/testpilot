import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import LayoutWrapper from "../../components/LayoutWrapper";

import { experimentL10nId } from "../../lib/utils";

import IncompatibleAddons from "./IncompatibleAddons";
import TestpilotPromo from "./TestpilotPromo";
import DetailsOverview from "./DetailsOverview";
import DetailsDescription, { EolBlock } from "./DetailsDescription";
import DetailsHeader from "./DetailsHeader";

const layoutDecorator = story =>
  <div className="blue" style={{ padding: 10 }} onClick={action("click")}>
    <div className="stars" />
    <LayoutWrapper>
      {story()}
    </LayoutWrapper>
  </div>;

const detailsLayoutDecorator = story =>
  <div className="blue" style={{ padding: 10 }} onClick={action("click")}>
    <div className="stars" />
    <LayoutWrapper>
      <div className="default-background" style={{ padding: "40px" }}>
        <div id="details">
          <LayoutWrapper
            helperClass="details-content"
            flexModifier="details-content"
          >
            {story()}
          </LayoutWrapper>
        </div>
      </div>
    </LayoutWrapper>
  </div>;

const experiment = {
  slug: "voice-fill",
  title: "Sample experiment",
  description: "This is an example experiment",
  subtitle: "",
  survey_url: "https://example.com",
  created: "2010-06-21T12:12:12Z",
  modified: "2010-06-21T12:12:12Z",
  incompatible: {
    "foo@bar.com": "Foo from BarCorp"
  },
  completed: null,
  thumbnail:
    "/static/images/experiments/voice-fill/experiments_experiment/thumbnail.png",
  changelog_url:
    "https://github.com/meandavejustice/min-vid/blob/master/CHANGELOG.md",
  contribute_url: "https://github.com/meandavejustice/min-vid",
  bug_report_url: "https://github.com/meandavejustice/min-vid/issues",
  discourse_url: "https://discourse.mozilla-community.org/c/test-pilot/min-vid",
  privacy_notice_url:
    "https://github.com/meandavejustice/min-vid/blob/master/docs/metrics.md",
  details: [
    {
      image:
        "/static/images/experiments/min-vid/experiments_experimentdetail/detail1.jpg",
      copy: "Access Min Vid from YouTube and Vimeo video players.\n"
    },
    {
      image:
        "/static/images/experiments/min-vid/experiments_experimentdetail/detail2.jpg",
      copy:
        "Watch video in the foreground while you do other things on the Web.\n"
    },
    {
      image:
        "/static/images/experiments/min-vid/experiments_experimentdetail/detail3.jpg",
      copy:
        "Right click on links to video to find Min Vid in the in-context controls.\n"
    }
  ],
  tour_steps: [
    {
      image:
        "/static/images/experiments/min-vid/experiments_experimenttourstep/tour1.jpg",
      copy: "The first step (is the hardest)"
    },
    {
      image:
        "/static/images/experiments/min-vid/experiments_experimenttourstep/tour2.jpg",
      copy: "The second step"
    },
    {
      image:
        "/static/images/experiments/min-vid/experiments_experimenttourstep/tour3.jpg",
      copy: "The third step"
    },
    {
      image: "/static/images/experiments/shared/tour-final.jpg",
      copy: "The final step"
    }
  ],
  contributors: [
    {
      display_name: "Dave Justice",
      title: "Engineer",
      avatar: "/static/images/experiments/min-vid/avatars/dave-justice.jpg"
    },
    {
      display_name: "Jared Hirsch",
      title: "Staff Engineer",
      avatar: "/static/images/experiments/min-vid/avatars/jared-hirsch.jpg"
    },
    {
      display_name: "Jen Kagan",
      title: "Engineering Intern",
      avatar: "/static/images/experiments/min-vid/avatars/jen-kagan.jpg"
    }
  ],
  measurements: [
    "When you use Send, Mozilla receives an encrypted copy of the file you upload, and basic information about the file, such as filename, file hash and file size. Mozilla does not have the ability to access the content of your encrypted file, and only keeps it for the time or number of downloads indicated.\n",
    "To allow you to see the status of your previously uploaded files, or delete them, basic information about your uploaded files are stored on your local device, such as Send’s identifier for the file, the filename, and the file’s unique download link. This is cleared if you delete your uploaded file or upon visiting Send after the file expires.\n",
    "Anyone you provide with the unique link (including the encryption key) to your encrypted file will be able to download and access that file. You should not provide the link to anyone you do not want to have access to your encrypted file.\n",
    "Send is also subject to our <a>websites privacy notice</a>. When you visit the Send website, information such as your IP address is temporarily retained as part of a standard server log.\n",
    "Send will also collect information about the performance and your use of the service, such as how often you upload files, how long your files remain with Mozilla before they expire, any errors related to file transfers, and what cryptographic protocols your browser supports.\n"
  ]
};

const installedAddons = ["foo@bar.com"];

const incompatibleAddonBaseProps = {
  experiment,
  installedAddons
};

storiesOf("ExperimentPage/IncompatibleAddons", module)
  .addDecorator(layoutDecorator)
  .add("base state", () =>
    <IncompatibleAddons {...incompatibleAddonBaseProps} />
  )
  .add("none installed", () =>
    <IncompatibleAddons
      {...{ ...incompatibleAddonBaseProps, installedAddons: [] }}
    />
  );

const testpilotPromoBaseProps = {
  experiment,
  isFirefox: false,
  isMinFirefox: false,
  graduated: false,
  hasAddon: false,
  varianttests: {},
  installExperiment: action("installExperiment")
};

storiesOf("ExperimentPage/TestpilotPromo", module)
  .addDecorator(layoutDecorator)
  .add("base state", () => <TestpilotPromo {...testpilotPromoBaseProps} />)
  .add("is firefox", () =>
    <TestpilotPromo {...{ ...testpilotPromoBaseProps, isFirefox: true }} />
  )
  .add("is min firefox", () =>
    <TestpilotPromo
      {...{ ...testpilotPromoBaseProps, isFirefox: true, isMinFirefox: true }}
    />
  )
  .add("has add-on", () =>
    <TestpilotPromo {...{ ...testpilotPromoBaseProps, hasAddon: true }} />
  );

storiesOf("ExperimentPage/EolBlock", module)
  .addDecorator(layoutDecorator)
  .add("base state", () =>
    <EolBlock
      l10nId={pieces => experimentL10nId(experiment, pieces)}
      experiment={{
        ...experiment,
        completed: "2027-10-24T12:12:12Z",
        eol_warning:
          "This experiment is ending, but it will live on in our metrics."
      }}
    />
  );

const detailsHeaderBaseProps = {
  hasAddon: true,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0",
  experiment,
  installed: {},
  enabled: false,
  progressButtonWidth: 248,
  isDisabling: false,
  isEnabling: false,
  surveyURL: "https://example.com/survey",
  installExperiment: action("installExperiment"),
  uninstallExperimentWithSurvey: action("uninstallExperimentWithSurvey"),
  getElementOffsetHeight: () => 100,
  getElementY: () => 100,
  setScrollY: () => 0,
  getScrollY: () => 0,
  l10nId: parts => parts,
  addScrollListener: () => {},
  removeScrollListener: () => {},
  flashMeasurementPanel: () => {},
  sendToGA: action("sendToGA"),
  doShowEolDialog: action("doShowEolDialog")
};

storiesOf("ExperimentPage/DetailsHeader", module)
  .addDecorator(story =>
    <div className="blue" onClick={action("click")}>
      <div className="stars" />
      <div id="page-container" className="dynamic-page" style={{ padding: 40 }}>
        <section id="experiment-page">
          <section className="view full-page-wrapper">
            <div className="default-background">
              {story()}
            </div>
          </section>
        </section>
      </div>
    </div>
  )
  .add("without addon", () =>
    <DetailsHeader {...{ ...detailsHeaderBaseProps, hasAddon: false }} />
  )
  .add("with addon", () => <DetailsHeader {...detailsHeaderBaseProps} />)
  .add("web experiment", () =>
    <DetailsHeader
      {...{
        ...detailsHeaderBaseProps,
        experiment: { ...experiment, platforms: ["web"] }
      }}
    />
  )
  .add("above max version", () =>
    <DetailsHeader
      {...{
        ...detailsHeaderBaseProps,
        experiment: { ...experiment, max_release: 56 }
      }}
    />
  )
  .add("below min version", () =>
    <DetailsHeader
      {...{
        ...detailsHeaderBaseProps,
        experiment: { ...experiment, min_release: 58 }
      }}
    />
  )
  .add("enabling", () =>
    <DetailsHeader {...{ ...detailsHeaderBaseProps, isEnabling: true }} />
  )
  .add("enabled", () =>
    <DetailsHeader {...{ ...detailsHeaderBaseProps, enabled: true }} />
  )
  .add("error", () =>
    <DetailsHeader
      {...{
        ...detailsHeaderBaseProps,
        experiment: { ...experiment, error: "argle bargle" }
      }}
    />
  )
  .add("disabling", () =>
    <DetailsHeader
      {...{ ...detailsHeaderBaseProps, enabled: true, isDisabling: true }}
    />
  )
  .add("subtitle", () =>
    <DetailsHeader
      {...{
        ...detailsHeaderBaseProps,
        experiment: { ...experiment, subtitle: "Sample subtitle hooray" }
      }}
    />
  );

storiesOf("ExperimentPage/DetailsOverview", module)
  .addDecorator(detailsLayoutDecorator)
  .add("base state", () =>
    <DetailsOverview
      {...{
        experiment,
        graduated: false,
        highlightMeasurementPanel: false,
        showTour: action("showTour")
      }}
    />
  )
  .add("graduated", () =>
    <DetailsOverview
      {...{
        experiment: {
          ...experiment,
          completed: "2017-09-09T12:00:00Z"
        },
        graduated: true,
        highlightMeasurementPanel: false,
        showTour: action("showTour")
      }}
    />
  );

storiesOf("ExperimentPage/DetailsDescription", module)
  .addDecorator(detailsLayoutDecorator)
  .add("base state", () =>
    <DetailsDescription
      {...{
        experiment,
        graduated: false,
        locale: "en-US",
        hasAddon: false,
        highlightMeasurementPanel: false,
        l10nId: id => id
      }}
    />
  )
  .add("locale warning", () =>
    <DetailsDescription
      {...{
        experiment: { ...experiment, locales: ["ar"] },
        graduated: false,
        locale: "en-US",
        hasAddon: true,
        highlightMeasurementPanel: false,
        l10nId: id => id
      }}
    />
  )
  .add("graduate soon", () =>
    <DetailsDescription
      {...{
        experiment: {
          ...experiment,
          eol_warning:
            "This experiment is ending, but it will live on in our hearts.",
          graduation_url: "https://mozilla.org/",
          completed: "2017-09-09T12:00:00Z"
        },
        graduated: false,
        locale: "en-US",
        hasAddon: false,
        highlightMeasurementPanel: false,
        l10nId: id => id
      }}
    />
  )
  .add("graduated", () =>
    <DetailsDescription
      {...{
        experiment: {
          ...experiment,
          graduation_url: "https://mozilla.org/",
          completed: "2017-09-09T12:00:00Z"
        },
        graduated: true,
        locale: "en-US",
        hasAddon: false,
        highlightMeasurementPanel: false,
        l10nId: id => id
      }}
    />
  );
