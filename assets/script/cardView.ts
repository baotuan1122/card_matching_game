import { _decorator, Component, Node, Sprite, SpriteFrame, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('cardView')
export class cardView extends Component {
    @property(Node)
    spriteNode: Node = null;
    @property(Sprite)
    sprite: Sprite = null;

    private front: SpriteFrame = null;
    private back: SpriteFrame = null;

    private isFlipped = false;
    private id = -1;

    init(id: number, front: SpriteFrame, back: SpriteFrame) {
        this.id = id;
        this.front = front;
        this.back = back;

        this.isFlipped = false;

        this.sprite.spriteFrame = this.back;
    }

    onLoad() {
        this.sprite.node.on(Node.EventType.TOUCH_START, this.onClick, this);
    }

    onClick() {
        if (this.isFlipped) return;
        // this.flip();
        this.node.emit('CARD_CLICKED', this);
    }

    flip() {
        this.isFlipped = true;
        tween(this.node)
            .to(0.15, { scale: new Vec3(0, 0.5, 1) })
            .call(() => {
                this.sprite.spriteFrame = this.front;
            })
            .to(0.15, { scale: new Vec3(0.5, 0.5, 1) })
            .start();
    }

    flipBack() {
        this.isFlipped = false;
        tween(this.node)
            .to(0.15, { scale: new Vec3(0, 0.5, 1) })
            .call(() => {
                this.sprite.spriteFrame = this.back;
            })
            .to(0.15, { scale: new Vec3(0.5, 0.5, 1) })
            .start();
    }

    getId() {
        return this.id;
    }
}