const getTitleRows = ($infobox) => $infobox.eq(0).find('.widget-row.value-only');

const getName = ($, $infobox) => getTitleRows($infobox).eq(0).html();

const getTenure = ($, $infobox) => {
  let value = null;

  $infobox
    .find('div:not(.widget-row)')
    .each((index, textRow) => {
      const title = $(textRow).html();

      if (title.match(/tenure/i)) {
        const paragraph = $(textRow).next().find('p');
        const directText = $(textRow).next().html();

        value = paragraph && paragraph.length > 0 ?
          paragraph.eq(0).html().trim() :
          directText;

        return;
      }
  });

  return value;
};

const getYearsInPosition = ($, $infobox) => {
  let value = null;

  $infobox
    .find('div:not(.widget-row)')
    .each((index, textRow) => {
      const title = $(textRow).html();

      if (title.match(/years.in.position/i)) {
        value = $(textRow).next().find('p').html().trim();
        return;
      }
  });

  return value;
};

const getSalary = ($, $infobox) => {
  const salaryData = {
    base: null,
    netWorth: null
  };

  getTitleRows($infobox)
    .each((index, compensationSection) => {
      const title = $(compensationSection).find('p').html();

      if (title && title.match(/compensation/i)) {
        let compensationItem = $(compensationSection).next();

        while (compensationItem && !compensationItem.hasClass('value-only')) {
          const $salaryType = compensationItem.find('.widget-key');
          const type = $salaryType && $salaryType.html().trim();
          
          const $salaryValue = compensationItem.find('.widget-value p');
          const value = $salaryValue && $salaryValue.html().trim();

          if (type && type.match(/base.salary/i)) {
            salaryData.base = value;
          }

          if (type && type.match(/net.worth/i)) {
            salaryData.netWorth = value;
          }

          compensationItem = compensationItem.next();
        }

        return;
      }
    });

  return salaryData;
};

const getEducation = ($, $infobox) => {
  let uniData = [];

  getTitleRows($infobox)
    .each((index, section) => {
      const title = $(section).find('p').html();

      if (title && title.match(/education/i)) {
        const values = [];

        let educationItem = $(section).next();

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

const getReligion = ($, $infobox) => {
  let religion = null;

  getTitleRows($infobox)
    .each((index, section) => {
      const title = $(section).html();

      if (title && title.match(/personal/i)) {
        let personalItem = $(section).next();

        while (personalItem && !personalItem.hasClass('value-only')) {
          const personalInfoType = personalItem.find('.widget-key').html().trim();
          if (personalInfoType.match(/religion/i)) {
            religion = personalItem.find('.widget-value').html().trim();
            return;
          }
        }
      }
    });

  return religion;
};

module.exports = {
  getName,
  getTenure,
  getEducation,
  getYearsInPosition,
  getSalary,
  getReligion
};