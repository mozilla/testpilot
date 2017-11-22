/* global describe, beforeEach, it */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import moment from 'moment';

import { findLocalizedById, findLocalizedHtmlById } from '../../../../test/app/util';

import { defaultState } from '../../reducers/newsletter-form';

import ExperimentPage, { ExperimentDetail } from './index';
import IncompatibleAddons from './IncompatibleAddons';
import TestpilotPromo from './TestpilotPromo';
import ExperimentPreFeedbackDialog from './ExperimentPreFeedbackDialog';
import ExperimentDisableDialog from './ExperimentDisableDialog';
import ExperimentEolDialog from './ExperimentEolDialog';
import ExperimentTourDialog from './ExperimentTourDialog';

import { PRIVACY_SCROLL_OFFSET } from './DetailsHeader';
import DetailsDescription, { LocaleWarning } from './DetailsDescription';

describe('app/containers/ExperimentPage', () => {
  const mockExperiment = {
    slug: 'testing',
    foo: 'bar'
  };
  const mockProps = {
    slug: mockExperiment.slug,
    getCookie: sinon.spy(),
    removeCookie: sinon.spy(),
    experiments: [mockExperiment],
    getExperimentBySlug: slug => {
      return slug === mockExperiment.slug ? mockExperiment : null;
    }
  };

  it('should pass the correct experiment to children', () => {
    const wrapper = shallow(<ExperimentPage {...mockProps} />);
    const child = wrapper.find(ExperimentDetail);
    expect(child.props().experiment).to.equal(mockExperiment);
  });
});

