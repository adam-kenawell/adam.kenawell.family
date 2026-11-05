export interface FrameInfo {
  w: number;
  h: number;
  count: number;
}

const SPRITE_BASE = 'https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite';

export function spriteUrl(pokemonId: number, action: string): string {
  const id = String(pokemonId).padStart(4, '0');
  return `${SPRITE_BASE}/${id}/${action}-Anim.png`;
}

function animDataUrl(pokemonId: number): string {
  const id = String(pokemonId).padStart(4, '0');
  return `${SPRITE_BASE}/${id}/AnimData.xml`;
}

export function loadImage(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export async function fetchAnimData(pokemonId: number): Promise<Record<string, { w: number; h: number }>> {
  try {
    const res = await fetch(animDataUrl(pokemonId));
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, 'text/xml');
    const anims = doc.querySelectorAll('Anim');
    const result: Record<string, { w: number; h: number }> = {};
    anims.forEach((el) => {
      const name = el.querySelector('Name')?.textContent ?? '';
      const w = parseInt(el.querySelector('FrameWidth')?.textContent ?? '0', 10);
      const h = parseInt(el.querySelector('FrameHeight')?.textContent ?? '0', 10);
      if (name && w > 0 && h > 0) {
        result[name] = { w, h };
      }
    });
    return result;
  } catch {
    return {};
  }
}

export function calcFrameInfo(img: HTMLImageElement, dims?: { w: number; h: number }): FrameInfo {
  if (dims && dims.w > 0 && dims.h > 0) {
    return {
      w: dims.w,
      h: dims.h,
      count: Math.max(1, Math.floor(img.naturalWidth / dims.w)),
    };
  }
  const size = Math.floor(img.naturalHeight / 8);
  return {
    w: size,
    h: size,
    count: Math.max(1, Math.floor(img.naturalWidth / size)),
  };
}

const WIDGET_ACTIONS = ['Walk', 'Idle', 'Attack', 'Sleep'] as const;
type WidgetAction = (typeof WIDGET_ACTIONS)[number];

interface SpriteWidgetInstance {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  sheets: Record<WidgetAction, HTMLImageElement | null>;
  frameInfo: Record<WidgetAction, FrameInfo | null>;
  frame: number;
  state: 'idle' | 'attacking';
  stateEnd: number;
  direction: number;
  nextFrameTime: number;
  scale: number;
}

let activeWidgets: SpriteWidgetInstance[] = [];
let widgetLoopRunning = false;

export function resetSpriteWidgets(): void {
  activeWidgets = [];
  widgetLoopRunning = false;
}

function startWidgetLoop(): void {
  if (widgetLoopRunning) return;
  widgetLoopRunning = true;

  function tick() {
    if (activeWidgets.length === 0) {
      widgetLoopRunning = false;
      return;
    }
    const now = performance.now();
    for (const w of activeWidgets) {
      const frameDuration = w.state === 'attacking' ? 80 : 150;
      if (now >= w.nextFrameTime) {
        w.nextFrameTime = now + frameDuration;
        const action: WidgetAction = w.state === 'attacking' ? 'Attack' : 'Idle';
        const sheet = w.sheets[action] || w.sheets.Idle || w.sheets.Walk;
        const info = w.frameInfo[action] || w.frameInfo.Idle || w.frameInfo.Walk;
        if (!sheet || !info) continue;

        const frameIdx = w.frame % info.count;
        w.ctx.clearRect(0, 0, w.canvas.width, w.canvas.height);
        w.ctx.imageSmoothingEnabled = false;
        const offsetX = Math.floor((w.canvas.width - info.w * w.scale) / 2);
        const offsetY = Math.floor((w.canvas.height - info.h * w.scale) / 2);
        w.ctx.drawImage(
          sheet,
          frameIdx * info.w,
          w.direction * info.h,
          info.w,
          info.h,
          offsetX,
          offsetY,
          info.w * w.scale,
          info.h * w.scale
        );
        w.frame++;
      }
      if (w.state === 'attacking' && now > w.stateEnd) {
        w.state = 'idle';
        w.frame = 0;
        w.nextFrameTime = 0;
      }
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

export async function createSpriteWidget(pokemonId: number, scale = 2): Promise<HTMLCanvasElement | null> {
  if (pokemonId <= 0) return null;
  const [animDims, walkImg, idleImg, attackImg, sleepImg] = await Promise.all([
    fetchAnimData(pokemonId),
    loadImage(spriteUrl(pokemonId, 'Walk')),
    loadImage(spriteUrl(pokemonId, 'Idle')),
    loadImage(spriteUrl(pokemonId, 'Attack')),
    loadImage(spriteUrl(pokemonId, 'Sleep')),
  ]);
  if (!walkImg && !idleImg) return null;

  const sheets: Record<WidgetAction, HTMLImageElement | null> = {
    Walk: walkImg,
    Idle: idleImg,
    Attack: attackImg,
    Sleep: sleepImg,
  };
  const frameInfo: Record<WidgetAction, FrameInfo | null> = {
    Walk: walkImg ? calcFrameInfo(walkImg, animDims.Walk) : null,
    Idle: idleImg ? calcFrameInfo(idleImg, animDims.Idle) : null,
    Attack: attackImg ? calcFrameInfo(attackImg, animDims.Attack) : null,
    Sleep: sleepImg ? calcFrameInfo(sleepImg, animDims.Sleep) : null,
  };

  let maxW = 0;
  let maxH = 0;
  for (const act of WIDGET_ACTIONS) {
    const info = frameInfo[act];
    if (info) {
      if (info.w > maxW) maxW = info.w;
      if (info.h > maxH) maxH = info.h;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = maxW * scale;
  canvas.height = maxH * scale;
  canvas.className = 'poke-sprite-canvas';
  canvas.style.imageRendering = 'pixelated';
  canvas.style.cursor = 'pointer';

  const ctx = canvas.getContext('2d')!;
  const widget: SpriteWidgetInstance = {
    canvas,
    ctx,
    sheets,
    frameInfo,
    frame: 0,
    state: 'idle',
    stateEnd: 0,
    direction: 0,
    nextFrameTime: 0,
    scale,
  };

  canvas.addEventListener('pointerdown', () => {
    const atkInfo = widget.frameInfo.Attack;
    if (widget.sheets.Attack && atkInfo) {
      widget.state = 'attacking';
      widget.frame = 0;
      widget.nextFrameTime = performance.now();
      widget.stateEnd = performance.now() + atkInfo.count * 80;
    }
  });

  activeWidgets.push(widget);
  startWidgetLoop();
  return canvas;
}
