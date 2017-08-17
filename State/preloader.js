import config from '../GameConfiger/config';
import initGame from '../InitGame/initGame';
import picturesConfig from '../Util/picturesConfig';

class preloader extends Phaser.State {
    constructor () {
        super();
    }

    init () {
       this.addBackground();
       this.addBgItem();
       this.addPreloadBar();
       this.addLoadingInfo();
       this.addCompanyInfo();
       this.resize();
    }

    preload () {
        this.loadGameConfigs();
        this.loadFontAssets();
        this.loadGraphics();
        this.load.setPreloadSprite(this.innerPreloaderSprite);
    }

    create () {
        this.initPicturesConfig();
        this.game.changeState('mainMenu', !0);
    }

    loadGameConfigs () {
        this.load.json('pictures', '/Parkour/assets/jsonHash/pictures.json');
    }

    loadFontAssets () {
        this.load.bitmapFont('digits', '/Parkour/assets/fonts/font.png', '/Parkour/assets/fonts/font.fnt', null);
    }

    loadGraphics () {
        this.load.atlasJSONHash('backgrounds_1', '/Parkour/assets/graphics/backgrounds_1.png', "/Parkour/assets/jsonHash/backgrounds_1.json");
        this.load.atlasJSONHash('common', '/Parkour/assets/graphics/common.png', "/Parkour/assets/jsonHash/common.json");
        this.load.atlasJSONHash('pictures_1', '/Parkour/assets/graphics/pictures_1.png', "/Parkour/assets/jsonHash/pictures_1.json");
        this.load.atlasJSONHash('pictures_2', '/Parkour/assets/graphics/pictures_2.png', "/Parkour/assets/jsonHash/pictures_2.json");
        this.load.atlasJSONHash('link_the_dots', '/Parkour/assets/graphics/link_the_dots.png', "/Parkour/assets/jsonHash/link_the_dots.json");
    }

    addBackground () {
       this.bg = this.game.add.image(0, 0, 'preloader', 'BG0000');
    }

    addBgItem () {
        this.item = this.game.add.image(0, 0, 'preloader', 'BG_Items0000');
        this.item.anchor.set(.5);
        this.item.scale.set(1.33);
    }

    addPreloadBar () {
        this.outerPreloaderSprite = this.game.add.image(0, 0, 'preloader', 'Preloader_Back0000');
        this.outerPreloaderSprite.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT);
        this.outerPreloaderSprite.anchor.set(.5);
        this.innerPreloaderSprite = this.game.add.image(0, 0, 'preloader', 'Preloader_Front0000');
        this.innerPreloaderSprite.position.set(config.HALF_GAME_WIDTH - this.innerPreloaderSprite.width * .5 - 2,
            config.HALF_GAME_HEIGHT - this.innerPreloaderSprite.height * .5);
    }

    addLoadingInfo () {
        let loadingStyle = {
            font: '40px GrilledCheeseBTNToasted',
            fill: '#FFFFFF',
            align: 'center'
        };
        this.loadingText = this.game.add.text(0, 0, '', loadingStyle);
        this.loadingText.anchor.set(.5);
        this.loadingText.setShadow(4, 4, '#999');
        this.loadingText.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT + this.outerPreloaderSprite.height + 10);
        this.game.time.events.add(100, () => {
           this.loadingText.setText('loading...');
        });
    }

    loadUpdate () {
        this.loadingText.setText(this.load.progress + '%');
    }

    addCompanyInfo () {
        let info = '一站地网络科技\nwww.ezhandi.com , 2017';
        let style = {
          font: '26px Verdana',
          fill: '#FFFFFF',
          align: 'center'
        };
        this.copyright = this.game.add.text(0, 0, info, style);
        this.copyright.lineSpacing = 10;
        this.copyright.anchor.set(.5);
        this.copyright.position.set(config.HALF_GAME_WIDTH, config.GAME_HEIGHT - this.copyright.height);
        this.copyright.setShadow(2, 2, '#333');
    }

    initPicturesConfig () {
        initGame.picturesConfig = new picturesConfig(this.game);
    }

    resizeBackground () {
        this.bg.width = config.GAME_WIDTH + 1;
        this.bg.height = config.GAME_HEIGHT + 1;
    }

    resizeBgItem () {
        this.item.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT);
    }

    resize () {
        this.resizeBackground();
        this.resizeBgItem();
    }

    shutdown () {
        this.cache.removeImage('preloader', !0);
    }
}

export default preloader;