describe('app/containers/ExperimentPage:ExperimentDetail', () => {
  let mockExperiment, mockClickEvent, props, subject;
  beforeEach(() => {
    mockExperiment = {
      slug: 'testing',
      title: 'Testing',
      subtitle: 'Testing',
      subtitle_l10nsuffix: 'foo',
      thumbnail: '/thumbnail.png',
      introduction: '<p class="test-introduction">Introduction!</p>',
      measurements: [
        'Measurement 0'
      ],
      graduation_url: 'http://example.com/graqduation-report',
      description: 'Description',
      pre_feedback_copy: null,
      contribute_url: 'https://example.com/contribute',
      bug_report_url: 'https://example.com/bugs',
      discourse_url: 'https://example.com/discourse',
      privacy_notice_url: 'https://example.com/privacy',
      changelog_url: 'https://example.com/changelog',
      survey_url: 'https://example.com/survey',
      contributors: [
        {
          display_name: 'Jorge Soler',
          title: 'Right Fielder',
          avatar: '/soler.jpg'
        }
      ],
      details: [
        {
          headline: ' ',
          image: '/img.jpg',
          copy: 'Testing'
        }
      ],
      min_release: 48.0,
      error: false
    };

    mockClickEvent = {
      preventDefault: sinon.spy(),
      stopPropagation: sinon.spy(),
      target: {
        offsetWidth: 100
      }
    };

    props = {
      isDev: false,
      hasAddon: false,
      experiments: [],
      installed: {},
      installedAddons: [],
      params: {},
      uninstallAddon: sinon.spy(),
      navigateTo: sinon.spy(),
      isAfterCompletedDate: sinon.stub().returns(false),
      isExperimentEnabled: sinon.spy(),
      requireRestart: sinon.spy(),
      sendToGA: sinon.spy(),
      openWindow: sinon.spy(),
      enableExperiment: sinon.spy(),
      disableExperiment: sinon.spy(),
      getExperimentBySlug: sinon.spy(),
      addScrollListener: sinon.spy(),
      removeScrollListener: sinon.spy(),
      getScrollY: sinon.spy(),
      setScrollY: sinon.spy(),
      getElementY: sinon.spy(),
      getElementOffsetHeight: sinon.spy(),
      setExperimentLastSeen: sinon.spy(),
      getCookie: sinon.spy(),
      removeCookie: sinon.spy(),
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:51.0) Gecko/20100101 Firefox/51.0',
      newsletterForm: defaultState(),
      getWindowLocation: sinon.spy(() => 'https://example.com'),
      setPageTitleL10N: sinon.spy()
    };

    subject = mount(<ExperimentDetail {...props} />);
  });

  const setExperiment = experiment => {
    subject.setProps({
      experiment,
      experiments: [experiment]
    });
    return experiment;
  };

  it('should have the correct l10n IDs', () => {
    setExperiment(mockExperiment);
    // Title field not localized; see #1732.
    expect(findLocalizedById(subject, 'testingTitle')).to.have.property('length', 0);
    expect(findLocalizedById(subject, 'testingSubtitleFoo')).to.have.property('length', 1);
    expect(findLocalizedHtmlById(subject, 'testingIntroduction')).to.have.property('length', 1);
    expect(findLocalizedById(subject, 'testingContributors0Title')).to.have.property('length', 1);
    expect(findLocalizedById(subject, 'testingDetails0Headline')).to.have.property('length', 1);
    expect(findLocalizedById(subject, 'testingDetails0Copy')).to.have.property('length', 1);

    // Fields only available when the add-on is installed.
    subject.setProps({ hasAddon: true });
    // The measurements section is rendered twice, for responsiveness reasons.
    expect(findLocalizedHtmlById(subject, 'testingMeasurements0')).to.have.property('length', 2);
  });

  it('should omit l10n IDs for dev-only content', () => {
    setExperiment({ dev: true, ...mockExperiment });
    expect(findLocalizedById(subject, 'testingSubtitleFoo')).to.have.property('length', 0);
    expect(findLocalizedHtmlById(subject, 'testingIntroduction')).to.have.property('length', 0);
    expect(findLocalizedById(subject, 'testingContributors0Title')).to.have.property('length', 0);
    expect(findLocalizedById(subject, 'testingDetails0Headline')).to.have.property('length', 0);
    expect(findLocalizedById(subject, 'testingDetails0Copy')).to.have.property('length', 0);
  });

  it('should not render experiment content if no experiment content is loaded', () => {
    expect(subject.find('#experiment-page')).to.have.property('length', 0);
  });

  it('should render a 404 page if experiment is undefined', () => {
    props = { ...props,
      experiment: undefined,
      experiments: [{ ...mockExperiment, slug: 'notit' }]
    };
    subject.setProps(props);
    expect(subject.find('NotFoundPage'))
      .to.have.property('length', 1);
  });

  it('should not render a locale warning for unsupported locales, on graduated experiments', () => {
    const unsupportedLocale = 'de';
    subject.setProps({
      isAfterCompletedDate: sinon.stub().returns(true),
      locale: unsupportedLocale
    });
    setExperiment({
      ...mockExperiment,
      locale_blocklist: unsupportedLocale
    });
    expect(subject.find(DetailsDescription).find(LocaleWarning)).to.have.length(0);
  });

  it('should render a locale warning for unsupported locales, on non-graduated experiments', () => {
    const unsupportedLocale = 'de';
    subject.setProps({
      isAfterCompletedDate: sinon.stub().returns(false),
      locale: unsupportedLocale
    });
    setExperiment({
      ...mockExperiment,
      locale_blocklist: unsupportedLocale
    });
    expect(subject.find(DetailsDescription).find(LocaleWarning)).to.have.length(1);
  });

  describe('with a valid experiment slug', () => {
    beforeEach(() => {
      setExperiment(mockExperiment);
      subject.setProps({
        isExperimentEnabled: () => false
      });
    });

    it('should localize the page title', () => {
      expect(props.setPageTitleL10N.called).to.be.true;
      expect(props.setPageTitleL10N.lastCall.args).to.deep.equal([
        'pageTitleExperiment', mockExperiment
      ]);
    });

    it('should render a 404 page if not on dev and launch date has not yet passed', () => {
      setExperiment({ ...mockExperiment, launch_date: moment().add(1, 'days').utc() });
      subject.setProps({ isDev: false });
      expect(subject.find('NotFoundPage')).to.have.property('length', 1);
    });

    it('should not render a 404 page if launch date has passed', () => {
      setExperiment({ ...mockExperiment, launch_date: moment().subtract(1, 'days').utc() });
      subject.setProps({ isDev: false });
      expect(subject.find('NotFoundPage')).to.have.property('length', 0);
    });

    it('should not render a 404 page if isDev, regardless of launch date', () => {
      setExperiment({ ...mockExperiment, launch_date: moment().add(1, 'days').utc() });
      subject.setProps({ isDev: true });
      expect(subject.find('NotFoundPage')).to.have.property('length', 0);
    });

    it('should set last seen timestamp for experiment when rendered', () => {
      expect(props.setExperimentLastSeen.called).to.be.true;
    });

    it('should clear both enabling & disabling state if experiment.inProgress changes', () => {
      const prevExperiment = { ...mockExperiment, inProgress: true };
      const nextExperiment = { ...mockExperiment, inProgress: false };

      subject.setProps({ experiment: prevExperiment });
      subject.setState({ isEnabling: true, isDisabling: true });
      subject.setProps({ experiment: nextExperiment });

      expect(subject.state('isEnabling')).to.be.false;
      expect(subject.state('isDisabling')).to.be.false;
    });

    it('should include an ExperimentPlatforms component if `platforms` is set', () => {
      expect(subject.find('ExperimentPlatforms')).to.have.property('length', 0);
      subject.setProps({ experiment: { ...mockExperiment, platforms: ['addon', 'web'] } });
      expect(subject.find('ExperimentPlatforms')).to.have.property('length', 1);
    });

    it('should render video iframe if video available', () => {
      expect(subject.find('.experiment-video')).to.have.property('length', 0);
      setExperiment({ ...mockExperiment, video_url: 'https://example.com/video' });
      expect(subject.find('.experiment-video')).to.have.property('length', 1);
    });

    it('should show the tour dialog if shouldShowTourDialog is true and experiment then becomes enabled', () => {
      // Flag the tour dialog to be shown, but experiment isn't enabled yet.
      subject.setState({ shouldShowTourDialog: true });

      // Tour dialog isn't shown yet...
      expect(subject.state('shouldShowTourDialog')).to.be.true;
      expect(subject.state('showTourDialog')).to.be.false;
      expect(subject.find('ExperimentTourDialog')).to.have.property('length', 0);

      // Enable the experiment...
      subject.setProps({ isExperimentEnabled: () => true });

      // Now show the tour dialog...
      expect(subject.state('shouldShowTourDialog')).to.be.false;
      expect(subject.state('showTourDialog')).to.be.true;
      expect(subject.find('ExperimentTourDialog')).to.have.property('length', 1);
    });

    it('should display a call-to-action to try other experiments', () => {
      const experiment = setExperiment(mockExperiment);
      expect(subject.find('.banner__subtitle')).to.have.property('length', 1);
      const cardList = subject.find('ExperimentCardList');
      expect(cardList).to.have.property('length', 1);
      expect(cardList.prop('except')).to.equal(experiment.slug);
    });

    describe('with hasAddon=true', () => {
      beforeEach(() => {
        subject.setProps({ hasAddon: true });
      });

      it('should not display a call-to-action to install Test Pilot', () => {
        expect(subject.find('.experiment-promo')).to.have.property('length', 0);
        expect(subject.find('MainInstallButton')).to.have.property('length', 0);
      });

      it('should show an email dialog if the first-run cookie is set', () => {
        const getCookie = sinon.spy(() => 1);
        const removeCookie = sinon.spy();
        props = { ...props, hasAddon: true, getCookie, removeCookie };
        subject = shallow(<ExperimentDetail {...props} />);
        setExperiment(mockExperiment);

        expect(subject.find('EmailDialog')).to.have.property('length', 1);
        expect(removeCookie.called).to.be.true;

        subject.setState({ showEmailDialog: false });
        expect(subject.find('EmailDialog')).to.have.property('length', 0);
      });

      it('should not show a "Disable" button', () =>
        expect(subject.find('#uninstall-button')).to.have.property('length', 0));
      it('should not show a "Give Feedback" button', () =>
        expect(subject.find('#feedback-button')).to.have.property('length', 0));
      it('should show an "Enable" button', () =>
        expect(subject.find('#install-button')).to.have.property('length', 1));
      it('should show an "Your privacy" button', () =>
        expect(subject.find('.highlight-privacy')).to.have.property('length', 1));

      it('should enable experiment and schedule tour when "Enable" clicked', () => {
        const experiment = setExperiment(mockExperiment);
        subject.find('#install-button').simulate('click', mockClickEvent);

        expect(props.enableExperiment.lastCall.args)
          .to.deep.equal([experiment]);
        expect(subject.state('isEnabling')).to.be.true;
        expect(subject.state('isDisabling')).to.be.false;
        expect(subject.state('shouldShowTourDialog')).to.be.true;
        expect(subject.state('progressButtonWidth'))
          .to.equal(mockClickEvent.target.offsetWidth);
        expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
          eventCategory: 'ExperimentDetailsPage Interactions',
          eventAction: 'Enable Experiment',
          eventLabel: experiment.title
        }]);
      });

      it('should show the tour dialog when the "tour" link is clicked', () => {
        subject.setState({ showTourDialog: false });
        subject.find('a.showTour').simulate('click', mockClickEvent);
        expect(subject.state('showTourDialog')).to.be.true;
        expect(subject.find('ExperimentTourDialog')).to.have.property('length', 1);
      });

      it('should display a warning only if userAgent does not meet minimum version', () => {
        const experiment = setExperiment({ ...mockExperiment, min_release: 50 });

        const userAgentPre = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:51.0) Gecko/20100101 Firefox/';

        subject.setProps({ userAgent: `${userAgentPre}23.0` });
        expect(subject.find('.upgrade-notice')).to.have.property('length', 1);
        expect(subject.find('.experiment-controls')).to.have.property('length', 0);

        findLocalizedById(subject, 'upgradeNoticeLink').find('a').simulate('click', mockClickEvent);
        expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
          eventCategory: 'ExperimentDetailsPage Interactions',
          eventAction: 'Upgrade Notice',
          eventLabel: experiment.title
        }]);

        subject.setProps({ userAgent: `${userAgentPre}50.0` });
        expect(subject.find('.upgrade-notice')).to.have.property('length', 0);
        expect(subject.find('.experiment-controls')).to.have.property('length', 1);

        subject.setProps({ userAgent: `${userAgentPre}51.0` });
        expect(subject.find('.upgrade-notice')).to.have.property('length', 0);
        expect(subject.find('.experiment-controls')).to.have.property('length', 1);
      });

      it('should display a warning only if userAgent does not meet maximum version limit', () => {
        const experiment = setExperiment({ ...mockExperiment, max_release: 52 });

        const userAgentPre = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:51.0) Gecko/20100101 Firefox/';

        subject.setProps({ userAgent: `${userAgentPre}49.0` });
        expect(subject.find('.upgrade-notice')).to.have.property('length', 0);
        expect(subject.find('.experiment-controls')).to.have.property('length', 1);

        subject.setProps({ userAgent: `${userAgentPre}50.0` });
        expect(subject.find('.upgrade-notice')).to.have.property('length', 0);
        expect(subject.find('.experiment-controls')).to.have.property('length', 1);

        subject.setProps({ userAgent: `${userAgentPre}53.0` });
        expect(subject.find('.upgrade-notice')).to.have.property('length', 1);
        expect(subject.find('.experiment-controls')).to.have.property('length', 0);

        findLocalizedById(subject, 'versionChangeNoticeLink').find('a').simulate('click', mockClickEvent);

        expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
          eventCategory: 'ExperimentDetailsPage Interactions',
          eventAction: 'Upgrade Notice',
          eventLabel: experiment.title
        }]);
      });

      it('should display a banner if the experiment has an error status', () => {
        setExperiment({ ...mockExperiment, error: true });
        expect(subject.find('.details-header-wrapper').hasClass('has-status')).to.be.true;
        expect(subject.find('.status-bar').hasClass('error')).to.be.true;
        expect(findLocalizedById(subject, 'installErrorMessage')).to.have.property('length', 1);
      });

      it('should scroll down to measurements block when "Your privacy" clicked', (done) => {
        const elementY = 400;
        const genericElementHeight = 125;

        subject.setProps({
          getElementY: () => elementY,
          getElementOffsetHeight: () => genericElementHeight
        });

        subject.find('.highlight-privacy').simulate('click', mockClickEvent);
        expect(props.setScrollY.lastCall.args[0]).to.equal(
          elementY + (genericElementHeight - PRIVACY_SCROLL_OFFSET));
        expect(subject.state('highlightMeasurementPanel')).to.be.true;

        // TODO: 5 second delay is too much. Skip until/unless we mock setTimeout.
        done();
        /*
        setTimeout(() => {
          expect(subject.state('highlightMeasurementPanel')).to.be.false;
          done();
        }, 5010);
        */
      });

      describe('with experiment enabled', () => {
        beforeEach(() => {
          subject.setProps({ isExperimentEnabled: () => true });
        });

        it('should show a "Disable" button', () =>
          expect(subject.find('#uninstall-button')).to.have.property('length', 1));
        it('should show a "Give Feedback" button', () =>
          expect(subject.find('#feedback-button')).to.have.property('length', 1));
        it('should not show an "Enable" button', () =>
          expect(subject.find('#install-button')).to.have.property('length', 0));
        it('should not show an "Your privacy" button', () =>
          expect(subject.find('.highlight-privacy')).to.have.property('length', 0));

        it('should disable experiment and show a dialog when "Disable" clicked', () => {
          const experiment = setExperiment(mockExperiment);
          subject.find('#uninstall-button').simulate('click', mockClickEvent);

          expect(props.disableExperiment.lastCall.args)
            .to.deep.equal([experiment]);
          expect(subject.state('showDisableDialog')).to.be.true;
          expect(subject.find('ExperimentDisableDialog')).to.have.property('length', 1);
          expect(subject.state('isEnabling')).to.be.false;
          expect(subject.state('isDisabling')).to.be.true;
          expect(subject.state('progressButtonWidth'))
            .to.equal(mockClickEvent.target.offsetWidth);
          expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
            eventCategory: 'ExperimentDetailsPage Interactions',
            eventAction: 'Disable Experiment',
            eventLabel: experiment.title
          }]);
        });

        it('should have the expected survey URL on the "Give Feedback" button', () => {
          subject.setProps({ installed: { foo: true, bar: true }, clientUUID: '38c51b84-9586-499f-ac52-94626e2b29cf' });
          const button = subject.find('#feedback-button');
          const expectedHref = 'https://example.com/survey?ref=givefeedback&experiment=Testing&cid=38c51b84-9586-499f-ac52-94626e2b29cf&installed=foo&installed=bar';
          expect(button.prop('href')).to.equal(expectedHref);
        });

        it('should send a GA event when "Give Feedback" clicked', () => {
          const experiment = setExperiment(mockExperiment);
          const button = subject.find('#feedback-button');
          const expectedHref = button.prop('href');
          mockClickEvent.target.getAttribute = () => expectedHref;
          button.simulate('click', mockClickEvent);

          expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
            eventCategory: 'ExperimentDetailsPage Interactions',
            eventAction: 'Give Feedback',
            eventLabel: experiment.title
          }]);
        });

        it('should show a pre-feedback dialog when message available & "Give Feedback" clicked', () => {
          setExperiment({ ...mockExperiment,
            pre_feedback_copy: '<p class="preFeedback">Hello</p>' });

          const button = subject.find('#feedback-button');
          const expectedHref = button.prop('href');
          mockClickEvent.target.getAttribute = () => expectedHref;
          button.simulate('click', mockClickEvent);

          expect(subject.state('showPreFeedbackDialog')).to.be.true;
          const dialog = subject.find('ExperimentPreFeedbackDialog');
          expect(dialog).to.have.property('length', 1);
          expect(dialog.prop('surveyURL')).to.equal(expectedHref);
        });

        it('should display a banner when the experiment is enabled', () => {
          expect(subject.find('.details-header-wrapper').hasClass('has-status')).to.be.true;
          expect(subject.find('.status-bar').hasClass('enabled')).to.be.true;
          expect(findLocalizedById(subject, 'isEnabledStatusMessage')).to.have.property('length', 1);
        });
      });

      describe('with a completed experiment', () => {
        beforeEach(() => {
          subject.setProps({
            experiment: Object.assign({}, mockExperiment, { completed: '2016-10-01' }),
            isAfterCompletedDate: sinon.stub().returns(true)
          });
        });

        it('does not render controls', () => {
          expect(subject.find('.experiment-controls').length).to.equal(0);
        });

        it('displays the end date instead of install count', () => {
          expect(findLocalizedHtmlById(subject, 'completedDateLabel').length).to.equal(1);
          expect(findLocalizedById(subject, 'userCountContainer').length).to.equal(0);
          expect(findLocalizedById(subject, 'userCountContainerAlt').length).to.equal(0);
        });

        describe('with experiment enabled', () => {
          beforeEach(() => {
            subject.setProps({ isExperimentEnabled: () => true });
          });

          it('only renders the disable button control', () => {
            expect(findLocalizedById(subject, 'giveFeedback').length).to.equal(0);
            expect(findLocalizedById(subject, 'disableExperiment').length).to.equal(1);
            expect(subject.find('#uninstall-button').hasClass('warning')).to.equal(true);
          });

          it('shows a modal dialog when the disable button is clicked', () => {
            expect(subject.state('showEolDialog')).to.equal(false);
            subject.find('#uninstall-button').simulate('click', mockClickEvent);
            expect(subject.state('showEolDialog')).to.equal(true);
          });
        });
      });
    });
  });
});

