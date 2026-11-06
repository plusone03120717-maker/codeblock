import { type ActionId } from './runtime/actions.js';
import { type Labels, type ModelMeta } from './runtime/format.js';
import { FORMAT, FORMAT_VERSION, LEGACY_FORMAT, PARAM_RANGES, Puppet, defaultParams, type ModelDef, type Params } from './runtime/puppet.js';
export { FORMAT, FORMAT_VERSION, LEGACY_FORMAT, PARAM_RANGES, defaultParams };
export type { ActionId, Labels, ModelDef, ModelMeta, Params };
/** this package's version */
export declare const VERSION = "0.2.1";
/** where a model comes from: the URL of its model.json, of the folder holding it, or of a .livliv package (relative URLs
 *  resolve against the page); a .livliv package itself (a File or Blob: a ZIP of the folder); or its files: a FileList /
 *  File[] from an <input type="file"> (a folder with webkitdirectory, or one picked .livliv), or a map of path -> Blob */
export type ModelSource = string | URL | Blob | FileList | Iterable<File> | Map<string, Blob> | Record<string, Blob>;
export interface PlayerOptions {
    /** move by itself: breathe, blink, sway, look around (default true). Off: only your params and drivers move it */
    idle?: boolean;
    /** the eyes and head follow the pointer anywhere on the page ('page', the default), only over the canvas
     *  ('canvas'), or not at all (false) */
    followPointer?: 'page' | 'canvas' | false;
    /** drawing-buffer pixels per CSS pixel at most (default 2; 1 saves power on high-DPI screens) */
    maxPixelRatio?: number;
    /** start the frame loop at once (default true) */
    autoplay?: boolean;
    /** the language expression names are picked in (`expressions[].label`; a BCP 47 tag, default the browser's) */
    lang?: string;
}
export interface ModelInfo {
    name: string;
    /** model.json's format: FORMAT ("livliv-model"), or LEGACY_FORMAT ("livemaker-puppet") for packages exported before v4 */
    format: string;
    /** its version (FORMAT_VERSION is the newest this player reads; a legacy package is 3) */
    version: number;
    /** the size the character was drawn at, in pixels */
    size: [number, number];
    /** what setExpression() takes: `id` (smile, shy, angry ... mean the same on every model; x_… is the model's own),
     *  `label` its name in the player's language, `labels` every language's (BCP 47 tag -> name) */
    expressions: {
        id: string;
        label: string;
        labels: Labels;
    }[];
    /** the mark drawn over the character: "LivLiv" (the free plan's), the owner's own text, or null */
    watermark: string | null;
    /** v4 packages: who made it (author), the terms it comes under (license), what wrote it and when; null before v4 */
    meta: ModelMeta | null;
}
/** where the character sits in the canvas: x, y move it by shares of the canvas (y up), zoom scales it about the
 *  center; head: frame the head instead of the whole drawing (avatars, chat bubbles) */
export interface View {
    x: number;
    y: number;
    zoom: number;
    head: boolean;
}
/** one frame being put together, as a driver sees it */
export interface Frame {
    /** the pose so far: write to it (for this frame only) */
    readonly params: Params;
    /** seconds since the last frame, and since the model loaded */
    readonly dt: number;
    readonly time: number;
    /** a face tracker drives the head this frame (lip sync then leaves the head alone) */
    tracked: boolean;
    /** add to params, kept in their ranges */
    add(offsets: Partial<Params>): void;
    /** move the picture: x, y shares of the canvas (y up), s a scale */
    readonly move: {
        x: number;
        y: number;
        s: number;
    };
}
/** something that moves the character each frame: face tracking and lip sync are drivers, and your own code can be */
export interface Driver {
    /** lower runs first: face tracking -10, yours 0 (default), lip sync 10 */
    order?: number;
    update(frame: Frame, player: Host): void;
    /** called when it is removed, or the player disposed */
    dispose?(): void;
}
/** what a driver, the lip sync and the face tracking need of a player: a Player, or a BodyPlayer (@livliv/player/body) */
export interface Host {
    /** adds a driver; returns a function that removes it */
    use(driver: Driver): () => void;
    /** blinks now (with the idle motion on) */
    blink(): void;
}
/** Plays one LivLiv model on a canvas. Size the canvas with CSS; the drawing follows its size. */
export declare class Player implements Host {
    readonly canvas: HTMLCanvasElement;
    /** the renderer underneath, for what this API does not cover. Its fields can change between versions */
    readonly puppet: Puppet;
    /** your values for the pose and face (ranges in PARAM_RANGES). The player never changes them */
    readonly params: Params;
    /** see PlayerOptions.idle */
    idle: boolean;
    /** see PlayerOptions.followPointer */
    followPointer: 'page' | 'canvas' | false;
    readonly view: View;
    /** see PlayerOptions.lang */
    readonly lang: string;
    private info;
    private mark;
    private idler;
    /** last frame's: a face tracker drove it, the mouth moved (the idle starts no move while the character talks) */
    private was;
    private actions;
    private drivers;
    private expr;
    private smile;
    private raf;
    private last;
    private visible;
    private io?;
    private queue;
    private disposed;
    private frame;
    /** Whether this browser can play a LivLiv model (WebGL2 starts on a new canvas). Where it cannot, new Player() throws */
    static isSupported(): boolean;
    constructor(canvas: HTMLCanvasElement, options?: PlayerOptions);
    /** the loaded model (null before the first load) */
    get model(): ModelInfo | null;
    get expressions(): {
        id: string;
        label: string;
        labels: Labels;
    }[];
    get playing(): boolean;
    /** Loads a model (see ModelSource) and shows it in place of the one before. Loads run one after another */
    load(source: ModelSource): Promise<ModelInfo>;
    private loadNow;
    /** Shows an expression (an id from `expressions`), easing over from the one before; null goes back to neutral.
     *  weight: how strongly, 0..1. False when the model has no such expression */
    setExpression(id: string | null, weight?: number): boolean;
    /** Plays a short move over whatever drives the character: nod, shake, tilt, hop, shy. 'away' toggles a dozing pose */
    act(action: ActionId): void;
    /** Looks toward (x, y), each -1..1 from the canvas center (y up), instead of following the pointer; null goes back to
     *  following it. Needs the idle motion on */
    lookAt(x: number | null, y?: number): void;
    /** Blinks now (with the idle motion on) */
    blink(): void;
    /** Adds a driver; returns a function that removes it. On a disposed player it is disposed at once: what started
     *  while the player went (a camera, a microphone) does not stay on */
    use(driver: Driver): () => void;
    play(): void;
    pause(): void;
    /** Draws now at the canvas's current size. A playing player follows the size by itself; call this after resizing a
     *  paused one */
    resize(): void;
    /** The current frame as an image (PNG data URL), the mark included */
    snapshot(): string;
    /** Stops, removes the drivers and frees the GPU memory. A load still running rejects. The canvas can take a new Player
     *  afterwards */
    dispose(): void;
    private draw;
    private onMove;
    private onLeave;
}
