import { _decorator, Component, AudioClip, AudioSource } from 'cc';
import { SoundType } from "./enum";
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {
    static instance: AudioManager;

    @property(AudioSource)
    audioSource: AudioSource = null;

    @property([AudioClip])
    clips: AudioClip[] = [];

    private soundMap: Map<string, AudioClip> = new Map();

    onLoad() {
        AudioManager.instance = this;
        this.soundMap.set(SoundType.FLIP, this.clips[0]);
        this.soundMap.set(SoundType.MATCH, this.clips[1]);
        this.soundMap.set(SoundType.FAIL, this.clips[2]);
        this.soundMap.set(SoundType.WIN, this.clips[3]);
    }

    play(sound: SoundType) {
        const clip = this.soundMap.get(sound);
        if (!clip) return;
    
        this.audioSource.playOneShot(clip);
    }
}