describe('app/containers/ExperimentPage/IncompatibleAddons', () => {
  let mockExperiment, props, subject;
  beforeEach(() => {
    mockExperiment = {
      slug: 'testing',
      title: 'Testing',
      incompatible: {}
    };
    props = {
      experiment: mockExperiment,
      installedAddons: []
    };
    subject = shallow(<IncompatibleAddons {...props} />);
  });

  it('should render a warning only if incompatible add-ons are installed', () => {
    expect(subject.find('.incompatible-addons')).to.have.property('length', 0);

    const experiment = { ...mockExperiment, incompatible: { foo: 1, bar: 2 } };
    subject.setProps({ experiment });

    subject.setProps({ installedAddons: ['baz'] });
    expect(subject.find('.incompatible-addons')).to.have.property('length', 0);

    subject.setProps({ installedAddons: ['baz', 'bar'] });
    expect(subject.find('.incompatible-addons')).to.have.property('length', 1);
  });
});

describe('app/containers/ExperimentPage/TestpilotPromo', () => {
  let mockExperiment, props, subject;
  beforeEach(() => {
    mockExperiment = {
      slug: 'testing',
      title: 'Testing',
      incompatible: {}
    };
    props = {
      experiment: mockExperiment,
      isFirefox: false,
      isMinFirefox: false,
      graduated: false,
      hasAddon: false,
      varianttests: {},
      installExperiment: () => {}
    };
    subject = shallow(<TestpilotPromo {...props} />);
  });

  it('should display a call-to-action to install Test Pilot without add-on', () => {
    expect(subject.find('#testpilot-promo')).to.have.property('length', 1);
    expect(subject.find('MainInstallButton')).to.have.property('length', 1);
  });

  it('should not display a call-to-action to install Test Pilot with add-on installed', () => {
    subject.setProps({ hasAddon: true });
    expect(subject.find('.experiment-promo')).to.have.property('length', 0);
    expect(subject.find('MainInstallButton')).to.have.property('length', 0);
  });
});

