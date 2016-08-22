import connectToStore from './connect-to-store';

connectToStore((store)=>{
    function pong() {
        let state = store.getState();
        if (state == 'ping') {
            setTimeout(()=>store.dispatch({type: 'pong'}), 1000)
        }
        console.log(state)
    }
    store.subscribe(pong)
    pong();
})
