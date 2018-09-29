const findNext = ($, domEl, selector, untilSelector) => {
  let currentElement = $(domEl).next();

  while (currentElement) {
    if (currentElement.is(untilSelector)) {
      return null;
    }

    if (currentElement.is(selector)) {
      return currentElement;
    }

    currentElement = currentElement.next();
  }

  return null;
};

module.exports = {
  findNext
};
