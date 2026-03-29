import { _decorator, Component, Node , Label} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScoreManager')
export class ScoreManager extends Component {
    static instance: ScoreManager;
    @property(Label)
    scoreLabel: Label = null;

    private score = 0;
    private turn = 0;

    onLoad() {
        ScoreManager.instance = this;
        this.updateUI();
    }

   addMatch() {
        this.score += 10;
        this.turn++;
        this.updateUI();
    }

    addFail() {
        this.score -= 5;
        if (this.score < 0) this.score = 0;
        this.turn++;
        this.updateUI();
    }

    getScore() {
        return this.score;
    }

    getTurn() {
        return this.turn;
    }

    reset() {
        this.score = 0;
        this.turn = 0;
        this.updateUI();
    }

    updateUI() {
        if (this.scoreLabel) {
            this.scoreLabel.string = `Score: ${this.score} | Turn: ${this.turn}`;
        }    
    }
}


