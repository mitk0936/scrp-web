import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import styles from '../resources/css/App.css';
import Commands from './commands';
import LogItem from '../components/log-item/log-item';
import { STATUS } from '../../constants';

const MESSAGES_LIMIT = 500;

class App extends React.Component {
  state = {
    status: STATUS.IDLE,
    messages: []
  };

  socket = null;

  setStatus = (status) => this.socket.emit('status', { status })

  render () {
    return (
      <div className={styles.app}>
        <Commands
          start={() => this.setState({
            messages: []
          }, () => this.setStatus(STATUS.RUNNING))}
          stop={() => this.setStatus(STATUS.IDLE)}
          status={this.state.status}
        />
        <ul className={styles.log}>
          {
            this.state.messages.map(({ type, message, json }) =>
              <LogItem
                key={`${type}-${message}`}
                type={type}
                message={message}
                json={json}
              />
            )
          }
        </ul>
      </div>
    );
  }
  
  componentDidMount () {
    this.socket = io(`${process.env.HOST}:${process.env.PORT}`);
    this.socket.on('status', ({ status }) => this.setState({ status }));
    this.socket.on('message', ({ type, message, json }) => {
      const updatedMessages = [...this.state.messages, { type, message, json }];

      if (updatedMessages.length > MESSAGES_LIMIT) {
        updatedMessages.shift();
      }

      this.setState({
        messages: updatedMessages
      });
    })
  }
};
;
export default App;
