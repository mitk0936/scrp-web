const jsdom = require('jsdom');
const jquery = require('jquery');

const getName = ($, $infobox) => $infobox.eq(0).find('.widget-row.value-only').eq(0).html();

const getTenure = ($, $infobox) => {
  let value = null;

  $infobox
    .find('div:not(.widget-row)')
    .each((index, el) => {
      const title = $(el).html();

      if (title.match(/tenure/i)) {
        value = $(el).next().find('p').html().trim();
      }
  });

  return value;
};

const getEducation = ($, $infobox) => {
  let uniData = [];

  $infobox
    .find('.widget-row.value-only')
    .each((index, educationSection) => {
      const title = $(educationSection).find('p').html();

      if (title && title.match(/education/i)) {
        const values = [];

        let educationItem = $(educationSection).next();

        while (educationItem && !educationItem.hasClass('value-only')) {
          const degree = educationItem.find('.widget-key').html().trim();
          const university = educationItem.find('.widget-value p').html().trim();

          values.push([degree, university]);
          educationItem = educationItem.next();
        }

        uniData = values;
        return;
      }
    });

  return uniData;
};

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
  const el = $.find('.infobox')[0];
  const $infobox = $(el);
  const errorHandler = handleErrors($, $infobox);

  return {
    name: errorHandler(getName),
    tenure: errorHandler(getTenure),
    education: errorHandler(getEducation)
  };
};

module.exports = { start };