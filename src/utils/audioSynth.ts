/**
 * VOODOO BOOMIN Web Audio Trap Synthesizer Engine
 * Synthesizes real-time high-fashion trap instrumentals with auditioning pitch & tempo controls.
 */

class TrapSynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentBeatId: string | null = null;
  private baseBpm: number = 140;
  private currentBpm: number = 140;
  private timerId: number | null = null;
  private currentStep: number = 0;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private volume: number = 0.8;
  private pitchShiftSemitones: number = 0; // -3 to +3
  private tempoMultiplier: number = 1.0; // 0.8 to 1.2
  private onTimeUpdateCallback: ((time: number, duration: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private playbackStartTime: number = 0;
  private beatDurationSeconds: number = 165;
  private audioTickTimer: number | null = null;

  private keyFreqs: { [key: string]: number[] } = {
    'C Minor': [130.81, 155.56, 196.00, 261.63],
    'F# Minor': [146.83, 174.61, 220.00, 293.66],
    'G Minor': [98.00, 116.54, 146.83, 196.00],
    'D Minor': [110.00, 130.81, 164.81, 220.00],
    'A# Minor': [116.54, 138.59, 174.61, 233.08],
    'E Minor': [82.41, 98.00, 123.47, 164.81],
  };

  private activeKey: string = 'F# Minor';

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setPitchShift(semitones: number) {
    this.pitchShiftSemitones = semitones;
  }

  public getPitchShift(): number {
    return this.pitchShiftSemitones;
  }

  public setTempoMultiplier(multiplier: number) {
    this.tempoMultiplier = multiplier;
    this.currentBpm = this.baseBpm * this.tempoMultiplier;
    if (this.isPlaying) {
      this.restartSequencerInterval();
    }
  }

  public getTempoMultiplier(): number {
    return this.tempoMultiplier;
  }

  private restartSequencerInterval() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
    }
    const stepTimeMs = (60 / this.currentBpm / 4) * 1000;
    this.timerId = window.setInterval(() => {
      this.step();
    }, stepTimeMs);
  }

  public playBeat(beatId: string, bpm: number = 140, key: string = 'F# Minor', durationSeconds: number = 165) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    if (this.isPlaying && this.currentBeatId === beatId) {
      return;
    }

    this.stopBeat();

    this.currentBeatId = beatId;
    this.baseBpm = bpm;
    this.currentBpm = bpm * this.tempoMultiplier;
    this.activeKey = key;
    this.beatDurationSeconds = durationSeconds;
    this.isPlaying = true;
    this.currentStep = 0;
    this.playbackStartTime = this.ctx.currentTime;

    this.restartSequencerInterval();

    this.audioTickTimer = window.setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      const elapsed = (this.ctx.currentTime - this.playbackStartTime) * this.tempoMultiplier;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(elapsed, this.beatDurationSeconds);
      }
      if (elapsed >= this.beatDurationSeconds) {
        this.stopBeat();
        if (this.onEndCallback) this.onEndCallback();
      }
    }, 200);
  }

  public pauseBeat() {
    this.stopSequencer();
    this.isPlaying = false;
  }

  public resumeBeat() {
    if (this.currentBeatId && !this.isPlaying) {
      this.isPlaying = true;
      this.restartSequencerInterval();
    }
  }

  public stopBeat() {
    this.stopSequencer();
    this.isPlaying = false;
    this.currentBeatId = null;
  }

  private stopSequencer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.audioTickTimer !== null) {
      clearInterval(this.audioTickTimer);
      this.audioTickTimer = null;
    }
  }

  public seek(seconds: number) {
    if (this.ctx) {
      this.playbackStartTime = this.ctx.currentTime - seconds / this.tempoMultiplier;
    }
  }

  public getCurrentState() {
    return {
      isPlaying: this.isPlaying,
      currentBeatId: this.currentBeatId,
      bpm: this.currentBpm,
      key: this.activeKey,
    };
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) return new Uint8Array(32);
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  public setCallbacks(
    onTimeUpdate: (time: number, duration: number) => void,
    onEnd: () => void
  ) {
    this.onTimeUpdateCallback = onTimeUpdate;
    this.onEndCallback = onEnd;
  }

  private step() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const t = this.ctx.currentTime;
    const s = this.currentStep % 16;

    if (s === 0 || s === 7 || s === 10) {
      this.play808Bass(t);
    }

    if (s === 4 || s === 12) {
      this.playTrapSnare(t);
    }

    if (s % 2 === 0 || s === 14 || s === 15) {
      this.playHiHat(t, s === 14 || s === 15);
    }

    if (s === 0 || s === 8) {
      this.playSynthChord(t);
    }

    this.currentStep++;
  }

  private getShiftedFreq(baseFreq: number): number {
    return baseFreq * Math.pow(2, this.pitchShiftSemitones / 12);
  }

  private play808Bass(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const freqs = this.keyFreqs[this.activeKey] || this.keyFreqs['C Minor'];
    const baseFreq = this.getShiftedFreq(freqs[0] / 2);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * 1.8, time);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, time + 0.09);

    gain.gain.setValueAtTime(0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.48);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.5);
  }

  private playTrapSnare(time: number) {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1300;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(time);
    whiteNoise.stop(time + 0.12);
  }

  private playHiHat(time: number, isRoll: boolean) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(8000, time);

    const dur = isRoll ? 0.02 : 0.04;
    const vol = isRoll ? 0.15 : 0.25;

    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + dur);
  }

  private playSynthChord(time: number) {
    if (!this.ctx || !this.masterGain) return;

    const chordNotes = this.keyFreqs[this.activeKey] || this.keyFreqs['C Minor'];

    chordNotes.slice(0, 3).forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const shifted = this.getShiftedFreq(freq);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(shifted, time);

      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.65);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.65);
    });
  }
}

export const audioSynth = new TrapSynthEngine();
