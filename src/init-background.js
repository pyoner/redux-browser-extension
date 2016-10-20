let ports = [];

function removePort(port) {
    let i = ports.indexOf(port);
    if (i !== -1) {
        ports.splice(i, 1);
    }
}

function getPortParents(port) {
    return ports
        .filter((p) => p !== port && p.sender.tab.id === port.sender.tab.id)
        .sort((a, b) => a.sender.frameId - b.sender.frameId)
}

function copyPort(port){
    return Object.assign({}, port, {name: port.name});
}

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
                    let meta = { meta: { port } }
                    let action = Object.assign({}, meta, message.payload);
                    store.dispatch(action);
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

        //on connect and store ready
        let parents = getPortParents(port);
        ports.push(port);

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
