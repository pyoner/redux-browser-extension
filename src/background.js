import initBackground from './init-background';
import { createStore } from 'redux';

function reducer(state = '', action) {
    switch (action.type) {
        case 'ping':
            return 'ping';
        case 'pong':
            return 'pong';
        default:
            return state;
    }
}
let store = createStore(reducer);
initBackground(store);

function ping() {
    store.dispatch({type: 'ping'});
}
store.subscribe(()=>{
    let state = store.getState();
    if (state == 'pong'){
        setTimeout(ping, 1000);
    }
    console.log(state)
})
ping()
