'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const [supported, setSupported] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function init() {
      try {
        // Feature detect BarcodeDetector
        const isSupported = typeof window !== 'undefined' && 'BarcodeDetector' in window;
        setSupported(isSupported);

        // Request camera (prefer environment camera)
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        if (isSupported) {
          // @ts-ignore
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const tick = async () => {
            try {
              if (!videoRef.current) return;
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes && barcodes.length > 0) {
                const rawValue = barcodes[0].rawValue || '';
                handleResult(rawValue);
                return;
              }
            } catch (e) {
              // Ignore transient errors while scanning
            }
            animationRef.current = requestAnimationFrame(tick);
          };
          animationRef.current = requestAnimationFrame(tick);
        }
      } catch (e: any) {
        if (e && (e.name === 'NotAllowedError' || e.name === 'SecurityError')) {
          setPermissionDenied(true);
          setError('Camera access was denied. Enable permission in your browser settings.');
        } else {
          setError('Unable to access camera.');
        }
      }
    }

    init();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  function handleResult(raw: string) {
    try {
      // Deep link handling for DankPass URLs or custom scheme
      if (raw.startsWith('dankpass://')) {
        const path = raw.replace('dankpass://', '');
        router.replace('/' + path.replace(/^\//, ''));
        return;
      }
      const url = new URL(raw);
      if (url.hostname.includes('dankpass')) {
        router.replace(url.pathname + url.search + url.hash);
        return;
      }
    } catch {}

    const perk = /\/perks\/(\w+)/.exec(raw);
    if (perk) {
      router.replace(`/perks/${perk[1]}`);
      return;
    }
    // Fallback: show as plain text via upload page context
    const q = new URLSearchParams({ scanned: raw });
    router.replace(`/upload?${q.toString()}`);
  }

  return (
    <div className="min-h-screen px-6 pt-16 pb-24">
      <h1 className="text-2xl font-bold mb-4">Scan QR</h1>

      {!supported && (
        <div className="card mb-4">
          <p className="muted">
            QR scanning isn&apos;t supported on this browser. Please update or try Chrome.
          </p>
        </div>
      )}

      {error && (
        <div className="card mb-4">
          <p className="text-red-400">{error}</p>
          {permissionDenied && (
            <p className="muted mt-2">After enabling the camera, revisit this page.</p>
          )}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden border border-brand-primary/20 bg-black">
        <video ref={videoRef} playsInline muted className="w-full h-[60vh] object-cover" />
      </div>

      <p className="muted mt-3">Point your camera at a DankPass QR to redeem or open links.</p>
    </div>
  );
}


