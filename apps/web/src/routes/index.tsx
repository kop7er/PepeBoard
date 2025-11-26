/** biome-ignore-all lint/a11y/noLabelWithoutControl: no form required */

import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Download, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { BOARD_VARIANTS, FALLBACK_BOARD_SIZE } from "../lib/boardConfig";
import { useBoardImage } from "../lib/useBoardImage";

interface TextElement {
    id: string;
    text: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    fontSize: number;
    fontFamily: string;
}

export const Route = createFileRoute("/")({
    component: Home,
});

const generateId = () => crypto.randomUUID();

const initialId = generateId();

function Home() {
    const [textElements, setTextElements] = useState<TextElement[]>([
        {
            id: initialId,
            text: "PEPE",
            x: 50,
            y: 23,
            fontSize: 120,
            fontFamily: BOARD_VARIANTS.normal.fontFamily,
        },
    ]);
    const [selectedId, setSelectedId] = useState<string>(initialId);
    const [fontsReady, setFontsReady] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const userProvidedImage = import.meta.env.VITE_BOARD_IMAGE_URL?.trim();
    const boardImageUrl =
        userProvidedImage && userProvidedImage.length > 0
            ? userProvidedImage
            : "/board-placeholder.png";
    const { image, status } = useBoardImage(boardImageUrl);

    useEffect(() => {
        if (typeof document === "undefined") {
            setFontsReady(true);
            return;
        }
        const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
        if (!fonts) {
            setFontsReady(true);
            return;
        }

        const fontLoadPromises = Object.values(BOARD_VARIANTS).map((variant) =>
            fonts.load(`16px ${variant.fontFamily}`).catch(() => {
                // Font load failed, but continue anyway
            }),
        );

        Promise.all(fontLoadPromises)
            .then(() => setFontsReady(true))
            .catch(() => setFontsReady(true));
    }, []);

    const selectedElement = textElements.find((el) => el.id === selectedId);

    const PREVIEW_WIDTH = 500;

    useEffect(() => {
        if (!canvasRef.current || !fontsReady) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const baseWidth = image?.naturalWidth ?? FALLBACK_BOARD_SIZE.width;
        const baseHeight = image?.naturalHeight ?? FALLBACK_BOARD_SIZE.height;
        const aspectRatio = baseHeight / baseWidth;

        const dpr = window.devicePixelRatio || 1;
        const displayWidth = PREVIEW_WIDTH;
        const displayHeight = PREVIEW_WIDTH * aspectRatio;

        canvasRef.current.width = displayWidth * dpr;
        canvasRef.current.height = displayHeight * dpr;

        ctx.scale(dpr, dpr);

        const width = displayWidth;
        const height = displayHeight;

        ctx.clearRect(0, 0, width, height);
        if (image) {
            ctx.drawImage(image, 0, 0, width, height);
        }

        // Draw all text elements
        textElements.forEach((element) => {
            if (!element.text) return;

            const scale = height / FALLBACK_BOARD_SIZE.height;
            const fontSize = Math.round(element.fontSize * scale);

            ctx.font = `${fontSize}px ${element.fontFamily}, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
            ctx.fillStyle = "#111827";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineJoin = "round";
            ctx.lineWidth = Math.max(6 * scale, 2);
            ctx.strokeStyle = "rgba(255,255,255,0.8)";

            const textX = (element.x / 100) * width;
            const textY = (element.y / 100) * height;

            ctx.strokeText(element.text, textX, textY);
            ctx.fillText(element.text, textX, textY);
        });
    }, [textElements, image, fontsReady]);

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || isDragging) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        if (selectedElement) {
            setTextElements((prev) =>
                prev.map((el) => (el.id === selectedId ? { ...el, x, y } : el)),
            );
        }
    };

    const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        handleCanvasClick(event);
    };

    const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging || !canvasRef.current) return;
        handleCanvasClick(event);
    };

    const handleCanvasMouseUp = () => {
        setIsDragging(false);
    };

    const addTextElement = () => {
        const newId = generateId();
        const newElement: TextElement = {
            id: newId,
            text: "NEW TEXT",
            x: 50,
            y: 23,
            fontSize: 120,
            fontFamily: selectedElement?.fontFamily || BOARD_VARIANTS.normal.fontFamily,
        };
        setTextElements((prev) => [...prev, newElement]);
        setSelectedId(newId);
    };

    const deleteTextElement = (id: string) => {
        setTextElements((prev) => prev.filter((el) => el.id !== id));
        if (selectedId === id) {
            setSelectedId(textElements[0]?.id || "");
        }
    };

    const updateTextElement = (id: string, updates: Partial<TextElement>) => {
        setTextElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
    };

    const canDownload = Boolean(canvasRef.current) && textElements.some((el) => el.text.trim());

    const handleDownload = () => {
        if (!image) return;

        // Create a separate canvas at full resolution for download
        const downloadCanvas = document.createElement("canvas");
        const ctx = downloadCanvas.getContext("2d");
        if (!ctx) return;

        const width = image.naturalWidth;
        const height = image.naturalHeight;

        downloadCanvas.width = width;
        downloadCanvas.height = height;

        ctx.drawImage(image, 0, 0, width, height);

        textElements.forEach((element) => {
            if (!element.text) return;

            const scale = height / FALLBACK_BOARD_SIZE.height;
            const fontSize = Math.round(element.fontSize * scale);

            ctx.font = `${fontSize}px ${element.fontFamily}, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
            ctx.fillStyle = "#111827";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineJoin = "round";
            ctx.lineWidth = Math.max(6 * scale, 2);
            ctx.strokeStyle = "rgba(255,255,255,0.8)";

            const textX = (element.x / 100) * width;
            const textY = (element.y / 100) * height;

            ctx.strokeText(element.text, textX, textY);
            ctx.fillText(element.text, textX, textY);
        });

        const link = document.createElement("a");
        link.download = `pepe-board-${Date.now()}.png`;
        link.href = downloadCanvas.toDataURL("image/png");
        link.click();
    };

    const handleReset = () => {
        const resetId = generateId();
        setTextElements([
            {
                id: resetId,
                text: "PEPE",
                x: 50,
                y: 23,
                fontSize: 120,
                fontFamily: BOARD_VARIANTS.normal.fontFamily,
            },
        ]);
        setSelectedId(resetId);
    };

    return (
        <div className="grid w-full gap-6 lg:grid-cols-[380px_1fr]">
            {/* Left Panel - Editor Controls */}
            <div className="space-y-4 rounded-xl border border-green-900/30 bg-slate-900/50 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Text Layers</h2>
                    <button
                        type="button"
                        onClick={addTextElement}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-green-900/30 transition hover:bg-green-500"
                    >
                        <Plus size={14} /> Add Text
                    </button>
                </div>

                <div className="space-y-2">
                    {textElements.map((element) => (
                        <button
                            key={element.id}
                            type="button"
                            onClick={() => setSelectedId(element.id)}
                            className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition ${
                                selectedId === element.id
                                    ? "border-green-600 bg-green-950/40"
                                    : "border-slate-700/50 bg-slate-800/30 hover:border-green-700/50"
                            }`}
                        >
                            <span className="truncate text-sm font-medium text-white">
                                {element.text || "Empty"}
                            </span>
                            {textElements.length > 1 && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTextElement(element.id);
                                    }}
                                    className="ml-2 rounded p-1 text-slate-400 transition hover:bg-red-900/30 hover:text-red-400"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </button>
                    ))}
                </div>

                {selectedElement && (
                    <div className="space-y-4 border-t border-slate-700/50 pt-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300">Text</label>
                            <input
                                value={selectedElement.text}
                                onChange={(e) =>
                                    updateTextElement(selectedId, { text: e.target.value })
                                }
                                placeholder="Enter text..."
                                className="mt-2 w-full rounded-lg border border-green-800/40 bg-slate-950/60 px-4 py-3 text-base font-medium text-white outline-none ring-green-500/50 transition placeholder:text-slate-500 focus:border-green-600/60 focus:ring-2"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-300">
                                Font
                            </label>
                            <div className="flex gap-2">
                                {Object.values(BOARD_VARIANTS).map((variant) => (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        onClick={() =>
                                            updateTextElement(selectedId, {
                                                fontFamily: variant.fontFamily,
                                            })
                                        }
                                        className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                                            selectedElement.fontFamily === variant.fontFamily
                                                ? "border-green-600 bg-green-950/40 text-white"
                                                : "border-slate-700/50 bg-slate-800/30 text-slate-300 hover:border-green-700/50 hover:bg-slate-800/50"
                                        }`}
                                    >
                                        {variant.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-300">
                                Font Size: {selectedElement.fontSize}px
                            </label>
                            <input
                                type="range"
                                min="20"
                                max="300"
                                step="5"
                                value={selectedElement.fontSize}
                                onChange={(e) =>
                                    updateTextElement(selectedId, {
                                        fontSize: Number(e.target.value),
                                    })
                                }
                                className="mt-2 w-full"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm font-medium text-slate-300">
                                    X Position: {selectedElement.x.toFixed(0)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={selectedElement.x}
                                    onChange={(e) =>
                                        updateTextElement(selectedId, { x: Number(e.target.value) })
                                    }
                                    className="mt-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300">
                                    Y Position: {selectedElement.y.toFixed(0)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="1"
                                    value={selectedElement.y}
                                    onChange={(e) =>
                                        updateTextElement(selectedId, { y: Number(e.target.value) })
                                    }
                                    className="mt-2 w-full"
                                />
                            </div>
                        </div>

                        <p className="text-xs text-slate-400">
                            💡 Tip: Click on the canvas to position text
                        </p>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                        <span>
                            Could not load the board image. Check VITE_BOARD_IMAGE_URL or ensure
                            board-placeholder.png exists.
                        </span>
                    </div>
                )}
            </div>

            {/* Right Panel - Preview */}
            <div className="flex flex-col rounded-xl border border-green-900/30 bg-slate-900/50 p-6 shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-green-400">
                            Live Preview
                        </p>
                        <p className="mt-0.5 text-sm text-slate-400">
                            Click to position selected text
                        </p>
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                            status === "loading"
                                ? "bg-yellow-900/30 text-yellow-300"
                                : "bg-green-900/30 text-green-300"
                        }`}
                    >
                        {status === "loading" ? "Loading..." : "Ready"}
                    </span>
                </div>

                <div className="flex flex-1 items-center justify-center rounded-lg border border-slate-700/50 bg-slate-950/60 p-6">
                    <canvas
                        ref={canvasRef}
                        aria-label="Board preview"
                        onClick={handleCanvasClick}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                        style={{ width: "100%", maxWidth: "500px", height: "auto" }}
                        className="cursor-crosshair"
                    />
                </div>

                <div className="mt-4 flex gap-3">
                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={!canDownload}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-slate-700/50 disabled:text-slate-500 disabled:shadow-none"
                    >
                        <Download size={16} /> Download
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600/50 bg-slate-800/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-700/50"
                    >
                        <RefreshCw size={16} /> Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
