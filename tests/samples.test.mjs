import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const script=fs.readFileSync(new URL('../js/samples.js',import.meta.url),'utf8');
const samples=['rachmaninoff','bartok'];
function setup(options={}){
 const controls=Object.fromEntries(['bpmInput','bpmSlider'].map(id=>[id,{value:0}]));
 const buttons=samples.map(key=>({dataset:{scoreSample:key},disabled:false,textContent:key,addEventListener(event,handler){this.click=handler;}}));
 const requests=[],loaded=[],errors=[];let bpmCalls=0;
 const context={File,URL,document:{baseURI:'https://nanalab.kr/score_reading/',querySelectorAll:()=>buttons,getElementById:id=>controls[id]},fetch:async(url,init)=>{
  requests.push({url:url.href,init});
  if(options.networkFailure)throw Error('network unavailable');
  const name=url.pathname.split('/').pop();
  return {ok:!options.httpFailure,status:options.httpFailure?404:200,blob:async()=>new Blob([fs.readFileSync(new URL('../samples/'+name,import.meta.url))])};
 },handleFile:async(file,info)=>{loaded.push({file,info});if(options.loadGate)await options.loadGate;},applyBpmChange:()=>bpmCalls++,setGlobalError:message=>errors.push(message)};
 vm.runInNewContext(script,context);
 return {buttons,requests,loaded,errors,controls,bpmCalls:()=>bpmCalls};
}
test('both buttons load the hosted sanitized XML only on click',async()=>{
 const s=setup();assert.equal(s.requests.length,0);
 for(const [i,button] of s.buttons.entries()){
  await button.click();const item=s.loaded[i];const text=await item.file.text();
  assert.ok(text.includes('<score-partwise'));assert.ok(!/<identification\b/.test(text));assert.ok(text.includes('color='));
  assert.equal(button.disabled,false);assert.equal(button.textContent,samples[i]);assert.equal(s.requests[i].init.credentials,'same-origin');
  assert.ok(s.requests[i].url.startsWith('https://nanalab.kr/score_reading/samples/'));assert.ok(item.info.title);assert.ok(item.info.composer);
 }
 assert.equal(s.bpmCalls(),1);assert.equal(s.controls.bpmInput.value,168);assert.equal(s.controls.bpmSlider.value,168);
});
test('failed HTTP and network requests report an error and restore both buttons',async()=>{
 for(const option of [{httpFailure:true},{networkFailure:true}]){
  const s=setup(option);await s.buttons[0].click();assert.equal(s.loaded.length,0);assert.equal(s.errors.length,1);
  assert.ok(s.errors[0].startsWith('샘플 로드 오류:'));assert.ok(s.buttons.every(b=>!b.disabled));assert.equal(s.buttons[0].textContent,'rachmaninoff');
 }
});
test('a second sample cannot race an in-progress load',async()=>{
 let release;const gate=new Promise(resolve=>release=resolve);const s=setup({loadGate:gate});
 const first=s.buttons[0].click();await s.buttons[1].click();assert.equal(s.requests.length,1);assert.ok(s.buttons.every(b=>b.disabled));
 release();await first;assert.equal(s.loaded.length,1);assert.ok(s.buttons.every(b=>!b.disabled));
});
test('a page without sample controls does not throw',()=>{
 const context={document:{querySelectorAll:()=>[]}};assert.doesNotThrow(()=>vm.runInNewContext(script,context));
});
