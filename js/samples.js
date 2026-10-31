// User-supplied public sample files. Score contents are never sent to analytics.
(() => {
  const buttons = [...document.querySelectorAll('button[data-score-sample]')];
  const samples = {
    rachmaninoff: {path:'samples/rachmaninoff-op39-no6.musicxml',title:'에튀드 타블로 Op. 39 No. 6',composer:'Sergei Rachmaninoff',bpm:168},
    bartok: {path:'samples/bartok-allegro-barbaro.musicxml',title:'Allegro barbaro, Sz. 49',composer:'Béla Bartók'},
  };
  let loading = false;
  for (const button of buttons) button.addEventListener('click', async () => {
    if (loading) return;
    const sample = samples[button.dataset.scoreSample];
    if (!sample) return;
    loading = true;
    const label = button.textContent;
    for (const item of buttons) item.disabled = true;
    button.textContent = '불러오는 중…';
    try {
      const response = await fetch(new URL(sample.path,document.baseURI),{credentials:'same-origin'});
      if (!response.ok) throw new Error('샘플 파일을 불러오지 못했습니다 ('+response.status+').');
      const file = new File([await response.blob()],sample.path.split('/').pop(),{type:'application/vnd.recordare.musicxml+xml'});
      await handleFile(file,{title:sample.title,composer:sample.composer});
      if (sample.bpm) {
        document.getElementById('bpmInput').value = sample.bpm;
        document.getElementById('bpmSlider').value = sample.bpm;
        applyBpmChange();
      }
    } catch (error) {
      setGlobalError('샘플 로드 오류: '+error.message);
    } finally {
      loading = false;
      for (const item of buttons) item.disabled = false;
      button.textContent = label;
    }
  });
})();
