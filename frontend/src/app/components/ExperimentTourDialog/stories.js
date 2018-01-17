import React from "react";
import { storiesOf } from "@storybook/react";

import ExperimentTourDialog from "./index";

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

storiesOf("components/ExperimentTourDialog", module)
  .add("base state", () =>
    <ExperimentTourDialog
      {...{
        experiment,
        isExperimentEnabled: () => true,
        onCancel: () => {},
        onComplete: () => {},
        sendToGA: () => {}
      }}
    />
  );
