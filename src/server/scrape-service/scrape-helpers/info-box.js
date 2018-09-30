const getTitleRows = ($infobox) => $infobox.eq(0).find('.widget-row.value-only');

const getName = ($, $infobox) => getTitleRows($infobox).eq(0).html();

const getTenure = ($, $infobox) => {
  let tenure = null;

  $infobox
    .find('div:not(.widget-row)')
    .each((index, textRow) => {
      if (tenure) {
        return;
      }

      const title = $(textRow).html();

      if (title.match(/tenure/i)) {
        const paragraph = $(textRow).next().find('p');
        const directText = $(textRow).next().html();

        tenure = paragraph && paragraph.length > 0 ?
          paragraph.eq(0).html().trim() :
          directText;

        return;
      }
  });

  return tenure;
};

const getYearsInPosition = ($, $infobox) => {
  let years = null;

  $infobox
    .find('div:not(.widget-row)')
    .each((index, textRow) => {
      if (years) {
        return;
      }

      const title = $(textRow).html();

      if (title.match(/years.in.position/i)) {
        years = $(textRow).next().find('p').html().trim();
        return;
      }
  });

  return years;
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

        while (compensationItem && compensationItem.is('.widget-row') && !compensationItem.hasClass('value-only')) {
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

        while (educationItem && educationItem.is('.widget-row') && !educationItem.hasClass('value-only')) {
          const degree = educationItem.find('.widget-key').html().trim();
          const institution = educationItem.find('.widget-value p').html().trim();

          values.push({ degree, institution });
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
      if (religion) {
        return;
      }

      const title = $(section).html();

      if (title && title.match(/personal/i)) {
        let personalItem = $(section).next();

        while (personalItem && !personalItem.hasClass('value-only') && personalItem.is('.widget-row')) {
          const personalInfoType = personalItem.find('.widget-key').html();

          if (personalInfoType && personalInfoType.trim().match(/religion/i)) {
            religion = personalItem.find('.widget-value').html().trim();
            return;
          }

          personalItem = personalItem.next();
        }
      }
    });

  return religion;
};

const getProfession = ($, $infobox) => {
  let profession = null;

  getTitleRows($infobox)
    .each((index, section) => {
      if (profession) {
        return;
      }

      const title = $(section).html();

      if (title && title.match(/personal/i)) {
        let personalItem = $(section).next();

        while (personalItem && !personalItem.hasClass('value-only') && personalItem.is('.widget-row')) {
          const personalInfoType = personalItem.find('.widget-key').html();

          if (personalInfoType && personalInfoType.trim().match(/profession/i)) {
            profession = personalItem.find('.widget-value').html().trim();
            return;
          }

          personalItem = personalItem.next();
        }
      }
    });

  return profession;
};

module.exports = {
  getName,
  getTenure,
  getEducation,
  getYearsInPosition,
  getSalary,
  getReligion,
  getProfession
};