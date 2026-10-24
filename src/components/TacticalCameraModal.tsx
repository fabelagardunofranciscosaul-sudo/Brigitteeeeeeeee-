import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, X, RefreshCw, Download, Zap, Sparkles, Check } from 'lucide-react';
import { soundFx } from '../utils/audioVoice';

interface TacticalCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSnapshot?: (dataUrl: string) => void;
}

export const TacticalCameraModal: React.FC<TacticalCameraModalProps> = ({
  isOpen,
  onClose,
  onSaveSnapshot,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'normal' | 'cyan' | 'night' | 'thermal'>('cyan');
  const [snapshot, setSnapshot] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Stop all tracks when modal closes
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      setSnapshot(null);
      setCameraError(null);
      return;
    }

    // Start camera
    const startCamera = async () => {
      try {
        setCameraError(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        soundFx.playTacticalPing();
      } catch (err: any) {
        console.warn('Camera access error:', err);
        setCameraError('No se pudo acceder a la cámara o el permiso fue denegado en el navegador.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCapture = () => {
    if (!videoRef.current) return;
    soundFx.playTacticalPing();
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setSnapshot(dataUrl);
    }
  };

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'cyan':
        return 'contrast(120%) brightness(95%) hue-rotate(170deg) saturate(140%)';
      case 'night':
        return 'contrast(140%) brightness(120%) sepia(100%) hue-rotate(80deg) saturate(300%)';
      case 'thermal':
        return 'contrast(160%) invert(80%) hue-rotate(240deg) saturate(200%)';
      default:
        return 'none';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-3xl rounded-2xl border-2 border-cyan-500/50 bg-[#090b13] p-4 sm:p-5 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <Camera className="w-5 h-5 text-cyan-400" />
            <h3 className="font-tech text-base font-bold text-white tracking-wider uppercase">
              CÁMARA ÓPTICA TÁCTICA // VISIÓN EN VIVO
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono">
              {(['normal', 'cyan', 'night', 'thermal'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-2 py-0.5 rounded capitalize ${
                    filterMode === mode ? 'bg-cyan-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewfinder Stage */}
        <div className="relative flex-1 bg-black rounded-xl overflow-hidden mt-3 min-h-[300px] sm:min-h-[420px] flex items-center justify-center border border-zinc-800">
          {cameraError ? (
            <div className="text-center p-6 text-zinc-400 font-mono text-sm space-y-2">
              <CameraOff className="w-12 h-12 mx-auto text-rose-500 mb-2" />
              <p className="text-rose-400 font-bold">{cameraError}</p>
              <p className="text-xs text-zinc-500">
                Asegúrate de conceder permiso a la cámara en el navegador para activar el visor táctico en vivo.
              </p>
            </div>
          ) : (
            <>
              {snapshot ? (
                <img src={snapshot} alt="Captura" className="w-full h-full object-cover" />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ filter: getFilterStyle() }}
                />
              )}

              {/* TACTICAL HUD OVERLAYS */}
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                {/* Top Corner Crosshairs */}
                <div className="flex justify-between items-start text-[10px] font-mono text-cyan-400">
                  <div className="bg-black/60 px-2 py-1 rounded border border-cyan-500/30">
                    TARGET: DETECTED // LOCK 99.4%
                  </div>
                  <div className="bg-black/60 px-2 py-1 rounded border border-cyan-500/30">
                    FPS: 30 // SENSOR: RGB-HD
                  </div>
                </div>

                {/* Center Reticle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-cyan-500/30 flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full border border-dashed border-cyan-400/50 flex items-center justify-center animate-spin-slow">
                      <div className="w-3 h-3 bg-cyan-400/80 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Bottom Status */}
                <div className="flex justify-between items-end text-[10px] font-mono text-zinc-400">
                  <div className="bg-black/60 px-2 py-1 rounded border border-zinc-800">
                    MODO: {filterMode.toUpperCase()} // OPTICS ACTIVE
                  </div>
                  <div className="bg-black/60 px-2 py-1 rounded border border-zinc-800 text-cyan-400">
                    STARK HUD PROTOCOL
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800 mt-3">
          <div className="text-xs font-mono text-zinc-400">
            {snapshot ? 'Captura lista para guardar o usar de foto' : 'Pulsa el botón para capturar foto instantánea'}
          </div>

          <div className="flex items-center gap-2">
            {snapshot ? (
              <>
                <button
                  onClick={() => setSnapshot(null)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Repetir</span>
                </button>

                {onSaveSnapshot && (
                  <button
                    onClick={() => {
                      onSaveSnapshot(snapshot);
                      soundFx.playTacticalPing();
                      onClose();
                    }}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-tech font-bold text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Usar Foto</span>
                  </button>
                )}

                <a
                  href={snapshot}
                  download="captura_tactica.jpg"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
              </>
            ) : (
              <button
                onClick={handleCapture}
                disabled={!!cameraError}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-40 cursor-pointer shadow-lg shadow-cyan-500/30"
              >
                <Camera className="w-4 h-4" />
                <span>Capturar Foto</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
