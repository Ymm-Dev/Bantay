import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createWorker } from 'tesseract.js';
import { extractTextFromImage } from '../ocr';

vi.mock('tesseract.js', () => ({
  createWorker: vi.fn(),
}));

const mockWorker = {
  recognize: vi.fn(async () => ({
    data: { text: '  BDO: verify at bdo-online.top  ' },
  })),
  terminate: vi.fn(async () => undefined),
};

const file = () => new File(['x'], 'sms.png', { type: 'image/png' });

describe('extractTextFromImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createWorker).mockResolvedValue(mockWorker as never);
  });

  it('returns trimmed OCR text and always terminates the worker', async () => {
    await expect(extractTextFromImage(file())).resolves.toBe(
      'BDO: verify at bdo-online.top',
    );
    expect(mockWorker.terminate).toHaveBeenCalledTimes(1);
  });

  it('surfaces a readable error when OCR fails', async () => {
    vi.mocked(createWorker)
      .mockRejectedValueOnce(new Error('boom'))
      .mockRejectedValueOnce(new Error('fallback boom'));

    await expect(extractTextFromImage(file())).rejects.toThrow(
      'Hindi mabasa ang screenshot.',
    );
  });

  it('falls back to the default worker when local assets are unavailable', async () => {
    vi.mocked(createWorker).mockRejectedValueOnce(new Error('local assets missing'));

    await expect(extractTextFromImage(file())).resolves.toBe(
      'BDO: verify at bdo-online.top',
    );
    expect(createWorker).toHaveBeenCalledTimes(2);
  });
});
