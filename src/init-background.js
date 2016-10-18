function initPortHandlers(storePromise, port) {
    console.log(port);
    storePromise.then((store) => {
        function subscribeHandler() {
            port.postMessage({
                type: 'EXTENSION_REDUX_STATE_CHANGED',
                payload: store.getState(),
            });
        }

        function messageHandler(message) {
            switch (message.type) {
                case 'EXTENSION_REDUX_DISPATCH':
                    store.dispatch(message.payload)
                    break;
            }
        }

        function disconnectHandler() {
            if (unsubscribe) {
                unsubscribe();
            }
            store.dispatch({
                type: 'EXTENSION_PORT_DISCONNECT',
                payload: port
            });
        }

        port.onMessage.addListener(messageHandler)
        port.onDisconnect.addListener(disconnectHandler)

        store.dispatch({
            type: 'EXTENSION_PORT_CONNECT',
            payload: port
        });

        port.postMessage({
            type: 'EXTENSION_PORT_INIT_STORE',
            payload: store.getState(),
            meta: {
                self: port.sender,
            }
        });

        let unsubscribe = store.subscribe(subscribeHandler);
    });
}

let bgInit = false;
export default function initBackground(storePromise) {
    if (bgInit) {
        throw new Error('background already init');
    }

    let handler = initPortHandlers.bind(null, storePromise);
    chrome.runtime.onConnect.addListener(handler);
    bgInit = true;
}
