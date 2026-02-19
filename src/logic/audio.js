// XO Arena - Audio Service (disabled)

class AudioService {
    constructor() {
        this.isMuted = true;
    }

    init() {}
    toggleMute() { return this.isMuted; }
    speak() {}
    startBGM() {}
    stopBGM() {}
    playSFX() {}
}

export const audio = new AudioService();
