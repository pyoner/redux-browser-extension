function deleteKey(obj, key) {
    let nObj = Object.assign({}, obj);
    delete nObj[key];
    return nObj;
}

export function portReducer(state = {}, { type, payload: port }) {
    switch (type) {
        case 'EXTENSION_PORT_CONNECT':
            return Object.assign({}, state, {
                [port.name]: {}
            });
            break;
        case 'EXTENSION_PORT_DISCONNECT':
            return deleteKey(state, port.name);
            break;
    }
    return state;
}


function getTabTopFrame(port) {
    return port && port.sender && port.sender.frameId === 0 && port.sender.tab;
}

export function tabReducer(state = {}, { type, payload: port }) {
    let tab = getTabTopFrame(port);
    if (tab) {
        switch (type) {
            case 'EXTENSION_PORT_CONNECT':
                return Object.assign({}, state, {
                    [tab.id]: {}
                });
                break;
            case 'EXTENSION_PORT_DISCONNECT':
                return deleteKey(state, tab.id);
                break;
        }
    }
    return state;
}
