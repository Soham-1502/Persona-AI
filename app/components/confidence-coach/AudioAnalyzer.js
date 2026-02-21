export class AudioAnalyzer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.stream = null;
        this.animationId = null;

        // Tracked Metrics
        this.volumes = [];
        this.isRecording = false;
    }

    async start() {
        if (this.isRecording) return;

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();

            this.analyser.fftSize = 256;
            this.source = this.audioContext.createMediaStreamSource(this.stream);
            this.source.connect(this.analyser);

            this.isRecording = true;
            this.volumes = [];

            this.processAudio();
        } catch (err) {
            console.error("Failed to start audio analyzer:", err);
            throw err;
        }
    }

    processAudio() {
        if (!this.isRecording) return;

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const avgVolume = sum / dataArray.length;
        this.volumes.push(avgVolume);

        this.animationId = requestAnimationFrame(() => this.processAudio());
    }

    stop() {
        this.isRecording = false;

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }

        if (this.audioContext) {
            // Close context to prevent memory leaks
            this.audioContext.close();
            this.audioContext = null;
        }

        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }

        return this.getMetrics();
    }

    getMetrics() {
        if (this.volumes.length === 0) return { avgVolume: 0, volumeVariance: 0 };

        const sum = this.volumes.reduce((a, b) => a + b, 0);
        const avgVolume = sum / this.volumes.length;

        const varianceSum = this.volumes.reduce((a, b) => a + Math.pow(b - avgVolume, 2), 0);
        const volumeVariance = varianceSum / this.volumes.length;

        return {
            avgVolume,
            volumeVariance,
            samples: this.volumes.length
        };
    }
}
