import Game from './InitGame/initGame';

let init = () => {
    new Game();
}

window.onload = init.call(this);