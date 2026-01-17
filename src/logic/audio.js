class AudioService {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voice = null;
        this.isMuted = false;
        this.audioCtx = null;
        this.bgmOscillators = [];
        this.bgmGain = null;
        this.isPlayingBGM = false;
    }

    init() {
        // TTS Setup
        const loadVoices = () => {
            const voices = this.synth.getVoices();
            this.voice = voices.find(v => v.name.includes("Microsoft Zira") || v.name.includes("Google US English")) || voices[0];
        };
        this.synth.onvoiceschanged = loadVoices;
        loadVoices();

        // Web Audio Setup (User interaction usually required to resume)
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn("Web Audio API not supported");
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;

        if (this.isMuted) {
            this.stopBGM();
            this.synth.cancel();
        } else {
            // Resume context if needed
            if (this.audioCtx?.state === 'suspended') {
                this.audioCtx.resume();
            }
            this.startBGM();
        }
        return this.isMuted;
    }

    speak(text) {
        if (this.isMuted || !this.voice) return;
        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        this.synth.speak(utterance);
    }

    // --- SYNTHESIZER (BGM & SFX) ---

    startBGM() {
        if (this.isMuted || !this.audioCtx || this.isPlayingBGM) return;

        this.isPlayingBGM = true;
        this.bgmGain = this.audioCtx.createGain();
        this.bgmGain.gain.value = 0.1; // Increased volume for presence
        this.bgmGain.connect(this.audioCtx.destination);

        // Create a dark ambient drone using multiple oscillators
        const freqs = [55, 110, 165]; // A1, A2, E3 (Power chord-ish)

        freqs.forEach(freq => {
            const osc = this.audioCtx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
            osc.connect(this.bgmGain);
            osc.start();
            this.bgmOscillators.push(osc);
        });
    }

    stopBGM() {
        this.bgmOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) { }
        });
        this.bgmOscillators = [];
        this.isPlayingBGM = false;
    }

    playSFX(type) {
        if (this.isMuted || !this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        const time = this.audioCtx.currentTime;

        if (type === 'move') {
            // High tech "blip"
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, time);
            osc.frequency.exponentialRampToValueAtTime(1200, time + 0.1);
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            osc.start(time);
            osc.stop(time + 0.1);
        } else if (type === 'win') {
            // Victory Chord
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, time);
            osc.frequency.setValueAtTime(554, time + 0.2); // C#
            osc.frequency.setValueAtTime(659, time + 0.4); // E
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.linearRampToValueAtTime(0, time + 1.5);
            osc.start(time);
            osc.stop(time + 1.5);
        } else if (type === 'error') {
            // Low buzz
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, time);
            osc.frequency.linearRampToValueAtTime(50, time + 0.2);
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.linearRampToValueAtTime(0, time + 0.2);
            osc.start(time);
            osc.stop(time + 0.2);
        }
    }
} // End Class

export const audio = new AudioService();
