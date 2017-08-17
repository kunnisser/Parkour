import config from '../GameConfiger/config';
import initGame from '../InitGame/initGame';
import menuIcon from '../GUI/menuIcon';

class mainMenu extends Phaser.State {
    constructor () {
        super();
    }

    init (params) {
        this.fromPreload = params.param;
        this.overlay = params.overlay;
        this.picturesIndex = 0;
        this.clickedPicture = null;
        this.inputDown = !1;
        this.updateView = !1;
        this.startDragX = 0;
        this.wasDragged = !1;
    }

    create () {
        this.addGameMenu();
        this.initPicturesData();
        this.addPictures();
        this.updatePicturesView();
        this.initInput();
        this.resize();
        this.hideOverlay();
    }

    // 添加背景
    addGameMenu () {
        this.mainSpritebatch = this.world;
        this.gameBg = this.game.add.image(0, 0, 'backgrounds_1', 'BG_60000', this.mainSpritebatch);
        this.bgItem = this.game.add.image(0, 0, 'backgrounds_1', '_Items0000', this.mainSpritebatch);
        this.bgItem.anchor.set(.5);
        this.vignet = this.game.add.image(0, 0, 'backgrounds_1', '_Vignette0000', this.mainSpritebatch);
        this.vignet.anchor.set(.5);
    }

    // 注册input的onDown和onUp事件
    initInput () {
        this.game.input.onDown.add(this.onInputDown, this);
        this.game.input.onUp.add(this.onInputUp, this);
    }

    // 复制图片信息的json对象
    initPicturesData () {
        this.picturesData = JSON.parse(JSON.stringify(initGame.picturesConfig));
    }

    onInputDown () {
        this.inputDown = !0;
        this.wasDragged = !1;
        this.updateView = !0;
        this.startDragX = this.picturesGroup.position.x;
        this.picturesIndex = Math.abs(Math.round(this.picturesGroup.position.x / config.HALF_GAME_WIDTH - 1));
        this.picturesIndex = Phaser.Math.clamp(this.picturesIndex, 0, this.pictures.length - 1);
        this.clickedPicture = null;
        let currentPostion = this.game.input.activePointer.position;
        this.clickedPicture = this.getPictureUnderPoint(currentPostion.x, currentPostion.y);
    }

    onInputUp () {
        if (this.inputDown) {
            this.inputDown = !1;
            this.wasDragged === !1 && this.clickedPicture && this.onClickPicture(this.clickedPicture);
            this.onDragStop();
        }
    }

    // 添加一个图片组
    addPictures () {
        this.pictures = [];
        this.picturesGroup = this.game.add.group();
        this.picturesGroup.position.x = config.HALF_GAME_WIDTH;
        let originX = 0;
        this.picturesArr = this.picturesData['_configArray'];
        for (let pic of this.picturesArr) {
            let picIcon = new menuIcon(this.game, pic.key, pic);
            picIcon.position.set(originX, 0);
            this.picturesGroup.add(picIcon);
            this.pictures.push(picIcon);
            originX += config.HALF_GAME_WIDTH;
        }
        // 设定左右滚动的边界
        this.limitLeftX = (this.pictures.length - 1) * config.HALF_GAME_WIDTH * -1 + 0.33 * config.GAME_WIDTH;
        this.limitRightX = config.GAME_WIDTH - 0.66 * config.HALF_GAME_WIDTH;
    }

    // 根据point的当前x和落点x定位图片组
    dragPictures () {
        let point = this.game.input.activePointer;
        let distance = (point.x - point.positionDown.x) / config.WORLD_SCALE * 1.66;
        let disY = point.y - point.positionDown.y;
        let newX = this.startDragX + distance;
        newX = Phaser.Math.clamp(newX, this.limitLeftX, this.limitRightX);
        !1 === this.wasDragged && (Math.abs(distance) > 0 || Math.abs(disY)) && (this.wasDragged = !0);
        this.picturesGroup.position.x = newX;
    }

