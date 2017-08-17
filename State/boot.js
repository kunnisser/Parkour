/**
 * Created by kunnisser on 2017/1/19 0019.
 * BOOT状态
 */

import initGame from '../InitGame/initGame';
import config from '../GameConfiger/config';
import stateTransition from '../Plugins/stateTransition';
import monobg from '../Plugins/monobg';

class boot extends Phaser.State {
    constructor () {
        super();
    }

    init () {
        // 设置设备信息
        initGame.isDesktop = this.game.device.desktop;
        this.gamescale = this.game.scale;
        let bootFont = {
            font: '20px GrilledCheeseBTNToasted',
            fill: 'white'
        },
            bootText = this.game.add.text(0, 0, 'preload font', bootFont);
        bootText.destroy();
    }

    preload () {
        this.load.atlasJSONHash('preloader', '/Parkour/assets/graphics/preloader.png', '/Parkour/assets/jsonHash/preloader.json');
    }

    create () {
        this.detectWeakDevice();
        this.setupScale();
        this.game.add.plugin(new stateTransition(this.game));
        this.game.add.plugin(new monobg(this.game));
        this.state.start('preloader', !0, !1);
    }

    // 判断陈旧的HostBrower
    detectWeakDevice () {
        if (Phaser.Device.isAndroidStockBrowser()) {
            initGame.isWeakDevice = !0;
            this.game.renderType = Phaser.CANVAS;
        }
    }

    // 缩放设置
    setupScale () {
       initGame.isDesktop ?
           this.scaleForDesktop() :
           (this.scaleForMobile(),
               this.isLandscape() && this.onEnterLandscape());
    }

    scaleForDesktop () {
        this.gamescale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // 保持比例缩放
        this.gamescale.aspectRatio = config.GAME_WIDTH / config.GAME_HEIGHT; // 设置对应的宽高比
        // canvas居中
        this.gamescale.pageAlignHorizontally = !0;
        this.gamescale.pageAlignVertically = !0;
    }

    scaleForMobile () {
        this.gamescale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.gamescale.forceOrientation(!1, !0); // 默认竖屏
        // 添加屏幕尺寸变化的callback
        this.gamescale.onSizeChange.add(this.onChangeSize, this);
    }

    isLandscape () {
        return window.innerWidth > window.innerHeight;
    }

    isPortrait () {
        return window.innerWidth < window.innerHeight;
    }

    onEnterLandscape () {
        document.getElementById('rotate').style.display = 'block';
    }

    onEnterPortrait () {
        document.getElementById('rotate').style.display = 'none';
    }

    onChangeSize () {
        this.isPortrait() ? (
            this.onEnterPortrait()
        ) : this.onEnterLandscape();
    }

}

export default boot;