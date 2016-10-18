function initPortHandlers(storePromise, port) {
    console.log(port);
    storePromise.then((store) => {
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
                    store.dispatch(message.payload)
                    break;
            }
        }

        function disconnectHandler() {
            if (unsubscribe) {
                unsubscribe();
            }
        }

        port.onMessage.addListener(messageHandler)
        port.onDisconnect.addListener(disconnectHandler)

        let message = {
            type: 'init',
            payload: store.getState(),
            meta: {
                self: port.sender,
            }
        }
        port.postMessage(message);

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