describe('app/containers/ExperimentPage/ExperimentDisableDialog', () => {
  const experiment = { title: 'foobar', survey_url: 'https://example.com' };
  const installed = { ex1: true, ex2: true };
  const clientUUID = '38c51b84-9586-499f-ac52-94626e2b29cf';

  let onSubmit, onCancel, sendToGA, preventDefault, mockClickEvent, subject,
    mockEscapeKeyDownEvent, mockEnterKeyDownEvent, mockNewWindowOpened;
  beforeEach(() => {
    mockNewWindowOpened = { location: '', opener: {} };
    global.window = { open: () => mockNewWindowOpened };
    sinon.spy(global.window, 'open');

    onSubmit = sinon.spy();
    onCancel = sinon.spy();
    sendToGA = sinon.spy();
    preventDefault = sinon.spy();
    mockClickEvent = { preventDefault };
    mockEscapeKeyDownEvent = {
      preventDefault,
      key: 'Escape'
    };
    mockEnterKeyDownEvent = {
      preventDefault,
      key: 'Enter'
    };
    subject = shallow(
      <ExperimentDisableDialog
        experiment={experiment} installed={installed}
        onSubmit={onSubmit} onCancel={onCancel}
        clientUUID={clientUUID} sendToGA={sendToGA} />
    );
  });

  it('should render a modal container', () => {
    expect(subject.find('.modal-container')).to.have.property('length', 1);
    expect(findLocalizedById(subject, 'feedbackUninstallTitle').props().$title)
      .to.equal(experiment.title);
  });

  it('should call onCancel when cancel button clicked', () => {
    subject.find('.modal-cancel').simulate('click', mockClickEvent);
    expect(onCancel.called).to.be.true;
    expect(preventDefault.called).to.be.true;
  });

  it('should call onCancel when the <Escape> key is pressed', () => {
    subject.find('.modal-container').simulate('keyDown', mockEscapeKeyDownEvent);
    expect(onCancel.called).to.be.true;
    expect(preventDefault.called).to.be.true;
  });

  it('should launch a survey when submit button clicked', () => {
    const submitLink = subject.find('.modal-actions a.submit');
    const expectedHref = 'https://example.com?ref=disable&experiment=foobar&cid=38c51b84-9586-499f-ac52-94626e2b29cf&installed=ex1&installed=ex2';

    expect(submitLink.props().href).to.equal(expectedHref);

    submitLink.simulate('click', mockClickEvent);
    expect(onSubmit.called).to.be.true;
    expect(preventDefault.called).to.be.false;
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'exit survey disabled'
    }]);
  });

  it('should launch a survey when the <Enter> key is pressed', () => {
    subject.find('.modal-container').simulate('keyDown', mockEnterKeyDownEvent);

    expect(global.window.open.calledOnce).to.be.true;
    const expectedHref = 'https://example.com?ref=disable&experiment=foobar&cid=38c51b84-9586-499f-ac52-94626e2b29cf&installed=ex1&installed=ex2';
    expect(mockNewWindowOpened.location).to.equal(expectedHref);
    expect(mockNewWindowOpened.opener).to.be.null;

    expect(onSubmit.called).to.be.true;
    expect(preventDefault.called).to.be.false;
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'exit survey disabled'
    }]);
  });
});

