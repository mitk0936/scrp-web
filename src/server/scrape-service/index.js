const jsdom = require('jsdom');
const jquery = require('jquery');
const genderGuess = require('gender');

const infoBoxScrapeHelpers = require('./scrape-helpers/info-box');
const mwContentScrapeHelpers = require('./scrape-helpers/mw-content-text');

const handleErrors = ($, $container, onError) => (getter) => {
  try {
    return getter($, $container);
  } catch (e) {
    onError(e.message);
    return 'error_parsing';
  }
};

const createJSDOM = (html) => {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(html);
  return (jquery)(dom.window);
};

const run = ({ html, onError }) => {
  const $ = createJSDOM(html);
  const infoBoxDomEl = $.find('.infobox')[0];
  const mwContentDomEl = $.find('#mw-content-text');

  const $infobox = $(infoBoxDomEl);
  const $mwContent = $(mwContentDomEl);

  const errorHandlerInfoBox = handleErrors($, $infobox, onError);
  const errorHandlerMwContent = handleErrors($, $mwContent, onError);

  if (!$mwContent || !$infobox.length) {
    return null;
  }

  const name = errorHandlerInfoBox(infoBoxScrapeHelpers.getName);
  const { gender, confidence } = genderGuess.guess(name || 'John Doe');
  const personGender = confidence > 0.85 ? gender : null;

  return {
    name,
    gender: personGender,
    state: errorHandlerMwContent(mwContentScrapeHelpers.getState),
    tenure: errorHandlerInfoBox(infoBoxScrapeHelpers.getTenure),
    yearsInPosition: errorHandlerInfoBox(infoBoxScrapeHelpers.getYearsInPosition),
    education: errorHandlerInfoBox(infoBoxScrapeHelpers.getEducation),
    salary: errorHandlerInfoBox(infoBoxScrapeHelpers.getSalary),
    religion: errorHandlerInfoBox(infoBoxScrapeHelpers.getReligion),
    profession: errorHandlerInfoBox(infoBoxScrapeHelpers.getProfession),
    career: errorHandlerMwContent(mwContentScrapeHelpers.getCareer)
  };
};

module.exports = { run };