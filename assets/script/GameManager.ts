import { _decorator, Component, instantiate, Node, Prefab, SpriteFrame, tween, Vec3 } from 'cc';
import { cardView } from './cardView';
import { SoundType } from "./enum";
import { AudioManager } from "./AudioManager";
import { ScoreManager } from './ScoreManager';
import { FXManager } from './FXManager';
import { colorType } from "./enum";
import { PopupBase } from "./PopupBase";

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property
    rows: number = 4;
    @property
    cols: number = 5;

    @property(Node)
    cardNode: Node = null;

    @property(Prefab)
    cardPrefab: Prefab = null;

    @property([SpriteFrame])
    cardSprites: SpriteFrame[] = [];

    @property(SpriteFrame)
    cardBack: SpriteFrame = null;

    @property(Node)
    winPopup: Node = null; 

    private firstCard: cardView = null;
    private secondCard: cardView = null;
    private canClick: boolean = true;
    private matchedPairs = 0;

    start() {
        this.spawnCards();
    }

    spawnCards() {
        const spacingX = 70;
        const spacingY = 100;

        const startX = -(this.cols - 1) * spacingX / 2;
        const startY = (this.rows - 1) * spacingY / 2;

        const data = this.createCardData();

        let index = 0;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {

                const card = instantiate(this.cardPrefab);
                this.cardNode.addChild(card);

                const x = startX + col * spacingX;
                const y = startY - row * spacingY;
                            
                const targetPos = new Vec3(x, y, 0);
                const startPos = new Vec3(x, y + 550, 0);

                card.setScale(0.5, 0.5, 1);
                card.setPosition(startPos);

                tween(card)
                    .delay(index * 0.05)
                    .to(0.3, { position: targetPos }, { easing: 'bounceOut' })
                    .start();

                const cardScript = card.getComponent(cardView);

                const id = data[index];

                cardScript.init(
                    id,
                    this.cardSprites[id],
                    this.cardBack
                );

                card.on('CARD_CLICKED', this.onCardClicked, this);
                index++;
            }
        }
    }
 
    createCardData(): number[] {
        const totalCards = this.rows * this.cols;
    
        if (totalCards % 2 !== 0) {
            console.warn("Total cards should be even for pairs!");
        }
        const pairsNeeded = Math.floor(totalCards / 2); 
        let list: number[] = [];
        for (let i = 0; i < pairsNeeded; i++) {
            list.push(i);
            list.push(i);
        }
    
        return this.shuffle(list);
    }

    shuffle(array: number[]): number[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    onCardClicked(card: cardView) {
        if (!this.canClick) return; 
    
        if (!this.firstCard) {
            this.firstCard = card;
            card.flip();
            AudioManager.instance.play(SoundType.FLIP);
            return;
        }

        if (this.firstCard === card) return;
    
        this.secondCard = card;
    
        this.canClick = false; 
        card.flip();
        AudioManager.instance.play(SoundType.FLIP);

        this.checkMatch();
    }

    checkMatch() {
        const worldPos = this.firstCard.node.worldPosition;
        if (this.firstCard.getId() === this.secondCard.getId()) {
            this.matchedPairs++;
            ScoreManager.instance.addMatch();
            FXManager.instance.showScore(colorType.WIN, worldPos, true);
            this.resetTurn();
            this.canClick = true; 
            AudioManager.instance.play(SoundType.MATCH);
            if (this.matchedPairs >= (this.rows * this.cols) / 2) {
                this.showWinPopup();
            }
        } else {
            ScoreManager.instance.addFail();
            FXManager.instance.showScore(colorType.LOSE, worldPos, false);

            this.scheduleOnce(() => {
                AudioManager.instance.play(SoundType.FAIL);
                this.firstCard.flipBack();
                this.secondCard.flipBack();
    
                this.resetTurn();
                this.canClick = true; 
            }, 0.5);
        }
    }

    showWinPopup(){
        if (!this.winPopup) return;
        const popup = this.winPopup.getComponent(PopupBase);
        if (popup) {
            popup.show();
        }
    }

    resetGame() {
    if (this.winPopup) this.winPopup.active = false;
        ScoreManager.instance.reset();
        this.matchedPairs = 0;
        this.cardNode.removeAllChildren();
        this.spawnCards();
        this.canClick = true;
    }

    resetTurn() {
        this.firstCard = null;
        this.secondCard = null;
    }

    setGridSize(rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
    
        this.resetGame();
    }
}