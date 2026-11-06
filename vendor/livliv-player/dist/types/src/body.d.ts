import { type ActionId } from './runtime/actions.js';
import { type Labels } from './runtime/format.js';
import { type Params } from './runtime/params.js';
import type { Driver, Host, View } from './index.js';
/** an expression a Body can show: `labels` its names by language (BCP 47 tag -> name), `label` the one to fall back on */
export interface BodyExpression {
    id: string;
    label: string;
    labels?: Labels;
}
/** one frame's pose, as a Body draws it: the params, the picture's move (x, y shares of the canvas, y up; s a scale)
 *  and each expression's weight (0..1, eased) */
export interface Pose {
    params: Params;
    move: {
        x: number;
        y: number;
        s: number;
    };
    expr: Record<string, number>;
}
export interface Body {
    /** what kind of character it draws ('png', 'vrm', ...): BodyInfo.format */
    readonly format: string;
    /** optional: called before load with the canvas it will draw on; throw if it cannot draw there (the canvas already has
     *  another kind of context), and load() rejects with that */
    attach?(canvas: HTMLCanvasElement): void;
    /** loads from its files (by file name); its name and the expressions it can show. If it rejects, the character before
     *  must stay as it is */
    load(files: Map<string, Blob>): Promise<{
        name: string;
        expressions: BodyExpression[];
        meta?: BodyMeta;
    }>;
    /** draws the pose into the canvas, w × h device pixels, dt seconds after the last frame */
    render(canvas: HTMLCanvasElement, pose: Pose, w: number, h: number, dt: number): void;
    /** where the head is, in shares of the canvas (from the top left) and its radii */
    head(): {
        x: number;
        y: number;
        rx: number;
        ry: number;
    };
    dispose(): void;
}
/** who made a body character and under what terms, as its file says */
export interface BodyMeta {
    author?: {
        name: string;
    } | null;
    license?: {
        id?: string;
        url?: string;
    } | null;
}
/** a loaded body character */
export interface BodyInfo {
    name: string;
    /** the Body's format: 'png', 'vrm', ... */
    format: string;
    /** what setExpression() takes (smile is always there: a param, not an expression) */
    expressions: {
        id: string;
        label: string;
        labels: Labels;
    }[];
    /** what the file says about itself, where it does: a VRM's author and terms (VrmTerms). null otherwise */
    meta: BodyMeta | null;
}
/** its files: a URL (one file, a .vrm say), a File / Blob, a FileList / File[], or a map or object of file name -> Blob
 *  or URL (`{ closed: 'me-closed.png', open: 'me-open.png' }`). Files are known by their name, without folders */
export type BodySource = string | URL | Blob | FileList | Iterable<File> | Map<string, Blob | string> | Record<string, Blob | string>;
export interface BodyPlayerOptions {
    /** move by itself: breathe, blink, sway, look around (default true) */
    idle?: boolean;
    /** the eyes and head follow the pointer anywhere on the page ('page', the default), over the canvas, or not */
    followPointer?: 'page' | 'canvas' | false;
    /** drawing-buffer pixels per CSS pixel at most (default 2) */
    maxPixelRatio?: number;
    /** start the frame loop at once (default true) */
    autoplay?: boolean;
    /** the language expression names are picked in (default the browser's) */
    lang?: string;
}
/** the most a body's files may hold in all (a VRM is usually 5-50 MB) */
export declare const BODY_LIMIT: number;
/** Plays a character a Body draws, with the API of Player where it applies (no mark, no `puppet`, no `view.head`) */
export declare class BodyPlayer implements Host {
    readonly canvas: HTMLCanvasElement;
    readonly body: Body;
    /** your values for the pose and face (ranges in PARAM_RANGES). The player never changes them */
    readonly params: Params;
    idle: boolean;
    followPointer: 'page' | 'canvas' | false;
    /** x, y move the character by shares of the canvas (y up), zoom scales it (`head` is not used) */
    readonly view: View;
    maxPixelRatio: number;
    readonly lang: string;
    private info;
    private pose;
    private idler;
    /** last frame's: a face tracker drove it, the mouth moved */
    private was;
    private actions;
    private drivers;
    private expr;
    private smile;
    private time;
    private raf;
    private last;
    private visible;
    private io?;
    private queue;
    private disposed;
    private frame;
    constructor(canvas: HTMLCanvasElement, body: Body, options?: BodyPlayerOptions);
    /** the loaded character (null before the first load) */
    get model(): BodyInfo | null;
    get expressions(): {
        id: string;
        label: string;
        labels: Labels;
    }[];
    get playing(): boolean;
    /** Loads a character from its files (see BodySource) in place of the one before (a failed load keeps it). Loads run one
     *  after another */
    load(source: BodySource): Promise<BodyInfo>;
    /** as Player's: an expression by id (smile is the smile param), easing over; null back to neutral */
    setExpression(id: string | null, weight?: number): boolean;
    act(action: ActionId): void;
    lookAt(x: number | null, y?: number): void;
    blink(): void;
    use(driver: Driver): () => void;
    play(): void;
    pause(): void;
    /** draws now at the canvas's current size */
    resize(): void;
    /** the current frame as a PNG data URL */
    snapshot(): string;
    dispose(): void;
    private draw;
    /** the body's head in the terms the idle's pointAt reads a puppet in (its canvas shares as clip space) */
    private seen;
    private onMove;
    private onLeave;
}