describe('app/containers/ExperimentPage/ExperimentEolDialog', () => {
  let props, mockClickEvent, subject,
    mockEscapeKeyDownEvent, mockEnterKeyDownEvent;
  beforeEach(() => {
    props = {
      onSubmit: sinon.spy(),
      onCancel: sinon.spy()
    };
    mockClickEvent = {
      preventDefault: sinon.spy()
    };
    mockEscapeKeyDownEvent = {
      preventDefault: sinon.spy(),
      key: 'Escape'
    };
    mockEnterKeyDownEvent = {
      preventDefault: sinon.spy(),
      key: 'Enter'
    };
    subject = shallow(<ExperimentEolDialog {...props} />);
  });

  it('should display expected content', () => {
    expect(subject.find('#retire-dialog-modal')).to.have.property('length', 1);
  });

  it('calls onCancel when the cancel button is clicked', () => {
    subject.find('.modal-cancel').simulate('click', mockClickEvent);
    expect(props.onCancel.called).to.be.true;
  });

  it('should call onCancel when the <Escape> button is pressed', () => {
    subject.find('.modal-container').simulate('keyDown', mockEscapeKeyDownEvent);
    expect(props.onCancel.called).to.be.true;
  });

  it('calls onSubmit when the disable button is clicked', () => {
    findLocalizedById(subject, 'disableExperiment').find('button')
      .simulate('click', mockClickEvent);
    expect(props.onSubmit.called).to.be.true;
  });

  it('should call onSubmit when the <Enter> key is pressed', () => {
    subject.find('.modal-container').simulate('keyDown', mockEnterKeyDownEvent);
    expect(props.onSubmit.called).to.be.true;
  });
});

