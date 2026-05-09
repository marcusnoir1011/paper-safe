import { createWorker } from "tesseract.js";

export const recognizeReceipt = async (imagePath: string) => {
  const worker = await createWorker(["eng", "jpn"]);

  const {
    data: { text },
  } = await worker.recognize(imagePath);
  await worker.terminate();
  return text;
};
