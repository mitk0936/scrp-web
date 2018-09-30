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

const getComiteeListData = ($, $ulDomEl) => {
  const children = [];

  $ulDomEl.find('>li').each((index, child) => {
    let childData = {
      text: null,
      items: []
    };

    const $childList = $(child).find('>ul');

    if ($childList.length > 0) {
      childData.items = getComiteeListData($, $childList);
      childData.text = $(child).find('>a').text();
    } else {
      childData.text = $(child).text();
    }

    if (childData.items.length === 0) {
      return children.push({
        text: childData.text
      });
    }

    children.push(childData);
  });

  return children;
};

const getComiteeAsignments = ($, $mwContentText) => {
  let comiteeAssignments = null;

  const titleSections = $mwContentText.find('>h2');

  titleSections.each((index, titleSection) => {
    if (comiteeAssignments) {
      return;
    }

    if ($(titleSection).text().match(/Committee.assignments/)) {
      const assignmentsTitle = commonHelpers.findNext($, titleSection, 'h3', 'h2');

      if (!assignmentsTitle) {
        const $infoText = $(titleSection).nextUntil('h2, h3, ul', 'p')
        const $listOnly = $(titleSection).nextUntil('h2', 'ul');

        if ($listOnly) {
          comiteeAssignments = {
            title: $infoText ? $infoText.text() : null,
            items: getComiteeListData($, $listOnly)
          };

          return;
        }
      }

      const firstLevelSections = assignmentsTitle.nextUntil('h3, h2', 'h4');
      const items = [];

      firstLevelSections.each((index, title) => {
        const $title = $(title);

        const item = {
          title: $title.text(),
          info: null,
          items: []
        };

        let $nextEl = $title.next();

        switch (true) {
          case $nextEl.is('p'):
            item.info = $nextEl.text();

            if ($nextEl.next().is('ul')) {
              item.items = getComiteeListData($, $nextEl.next());
            }

            break;
          case $nextEl.is('ul'):
            item.items = getComiteeListData($, $nextEl);
            break;
          default:
            return null;
        }
        
        items.push(item);
      });

      comiteeAssignments = {
        title: assignmentsTitle.text(),
        items
      };
    }
  });

  return comiteeAssignments;
};

module.exports = {
  getState,
  getCareer,
  getComiteeAsignments
};