    // 滑动停止事件
    onDragStop () {
        let currentIndex = Math.abs(Math.round(this.picturesGroup.position.x / config.HALF_GAME_WIDTH) - 1);
        let currentX = (1 - currentIndex) * config.HALF_GAME_WIDTH;
        this.game.add.tween(this.picturesGroup.position).to({
            x: currentX
        }, 400, Phaser.Easing.Cubic.Out, !0).onComplete.addOnce(() => {
            this.inputDown || (this.updateView = !1);
        });
    }

    // 返回点击到的图片
    getPictureUnderPoint (x, y) {
        for (let p of this.pictures) {
            if (p.visible && p.getBounds().contains(x, y)) {
                return p;
            }
        }
    }

    // 注册点击图片事件
    onClickPicture (pic) {
        this.game.add.tween(pic.scale).to({
            x: 1.2,
            y: 1.2
        }, 1e3, Phaser.Easing.Elastic.Out, !0);
        pic.showWhiteFx.call(pic, 0);
        let index = this.pictures.indexOf(pic);
        let prevPic = this.pictures[index - 1];
        let nextPic = this.pictures[index + 1];
        prevPic && this.game.add.tween(prevPic.position).to({
            x: '-100'
        }, 200, Phaser.Easing.Cubic.Out, !0);
        nextPic && this.game.add.tween(nextPic.position).to({
            x: '+100'
        }, 200, Phaser.Easing.Cubic.Out, !0);
        this.game.time.events.add(400, this.gotoLinkDots, this, pic.pictureKey);
    }

    //根据图片组的当前x来更新组中成员的状态
    updatePicturesView () {
        for (let p of this.pictures) {
            let currentX = this.picturesGroup.position.x + p.x;
            let currentD = config.HALF_GAME_WIDTH - currentX;
            let currentD_ABS = Math.abs(config.HALF_GAME_WIDTH - currentX);
            if (currentD_ABS > (config.HALF_GAME_WIDTH + 100)) {
                p.visible = !1;
            } else {
                p.visible = !0;
                let scale = 1 - currentD_ABS / (config.HALF_GAME_WIDTH + 300);
                p.scale.set(scale);
                p.position.y = currentD_ABS / (config.HALF_GAME_WIDTH + 300) * 150;
                p.angle = currentD / (config.HALF_GAME_WIDTH + 300) * 40 * -1;
            }
        }
    }

    //进入下一场景linkDots
    gotoLinkDots () {
        this.game.changeState('linkDots', arguments[0]);
    }

    // 刷新事件
    update () {
        this.inputDown && this.dragPictures();
        this.updateView && this.updatePicturesView();
    }

    // 重置背景尺寸
    resizeBackground () {
        this.gameBg.width = config.GAME_WIDTH + 1;
        this.gameBg.height = config.GAME_HEIGHT + 1;
        this.bgItem.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT);
        this.bgItem.width = 0.9 * config.GAME_WIDTH;
        this.bgItem.height = 0.9 * config.GAME_HEIGHT;
        this.vignet.position.set(config.HALF_GAME_WIDTH, config.HALF_GAME_HEIGHT);
        this.vignet.width = 1.4 * config.GAME_WIDTH;
        this.vignet.height = 1.4 * config.GAME_HEIGHT;
    }

    resize () {
        this.resizeBackground();
        this.picturesGroup.position.y = config.GAME_HEIGHT * .47;
    }

    shutdown () {
        this.pictures = null;
    }

    // 隐藏转场遮罩层
    hideOverlay () {
        this.hideLayTween = this.game.add.tween(this.overlay).to({
            alpha: 0
        }, 400, Phaser.Easing.Cubic.Out, !0);
        this.hideLayTween.onComplete.addOnce(() => {
            this.overlay.visible = !1;
        });
    }
}

export default mainMenu;