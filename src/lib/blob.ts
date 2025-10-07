import { put } from '@vercel/blob';

export async function uploadReceipt(file: File): Promise<string> {
  try {
    const blob = await put(file.name, file, {
      access: 'public',
    });
    return blob.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload receipt');
  }
}

export async function uploadReceiptFromBuffer(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  try {
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType,
    });
    return blob.url;
  } catch (error) {
    console.error('Error uploading file from buffer:', error);
    throw new Error('Failed to upload receipt');
  }
}
