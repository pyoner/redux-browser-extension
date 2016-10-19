import { createStore, combineReducers } from 'redux';

import initBackground from './init-background';
import { portReducer, tabReducer } from './reducers';

function reducer(state = '', action) {
    console.log(action);
    switch (action.type) {
        case 'ping':
            return 'ping';
        case 'pong':
            return 'pong';
        default:
            return state;
    }
}

const reducers = combineReducers({
    app: reducer,
    ports: portReducer,
    tabs: tabReducer,
});
let storePromise = new Promise((resolve, reject) => {
    let store = createStore(reducers);
    resolve(store);

    function ping() {
        store.dispatch({ type: 'ping' });
    }
    store.subscribe(() => {
        let state = store.getState();
        if (state.app == 'pong') {
            setTimeout(ping, 1000);
        }
        console.log(state)
    })
    ping()
})
initBackground(storePromise);
