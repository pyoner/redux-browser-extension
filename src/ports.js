let ports = [];

export function addPort(port) {
    ports.push(port);
}

export function removePort(port) {
    let i = ports.indexOf(port);
    if (i !== -1) {
        ports.splice(i, 1);
    }
}

export function getPortParents(port) {
    return ports
        .filter((p) => p !== port && p.sender.tab.id === port.sender.tab.id && p.sender.frameId < port.sender.frameId)
        .sort((a, b) => a.sender.frameId - b.sender.frameId)
}

export function copyPort(port) {
    return Object.assign({}, port, { name: port.name });
}

export default ports;
