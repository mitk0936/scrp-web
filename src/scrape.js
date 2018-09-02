const jsdom = require('jsdom');
const jquery = require('jquery');

const infoBoxScrapeHelpers = require('./scrape-helpers/info-box');

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

const start = (html) => {
  const $ = createJSDOM(html);
  const infoBoxDomEl = $.find('.infobox')[0];
  const $infobox = $(infoBoxDomEl);
  const errorHandler = handleErrors($, $infobox);

  return {
    name: errorHandler(infoBoxScrapeHelpers.getName),
    tenure: errorHandler(infoBoxScrapeHelpers.getTenure),
    yearsInPosition: errorHandler(infoBoxScrapeHelpers.getYearsInPosition),
    education: errorHandler(infoBoxScrapeHelpers.getEducation),
    salary: errorHandler(infoBoxScrapeHelpers.getSalary)
  };
};

module.exports = { start };