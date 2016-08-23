export default function connectToStore(callback) {
    let subscribers = [];
    let port = chrome.runtime.connect();
    port.onMessage.addListener((message) => {
        switch (message.type) {
            case 'init':
                store.state = message.payload;
                if (callback) {
                    callback(store);
                    callback = null;
                }
                break;
            case 'state':
                store.state = message.payload;
                subscribers.forEach((handler)=>handler());
                break;
        }
    });

    let store = {
        state: null,
        getState() {
            return this.state;
        },

        dispatch(action) {
            let message = {
                type: 'dispatch',
                payload: action
            }
            port.postMessage(message);
        },

        subscribe(handler) {
            subscribers.push(handler);
            return function () {
                let i = subscribers.indexOf(handler);
                subscribers.splice(i, 1);
            }
        },
    }
}
