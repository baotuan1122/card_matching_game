import { _decorator, Component, Node, Vec3, tween} from 'cc';
import { AudioManager } from './AudioManager';
import { PopupBase } from "./PopupBase";

const { ccclass, property } = _decorator;

@ccclass('SoundToggle')
export class SoundToggle extends Component {
    @property(Node)
    iconOn: Node = null;

    @property(Node)
    iconOff: Node = null;

    @property(Node)
    slideNode: Node = null;

    private isOpenSlider: boolean = false;
    private isSoundOn: boolean = true;

    start() {
        this.updateIcons();
    }

    toggleSound() {
        this.isSoundOn = !this.isSoundOn;

        if (AudioManager.instance && AudioManager.instance.audioSource) {
            AudioManager.instance.audioSource.volume = this.isSoundOn ? 1 : 0;
        }

        this.updateIcons();
    }

    toggleSlide() {
        this.isOpenSlider = !this.isOpenSlider;
    
        const targetScaleY = this.isOpenSlider ? 1 : 0;
    
        tween(this.slideNode)
            .to(0.25, { scale: new Vec3(1, targetScaleY, 1) }, {
                easing: 'quadOut'
            })
            .start();
    }

    private updateIcons() {
        this.iconOn.active = this.isSoundOn;
        this.iconOff.active = !this.isSoundOn;
    }

}