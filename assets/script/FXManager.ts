import { _decorator, Component, Sprite, SpriteFrame,Prefab ,Node, Label, tween, Vec3, instantiate, Color, UITransform, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FXManager')
export class FXManager extends Component {
    static instance: FXManager;

    @property(Node)
    canvas: Node = null;

    @property(Prefab)
    textPrefab: Prefab = null;

    @property(Prefab)
    particlePrefab: Prefab = null; 
    
    onLoad() {
        FXManager.instance = this;
    }

    showScore(text: string, worldPos: Vec3, isPositive: boolean = true) {
        if (!this.canvas || !this.textPrefab) return;
    
        const fx = instantiate(this.textPrefab);
        this.canvas.addChild(fx);
    
        const canvasTransform = this.canvas.getComponent(UITransform);
        const localPos = canvasTransform?.convertToNodeSpaceAR(worldPos) || new Vec3();
        fx.setPosition(localPos);
    
        const label = fx.getComponentInChildren(Label);
        if (!label) {
            return;
        }
    
        label.string = text;
        label.color = isPositive ? Color.GREEN : Color.RED;
    
        let opacityComp = fx.getComponent(UIOpacity);
        if (!opacityComp) opacityComp = fx.addComponent(UIOpacity);
        opacityComp.opacity = 255;
    
        tween(fx)
            .to(0.8, { position: new Vec3(localPos.x, localPos.y + 50, 0) })
            .start();
    
        tween(opacityComp)
            .to(0.8, { opacity: 0 })
            .call(() => fx.destroy())
            .start();
        this.spawnParticleBurst(localPos, isPositive);
    }

    spawnParticleBurst(centerPos: Vec3, isPositive: boolean) {
        if (!this.canvas || !this.particlePrefab) return;
        if(!isPositive) return;

        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const particle = instantiate(this.particlePrefab); 
            this.canvas.addChild(particle);
            particle.setPosition(centerPos);
    
            const scale = Math.random() * 0.6 + 0.4;
            particle.setScale(new Vec3(scale, scale, 1));
    
            const angle = Math.random() * Math.PI * 2;
            const distance = 60 + Math.random() * 60;
            const targetPos = new Vec3(
                centerPos.x + Math.cos(angle) * distance,
                centerPos.y + Math.sin(angle) * distance,
                0
            );
    
            const opacityComp = particle.getComponent(UIOpacity) || particle.addComponent(UIOpacity);
            opacityComp.opacity = 255;
    
            tween(particle).to(0.8, { position: targetPos }).start();
            tween(opacityComp).to(0.8, { opacity: 0 }).call(() => particle.destroy()).start();
        }
    }
}