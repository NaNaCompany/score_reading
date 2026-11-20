import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code = fs.readFileSync(new URL('../js/audio-export.js', import.meta.url), 'utf8');
const ctx = {}; vm.runInNewContext(code, ctx);
const api = ctx.ScoreAudioExport;
test('single-pass plan uses selected BPM and all notes regardless of playhead/repeat', () => {
  const data = {totalQ: 365.5, noteInfo: new Map([['a',{onQ:0,offQ:1,pitch:60}], ['tie',{onQ:1,offQ:2,pitch:null}], ['z',{onQ:364,offQ:365.5,pitch:70}]])};
  const plan = api.plan(data,70);
  assert.equal(plan.notes.length,2); assert.equal(plan.notes[0].start,0);
  assert.equal(plan.duration,365.5*60/70+0.5);
  assert.ok(Math.abs(plan.duration-313.786)<0.01);
  assert.throws(()=>api.plan(data,0)); assert.throws(()=>api.plan(data,1));
});
test('WAV is stereo PCM16 with valid sizes and peak normalization without clipping', () => {
  const wave=api.encodeWav({numberOfChannels:2,length:3,sampleRate:44100,getChannelData:c=>c ? new Float32Array([0,2,-2]) : new Float32Array([0,1,-1])});
  const v=new DataView(wave);const bytes=new Uint8Array(wave);
  assert.equal(String.fromCharCode(...bytes.slice(0,4)),'RIFF');
  assert.equal(String.fromCharCode(...bytes.slice(8,12)),'WAVE');
  assert.equal(v.getUint32(4,true),wave.byteLength-8);assert.equal(v.getUint32(40,true),12);
  assert.equal(v.getUint16(20,true),1);assert.equal(v.getUint16(22,true),2);
  assert.equal(v.getUint32(24,true),44100);assert.equal(v.getUint16(34,true),16);
  assert.equal(v.getInt16(44,true),0);assert.ok(v.getInt16(50,true)<32767);assert.ok(v.getInt16(54,true)>-32768);
});
test('offline render schedules score-derived piano notes once and does not use Tone', async()=>{
 const starts=[],stops=[],rates=[],requests=[];
 class Offline {
  constructor(channels,frames,rate){this.destination={};this.frames=frames;this.rate=rate;}
  async decodeAudioData(){return {};}
  createBufferSource(){const node={playbackRate:{value:0},connect(){},start(t){starts.push(t);rates.push(node.playbackRate.value);},stop(t){stops.push(t);}};return node;}
  createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){}},connect(){}};}
  async startRendering(){return {numberOfChannels:2,length:4,sampleRate:this.rate,getChannelData:()=>new Float32Array(4)};}
 }
 const c={OfflineAudioContext:Offline,fetch:async url=>{requests.push(url);return {ok:true,arrayBuffer:async()=>new ArrayBuffer(0)}}};vm.runInNewContext(code,c);
 await c.ScoreAudioExport.render({totalQ:2,noteInfo:new Map([['a',{onQ:0,offQ:1,pitch:60}],['b',{onQ:1,offQ:2,pitch:61}]])},60,'https://samples/',1);
 assert.deepEqual(starts,[0,1]);assert.deepEqual(stops,[1.3,2.3]);assert.equal(rates[0],1);assert.equal(requests.length,1);
});
test('all inline scripts parse',()=>{
 const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
 for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) if(!/src=|ld\+json/.test(m[1]))new vm.Script(m[2]);
});
test('repeat restarts from zero; non-repeat keeps tail; Stop cancels repeat and pending start',()=>{
 const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const extract=(start,end)=>html.slice(html.indexOf(start),html.indexOf(end,html.indexOf(start)));
 const controls={repeatPlayback:{checked:true},playPauseBtn:{},stopBtn:{}};
 const calls=[];const c={document:{getElementById:id=>controls[id]},isPlaying:true,audioCtx:{currentTime:3},playbackStartAudioTime:0,playbackStartQ:0,playbackCurrentQ:0,playbackData:{totalQ:2},playbackRun:1,playbackStarting:true,playbackIntervalId:42,lastScrolledId:'old',currentBpm:()=>60,scheduleDueNotes(){},updatePlaybackTimeUI(){},followPlayback(){},clearScheduledVoices(){calls.push('clear')},releaseRepeatVoices(){calls.push('release')},scheduleFrom:q=>calls.push(q),clearInterval:id=>calls.push(id)};
 vm.createContext(c);
 vm.runInContext(extract('function playbackTick()','async function startPlayback()'),c);
 vm.runInContext(extract('function pausePlayback()','document.getElementById(\'playPauseBtn\').addEventListener'),c);
 vm.runInContext('playbackTick()',c);assert.equal(c.playbackCurrentQ,0);assert.equal(c.isPlaying,true);assert.ok(calls.includes(0));
 vm.runInContext('stopPlayback(); playbackTick()',c);assert.equal(c.isPlaying,false);assert.equal(c.playbackStarting,false);assert.equal(c.playbackRun,2);assert.equal(c.playbackIntervalId,null);assert.equal(controls.stopBtn.disabled,true);
 controls.repeatPlayback.checked=false;c.isPlaying=true;c.audioCtx.currentTime=2.5;
 vm.runInContext('playbackTick()',c);assert.equal(c.isPlaying,true);
 c.audioCtx.currentTime=3;vm.runInContext('playbackTick()',c);assert.equal(c.isPlaying,false);
});
test('repeated natural boundaries keep the loaded piano and never construct fallback voices',()=>{
 const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const extract=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
 let released=0,attacks=0;const piano={releaseAll(){released++},triggerAttackRelease(){attacks++},dispose(){throw Error('repeat disposed piano')}};
 const c={pianoSampler:piano,pianoSamplerLoaded:true,polySynth:null,audioCtx:{currentTime:0},playbackStartAudioTime:0,playbackStartQ:0,scheduledNoteIds:new Set(),LOOKAHEAD_SEC:0.15,playbackData:{noteInfo:new Map([['a',{onQ:0,offQ:1,pitch:60}]])},currentBpm:()=>60,qToSeconds:q=>q,midiToFreq:p=>p,ensurePolySynth(){throw Error('fallback selected')}};
 vm.createContext(c);
 vm.runInContext(extract('function scheduleDueNotes()', '// At a natural repeat boundary'),c);
 vm.runInContext(extract('function releaseRepeatVoices()', 'function clearScheduledVoices()'),c);
 for(let i=0;i<30;i++){
  c.scheduledNoteIds=new Set();vm.runInContext('scheduleDueNotes(); releaseRepeatVoices()',c);
  assert.equal(c.pianoSampler,piano);assert.equal(c.pianoSamplerLoaded,true);
 }
 assert.equal(attacks,30);assert.equal(released,30);
});
