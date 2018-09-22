import * as React from 'react';
import PropTypes from 'prop-types';
import { STATUS } from '../../constants';
import styles from '../resources/css/Commands.css';

export class Commands extends React.Component {
  render () {
    return (
      <fieldset className={styles.fieldset}>
        <legend>Control scrape service</legend>
        <table border="0">
          <tbody>
              <tr>
              <td>
                Current status:
              </td>
              <td>
                {this.props.status}
              </td>
            </tr>
            {
              this.props.status === STATUS.IDLE && (
                <tr>
                  <td>
                    <button onClick={this.props.start}>
                      Start Script
                    </button>
                  </td>
                </tr>
              )
            }
            {
              this.props.status === STATUS.RUNNING && (
                <tr>
                  <td>
                    <button onClick={this.props.stop}>
                      Cancel
                    </button>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </fieldset>
    );
  }
};

Commands.propTypes = {
  start: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired
};

export default Commands;
