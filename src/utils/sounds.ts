// 音声ファイルを再生するためのユーティリティ
// 
// 使用方法:
// 1. public/sounds/ フォルダに以下のファイルを配置してください:
//    - block-add.mp3 (または .wav, .ogg): ブロック配置時の効果音
//    - block-remove.mp3 (または .wav, .ogg): ブロック削除時の効果音
//    - correct.mp3 (または .wav, .ogg): 正解時の効果音
//    - incorrect.mp3 (または .wav, .ogg): 不正解時の効果音
// 2. 音声ファイルが存在しない場合、自動的に生成音にフォールバックします

// 音声オブジェクトをキャッシュ（パフォーマンス向上のため）
const audioCache: { [key: string]: HTMLAudioElement } = {};

/**
 * 音声ファイルを再生するヘルパー関数（フォールバック付き）
 */
function playSoundFile(path: string, fallbackFn: () => void) {
  if (typeof window === "undefined") return;
  
  try {
    // キャッシュがあればそれを使用、なければ新規作成
    if (!audioCache[path]) {
      const audio = new Audio(path);
      audio.volume = 0.5; // 音量調整（0.0 ～ 1.0）
      
      // エラーハンドリング: ファイルが見つからない場合など
      audio.addEventListener('error', () => {
        // ファイルが見つからない場合はフォールバック
        fallbackFn();
      });
      
      audioCache[path] = audio;
    }
    
    // 音声を最初から再生
    const audio = audioCache[path];
    audio.currentTime = 0;
    audio.play().catch((error) => {
      // 自動再生がブロックされた場合など、エラー時はフォールバック
      fallbackFn();
    });
  } catch (error) {
    // エラー時はフォールバック
    fallbackFn();
  }
}

/**
 * Web Audio APIを使用してサウンドエフェクトを生成（フォールバック用）
 */
function playGeneratedAddSound() {
  if (typeof window === "undefined") return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 明るい高音（配置時）
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.type = "sine";
    
    // エンベロープ（音量の変化）
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch (error) {
    console.warn("Failed to play generated sound:", error);
  }
}

function playGeneratedRemoveSound() {
  if (typeof window === "undefined") return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 低めの音（削除時）
    oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4
    oscillator.type = "sine";
    
    // エンベロープ（音量の変化）
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch (error) {
    console.warn("Failed to play generated sound:", error);
  }
}

/**
 * 正解時の音を生成（フォールバック用）
 */
function playGeneratedCorrectSound() {
  if (typeof window === "undefined") return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.setValueAtTime(0.3, audioContext.currentTime);
    
    // 明るい和音（メジャーコード）を生成
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    const oscillators: OscillatorNode[] = [];
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(masterGain);
      
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
      oscillator.type = "sine";
      
      // エンベロープ（音量の変化）
      const delay = index * 0.05; // 少しずつずらして和音感を出す
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + delay + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + 0.3);
      
      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + 0.3);
      
      oscillators.push(oscillator);
    });
  } catch (error) {
    console.warn("Failed to play generated correct sound:", error);
  }
}

/**
 * 不正解時の音を生成（フォールバック用）
 */
function playGeneratedIncorrectSound() {
  if (typeof window === "undefined") return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 低めの音（不正解時）
    oscillator.frequency.setValueAtTime(220.00, audioContext.currentTime); // A3
    oscillator.type = "sawtooth"; // より硬い音色
    
    // エンベロープ（音量の変化）
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    console.warn("Failed to play generated incorrect sound:", error);
  }
}

/**
 * ブロックを配置したときの音を再生
 * 音声ファイルが存在する場合はそれを使用し、存在しない場合は生成音にフォールバック
 */
export function playBlockAddSound() {
  // 音声ファイルのパス（複数の拡張子を試す）
  // 優先順位: mp3 > wav > ogg
  const soundPath = "/sounds/block-add.mp3";
  
  // 音声ファイルを試す（失敗時は生成音にフォールバック）
  playSoundFile(soundPath, playGeneratedAddSound);
}

/**
 * ブロックを削除したときの音を再生
 * 音声ファイルが存在する場合はそれを使用し、存在しない場合は生成音にフォールバック
 */
export function playBlockRemoveSound() {
  // 音声ファイルのパス
  const soundPath = "/sounds/block-remove.mp3";
  
  // 音声ファイルを試す（失敗時は生成音にフォールバック）
  playSoundFile(soundPath, playGeneratedRemoveSound);
}

/**
 * 正解時の音を再生
 * 音声ファイルが存在する場合はそれを使用し、存在しない場合は生成音にフォールバック
 */
export function playCorrectSound() {
  const soundPath = "/sounds/correct.mp3";
  playSoundFile(soundPath, playGeneratedCorrectSound);
}

/**
 * 不正解時の音を再生
 * 音声ファイルが存在する場合はそれを使用し、存在しない場合は生成音にフォールバック
 */
export function playIncorrectSound() {
  const soundPath = "/sounds/incorrect.mp3";
  playSoundFile(soundPath, playGeneratedIncorrectSound);
}


