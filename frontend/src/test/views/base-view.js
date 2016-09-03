import test from 'tape-catch';
import view from '../../app/views/base-view';

let beforeCalled = false;
let afterCalled = false;

test(`Running Tests for ${__filename}`, a => a.end());

const MyView = view.extend({
  template: '<div></div>',
  beforeRender: () => {
    beforeCalled = true;
  },
  afterRender: () => {
    afterCalled = true;
  }
});

test('Base view renders', t => {
  t.plan(1);

  const el = new MyView().render().el;
  t.ok(el);
});

test('beforeRender is called', t => {
  t.plan(1);

  new MyView().render();

  t.ok(beforeCalled);
});

test('afterRender is called', t => {
  t.plan(1);

  new MyView().render();

  t.ok(afterCalled);
});
