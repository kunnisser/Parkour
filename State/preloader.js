import config from '../GameConfiger/config';

class preloader extends Phaser.State {
    constructor () {
        super();
    }

    init () {
       this.addBackground();
       this.addPreloadBar();
       this.addLoadingInfo();
       this.addCompanyInfo();
       this.resize();
    }

    preload () {
        this.loadFontAssets();
        this.loadGraphics();
        this.load.setPreloadSprite(this.innerPreloaderSprite);
    }

    create () {

    }

    loadFontAssets () {
        this.load.bitmapFont('digits', '/Parkour/assets/fonts/font.png', '/Parkour/assets/fonts/font.fnt', null);
    }

    loadGraphics () {
        this.load.image('figure', '/Parkour/assets/graphics/figure.png');
        this.load.image('model', '/Parkour/assets/graphics/model.png');
        this.load.image('tutorial', '/Parkour/assets/graphics/tutorial.png');
        this.load.atlasJSONHash('main_menu', '/Parkour/assets/graphics/menu.png', "/Parkour/assets/jsonHash/menu.json");
        this.load.atlasJSONHash('plateform', '/Parkour/assets/graphics/plateform.png', "/Parkour/assets/jsonHash/plateform.json");
        this.load.atlasJSONHash('interface', '/Parkour/assets/graphics/interface.png', "/Parkour/assets/jsonHash/interface.json");
        this.load.atlasJSONHash('jiongDog', '/Parkour/assets/graphics/jiongDog.png', "/Parkour/assets/jsonHash/jiongDog.json");
    }

    addBackground () {
       this.bg = this.game.add.image(0, 0, 'preloader', 'Preloader_Background0000');
    }

    addPreloadBar () {
        this.outerPreloaderSprite = this.game.add.image(0, 0, 'preloader', 'Preloader_Outer0000');
        this.outerPreloaderSprite.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT);
        this.outerPreloaderSprite.anchor.set(.5);
        this.outerPreloaderSprite.angle = -90;
        this.innerPreloaderSprite = this.game.add.image(0, 0, 'preloader', 'Preloader_Inner0000');
        this.innerPreloaderSprite.angle = -90;
        this.innerPreloaderSprite.position.set(config.HALF_GAME_WIDTH - this.innerPreloaderSprite.height * .5,
            config.HALF_GAME_HEIGHT + this.innerPreloaderSprite.width * .5);
    }

    addLoadingInfo () {
        let loadingStyle = {
            font: '40px GrilledCheeseBTNToasted',
            fill: '#FFFFFF',
            align: 'center'
        };
        this.loadingText = this.game.add.text(0, 0, '', loadingStyle);
        this.loadingText.anchor.set(.5);
        this.loadingText.setShadow(2, 2, '#0C1829');
        this.loadingText.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT + this.outerPreloaderSprite.height);
        this.game.time.events.add(1, () => {
           this.loadingText.setText('loading...');
        });
    }

    addCompanyInfo () {

    }

    resizeBackground () {
        let natureW = this.bg.width / this.bg.scale.x,
            natureH = this.bg.height / this.bg.scale.y;
        this.bg.scale.set(config.GAME_WIDTH / natureW, config.GAME_HEIGHT / natureH);
    }

    resize () {
        this.resizeBackground();
    }
}

export default preloader;