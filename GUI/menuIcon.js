
import initGame from "../InitGame/initGame";

class menuIcon extends Phaser.Group {
    constructor (game, key, pic) {
        super(game, null, 'picture_icon');
        return this._pictureKey = key,
            this._pictureConfig = pic,
            this.addPicture(),
            this.addWhite(),
            this;
    }

    get pictureKey () {
        return this._pictureKey;
    }

    get pictureConfig () {
        return this._pictureConfig;
    }

    addPicture () {
        let texture = this._pictureConfig.image.texture;
        let keyframe = this._pictureConfig.image.frame;
        this.picture = this.game.add.image(0, 0, texture, keyframe, this);
        this.picture.anchor.set(.5);
    }

    addWhite () {
        initGame.isWeakDevice || (this.white = this.game.add.image(0, 0, this.picture.key, this.picture.frameName, this),
        this.white.blendMode = PIXI.blendModes.ADD,
        this.white.anchor.set(.5),
        this.white.visible = !1);
    }

    showWhiteFx (delay) {
        this.white && (this.white.visible = !0, this.game.add.tween(this.white).from({
            alpha: 0
        }, 66, Phaser.Easing.Linear.None, !0, delay).onComplete.addOnce(() => {
            this.game.add.tween(this.white).to({
                alpha: 0
            }, 600, Phaser.Easing.Cubic.In, !0);
            })
        );
    }
}

export default menuIcon;