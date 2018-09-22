import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import styles from '../resources/css/App.css';
import Commands from './commands';
import Console from './console';
import { STATUS } from '../../constants';

class App extends React.Component {
  state = {
    status: STATUS.IDLE,
    messages: []
  };

  socket = null;

  render () {
    return (
      <div className={styles.app}>
        <Commands
          start={() => this.setStatus(STATUS.RUNNING)}
          stop={() => this.setStatus(STATUS.IDLE)}
          status={this.state.status}
        />
        <ul>
        {
          this.state.messages.map(({ type, message }) => (
            <li>
              Type: {type}, Message: {message}
            </li>
          ))
        }
        </ul>
      </div>
    );
  }

  setStatus = (status) => this.socket.emit('status', {
    status
  })
  
  componentDidMount () {
    this.socket = io(`http://127.0.0.1:${process.env.PORT}`);
    this.socket.on('status', ({ status }) => this.setState({ status }));
    this.socket.on('message', ({ type, message }) => this.setState({
      messages: [...this.state.messages, { type, message }]
    }))
  }
};

export default App;
