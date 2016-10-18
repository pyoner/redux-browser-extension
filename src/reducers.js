export function portReducer(state = {}, { payload: port }) {
    switch (state) {
        case 'EXTENSION_PORT_CONNECT':
            state[port.name] = {}
            break;
        case 'EXTENSION_PORT_DISCONNECT':
            delete state[port.name];
            break;
    }
    return state;
}

export function tabReducer(state = {}, { payload: port }) {
    let tab = port.sender.tab;
    if (tab && port.sender.frameId === 0) {
        switch (state) {
            case 'EXTENSION_PORT_CONNECT':
                state[tab.id] = {};
                break;
            case 'EXTENSION_PORT_DISCONNECT':
                delete state[tab.id];
                break;
        }
    }
    return state;
}
