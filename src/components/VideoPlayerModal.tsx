"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

interface VideoPlayerModalProps {
  src: string;
  title: string;
  category: string;
  accentColor: string;
  onClose: () => void;
}

function formatTime(s: number): string {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function VideoPlayerModal({
  src,
  title,
  category,
  accentColor,
  onClose,
}: VideoPlayerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isVertical, setIsVertical] = useState(false);

  /* ── Entrance animation ── */
  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(
      modalRef.current,
      { scale: 0.82, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "expo.out", delay: 0.05 }
    );
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* ── Close animation ── */
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    gsap.to(modalRef.current, { scale: 0.88, opacity: 0, duration: 0.3, ease: "expo.in" });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: "expo.in",
      onComplete: onClose,
    });
  }, [isClosing, onClose]);

  /* ── Video events ── */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => {
      setDuration(v.duration);
      if (v.videoHeight > v.videoWidth) {
        setIsVertical(true);
      }
    };
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  /* ── Fullscreen change ── */
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { handleClose(); return; }
      const v = videoRef.current;
      if (!v) return;
      if (e.key === " ") { e.preventDefault(); v.paused ? v.play() : v.pause(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); v.currentTime = Math.max(0, v.currentTime - 10); }
      if (e.key === "ArrowRight") { e.preventDefault(); v.currentTime = Math.min(v.duration, v.currentTime + 10); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose]);

  /* ── Controls auto-hide ── */
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setControlsVisible(false);
    }, 2800);
  }, []);

  /* ── Helpers ── */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) { videoRef.current.volume = val; videoRef.current.muted = val === 0; }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    v.muted = next;
    setIsMuted(next);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      modalRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const seekPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volPct = isMuted ? 0 : volume * 100;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/88"
        style={{ backdropFilter: "blur(12px)" }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative z-10 w-full rounded-[20px] overflow-hidden"
        style={{ maxWidth: isVertical ? 420 : 900, background: "#0f0f0f", boxShadow: "0 40px 120px rgba(0,0,0,0.9)" }}
        onMouseMove={showControls}
      >
        {/* Video area */}
        <div className={`relative bg-black ${isVertical ? "aspect-[9/16] max-h-[70vh] sm:max-h-[80vh] mx-auto" : "aspect-video"}`}>
          <video
            ref={videoRef}
            src={src}
            preload="auto"
            playsInline
            className="w-full h-full object-contain"
            onClick={togglePlay}
          />

          {/* Big play/pause centre flash */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ opacity: isPlaying ? 0 : 0.8, transition: "opacity 0.3s" }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </div>

          {/* Controls bar */}
          <div
            ref={controlsRef}
            className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
              opacity: controlsVisible ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            {/* Seek bar */}
            <div className="mb-3">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 appearance-none rounded-full outline-none"
                style={{
                  background: `linear-gradient(to right, ${accentColor} ${seekPct}%, rgba(255,255,255,0.2) ${seekPct}%)`,
                  cursor: "pointer",
                }}
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:scale-110 transition-transform flex-shrink-0"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </button>

              {/* Time */}
              <span className="text-white/70 text-[11px] font-mono flex-shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <div className="flex-1" />

              {/* Mute + Volume */}
              <button onClick={toggleMute} className="text-white/80 hover:text-white transition-colors flex-shrink-0" aria-label="Toggle mute">
                {isMuted || volume === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12A4.5 4.5 0 0014 7.97V10.18L16.45 12.63C16.48 12.43 16.5 12.21 16.5 12zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={isMuted ? 0 : volume}
                onChange={handleVolume}
                className="w-16 h-1 appearance-none rounded-full outline-none"
                style={{
                  background: `linear-gradient(to right, ${accentColor} ${volPct}%, rgba(255,255,255,0.2) ${volPct}%)`,
                  cursor: "pointer",
                }}
              />

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} className="text-white/80 hover:text-white transition-colors flex-shrink-0" aria-label="Fullscreen">
                {isFullscreen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                  </svg>
                )}
              </button>

              {/* Close */}
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white transition-colors flex-shrink-0 ml-1"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Info + Rating panel */}
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span
              className="inline-block text-[10px] font-semibold tracking-[0.2em] uppercase px-2 py-0.5 rounded-full mb-1.5"
              style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
            >
              {category}
            </span>
            <h3 className="font-display text-white text-[18px] md:text-[22px] leading-tight truncate">
              {title}
            </h3>
          </div>

          {/* Star rating */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-white/40 text-[11px] tracking-widest uppercase mr-2 hidden sm:block">Rate</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                className="text-[22px] transition-transform duration-150 hover:scale-125 leading-none"
                style={{
                  color: star <= (hoverRating || rating) ? "#F7C73D" : "rgba(255,255,255,0.2)",
                  transition: "color 0.15s ease, transform 0.15s cubic-bezier(0.16,1,0.3,1)",
                  filter: star <= (hoverRating || rating) ? "drop-shadow(0 0 6px #F7C73D88)" : "none",
                }}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="px-5 pb-3 flex gap-4 flex-wrap">
          {[["Space","Play/Pause"], ["←→","Seek 10s"], ["Esc","Close"]].map(([key, label]) => (
            <span key={key} className="text-white/25 text-[10px] font-mono">
              <span className="text-white/40">{key}</span> {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
