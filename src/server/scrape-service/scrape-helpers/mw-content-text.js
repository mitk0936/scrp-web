const STATES = require('../../../usa-states');
const commonHelpers = require('./common');

const LONGEST_STATE_NAME = 30;

const getState = ($, $mwContentText) => {
  let state = null;
  
  $mwContentText.find('a[title]')
    .each((index, linkDomEl) => {
      if (state) {
        return;
      }

      const linkTitle = $(linkDomEl).attr('title');

      if (linkTitle.length <= LONGEST_STATE_NAME) {
        const actualState = STATES.find(({ name }) => Boolean(linkTitle.includes(name)));

        if (actualState) {
          state = actualState.abbreviation;
        }
      }
    });
    
  return state;
};

const getCareer = ($, $mwContentText) => {
  let careerData = null;
  const titleSections = $mwContentText.find('>h2');

  titleSections
    .each((index, titleSection) => {
      if (careerData) {
        return;
      }

      if ($(titleSection).text().match(/Career/)) {
        const listDomEl = commonHelpers.findNext($, titleSection, 'ul', 'h2');

        if (listDomEl) {
          careerData = [];
          $(listDomEl).find('>li').each((index, carrerItem) => careerData.push($(carrerItem).text()));
        }
      }
    });

  return careerData;
};

module.exports = {
  getState,
  getCareer
};