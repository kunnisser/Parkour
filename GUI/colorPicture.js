import initGame from '../InitGame/initGame';
import revealLine from './revealLine';
import revealLineParticles from '../Particle/revealLineParticles';

class colorPicture extends Phaser.Group {
    constructor (game, world, config) {
        super(game, world);
        return this._onRevealLineHide = new Phaser.Signal(),
            this.pictureConfig = config,
            this.visible = !1,
            this.exists = !1,
            this.initRaysOffset(),
            this.addRays(),
            this.addColorPicture(),
            this.addWhitePicture(),
            this.addRevealLine(),
            this.onLevelComplete(),
            this;
    }

    get onRevealLineHide () {
        return this._onRevealLineHide;
    }

    get colorImage () {
        return this._colorPic;
    }

    // 初始光束位置
    initRaysOffset () {
        this.raysOffset = new Phaser.Point();
    }

    // 添加光束
    addRays () {
        this.backRays = this.game.add.image(this.raysOffset.x, this.raysOffset.y, this.pictureConfig.image.texture, 'Rays0000', this);
        this.backRays.anchor.set(.5);
        this.backRays.scale.set(.9);
        this.backRays.visible = !1;
        this.frontRays = this.game.add.image(this.raysOffset.x, this.raysOffset.y, this.pictureConfig.image.texture, 'Rays0000', this);
        this.frontRays.anchor.set(.5);
        this.frontRays.scale.set(.77);
        this.frontRays.angle = -43;
        this.frontRays.visible = !1;
    }

    // 添加picture
    addColorPicture () {
        let texture = this.pictureConfig.image.texture;
        let keyframe = this.pictureConfig.image.frame;
        this._colorPic = this.game.add.image(0, 0, texture, keyframe, this);
        this._colorPic.x = this._colorPic.width * .5 * -1;
        this._colorPic.y = this._colorPic.height * .5;
        this._colorPic.visible = !1;
    }

    addWhitePicture () {
        this.whitePic = this.game.add.image(0, 0, this._colorPic.key, this._colorPic.frameName, this);
        this.whitePic.blendMode = PIXI.blendModes.ADD;
        this.whitePic.x = this.whitePic.width * -.5;
        this.whitePic.y = this.whitePic.height * -.5;
        this.whitePic.visible = !1;
    }

    // 添加展示线
    addRevealLine () {
        initGame.isWeakDevice || (this.revealLineParticles = new revealLineParticles(this.game, this)),
        this.revealLine = new revealLine(this.game, 'link_the_dots', 'Reveal_Line0000'),
        this.revealLine.x = 0,
        this.revealLine.y = this.whitePic.height * .5,
        this.revealLine.width = 1.2 * this.whitePic.width,
        this.revealLine.visible = !1,
        this.add(this.revealLine);
    }

    onLevelComplete () {
        this.exists = !0;
        this.visible = !0;
        this._colorPic.visible = !0;
        this._colorPic.anchor.set(0, 1);
        this._colorPic.crop(new Phaser.Rectangle(0, this.whitePic.bottom, this.whitePic.width, 0), !1);
        this.revealLine.visible = !0;
        this.revealLine.y = this.whitePic.bottom + 10;
        this.game.add.tween(this.revealLine.scale).from({
            x: 0,
            y: 0
        }, 300, Phaser.Easing.Back.Out, !0).onComplete.addOnce(() => {
            this.game.add.tween(this.revealLine.scale).to({
                x: 0,
                y: 0
            }, 300, Phaser.Easing.Back.In, !0, 1200);
            this.game.add.tween(this.revealLine).to({
                y: this.whitePic.top - 10
            }, 1500, Phaser.Easing.Cubic.Out, !0).onUpdateCallback((tween, progress) => {
                progress < 0.9 && this.emitParticles(), // 缓动进行到90，停止发生粒子
                this._colorPic.cropRect.height = this.whitePic.bottom - this.revealLine.y,
                this._colorPic.cropRect.y = .5 * this.whitePic.height + this.revealLine.y,
                this._colorPic.updateCrop();
            });
        });
    }

    emitParticles () {
        if (this.revealLineParticles) {
            let offset = 10,
                leftBound = this.revealLine.left + offset,
                rightBound = this.revealLine.right - offset;
            this.revealLineParticles.emitParticle(2, leftBound, rightBound, this.revealLine.y);
        }
    }
}

export default colorPicture;