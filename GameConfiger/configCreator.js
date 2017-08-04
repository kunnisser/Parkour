/**
 * Created by kunnisser on 2017/8/2.
 * 配置game初始化参数
 */

import config from './config';

class configCreator {
    constructor () {};
    static createConfig () {
        let w = config.GAME_WIDTH,
            h = config.GAME_HEIGHT;
        return {
            width: w,
            height: h,
            renderer: Phaser.AUTO,
            antialias: !1
        };
    };
}

export default configCreator;