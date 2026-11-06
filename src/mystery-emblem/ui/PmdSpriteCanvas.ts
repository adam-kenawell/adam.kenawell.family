/**
 * Crisp `image-rendering: pixelated` 8-Directional Map Sprite & Emotion Portrait Renderers (Step 2)
 */

import {
  loadSpeciesPortrait,
  loadSpeciesSpriteBundle,
  type LoadedActionAnimation,
  type LoadedPortraitAsset,
  type LoadedSpriteBundle,
  type PmdDirection,
  type PmdPortraitEmotion,
  type PmdSpriteAction,
} from '../assets/pmdAssetLoader';
import { bindPointerTap } from './pointerControls';

export interface PmdSpriteActorOptions {
  speciesIdOrAssetId: string;
  scale?: number;
  initialAction?: PmdSpriteAction;
  initialDirection?: PmdDirection;
  /** Optional fixed logical canvas box (e.g., 48x48); if omitted, sizes to `maxFrameWidth * scale` */
  fixedBoxPx?: { width: number; height: number };
  /** When true, tapping the sprite triggers a one-shot `Attack` animation */
  interactiveTapAttack?: boolean;
  testId?: string;
}

export interface PmdSpriteActorSnapshot {
  speciesId: string | undefined;
  pmdAssetId: string;
  action: PmdSpriteAction;
  direction: PmdDirection;
  frameIndex: number;
  xmlAnimName: string;
  sheetName: string;
  sourceUrl: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  rowCount: number;
  scale: number;
  imageSmoothingEnabled: boolean;
  synthesizedFallback: boolean;
}

const activeActors = new Set<PmdSpriteActor>();
let actorRafRunning = false;