describe('app/containers/ExperimentPage/ExperimentPreFeedbackDialog', () => {
  const experiment = {
    title: 'foobar',
    survey_url: 'https://example.com/survey',
    pre_feedback_image: '/foo.png',
    pre_feedback_copy: '<p class="expectedCopy">markup works!</p>'
  };
  const surveyURL = experiment.survey_url;

  let sendToGA, onCancel, preventDefault, getAttribute, subject,
    mockClickEvent, mockEscapeKeyDownEvent, mockEnterKeyDownEvent, mockNewWindowOpened;
  beforeEach(() => {
    mockNewWindowOpened = { location: '', opener: {} };
    global.window = { open: () => mockNewWindowOpened };
    sinon.spy(global.window, 'open');

    sendToGA = sinon.spy();
    onCancel = sinon.spy();
    preventDefault = sinon.spy();
    getAttribute = sinon.spy(() => surveyURL);
    mockClickEvent = { preventDefault, target: { getAttribute } };
    mockEscapeKeyDownEvent = {
      preventDefault,
      key: 'Escape'
    };
    mockEnterKeyDownEvent = {
      preventDefault,
      target: { getAttribute },
      key: 'Enter'
    };
    subject = shallow(
      <ExperimentPreFeedbackDialog experiment={experiment} surveyURL={surveyURL}
                                   onCancel={onCancel} sendToGA={sendToGA} />
    );
  });

  it('should render expected content', () => {
    expect(subject.find('.modal-container'))
      .to.have.property('length', 1);
    expect(findLocalizedById(subject, 'experimentPreFeedbackTitle').prop('$title'))
      .to.equal(experiment.title);
    expect(findLocalizedById(subject, 'experimentPreFeedbackLinkCopy').prop('$title'))
      .to.equal(experiment.title);
    expect(subject.find('.tour-image img').props().src)
      .to.equal(experiment.pre_feedback_image);
    expect(subject.find('.tour-text').first().html())
      .to.contain(experiment.pre_feedback_copy);
  });

  it('should call onCancel on cancel button click', () => {
    subject.find('.modal-cancel').simulate('click', mockClickEvent);
    expect(onCancel.called).to.be.true;
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel feedback'
    }]);
  });

  it('should call onCancel when the <Escape> key is pressed', () => {
    subject.find('.modal-container').simulate('keyDown', mockEscapeKeyDownEvent);
    expect(onCancel.called).to.be.true;
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel feedback'
    }]);
  });

  it('should launch feedback on feedback button click', () => {
    subject.find('.tour-text a').simulate('click', mockClickEvent);
    expect(onCancel.called).to.be.false;
    expect(getAttribute.called).to.be.true;
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'PreFeedback Confirm',
      eventLabel: 'foobar',
      outboundURL: surveyURL
    }]);
  });

  it('should launch feedback on <Enter> key pressed', () => {
    subject.find('.modal-container').simulate('keyDown', mockEnterKeyDownEvent);
    expect(global.window.open.calledOnce).to.be.true;
    expect(onCancel.called).to.be.false;
    expect(sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'PreFeedback Confirm',
      eventLabel: 'foobar',
      outboundURL: surveyURL
    }]);
  });
});

