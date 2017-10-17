import uuid from 'uuid';

export default function connectToStore(callback, opts = {}) {
    const { portName = uuid(), localKey } = opts;
    const subscribers = [];
    const port = chrome.runtime.connect(null, { name: portName });
    port.onMessage.addListener((message) => {
        switch (message.type) {
            case 'MSG_PORT_INIT_STORE':
                store.state = message.payload;
                if (callback) {
                    callback(port, store, {...message.meta, localKey });
                    callback = null;
                }
                break;
            case 'MSG_REDUX_STATE_CHANGED':
                store.state = message.payload;
                subscribers.forEach((handler) => handler());
                break;
        }
    });

    const store = {
        state: null,
        getState() {
            return this.state;
        },

        dispatch(action) {
            const meta = { localKey, ...action.meta }
            port.postMessage({
                type: 'MSG_REDUX_DISPATCH',
                payload: {
                    ...action,
                    meta
                }
            });
        },

        subscribe(handler) {
            subscribers.push(handler);
            return function() {
                const i = subscribers.indexOf(handler);
                subscribers.splice(i, 1);
            }
        },
    }
}
