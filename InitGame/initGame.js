/**
 * Created by kunnisser on 2017/8/2.
 * 初始化Game
 * */

import configCreate from '../GameConfiger/configCreator';
import boot from '../State/boot';
import preloader from '../State/preloader';

class initGame extends Phaser.Game{
    constructor () {
        let conf = configCreate.createConfig();
        super(conf);
        // 符合条件进入boot状态
        this.isAllowDomain() && this.checkIframe() && (
            this.state.add('boot', boot, !0),
                this.state.add('preloader', preloader, !1)
        );
    };

    // TODO: 检查当前host是否在设置条件内
    isAllowDomain () {
        let netHandle = new Phaser.Net(this),
            allowDomainArr = initGame.development ? ['192.168.0.185', 'localhost']
                : ['kuni.applinzi.com'];
        return allowDomainArr.some((u) => {
            return netHandle.checkDomainName(u);
        });
    }

    // TODO: 检查当前页面是否存在父框架
    checkIframe () {
        try {
            return window.self === window.top;
        } catch (e) {
            return !1;
        }
    }

    static development = !0;

    static isDesktop = !1;

    static isWeakDevice = !1;
}

export default initGame;