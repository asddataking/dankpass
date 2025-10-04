declare module 'imghash' {
  export function hash(imagePath: string): Promise<string>;
  export function hash(imageBuffer: Buffer): Promise<string>;
}
