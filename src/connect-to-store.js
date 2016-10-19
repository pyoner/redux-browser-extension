export default function connectToStore(callback) {
    let subscribers = [];
    let uid = Math.random().toString().slice(2);
    let port = chrome.runtime.connect(null, { name: uid });
    port.onMessage.addListener((message) => {
        switch (message.type) {
            case 'MSG_PORT_INIT_STORE':
                store.state = message.payload;
                if (callback) {
                    callback(store, message.meta);
                    callback = null;
                }
                break;
            case 'MSG_REDUX_STATE_CHANGED':
                store.state = message.payload;
                subscribers.forEach((handler) => handler());
                break;
        }
    });

    let store = {
        state: null,
        getState() {
            return this.state;
        },

        dispatch(action) {
            port.postMessage({
                type: 'MSG_REDUX_DISPATCH',
                payload: action
            });
        },

        subscribe(handler) {
            subscribers.push(handler);
            return function() {
                let i = subscribers.indexOf(handler);
                subscribers.splice(i, 1);
            }
        },
    }
}
