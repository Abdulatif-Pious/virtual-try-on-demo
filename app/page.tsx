"use client";

import { useEffect, useRef, useState } from "react";
import { createMockVtonSession } from "@/lib/vton";
import {
  connectDecart,
  applyGarment,
  disconnectDecart,
} from "@/lib/decart-realtime";
const garments = [
  {
    id: 1,
    name: "Silk Noir Dress",
    price: "$129",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&q=80",
  },
  {
    id: 2,
    name: "Ivory Evening Dress",
    price: "$149",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=80",
  },
  {
    id: 3,
    name: "Midnight Satin",
    price: "$139",
    image:
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&q=80",
  },
  {
    id: 4,
    name: "Rose Minimal Dress",
    price: "$119",
    image:
      "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=900&q=80",
  },
];

export default function Home() {
  const [selected, setSelected] = useState(garments[0]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const outputVideoRef = useRef<HTMLVideoElement>(null);

  const [cameraStarted, setCameraStarted] = useState(false);
  const [decartConnected, setDecartConnected] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [tryOnActive, setTryOnActive] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<
  "idle" | "connecting" | "active" | "stopped" | "error"
>("idle");

const decartRef = useRef<Awaited<ReturnType<typeof connectDecart>> | null>(
  null
);
const startCamera = async () => {
  try {
    setCameraError("");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    setCameraStarted(true);
  } catch (error) {
    console.error(error);
    setCameraError(
      "Camera access was denied or your camera is unavailable."
    );
  }
};

useEffect(() => {
  return () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;

    stream?.getTracks().forEach((track) => track.stop());
  };
}, []);

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#171717]">
      {/* NAVBAR */}
      <nav className="flex h-20 items-center justify-between border-b border-black/5 px-6 md:px-12">
        <div className="text-xl font-medium tracking-[0.25em]">
          LÉORA
        </div>

        <div className="hidden items-center gap-10 text-sm md:flex">
          <a href="#collection" className="hover:opacity-60">
            Collection
          </a>

          <a href="#try-on" className="hover:opacity-60">
            Virtual Try-On
          </a>
        </div>

        <button className="rounded-full border border-black/10 px-5 py-2 text-sm hover:bg-black hover:text-white">
          Bag (0)
        </button>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 md:grid-cols-2 md:px-12 md:py-20">
        <div className="flex flex-col justify-center">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-black/50">
            New Collection · 2026
          </p>

          <h1 className="max-w-xl text-5xl font-light leading-[1.05] tracking-tight md:text-7xl">
            Fashion,
            <br />
            <span className="italic">made personal.</span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-7 text-black/55">
            Discover pieces designed to become yours. See how they look on you
            before you buy.
          </p>

          <a
            href="#try-on"
            className="mt-9 flex w-fit items-center rounded-full bg-black px-7 py-4 text-sm text-white transition hover:scale-[1.02]"
          >
            Try it on
            <span className="ml-3">→</span>
          </a>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] bg-neutral-200">
          <img
            src={selected.image}
            alt={selected.name}
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-4 py-2 text-xs backdrop-blur">
            {selected.name}
          </div>
        </div>
      </section>

      {/* VIRTUAL TRY-ON */}
      <section
        id="try-on"
        className="bg-[#171717] px-6 py-20 text-white md:px-12 md:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">
              Virtual Fitting Room
            </p>

            <h2 className="mt-4 text-4xl font-light tracking-tight md:text-6xl">
              See it on <span className="italic">you.</span>
            </h2>

            <p className="mt-5 leading-7 text-white/50">
              Choose a piece and experience it in real time using our virtual
              try-on technology.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* CAMERA PLACEHOLDER */}
          {/* CAMERA */}
          <div className="relative h-[350px] overflow-hidden rounded-2xl bg-[#252525]">
  {decartConnected && (
    <video
      ref={outputVideoRef}
      autoPlay
      playsInline
      muted
      className="absolute inset-0 h-full w-full object-cover"
    />
  )}

