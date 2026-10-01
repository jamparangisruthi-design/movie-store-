// WebRTC and Browser Screen Capture API integration service

export class WebRTCManager {
  constructor() {
    this.screenStream = null;
    this.audioStream = null;
    this.audioContext = null;
    this.analyser = null;
    this.speakingInterval = null;
  }

  // Request user-authorized Screen Capture via standard Browser API
  async startScreenCapture() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      throw new Error("Screen sharing is not supported by your browser.");
    }

    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
          frameRate: { ideal: 30, max: 60 }
        },
        audio: true
      });

      // Handle user stopping screen share via native browser UI
      this.screenStream.getVideoTracks()[0].onended = () => {
        if (this.onScreenShareEnded) {
          this.onScreenShareEnded();
        }
      };

      return this.screenStream;
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        throw new Error("Screen sharing permission was denied. Please allow screen sharing to broadcast to your room.");
      }
      throw err;
    }
  }

  stopScreenCapture() {
    if (this.screenStream) {
      this.screenStream.getTracks().forEach(track => track.stop());
      this.screenStream = null;
    }
  }

  // Request Microphone for Live Voice Chat
  async startMicrophone(onSpeakingChange) {
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Set up Web Audio Analyser for Speaking Indicator Detection
      this.setupSpeakingDetector(this.audioStream, onSpeakingChange);
      return this.audioStream;
    } catch (err) {
      console.warn("Microphone access not granted or not available:", err);
      return null;
    }
  }

  setupSpeakingDetector(stream, onSpeakingChange) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let wasSpeaking = false;

      this.speakingInterval = setInterval(() => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const isSpeaking = average > 18; // threshold

        if (isSpeaking !== wasSpeaking) {
          wasSpeaking = isSpeaking;
          if (onSpeakingChange) {
            onSpeakingChange(isSpeaking);
          }
        }
      }, 150);
    } catch (err) {
      console.warn("Audio meter setup error:", err);
    }
  }

  stopMicrophone() {
    if (this.speakingInterval) clearInterval(this.speakingInterval);
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }

  toggleMute(isMuted) {
    if (this.audioStream) {
      this.audioStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }
}

export const webrtcService = new WebRTCManager();
