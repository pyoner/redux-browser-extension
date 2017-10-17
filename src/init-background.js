import { getPortParents, addPort, removePort, copyPort } from './ports';

function initPortHandlers(storePromise, port) {
    storePromise.then((store) => {
        function subscribeHandler() {
            port.postMessage({
                type: 'MSG_REDUX_STATE_CHANGED',
                payload: store.getState(),
            });
        }

        function messageHandler(message) {
            switch (message.type) {
                case 'MSG_REDUX_DISPATCH':
                    //extend meta info
                    let meta = { meta: Object.assign({}, { port }, message.payload.meta) }
                    let action = Object.assign({}, message.payload, meta);
                    store.dispatch(action);
                    break;
            }
        }

        function disconnectHandler() {
            removePort(port);
            if (unsubscribe) {
                unsubscribe();
            }
            store.dispatch({
                type: 'EXTENSION_PORT_DISCONNECT',
                payload: port
            });
        }

        //on connect and store ready
        let parents = getPortParents(port);
        addPort(port);

        port.onMessage.addListener(messageHandler)
        port.onDisconnect.addListener(disconnectHandler)

        store.dispatch({
            type: 'EXTENSION_PORT_CONNECT',
            payload: port
        });

        port.postMessage({
            type: 'MSG_PORT_INIT_STORE',
            payload: store.getState(),
            meta: {
                port: copyPort(port),
                parents: parents.map(copyPort),
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