{cameraStarted || demoMode ? (
  demoMode && !cameraStarted ? (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#252525] text-center">
      <div className="text-5xl">👗</div>

      <p className="mt-4 text-sm text-white/50">
        Virtual Try-On Demo
      </p>

      <p className="mt-2 text-xs text-white/30">
        Demo mode · No camera required
      </p>
    </div>
  ) : (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="h-full w-full object-contain bg-black"    />
  )
) : (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-2xl">
        ✦
      </div>

      <h3 className="text-xl font-light">
        Your virtual fitting room
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-white/40">
        Allow camera access to see yourself in the fitting room.
      </p>

        <div className="mt-7 flex flex-col items-center gap-3">
    <button
      onClick={startCamera}
      className="rounded-full bg-white px-7 py-3 text-sm text-black transition hover:bg-white/90"
    >
      Start camera
    </button>

    <button
      onClick={() => {
        setDemoMode(true);
        setTryOnActive(true);
        setSessionStatus("active");
        setCameraError("");
      }}
      className="rounded-full border border-white/15 px-6 py-2.5 text-xs text-white/60 transition hover:bg-white/5"
    >
      Use Demo Mode
    </button>
</div>

      {cameraError && (
        <p className="mt-4 text-xs text-red-400">
          {cameraError}
        </p>
      )}
    </div>
  )}

  <div className="absolute left-5 top-5 rounded-full bg-black/50 px-3 py-1.5 text-[11px] text-white/60 backdrop-blur">
  {tryOnActive
  ? "VIRTUAL TRY-ON · DEMO"
  : cameraStarted
    ? "CAMERA ACTIVE"
    : "LIVE PREVIEW"}  </div>
</div>

            {/* GARMENT SELECTOR */}
            <div>
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-white/60">
                  Select a piece
                </span>

                <span className="text-xs text-white/30">
                  {garments.length} pieces
                </span>
              </div>

              <div className="space-y-3">
                {garments.map((garment) => (
                  <button
                    key={garment.id}
                    onClick={() => setSelected(garment)}
                    className={`flex w-full items-center gap-4 rounded-xl p-2 text-left transition ${
                      selected.id === garment.id
                        ? "bg-white text-black"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <img
                      src={garment.image}
                      alt={garment.name}
                      className="h-20 w-16 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-sm">{garment.name}</p>

                      <p
                        className={`mt-1 text-xs ${
                          selected.id === garment.id
                            ? "text-black/50"
                            : "text-white/40"
                        }`}
                      >
                        {garment.price}
                      </p>
                    </div>

                    {selected.id === garment.id && (
                      <span className="mr-3 text-sm">✓</span>
                    )}
                  </button>
                ))}
              </div>

              <button
  onClick={async () => {
    if (!cameraStarted) {
      setCameraError("Start your camera first.");
      return;
    }

    try {
      setCameraError("");
      setSessionStatus("connecting");

      const stream = videoRef.current?.srcObject as MediaStream | null;

      if (!stream) {
        throw new Error("Camera stream is unavailable.");
      }

      const realtime = await connectDecart(stream, (remoteStream) => {
        if (outputVideoRef.current) {
          outputVideoRef.current.srcObject = remoteStream;
          outputVideoRef.current.play().catch(() => {});
        }
      });

      decartRef.current = realtime;

      await applyGarment(
        realtime,
        selected.image,
        selected.name
      );
      
      setDecartConnected(true);
      setTryOnActive(true);
      setSessionStatus("active");

      console.log("🔥 Decart realtime connected");
    } catch (error) {
      console.error("Decart connection failed:", error);
      setSessionStatus("error");
      setCameraError("Could not connect to Decart.");
    }
  }}
  className="mt-6 w-full rounded-full bg-white py-4 text-sm text-black transition hover:bg-white/90"
>
  {tryOnActive ? "Virtual Try-On Active" : `Try ${selected.name}`}
</button>

{tryOnActive && (
  <button
  onClick={() => {
    disconnectDecart(decartRef.current);
    decartRef.current = null;
  
    setDecartConnected(false);
    setTryOnActive(false);
    setSessionStatus("stopped");
  
    if (outputVideoRef.current) {
      outputVideoRef.current.srcObject = null;
    }
  }}
    className="mt-3 w-full rounded-full border border-white/10 py-3 text-sm text-white/60 transition hover:bg-white/5"
  >
    Stop Try-On
  </button>
)}
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section id="collection" className="px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                The Collection
              </p>

              <h2 className="mt-3 text-4xl font-light tracking-tight md:text-5xl">
                Featured pieces
              </h2>
            </div>

            <span className="hidden text-sm text-black/40 md:block">
              04 / 04
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {garments.map((garment) => (
              <button
                key={garment.id}
                onClick={() => {
                  setSelected(garment);

                  document
                    .getElementById("try-on")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group text-left"
              >
                <div className="aspect-[3/4] overflow-hidden bg-neutral-100">
                  <img
                    src={garment.image}
                    alt={garment.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mt-4 flex justify-between gap-3">
                  <span className="text-sm">{garment.name}</span>

                  <span className="text-sm text-black/50">
                    {garment.price}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/5 px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-xs text-black/40 md:flex-row">
          <span>© 2026 LÉORA</span>
          <span>Fashion made personal.</span>
        </div>
      </footer>
    </main>
  );
}