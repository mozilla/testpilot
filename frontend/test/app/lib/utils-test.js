import { expect } from 'chai';
import { l10nIdFormat, l10nId, experimentL10nId, newsUpdateL10nId, lookup } from '../../../src/app/lib/utils';

describe('app/lib/utils', () => {

  describe('l10nIdFormat', () => {
    it('should strip non-alpha characters', () => {
      expect(l10nIdFormat('a_%-b')).to.equal('Ab');
    });

    it('should only capitalize the first letter', () => {
      expect(l10nIdFormat('ABCDE')).to.equal('Abcde');
    });

    it('should coerce integers to strings', () => {
      expect(l10nIdFormat(1)).to.equal('1');
    });
  });

  describe('l10nId', () => {
    it('should join the pieces', () => {
      expect(l10nId(['a', 'b', 'c'])).to.equal('aBC');
    });

    it('should sanitize each piece', () => {
      expect(l10nId(['A-', 'b-', 'c-'])).to.equal('aBC');
    });
  });

  const mockLookup = {
    string: 'a',
    object: {
      b: 'c'
    },
    array: [
      {
        x: 'y',
        x_l10nsuffix: 'z'
      }
    ],
    string2: 'h',
    string2_l10nsuffix: 'i'
  };

  describe('lookup', () => {
    it('should fetch properties of the object', () => {
      expect(lookup(mockLookup, 'string')).to.equal(mockLookup.string);
    });

    it('should fetch nested properties', () => {
      expect(lookup(mockLookup, 'object.b')).to.equal(mockLookup.object.b);
    });

    it('should fetch array items via index', () => {
      expect(lookup(mockLookup, 'array.0.x')).to.equal(mockLookup.array[0].x);
    });
  });

  describe('experimentL10nId', () => {
    const mockExperiment = Object.assign({slug: 'foo'}, mockLookup);

    it('should generate the correct l10n ID', () => {
      expect(experimentL10nId(mockExperiment, ['string'])).to.equal('fooString');
    });

    it('should respect _l10nsuffix suffices', () => {
      expect(experimentL10nId(mockExperiment, ['string2'])).to.equal('fooString2I');
    });

    it('handles a string piece by turning it into an array', () => {
      expect(experimentL10nId(mockExperiment, 'string')).to.equal('fooString');
    });

    it('looks up object properties', () => {
      expect(experimentL10nId(mockExperiment, ['object', 'b'])).to.equal('fooObjectB');
    });

    it('looks up array items', () => {
      expect(experimentL10nId(mockExperiment, ['array', '0', 'x'])).to.equal('fooArray0XZ');
    });

    it('should return null for a dev-only experiment', () => {
      expect(experimentL10nId({ dev: true, ...mockExperiment }, ['string'])).to.equal(null);
    });
  });

  describe('newsUpdateL10nId', () => {

    it('should generate the correct l10n ID when given an update with experiment slug', () => {
      const result = newsUpdateL10nId({
        experimentSlug: 'foobar',
        slug: 'xyzzy',
        title: 'bazquux'
      }, 'title');
      expect(result).to.equal('foobarNewsupdatesXyzzyTitle');
    });

    it('should generate the correct l10n ID when given an field with an _l10nsuffix', () => {
      const result = newsUpdateL10nId({
        experimentSlug: 'foobar',
        slug: 'xyzzy',
        title: 'bazquux',
        title_l10nsuffix: 'frobnitz'
      }, 'title');
      expect(result).to.equal('foobarNewsupdatesXyzzyTitleFrobnitz');
    });

    it('should generate the correct l10n ID when given an update without experiment slug', () => {
      const result = newsUpdateL10nId({
        slug: 'xyzzy',
        title: 'bazquux'
      }, 'title');
      expect(result).to.equal('testpilotNewsupdatesXyzzyTitle');
    });

  });

});
