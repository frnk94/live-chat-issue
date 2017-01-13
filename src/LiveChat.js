
import moment from 'moment';

const EventEmitter = require('events').EventEmitter;

const CHAT_CHANGED = 'changed';

const AVAILABLE_STATES = {
	STARTED: 'started',
	ENDED: 'ended',
};

const MOCK_USERS = {
	firstname: 'Francois',
	lastname: 'Bissonnette',
	email: 'francois.bissonnette@icloud.com',
	companyId: 1,
};

class LiveChat extends EventEmitter {
	constructor() {
		super();

		// Init
		this.loaded = false
		this.state = AVAILABLE_STATES.ENDED;
		this.api = null;

		// Adding LC to window
		window.__lc = {};
		window.__lc.license = 8541501;
		window.LC_API = window.LC_API || {};

		window.LC_API.on_before_load = () => {
			this.onBeforeLoad();
		};

		window.LC_API.on_after_load = () => {
			this.onAfterLoad();
		};

		window.LC_API.on_chat_ended = () => {
			this.onChatEnded();
		};

		// Starting LC
		var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
		lc.src = (document.location.protocol === 'https:' ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
	}
	onBeforeLoad() {
		this.api = window.LC_API;
		this.api.hide_chat_window();
	}
	onAfterLoad() {
		if (!this.loaded) {
			this.loaded = true;
			this.emitChatStateChangeEvent();
		}
	}
	start(user = MOCK_USERS) {

		if (AVAILABLE_STATES.STARTED === this.state) {
			this.api.open_chat_window();
		}

		else if (this.loaded && this.api && AVAILABLE_STATES.ENDED === this.state) {
			const lastVisit = moment(this.api.get_last_visit_timestamp());

			this.api.set_visitor_name(user.firstname + ' ' + user.lastname);
			this.api.set_visitor_email(user.email);
			this.api.set_custom_variables([
				{ name: 'Current Page', value: window.location.href },
				{ name: 'Company Page', value: '/companies/' + user.company_id + '/stats' },
				{ name: 'Previous Visit', value: lastVisit.toString() },
				{ name: 'Number of Chats', value: this.api.get_chats_number() },
			]);
			this.state = AVAILABLE_STATES.STARTED;
			this.api.start_chat();
			this.emitChatStateChangeEvent();
		}
	}
	onChatEnded() {
		if (this.loaded) {
			this.state = AVAILABLE_STATES.ENDED;
			this.api.close_chat();
			this.api.hide_chat_window();
			this.emitChatStateChangeEvent();
		}
	}
	emitChatStateChangeEvent() {
		this.emit(CHAT_CHANGED);
	}
	addChatStateChangeListener(callback) {
		this.addListener(CHAT_CHANGED, callback);
	}
	removeChatStateChangeListener(callback) {
		this.removeListener(CHAT_CHANGED, callback);
	}
}

module.exports = new LiveChat();
