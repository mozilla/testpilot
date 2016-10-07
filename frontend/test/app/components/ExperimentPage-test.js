import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import moment from 'moment';

import ExperimentPage from '../../../src/app/components/ExperimentPage';

const CHANGE_HEADER_ON = 105;

describe('app/components/ExperimentPage', () => {

  let mockExperiment, mockClickEvent, props, subject;
  beforeEach(() => {
    mockExperiment = {
      slug: 'testing',
      title: 'Testing',
      version: '1.0',
      thumbnail: '/thumbnail.png',
      introduction: '<p class="test-introduction">Introduction!</p>',
      measurements: '<p class="test-measurements">Measurements</p>',
      pre_feedback_copy: null,
      contribute_url: 'https://example.com/contribute',
      bug_report_url: 'https://example.com/bugs',
      discourse_url: 'https://example.com/discourse',
      privacy_notice_url: 'https://example.com/privacy',
      changelog_url: 'https://example.com/changelog',
      survey_url: 'https://example.com/survey',
      contributors: [ ],
      details: [ ],
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
      uninstallAddon: sinon.spy(),
      navigateTo: sinon.spy(),
      isExperimentEnabled: sinon.spy(),
      requireRestart: sinon.spy(),
      sendToGA: sinon.spy(),
      openWindow: sinon.spy(),
      enableExperiment: sinon.spy(),
      disableExperiment: sinon.spy(),
      addScrollListener: sinon.spy(),
      removeScrollListener: sinon.spy(),
      getScrollY: sinon.spy(),
      setScrollY: sinon.spy(),
      getElementY: sinon.spy(),
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:51.0) Gecko/20100101 Firefox/51.0'
    };

    subject = shallow(<ExperimentPage {...props} />);
  });

  const findByL10nID = id => subject.findWhere(el => id === el.props()['data-l10n-id']);

  const setExperiment = experiment => {
    subject.setProps({
      experiment,
      experiments: [ experiment ]
    });
    return experiment;
  };

  it('should render a loading page if no experiments are available', () => {
    expect(subject.find('LoadingPage')).to.have.property('length', 1);
  });

  it('should render a 404 page if experiment is undefined', () => {
    props = { ...props,
      experiment: undefined,
      experiments: [ { ...mockExperiment, slug: 'notit' } ]
    };
    subject.setProps(props);
    expect(subject.find('NotFoundPage'))
      .to.have.property('length', 1);
  });

  describe('with a valid experiment slug', () => {
    beforeEach(() => {
      setExperiment(mockExperiment);
      subject.setProps({
        isExperimentEnabled: experiment => false
      });
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

    it('should clear both enabling & disabling state if experiment.inProgress changes', () => {
      const prevExperiment = { ...mockExperiment, inProgress: true };
      const nextExperiment = { ...mockExperiment, inProgress: false };

      subject.setProps({ experiment: prevExperiment });
      subject.setState({ isEnabling: true, isDisabling: true });
      subject.setProps({ experiment: nextExperiment });

      expect(subject.state('isEnabling')).to.be.false;
      expect(subject.state('isDisabling')).to.be.false;
    });

    it('should show the tour dialog if shouldShowTourDialog is true and experiment then becomes enabled', () => {
      // Flag the tour dialog to be shown, but experiment isn't enabled yet.
      subject.setState({ shouldShowTourDialog: true });

      // Tour dialog isn't shown yet...
      expect(subject.state('shouldShowTourDialog')).to.be.true;
      expect(subject.state('showTourDialog')).to.be.false;
      expect(subject.find('ExperimentTourDialog')).to.have.property('length', 0);

      // Enable the experiment...
      subject.setProps({ isExperimentEnabled: experiment => true });

      // Now show the tour dialog...
      expect(subject.state('shouldShowTourDialog')).to.be.false;
      expect(subject.state('showTourDialog')).to.be.true;
      expect(subject.find('ExperimentTourDialog')).to.have.property('length', 1);
    });

    it('should render a warning only if incompatible add-ons are installed', () => {
      expect(subject.find('.incompatible-addons')).to.have.property('length', 0);

      const experiment = { ...mockExperiment, incompatible: { foo: 1, bar: 2 } };
      subject.setProps({ experiment });

      subject.setProps({ installedAddons: [ 'baz' ] });
      expect(subject.find('.incompatible-addons')).to.have.property('length', 0);

      subject.setProps({ installedAddons: [ 'baz', 'bar' ] });
      expect(subject.find('.incompatible-addons')).to.have.property('length', 1);
    });

    // TODO #1138: Special sub-title case for No More 404s
    it('(TODO #1138) should add a hardcoded subtitle for No More 404s', () => {
      setExperiment({ ...mockExperiment, title: 'No More 404s' });
      expect(subject.find('.subtitle').text()).to.equal('Powered by the Wayback Machine');
    });

    it('should display installation count if over 100', () => {
      const experiment = setExperiment({ ...mockExperiment, installation_count: '101' });
      const el = findByL10nID('userCountContainer');
      expect(el).has.property('length', 1);
      expect(JSON.parse(el.prop('data-l10n-args')))
        .to.have.property('installation_count', experiment.installation_count);
    });

    it('should display alternative message if installation count <= 100', () => {
      setExperiment({ ...mockExperiment, installation_count: '99' });
      const el = findByL10nID('userCountContainerAlt');
      expect(el).has.property('length', 1);
    });

    it('should display a call-to-action to install Test Pilot', () => {
      expect(subject.find('.experiment-promo')).to.have.property('length', 1);
      expect(subject.find('MainInstallButton')).to.have.property('length', 1);
    });

    it('should display a call-to-action to try other experiments', () => {
      const experiment = setExperiment(mockExperiment);
      expect(subject.find('.card-list-header')).to.have.property('length', 1);
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
          eventAction: 'button click',
          eventLabel: 'Enable Experiment'
        }]);
      });

      it('should display a warning only if userAgent does not meet minimum version', () => {
        setExperiment({ ...mockExperiment, min_release: 50 });

        const userAgentPre = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:51.0) Gecko/20100101 Firefox/';

        subject.setProps({ userAgent: `${userAgentPre}23.0` });
        expect(subject.find('.upgrade-notice')).to.have.property('length', 1);
        expect(subject.find('.experiment-controls')).to.have.property('length', 0);

        findByL10nID('upgradeNoticeLink').simulate('click', mockClickEvent);
        expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
          eventCategory: 'ExperimentDetailsPage Interactions',
          eventAction: 'button click',
          eventLabel: 'Upgrade Notice'
        }]);

        subject.setProps({ userAgent: `${userAgentPre}50.0` });
        expect(subject.find('.upgrade-notice')).to.have.property('length', 0);
        expect(subject.find('.experiment-controls')).to.have.property('length', 1);

        subject.setProps({ userAgent: `${userAgentPre}51.0` });
        expect(subject.find('.upgrade-notice')).to.have.property('length', 0);
        expect(subject.find('.experiment-controls')).to.have.property('length', 1);
      });

      it('should display a banner if the experiment has an error status', () => {
        setExperiment({ ...mockExperiment, error: true });
        expect(subject.find('.details-header-wrapper').hasClass('has-status')).to.be.true;
        expect(subject.find('.status-bar').hasClass('error')).to.be.true;
        expect(findByL10nID('installErrorMessage')).to.have.property('length', 1);
      });

      it('should make the page header sticky on page scrolling', (done) => {
        // Switch to mounted component to exercise componentDidMount
        let scrollY = 0;
        const mountedProps = { ...props,
          hasAddon: true,
          getScrollY: () => scrollY,
          experiments: [ mockExperiment ],
          experiment: mockExperiment
        };
        const mountedSubject = mount(<ExperimentPage {...mountedProps} />);

        expect(props.addScrollListener.called).to.be.true;
        expect(mountedSubject.state('useStickyHeader')).to.be.false;
        expect(mountedSubject.find('.details-header-wrapper').hasClass('stick')).to.be.false;

        const scrollListener = props.addScrollListener.lastCall.args[0];
        scrollY = 300;  // see CHANGE_HEADER_ON in the component
        scrollListener();

        // HACK: scrollListner() has a setTimeout(..., 1) so let's wait longer.
        setTimeout(() => {
          expect(mountedSubject.state('useStickyHeader')).to.be.true;
          expect(mountedSubject.find('.details-header-wrapper').hasClass('stick')).to.be.true;

          // Now, scroll back.
          scrollY = 10;
          scrollListener();
          setTimeout(() => {
            expect(mountedSubject.state('useStickyHeader')).to.be.false;
            expect(mountedSubject.find('.details-header-wrapper').hasClass('stick')).to.be.false;
            expect(mountedSubject.find('.details-header-wrapper.stick'))
              .to.have.property('length', 0);
            mountedSubject.unmount();
            expect(props.removeScrollListener.called).to.be.true;
            done();
          }, 5);
        }, 5);
      });

      it('should scroll down to measurements block when "Your privacy" clicked', (done) => {
        const elementY = 400;
        subject.setProps({ getElementY: sel => elementY });

        subject.find('.highlight-privacy').simulate('click', mockClickEvent);

        expect(props.setScrollY.lastCall.args[0]).to.equal(elementY - CHANGE_HEADER_ON);
        expect(subject.state('useStickyHeader')).to.be.true;
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
          subject.setProps({ isExperimentEnabled: experiment => true });
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
            eventAction: 'button click',
            eventLabel: 'Disable Experiment'
          }]);
        });

        it('should have the expected survey URL on the "Give Feedback" button', () => {
          subject.setProps({ installed: { foo: true, bar: true } });
          const button = subject.find('#feedback-button');
          const expectedHref = 'https://example.com/survey?ref=givefeedback&experiment=Testing&installed=foo&installed=bar';
          expect(button.prop('href')).to.equal(expectedHref);
        });

        it('should navigate to survey URL when "Give Feedback" clicked', () => {
          const button = subject.find('#feedback-button');
          const expectedHref = button.prop('href');
          mockClickEvent.target.getAttribute = name => expectedHref;
          button.simulate('click', mockClickEvent);

          expect(props.sendToGA.lastCall.args).to.deep.equal(['event', {
            eventCategory: 'ExperimentDetailsPage Interactions',
            eventAction: 'button click',
            eventLabel: 'Give Feedback',
            outboundURL: expectedHref
          }]);
        });

        it('should show a pre-feedback dialog when message available & "Give Feedback" clicked', () => {
          setExperiment({ ...mockExperiment,
            pre_feedback_copy: '<p class="preFeedback">Hello</p>' });

          const button = subject.find('#feedback-button');
          const expectedHref = button.prop('href');
          mockClickEvent.target.getAttribute = name => expectedHref;
          button.simulate('click', mockClickEvent);

          expect(subject.state('showPreFeedbackDialog')).to.be.true;
          const dialog = subject.find('ExperimentPreFeedbackDialog');
          expect(dialog).to.have.property('length', 1);
          expect(dialog.prop('surveyURL')).to.equal(expectedHref);
        });

        it('should display a banner when the experiment is enabled', () => {
          expect(subject.find('.details-header-wrapper').hasClass('has-status')).to.be.true;
          expect(subject.find('.status-bar').hasClass('enabled')).to.be.true;
          expect(findByL10nID('isEnabledStatusMessage')).to.have.property('length', 1);
        });

      });

    });

  });

});
