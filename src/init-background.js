function initPortHandlers(store, port) {

    function subscribeHandler() {
        let message = {
            type: 'state',
            payload: store.getState(),
        }
        port.postMessage(message);
    }

    function messageHandler(message) {
        switch (message.type) {
            case 'dispatch':
                store.dispatch(message.action)
                break;
        }
    }

    function diconnectHandler() {
        if (unsubscribe) {
            unsubscribe();
        }
    }

    port.onMessage.addListener(messageHandler)
    port.onDisconnect.addListener(disconnectHandler)

    let message = {
        type: 'init',
        payload: store.getState()
    }
    port.postMessage(message);

    let unsubscribe = store.subscribe(subscribeHandler);
}

let bgInit = false;
export default function initBackground(store) {
    if (bgInit) {
        throw new Error('background already init');
    }

    let handler = initPortHandlers.bind(null, store);
    chrome.runtime.onConnect.addListener(handler);
    bgInit = true;
}
