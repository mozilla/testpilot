/* global describe beforeEach it */
import assert from 'assert';
import sinon from 'sinon';
import * as actions from '../src/lib/actions';
import InstallListener from '../src/lib/actionCreators/InstallListener';

const dispatch = sinon.spy();
const experiment = { addon_id: 'x' };
const addonInstall = {};
let listener = new InstallListener({ dispatch, experiment });

describe('InstallListener', function() {
  beforeEach(function() {
    dispatch.reset();
  });

  it('initializes', function() {
    assert.equal(listener.dispatch, dispatch);
  });

  it('handles onInstallEnded', function() {
    listener.onInstallEnded(addonInstall, { id: 'x', installDate: new Date() });
    assert.ok(dispatch.calledOnce);
    assert.equal(dispatch.firstCall.args[0].type, actions.INSTALL_ENDED.type);
  });

  it('handles onInstallFailed', function() {
    listener.onInstallFailed(addonInstall);
    assert.ok(dispatch.calledOnce);
    assert.equal(dispatch.firstCall.args[0].type, actions.INSTALL_FAILED.type);
  });

  it('handles onInstallStarted', function() {
    listener.onInstallStarted(addonInstall);
    assert.ok(dispatch.calledOnce);
    assert.equal(dispatch.firstCall.args[0].type, actions.INSTALL_STARTED.type);
  });

  it('handles onInstallCancelled', function() {
    listener.onInstallCancelled(addonInstall);
    assert.ok(dispatch.calledOnce);
    assert.equal(
      dispatch.firstCall.args[0].type,
      actions.INSTALL_CANCELLED.type
    );
  });

  it('handles onDownloadStarted', function() {
    listener.onDownloadStarted(addonInstall);
    assert.ok(dispatch.calledOnce);
    assert.equal(
      dispatch.firstCall.args[0].type,
      actions.DOWNLOAD_STARTED.type
    );
  });

  it('handles onDownloadProgress', function() {
    listener.onDownloadProgress(addonInstall);
    assert.ok(dispatch.calledOnce);
    assert.equal(
      dispatch.firstCall.args[0].type,
      actions.DOWNLOAD_PROGRESS.type
    );
  });

  it('handles onDownloadEnded', function() {
    listener.onDownloadEnded(addonInstall);
    assert.ok(dispatch.calledOnce);
    assert.equal(dispatch.firstCall.args[0].type, actions.DOWNLOAD_ENDED.type);
  });

  it('handles onDownloadCancelled', function() {
    listener.onDownloadCancelled(addonInstall);
    assert.ok(dispatch.calledOnce);
    assert.equal(
      dispatch.firstCall.args[0].type,
      actions.DOWNLOAD_CANCELLED.type
    );
  });

  it('handles onDownloadFailed', function() {
    listener.onDownloadFailed(addonInstall);
    assert.ok(dispatch.calledOnce);
    assert.equal(dispatch.firstCall.args[0].type, actions.DOWNLOAD_FAILED.type);
  });
});
