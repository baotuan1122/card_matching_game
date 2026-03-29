import { _decorator, Component, tween, Vec3, UIOpacity, Node } from 'cc';
const { ccclass } = _decorator;

@ccclass('PopupBase')
export class PopupBase extends Component {

    show() {
        console.log('show')
        this.node.active = true;

        this.node.setScale(new Vec3(0.5, 0.5, 1));

        let opacity = this.getOpacity();
        opacity.opacity = 0;

        tween(this.node)
            .to(0.25, { scale: new Vec3(1, 1, 1) }, { easing: 'backOut' })
            .start();

        tween(opacity)
            .to(0.25, { opacity: 255 })
            .start();
    }

    hide() {
        let opacity = this.getOpacity();

        tween(this.node)
            .to(0.2, { scale: new Vec3(0.5, 0.5, 1) }, { easing: 'backIn' })
            .call(() => this.node.active = false)
            .start();

        tween(opacity)
            .to(0.2, { opacity: 0 })
            .start();
    }

    private getOpacity(): UIOpacity {
        let opacity = this.node.getComponent(UIOpacity);
        if (!opacity) {
            opacity = this.node.addComponent(UIOpacity);
        }
        return opacity;
    }
}