/* Offline, single-pass rendering. Never changes Tone's live audio context. */
(function (root) {
  const sampleRate = 44100;
  function plan(data, bpm) {
    if (!(bpm > 0) || !Number.isFinite(bpm)) throw Error('BPM을 확인해주세요.');
    const notes = [...data.noteInfo.values()].filter(n => n.pitch != null).map(n => ({
      pitch: n.pitch, start: n.onQ * 60 / bpm,
      duration: Math.max(0.04, (n.offQ - n.onQ) * 60 / bpm)
    }));
    const duration = notes.reduce((end, n) => Math.max(end, n.start + n.duration), Math.max(0, data.totalQ * 60 / bpm)) + 0.5;
    if (duration > 600) throw Error('WAV 저장은 10분 이내 악보를 지원합니다. BPM을 높여주세요.');
    return { notes, duration, bpm };
  }
  function encodeWav(buffer) {
    const channels = buffer.numberOfChannels, frames = buffer.length;
    const output = new ArrayBuffer(44 + frames * channels * 2), view = new DataView(output);
    const str = (at, text) => [...text].forEach((c, i) => view.setUint8(at + i, c.charCodeAt(0)));
    str(0, 'RIFF'); view.setUint32(4, output.byteLength - 8, true); str(8, 'WAVE');
    str(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, channels, true); view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * channels * 2, true); view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true); str(36, 'data'); view.setUint32(40, frames * channels * 2, true);
    const data = Array.from({length: channels}, (_, i) => buffer.getChannelData(i));
    let peak = 0;
    for (const channel of data) for (const value of channel) peak = Math.max(peak, Math.abs(value));
    const gain = peak > 0.98 ? 0.98 / peak : 1;
    for (let i = 0; i < frames; i++) for (let c = 0; c < channels; c++) {
      const value = Math.max(-1, Math.min(1, data[c][i] * gain));
      view.setInt16(44 + (i * channels + c) * 2, Math.round(value * (value < 0 ? 32768 : 32767)), true);
    }
    return output;
  }
  const cache = new Map();
  async function render(data, bpm, baseUrl, volume = 1) {
    const score = plan(data, bpm);
    const Context = root.OfflineAudioContext || root.webkitOfflineAudioContext;
    if (!Context) throw Error('이 브라우저는 오프라인 오디오 저장을 지원하지 않습니다.');
    const context = new Context(2, Math.ceil(score.duration * sampleRate), sampleRate);
    const samples = [];
    for (let octave = 1; octave <= 7; octave++) {
      for (const [name, offset] of [['C', 0], ['Ds', 3], ['Fs', 6], ['A', 9]]) samples.push({pitch: (octave + 1) * 12 + offset, file: `${name}${octave}.mp3`});
    }
    const nearest = pitch => samples.reduce((a, b) => Math.abs(a.pitch - pitch) <= Math.abs(b.pitch - pitch) ? a : b);
    const required = [...new Set(score.notes.map(n => nearest(n.pitch)))];
    // Limit parallel requests; retain decoded buffers for subsequent downloads.
    for (let i = 0; i < required.length; i += 4) await Promise.all(required.slice(i, i + 4).map(async sample => {
      const url = baseUrl + sample.file;
      if (!cache.has(url)) {
        const response = await fetch(url);
        if (!response.ok) throw Error('피아노 샘플을 불러오지 못했습니다. 다시 시도해주세요.');
        cache.set(url, await context.decodeAudioData(await response.arrayBuffer()));
      }
    }));
    for (const note of score.notes) {
      const sample = nearest(note.pitch), source = context.createBufferSource(), gain = context.createGain();
      source.buffer = cache.get(baseUrl + sample.file);
      source.playbackRate.value = 2 ** ((note.pitch - sample.pitch) / 12);
      gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), note.start);
      gain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), note.start + note.duration);
      gain.gain.linearRampToValueAtTime(0, note.start + note.duration + 0.3);
      source.connect(gain); gain.connect(context.destination);
      source.start(note.start); source.stop(note.start + note.duration + 0.3);
    }
    return encodeWav(await context.startRendering());
  }
  root.ScoreAudioExport = {plan, encodeWav, render};
})(globalThis);
