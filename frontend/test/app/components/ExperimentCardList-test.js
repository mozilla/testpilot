import React from 'react';
import { assert, expect } from 'chai';
import { shallow, mount, render } from 'enzyme';

import ExperimentCardList from '../../../src/app/components/ExperimentCardList';
import ExperimentRowCard from '../../../src/app/components/ExperimentRowCard';
import Loading from '../../../src/app/components/Loading';


const _exp = [
  { slug: 'foo' },
  { slug: 'bat' }
];

const noop = () => {};

describe('app/components/ExperimentCardList', () => {
  it('renders a loading screen of no experiments are available', () => {
    const wrapper = shallow(<ExperimentCardList isExperimentEnabled={noop} experiments={[]} />);
    expect(wrapper.contains(<Loading />)).to.equal(true);
  });

  it('renders ExperimentRowCards for each experiment', () => {
    const wrapper = shallow(<ExperimentCardList isExperimentEnabled={noop} experiments={_exp} />);
    expect(wrapper.find(ExperimentRowCard)).to.have.length(_exp.length);
  });

  it('respects an exception if specified', () => {
    const wrapper = shallow(<ExperimentCardList isExperimentEnabled={noop}
                                                experiments={_exp}
                                                except={_exp[0].slug} />);
    expect(wrapper.find(ExperimentRowCard)).to.have.length(_exp.length - 1);
  });
});
