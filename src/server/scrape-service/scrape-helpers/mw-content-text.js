const STATES = require('../../../usa-states');

const getState = ($, $mwContentText) => {
  let state = null;
  
  $mwContentText.find('a[title]')
    .each((index, linkDomEl) => {
      const stateName = $(linkDomEl).attr('title');
      const actualState = STATES.find(({ name }) => name === stateName);

      if (actualState) {
        state = actualState;
        return true;
      }

      return false;
    });

  return state;
}

module.exports = {
  getState
};