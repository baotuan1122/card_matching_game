import { _decorator, Component, Node} from 'cc';
import { GameManager } from './GameManager';
import { PopupBase } from "./PopupBase";

const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {

    @property(GameManager)
    gameManager: GameManager = null;

    @property(Node)
    info: Node = null; 

    showInfo(){
        if (!this.info) return;
        const popup = this.info.getComponent(PopupBase);
        console.log(popup)
        if (popup) {
            popup.show();
        }
    }
    
    hideInfo(){
        if (!this.info) return;
        const popup = this.info.getComponent(PopupBase);
        console.log(popup)
        if (popup) {
            popup.hide();
        }
    }

    onClick2x2() {
        this.gameManager.setGridSize(2, 2);
        this.hideInfo();
    }

    onClick3x3() {
        this.gameManager.setGridSize(3, 4);
        this.hideInfo();
    }

    onClick4x4() {
        this.gameManager.setGridSize(4, 4);
        this.hideInfo();
    }
}