describe('app/containers/ExperimentPage/ExperimentTourDialog', () => {
  let props, mockClickEvent, subject,
    mockEscapeKeyDownEvent, mockEnterKeyDownEvent,
    mockArrowLeftKeyDownEvent, mockArrowRightKeyDownEvent;
  beforeEach(() => {
    mockClickEvent = { preventDefault: sinon.spy() };
    mockEscapeKeyDownEvent = {
      preventDefault: sinon.spy(),
      key: 'Escape'
    };
    mockArrowLeftKeyDownEvent = {
      preventDefault: sinon.spy(),
      key: 'ArrowLeft'
    };
    mockArrowRightKeyDownEvent = {
      preventDefault: sinon.spy(),
      key: 'ArrowRight'
    };
    mockEnterKeyDownEvent = {
      preventDefault: sinon.spy(),
      key: 'Enter'
    };

    props = {
      experiment: {
        title: 'Test Experiment',
        slug: 'test',
        tour_steps: [
          { image: '/example1.png', copy: 'Example 1', copy_l10nsuffix: 'foo' },
          { image: '/example2.png', copy: 'Example 2' },
          { image: '/example3.png', copy: 'Example 3' }
        ]
      },
      isExperimentEnabled: () => true,
      sendToGA: sinon.spy(),
      onComplete: sinon.spy(),
      onCancel: sinon.spy()
    };

    subject = mount(<ExperimentTourDialog {...props} />);
  });

  it('should render expected default content', () => {
    expect(findLocalizedById(subject, 'tourOnboardingTitle').prop('$title'))
      .to.equal(props.experiment.title);

    const expectedTourStep = props.experiment.tour_steps[0];
    expect(subject.find('.tour-image > img').prop('src'))
      .to.equal(expectedTourStep.image);
    // There is now a LocalizedHtml element between the
    // .tour-text element and the p element, so
    // '.tour-text > p' won't work, but '.tour-text p' does
    expect(subject.find('.tour-text p').html())
      .to.include(expectedTourStep.copy);
  });

  it('should render only the experiment title if not enabled', () => {
    subject.setProps({
      isExperimentEnabled: () => false,
      experiment: { ...props.experiment }
    });
    expect(subject.find('.modal-header').text()).to.equal(props.experiment.title);
  });

  it('should have the correct l10n IDs', () => {
    expect(findLocalizedById(subject, 'testToursteps0CopyFoo').length).to.equal(1);
  });

  it('should not have l10n IDs if the experiment is dev-only', () => {
    subject.setProps({ experiment: { dev: true, ...props.experiment } });
    expect(subject.find('.tour-text > Localized').prop('id')).to.equal(null);
  });

  it('should advance one step and ping GA when the next button is clicked', () => {
    subject.find('.tour-next').simulate('click', mockClickEvent);

    const expectedTourStep = props.experiment.tour_steps[1];
    expect(subject.find('.tour-image > img').prop('src'))
      .to.equal(expectedTourStep.image);
    expect(subject.find('.tour-text').html())
      .to.include(expectedTourStep.copy);

    expect(subject.state('currentStep')).to.equal(1);

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'forward to step 1'
    }]);
  });

  it('should advance one step and ping GA when the <ArrowRight> key is pressed', () => {
    subject.find('.modal-container').simulate('keyDown', mockArrowRightKeyDownEvent);

    const expectedTourStep = props.experiment.tour_steps[1];
    expect(subject.find('.tour-image > img').prop('src'))
      .to.equal(expectedTourStep.image);
    expect(subject.find('.tour-text').html())
      .to.include(expectedTourStep.copy);

    expect(subject.state('currentStep')).to.equal(1);

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'forward to step 1'
    }]);
  });

  it('should rewind one step and ping GA when the back button is clicked', () => {
    expect(subject.find('.tour-back').hasClass('hidden')).to.be.true;
    subject.setState({ currentStep: 1 });
    expect(subject.find('.tour-back').hasClass('hidden')).to.be.false;

    subject.find('.tour-back').simulate('click', mockClickEvent);

    const expectedTourStep = props.experiment.tour_steps[0];
    expect(subject.find('.tour-image > img').prop('src'))
      .to.equal(expectedTourStep.image);
    expect(subject.find('.tour-text').html())
      .to.include(expectedTourStep.copy);

    expect(subject.state('currentStep')).to.equal(0);

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'back to step 0'
    }]);
  });

  it('should rewind one step and ping GA when the <ArrowLeft> key is pressed', () => {
    expect(subject.find('.tour-back').hasClass('hidden')).to.be.true;
    subject.setState({ currentStep: 1 });
    expect(subject.find('.tour-back').hasClass('hidden')).to.be.false;

    subject.find('.modal-container').simulate('keyDown', mockArrowLeftKeyDownEvent);

    const expectedTourStep = props.experiment.tour_steps[0];
    expect(subject.find('.tour-image > img').prop('src'))
      .to.equal(expectedTourStep.image);
    expect(subject.find('.tour-text').html())
      .to.include(expectedTourStep.copy);

    expect(subject.state('currentStep')).to.equal(0);

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'back to step 0'
    }]);
  });

  it('should render dots to indicate and choose tour steps', () => {
    expect(subject.find('.tour-image .dot'))
      .to.have.property('length', props.experiment.tour_steps.length);

    subject.setState({ currentStep: 2 });
    expect(subject.find('.tour-image .dot').at(2).hasClass('current')).to.be.true;

    subject.find('.tour-image .dot').at(0).simulate('click', mockClickEvent);

    expect(subject.state('currentStep')).to.equal(0);

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'dot to step 0'
    }]);
  });

  it('should ping GA and call onCancel when cancel button clicked', () => {
    subject.find('.modal-cancel').simulate('click', mockClickEvent);

    expect(props.onCancel.called).to.be.true;

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel tour'
    }]);
  });

  it('should ping GA and call onCancel when the <Escape> key is pressed', () => {
    subject.find('.modal-container').simulate('keyDown', mockEscapeKeyDownEvent);

    expect(props.onCancel.called).to.be.true;

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'cancel tour'
    }]);
  });

  it('should ping GA and call onComplete when done button clicked', () => {
    expect(subject.find('.tour-next').hasClass('no-display')).to.be.false;
    expect(subject.find('.tour-done').hasClass('no-display')).to.be.true;
    subject.setState({ currentStep: 2 });
    expect(subject.find('.tour-next').hasClass('no-display')).to.be.true;
    expect(subject.find('.tour-done').hasClass('no-display')).to.be.false;

    subject.find('.tour-done').simulate('click', mockClickEvent);

    expect(props.onComplete.called).to.be.true;

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'complete tour'
    }]);
  });

  it('should ping GA and call onComplete when the <Enter> key is pressed', () => {
    expect(subject.find('.tour-next').hasClass('no-display')).to.be.false;
    expect(subject.find('.tour-done').hasClass('no-display')).to.be.true;
    subject.setState({ currentStep: 2 });
    expect(subject.find('.tour-next').hasClass('no-display')).to.be.true;
    expect(subject.find('.tour-done').hasClass('no-display')).to.be.false;

    subject.find('.modal-container').simulate('keyDown', mockEnterKeyDownEvent);

    expect(props.onComplete.called).to.be.true;

    expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
      eventCategory: 'ExperimentDetailsPage Interactions',
      eventAction: 'button click',
      eventLabel: 'complete tour'
    }]);
  });
});
