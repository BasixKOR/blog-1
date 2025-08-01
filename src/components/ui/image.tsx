import { readFile } from 'fs/promises';
import sizeOf from 'image-size';
import NextImage from 'next/image';
import { join } from 'path';

import { Caption } from './caption';

export async function Image({
  src,
  alt: originalAlt,
  width = null,
  height = null,
}: {
  src: string;
  alt?: string;
  width: number | null;
  height: number | null;
}) {
  const isDataImage = src.startsWith('data:');
  if (isDataImage) {
    /* eslint-disable @next/next/no-img-element */
    return <img src={src} alt={originalAlt ?? ''} />;
  } else {
    if (width === null || height === null) {
      let imageBuffer: Buffer | null = null;

      if (src.startsWith('http')) {
        const arrayBuffer = await fetch(src).then((res) => res.arrayBuffer());
        imageBuffer = Buffer.from(new Uint8Array(arrayBuffer));
      } else {
        if (!process.env.CI && process.env.VERCEL_URL && process.env.NODE_ENV === 'production') {
          const arrayBuffer = await fetch('https://' + process.env.VERCEL_URL + src).then((res) => res.arrayBuffer());
          imageBuffer = Buffer.from(new Uint8Array(arrayBuffer));
        } else {
          imageBuffer = await readFile(
            new URL(join(import.meta.url, '..', '..', '..', '..', 'public', src)).pathname
          );
        }
      }
      const computedSize = sizeOf(imageBuffer);
      if (computedSize.width === undefined || computedSize.height === undefined) {
        throw new Error('Could not compute image size');
      }
      width = computedSize.width;
      height = computedSize.height;
    }

    let alt: string | null = originalAlt ?? null;
    let dividedBy = 100;

    if ('string' === typeof originalAlt) {
      const match = originalAlt.match(/(.*) (\[(\d+)%\])?$/);
      if (match != null) {
        alt = match[1];
        dividedBy = match[3] ? parseInt(match[3]) : 100;
      }
    } else {
      alt = originalAlt ?? null;
    }

    const factor = dividedBy / 100;

    return (
      <span className="my-5 flex flex-col items-center">
        <NextImage width={width * factor} height={height * factor} alt={alt ?? ''} src={src} />

        {alt && <Caption>{alt}</Caption>}
      </span>
    );
  }
}
