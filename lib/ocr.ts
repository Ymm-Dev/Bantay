type OcrWorker = {
  recognize: (image: File) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
};

export async function extractTextFromImage(file: File): Promise<string> {
  let worker: OcrWorker | undefined;

  try {
    const { createWorker } = await import('tesseract.js');

    try {
      worker = (await createWorker('eng', 1, {
        workerPath: '/tesseract/worker.min.js',
        corePath: '/tesseract',
        langPath: '/tesseract',
      })) as unknown as OcrWorker;
    } catch {
      // Local assets can be missing if the build-time download failed.
      // Fall back to the default worker (CDN) instead of failing outright.
      worker = (await createWorker('eng')) as unknown as OcrWorker;
    }

    const { data } = await worker.recognize(file);
    return data.text.trim();
  } catch {
    throw new Error('Hindi mabasa ang screenshot. Subukan ang paste.');
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch {
        // Ignore cleanup failures; the result or the readable error matters more.
      }
    }
  }
}