function ensureActorLoop(): void {
  if (actorRafRunning) return;
  actorRafRunning = true;

  const step = (now: number) => {
    if (activeActors.size === 0) {
      actorRafRunning = false;
      return;
    }
    for (const actor of activeActors) {
      actor.tick(now);
    }
    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

export function destroyAllPmdSpriteActors(): void {
  for (const actor of [...activeActors]) {
    actor.destroy();
  }
  activeActors.clear();
  actorRafRunning = false;
}

export class PmdSpriteActor {
  public readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private bundle: LoadedSpriteBundle | null = null;
  private currentTarget: string;
  private action: PmdSpriteAction;
  private direction: PmdDirection;
  private scale: number;
  private readonly fixedBoxPx?: { width: number; height: number };
  private frameIndex = 0;
  private nextFrameAt = 0;
  private loopCurrentAction = true;
  private onOneShotComplete: (() => void) | null = null;
  private loadToken = 0;
  private destroyed = false;
  private readonly tapAbort = new AbortController();

  constructor(options: PmdSpriteActorOptions) {
    this.currentTarget = options.speciesIdOrAssetId;
    this.action = options.initialAction ?? 'Idle';
    this.direction = options.initialDirection ?? 0;
    this.scale = options.scale ?? 2;
    this.fixedBoxPx = options.fixedBoxPx;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'pmd-sprite-canvas pmd-pixelated';
    this.canvas.style.imageRendering = 'pixelated';
    if (options.testId) {
      this.canvas.dataset.testid = options.testId;
    }
    if (this.fixedBoxPx) {
      this.canvas.width = this.fixedBoxPx.width;
      this.canvas.height = this.fixedBoxPx.height;
    } else {
      this.canvas.width = 32 * this.scale;
      this.canvas.height = 32 * this.scale;
    }

    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;

    if (options.interactiveTapAttack) {
      this.canvas.style.cursor = 'pointer';
      bindPointerTap(
        this.canvas,
        () => {
          this.setAction('Attack', {
            loop: false,
            onComplete: () => this.setAction('Idle', { loop: true }),
          });
        },
        { signal: this.tapAbort.signal, stopPropagation: true }
      );
    }

    activeActors.add(this);
    ensureActorLoop();
  }

  public async ready(): Promise<this> {
    await this.setSpecies(this.currentTarget);
    return this;
  }

  public async setSpecies(speciesIdOrAssetId: string): Promise<LoadedSpriteBundle | null> {
    if (this.destroyed) return null;
    this.currentTarget = speciesIdOrAssetId;
    const token = ++this.loadToken;
    const loaded = await loadSpeciesSpriteBundle(speciesIdOrAssetId);
    if (this.destroyed || token !== this.loadToken) {
      return null;
    }

    this.bundle = loaded;
    if (!this.fixedBoxPx) {
      this.canvas.width = Math.max(16, loaded.maxFrameWidth * this.scale);
      this.canvas.height = Math.max(16, loaded.maxFrameHeight * this.scale);
    }
    this.ctx.imageSmoothingEnabled = false;
    this.frameIndex = 0;
    this.nextFrameAt = performance.now() + this.getCurrentFrameDuration();
    this.syncDataset();
    this.drawCurrentFrame();
    return loaded;
  }

  public setAction(
    action: PmdSpriteAction,
    opts?: { loop?: boolean; onComplete?: () => void }
  ): void {
    this.action = action;
    this.loopCurrentAction = opts?.loop ?? true;
    this.onOneShotComplete = opts?.onComplete ?? null;
    this.frameIndex = 0;
    this.nextFrameAt = performance.now() + this.getCurrentFrameDuration();
    this.syncDataset();
    this.drawCurrentFrame();
  }

  public setDirection(direction: PmdDirection): void {
    this.direction = direction;
    this.syncDataset();
    this.drawCurrentFrame();
  }

  public setScale(scale: number): void {
    this.scale = Math.max(1, Math.floor(scale));
    if (this.bundle && !this.fixedBoxPx) {
      this.canvas.width = Math.max(16, this.bundle.maxFrameWidth * this.scale);
      this.canvas.height = Math.max(16, this.bundle.maxFrameHeight * this.scale);
    }
    this.ctx.imageSmoothingEnabled = false;
    this.drawCurrentFrame();
  }

  public tick(now: number): void {
    if (this.destroyed || !this.bundle) return;
    if (!this.canvas.isConnected && this.nextFrameAt > 0) {
      // Pause off-DOM frame advancement unless explicitly queried
    }
    if (now < this.nextFrameAt) return;

    const anim = this.getCurrentAnim();
    if (!anim) return;

    const nextIdx = this.frameIndex + 1;
    if (nextIdx >= anim.frameCount) {
      if (!this.loopCurrentAction) {
        const cb = this.onOneShotComplete;
        this.onOneShotComplete = null;
        this.loopCurrentAction = true;
        if (cb) {
          cb();
          return;
        }
      }
      this.frameIndex = 0;
    } else {
      this.frameIndex = nextIdx;
    }

    this.nextFrameAt = now + this.getCurrentFrameDuration();
    this.drawCurrentFrame();
  }

  public getSnapshot(): PmdSpriteActorSnapshot | null {
    const anim = this.getCurrentAnim();
    if (!this.bundle || !anim) return null;
    return {
      speciesId: this.bundle.speciesId,
      pmdAssetId: this.bundle.pmdAssetId,
      action: this.action,
      direction: this.direction,
      frameIndex: this.frameIndex,
      xmlAnimName: anim.xmlAnimName,
      sheetName: anim.sheetName,
      sourceUrl: anim.sourceUrl,
      frameWidth: anim.frameWidth,
      frameHeight: anim.frameHeight,
      frameCount: anim.frameCount,
      rowCount: anim.rowCount,
      scale: this.scale,
      imageSmoothingEnabled: this.ctx.imageSmoothingEnabled,
      synthesizedFallback: anim.synthesizedFallback,
    };
  }

  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.tapAbort.abort();
    activeActors.delete(this);
  }

  private getCurrentAnim(): LoadedActionAnimation | null {
    if (!this.bundle) return null;
    return this.bundle.actions[this.action] ?? this.bundle.actions.Idle;
  }

  private getCurrentFrameDuration(): number {
    const anim = this.getCurrentAnim();
    if (!anim) return 140;
    return anim.durationsMs[this.frameIndex % anim.durationsMs.length] ?? 140;
  }

  private syncDataset(): void {
    const anim = this.getCurrentAnim();
    this.canvas.dataset.speciesId = this.bundle?.speciesId ?? '';
    this.canvas.dataset.pmdAssetId = this.bundle?.pmdAssetId ?? '';
    this.canvas.dataset.action = this.action;
    this.canvas.dataset.direction = String(this.direction);
    this.canvas.dataset.sheetName = anim?.sheetName ?? '';
    this.canvas.dataset.xmlAnimName = anim?.xmlAnimName ?? '';
  }

  private drawCurrentFrame(): void {
    const anim = this.getCurrentAnim();
    if (!anim) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.imageSmoothingEnabled = false;

    const frameIdx = this.frameIndex % Math.max(1, anim.frameCount);
    const rowIdx = anim.rowCount >= 8 ? this.direction : this.direction % anim.rowCount;

    // Maintain consistent uniform pixel scale across all actions of this Pokémon
    const destW = anim.frameWidth * this.scale;
    const destH = anim.frameHeight * this.scale;
    const offsetX = Math.floor((this.canvas.width - destW) / 2);
    const offsetY = Math.floor((this.canvas.height - destH) / 2);

    this.ctx.drawImage(
      anim.source,
      frameIdx * anim.frameWidth,
      rowIdx * anim.frameHeight,
      anim.frameWidth,
      anim.frameHeight,
      offsetX,
      offsetY,
      destW,
      destH
    );
  }
}

export interface PmdPortraitViewOptions {
  pixelScale?: number;
  testId?: string;
}

export interface SetPortraitParams {
  speciesIdOrAssetId: string;
  emotion: PmdPortraitEmotion;
  mirrorHorizontal?: boolean;
}

export class PmdPortraitView {
  public readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly pixelScale: number;
  private loadToken = 0;
  private lastAsset: LoadedPortraitAsset | null = null;
  private mirrored = false;

  constructor(options: PmdPortraitViewOptions = {}) {
    this.pixelScale = options.pixelScale ?? 2;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 40 * this.pixelScale;
    this.canvas.height = 40 * this.pixelScale;
    this.canvas.className = 'pmd-portrait-canvas pmd-pixelated';
    this.canvas.style.imageRendering = 'pixelated';
    if (options.testId) {
      this.canvas.dataset.testid = options.testId;
    }

    this.ctx = this.canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = false;
  }

  public async setPortrait(params: SetPortraitParams): Promise<LoadedPortraitAsset | null> {
    const token = ++this.loadToken;
    const asset = await loadSpeciesPortrait(params.speciesIdOrAssetId, params.emotion);
    if (token !== this.loadToken) return null;

    this.lastAsset = asset;
    this.mirrored = Boolean(params.mirrorHorizontal);

    this.canvas.dataset.speciesId = asset.speciesId ?? '';
    this.canvas.dataset.pmdAssetId = asset.pmdAssetId;
    this.canvas.dataset.requestedEmotion = asset.requestedEmotion;
    this.canvas.dataset.resolvedEmotion = asset.resolvedEmotion;
    this.canvas.dataset.mirrored = String(this.mirrored);
    this.canvas.dataset.sourceUrl = asset.sourceUrl;

    this.redraw();
    return asset;
  }

  public setMirrored(mirrorHorizontal: boolean): void {
    this.mirrored = mirrorHorizontal;
    this.canvas.dataset.mirrored = String(this.mirrored);
    this.redraw();
  }

  public getSnapshot(): {
    pmdAssetId: string;
    speciesId?: string;
    requestedEmotion: PmdPortraitEmotion;
    resolvedEmotion: PmdPortraitEmotion;
    mirrored: boolean;
    sourceUrl: string;
    imageSmoothingEnabled: boolean;
  } | null {
    if (!this.lastAsset) return null;
    return {
      pmdAssetId: this.lastAsset.pmdAssetId,
      speciesId: this.lastAsset.speciesId,
      requestedEmotion: this.lastAsset.requestedEmotion,
      resolvedEmotion: this.lastAsset.resolvedEmotion,
      mirrored: this.mirrored,
      sourceUrl: this.lastAsset.sourceUrl,
      imageSmoothingEnabled: this.ctx.imageSmoothingEnabled,
    };
  }

  private redraw(): void {
    if (!this.lastAsset) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);
    this.ctx.imageSmoothingEnabled = false;

    this.ctx.save();
    if (this.mirrored) {
      this.ctx.translate(w, 0);
      this.ctx.scale(-1, 1);
    }
    this.ctx.drawImage(
      this.lastAsset.source,
      0,
      0,
      this.lastAsset.width,
      this.lastAsset.height,
      0,
      0,
      w,
      h
    );
    this.ctx.restore();
  }
}
