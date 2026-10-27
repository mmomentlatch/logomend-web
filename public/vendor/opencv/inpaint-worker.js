let runtime = null;

async function loadOpenCv() {
  if (runtime?.Mat && typeof runtime.inpaint === 'function') return;
  self.postMessage({ type: 'status', stage: 'script' });
  importScripts('./opencv.js');
  runtime = self.cv;
  self.postMessage({ type: 'status', stage: 'runtime' });

  // The legacy OpenCV.js thenable resolves with itself, so it must not be
  // awaited directly. Resolve our own promise without passing that thenable.
  if (runtime && typeof runtime.then === 'function' && !runtime.Mat) {
    await new Promise(resolve => runtime.then(() => resolve()));
    runtime = self.cv;
  }

  if (!runtime?.Mat || typeof runtime.inpaint !== 'function') {
    throw new Error('OpenCV.js inpaint is unavailable');
  }
  self.postMessage({ type: 'status', stage: 'ready' });
}

self.addEventListener('message', async event => {
  const { type, id } = event.data || {};
  try {
    await loadOpenCv();
    const cv = runtime;
    if (type === 'init') {
      self.postMessage({ type: 'ready' });
      return;
    }
    if (type !== 'inpaint') return;

    const { width, height, pixels, mask, radius } = event.data;
    const sourceRgba = new cv.Mat(height, width, cv.CV_8UC4);
    const maskRgba = new cv.Mat(height, width, cv.CV_8UC4);
    const sourceRgb = new cv.Mat();
    const maskGray = new cv.Mat();
    const restoredRgb = new cv.Mat();
    const restoredRgba = new cv.Mat();

    try {
      sourceRgba.data.set(new Uint8Array(pixels));
      maskRgba.data.set(new Uint8Array(mask));
      cv.cvtColor(sourceRgba, sourceRgb, cv.COLOR_RGBA2RGB);
      cv.cvtColor(maskRgba, maskGray, cv.COLOR_RGBA2GRAY);
      cv.inpaint(sourceRgb, maskGray, restoredRgb, radius, cv.INPAINT_TELEA);
      cv.cvtColor(restoredRgb, restoredRgba, cv.COLOR_RGB2RGBA);
      const output = restoredRgba.data.slice().buffer;
      self.postMessage({ type: 'result', id, pixels: output }, [output]);
    } finally {
      sourceRgba.delete(); maskRgba.delete(); sourceRgb.delete();
      maskGray.delete(); restoredRgb.delete(); restoredRgba.delete();
    }
  } catch (error) {
    self.postMessage({ type: 'error', id, message: error?.message || String(error) });
  }
});
