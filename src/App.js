import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LiveChat from './LiveChat.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = this.resetState();
	}
	componentWillMount() {
		LiveChat.addChatStateChangeListener(this.onChatChange);
	}
	componentWillUnmount() {
		LiveChat.removeChatStateChangeListener(this.onChatChange);
	}
	resetState = () => {
		return {
			chatIsLoaded: LiveChat.loaded,
			chatState: LiveChat.state,
		};
	}
	onChatChange = (state) => {
		this.setState((prevState) => this.resetState());
	}
	handleButtonClick = () => {
		LiveChat.start();
	}
	render() {
		console.log(this.state);
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>LiveChat Issue</h2>
				</div>
				<p className="App-intro">
					<button onClick={this.handleButtonClick} className="btn" type="button">
						<span>CLICK HERE TO START CHAT</span>
					</button>
				</p>
			</div>
		);
	}
}

export default App;
