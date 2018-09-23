const jsdom = require('jsdom');
const jquery = require('jquery');
const genderGuess = require('gender');

const infoBoxScrapeHelpers = require('./scrape-helpers/info-box');
const mwContentScrapeHelpers = require('./scrape-helpers/mw-content-text');

const handleErrors = ($, $container) => (getter) => {
  try {
    return getter($, $container);
  } catch (e) {
    console.log(e);
    return 'error_parsing';
  }
};

const createJSDOM = (html) => {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(html);
  return (jquery)(dom.window);
};

const run = ({ html }) => {
  const $ = createJSDOM(html);
  const infoBoxDomEl = $.find('.infobox')[0];
  const mwContentDomEl = $.find('#mw-content-text');

  const $infobox = $(infoBoxDomEl);
  const $mwContent = $(mwContentDomEl);

  const errorHandlerInfoBox = handleErrors($, $infobox);
  const errorHandlerMwContent = handleErrors($, $mwContent);

  const name = errorHandlerInfoBox(infoBoxScrapeHelpers.getName);
  const { gender } = genderGuess.guess(name);

  return {
    name,
    gender,
    state: errorHandlerMwContent(mwContentScrapeHelpers.getState),
    tenure: errorHandlerInfoBox(infoBoxScrapeHelpers.getTenure),
    yearsInPosition: errorHandlerInfoBox(infoBoxScrapeHelpers.getYearsInPosition),
    education: errorHandlerInfoBox(infoBoxScrapeHelpers.getEducation),
    salary: errorHandlerInfoBox(infoBoxScrapeHelpers.getSalary),
    religion: errorHandlerInfoBox(infoBoxScrapeHelpers.getReligion)
  };
};

module.exports = { run };