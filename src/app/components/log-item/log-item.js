import React from 'react';
import PropTypes from 'prop-types';
import ReactJson from 'react-json-view';
import styles from '../../resources/css/LogItem.css';
import { EVENT_TYPES } from '../../../constants';

const EVENT_TYPE_TO_CLASS_MAPPING = {
  [EVENT_TYPES.SUCCESS]: 'logItemSuccess',
  [EVENT_TYPES.FAILURE]: 'logItemFailure',
  [EVENT_TYPES.WARNING]: 'logItemWarning'
};

class LogItem extends React.Component {
  render () {
    const { type, message, json } = this.props;
    
    return (
      <li
        className={[
        styles.logItem,
        styles[EVENT_TYPE_TO_CLASS_MAPPING[type]]
      ].join(' ')}>
        {message}
        {json && (
          <div className={styles.dataContainer}>
            <ReactJson src={json} collapsed enableClipboard={false} displayDataTypes={false} />
          </div>
        )}
      </li>
    );
  }
};

LogItem.propTypes = {
  type: PropTypes.oneOf(Object.values(EVENT_TYPES)),
  message: PropTypes.string.isRequired,
  json: PropTypes.object
}

export default LogItem;
