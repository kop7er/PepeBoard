/** biome-ignore-all lint/a11y/noLabelWithoutControl: no form required */

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createFileRoute } from "@tanstack/react-router";
import {
    AlertTriangle,
    Check,
    Copy,
    Download,
    Eye,
    EyeOff,
    Grid3X3,
    GripVertical,
    Keyboard,
    Plus,
    Redo2,
    RefreshCw,
    Trash2,
    Undo2,
    X,
    ZoomIn,
    ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { BOARD_VARIANTS, FALLBACK_BOARD_SIZE } from "../lib/boardConfig";
import { useBoardImage } from "../lib/useBoardImage";

interface TextElement {
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily: string;
    color: string;
    strokeColor: string;
    strokeWidth: number;
    visible: boolean;
    rotation: number;
}

type HistoryState = TextElement[];

export const Route = createFileRoute("/")({
    component: Home,
});

const generateId = () => crypto.randomUUID();

const DEFAULT_TEXT_ELEMENT: Omit<TextElement, "id"> = {
    text: "PEPE",
    x: 50,
    y: 23,
    fontSize: 120,
    fontFamily: BOARD_VARIANTS.normal.fontFamily,
    color: "#111827",
    strokeColor: "rgba(255,255,255,0.8)",
    strokeWidth: 6,
    visible: true,
    rotation: 0,
};

const PRESET_COLORS = [
    "#111827",
    "#FFFFFF",
    "#EF4444",
    "#F97316",
    "#EAB308",
    "#22C55E",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
];

// Custom hook for undo/redo
function useHistory<T>(initialState: T) {
    const [history, setHistory] = useState<T[]>([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const current = history[currentIndex];

    const set = useCallback(
        (newState: T | ((prev: T) => T)) => {
            setHistory((prev) => {
                const resolved =
                    typeof newState === "function"
                        ? (newState as (prev: T) => T)(prev[currentIndex])
                        : newState;
                const newHistory = prev.slice(0, currentIndex + 1);
                return [...newHistory, resolved];
            });
            setCurrentIndex((prev) => prev + 1);
        },
        [currentIndex],
    );

    const undo = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    }, [currentIndex]);

    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, history.length]);

    const canUndo = currentIndex > 0;
    const canRedo = currentIndex < history.length - 1;

    const reset = useCallback((newState: T) => {
        setHistory([newState]);
        setCurrentIndex(0);
    }, []);

    return { current, set, undo, redo, canUndo, canRedo, reset };
}

// Sortable layer item
function SortableLayerItem({
    element,
    isSelected,
    onSelect,
    onDelete,
    onToggleVisibility,
    canDelete,
}: {
    element: TextElement;
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onToggleVisibility: () => void;
    canDelete: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: element.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 rounded-lg border px-2 py-2 transition ${
                isSelected
                    ? "border-green-600 bg-green-950/40"
                    : "border-slate-700/50 bg-slate-800/30 hover:border-green-700/50"
            } ${!element.visible ? "opacity-50" : ""}`}
        >
            <button
                type="button"
                className="cursor-grab touch-none text-slate-500 hover:text-slate-300"
                {...attributes}
                {...listeners}
            >
                <GripVertical size={14} />
            </button>
            <button
                type="button"
                onClick={onSelect}
                className="flex-1 truncate text-left text-sm font-medium text-white"
            >
                {element.text || "Empty"}
            </button>
            <div
                className="h-3 w-3 rounded-full border border-slate-600"
                style={{ backgroundColor: element.color }}
                title={`Color: ${element.color}`}
            />
            <button
                type="button"
                onClick={onToggleVisibility}
                className="rounded p-1 text-slate-400 transition hover:bg-slate-700/50 hover:text-white"
                title={element.visible ? "Hide layer" : "Show layer"}
            >
                {element.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            {canDelete && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="rounded p-1 text-slate-400 transition hover:bg-red-900/30 hover:text-red-400"
                    title="Delete layer"
                >
                    <Trash2 size={14} />
                </button>
            )}
        </div>
    );
}

// Keyboard shortcuts modal
function ShortcutsModal({ onClose }: { onClose: () => void }) {
    const shortcuts = [
        { keys: ["Ctrl", "Z"], desc: "Undo" },
        { keys: ["Ctrl", "Shift", "Z"], desc: "Redo" },
        { keys: ["Ctrl", "C"], desc: "Copy layer" },
        { keys: ["Ctrl", "V"], desc: "Paste layer" },
        { keys: ["Delete"], desc: "Delete layer" },
        { keys: ["↑", "↓", "←", "→"], desc: "Move text (1%)" },
        { keys: ["Shift", "+", "Arrow"], desc: "Move text (5%)" },
        { keys: ["H"], desc: "Center horizontally" },
        { keys: ["V"], desc: "Center vertically" },
        { keys: ["G"], desc: "Toggle grid" },
        { keys: ["?"], desc: "Toggle shortcuts" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-xl border border-green-900/30 bg-slate-900 p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-2">
                    {shortcuts.map((shortcut) => (
                        <div
                            key={shortcut.desc}
                            className="flex items-center justify-between py-1.5"
                        >
                            <span className="text-sm text-slate-300">{shortcut.desc}</span>
                            <div className="flex gap-1">
                                {shortcut.keys.map((key) => (
                                    <kbd
                                        key={key}
                                        className="rounded bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300"
                                    >
                                        {key}
                                    </kbd>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Toast notification
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 2000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-in">
            <div className="flex items-center gap-2 rounded-lg border border-green-800/50 bg-slate-900/95 px-4 py-2.5 shadow-lg backdrop-blur-sm">
                <Check size={16} className="text-green-400" />
                <span className="text-sm font-medium text-white">{message}</span>
            </div>
        </div>
    );
}

function Home() {
    const initialId = useMemo(() => generateId(), []);

    const {
        current: textElements,
        set: setTextElements,
        undo,
        redo,
        canUndo,
        canRedo,
        reset: resetHistory,
    } = useHistory<HistoryState>([{ ...DEFAULT_TEXT_ELEMENT, id: initialId }]);

    const [selectedId, setSelectedId] = useState<string>(initialId);
    const [fontsReady, setFontsReady] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [zoom, setZoom] = useState(100);
    const [showGrid, setShowGrid] = useState(false);
    const [clipboard, setClipboard] = useState<TextElement | null>(null);
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const userProvidedImage = import.meta.env.VITE_BOARD_IMAGE_URL?.trim();
    const boardImageUrl =
        userProvidedImage && userProvidedImage.length > 0
            ? userProvidedImage
            : "/board-placeholder.png";
    const { image, status } = useBoardImage(boardImageUrl);

    const selectedElement = textElements.find((el) => el.id === selectedId);

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const showToast = useCallback((message: string) => {
        setToast(message);
    }, []);

    // Helper functions defined with useCallback for stability
    const updateTextElement = useCallback(
        (id: string, updates: Partial<TextElement>) => {
            setTextElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
        },
        [setTextElements],
    );

    const deleteTextElement = useCallback(
        (id: string) => {
            setTextElements((prev) => {
                const filtered = prev.filter((el) => el.id !== id);
                if (selectedId === id && filtered.length > 0) {
                    setSelectedId(filtered[0].id);
                }
                return filtered;
            });
        },
        [setTextElements, selectedId],
    );

    const addTextElement = useCallback(() => {
        const newId = generateId();
        const newElement: TextElement = {
            ...DEFAULT_TEXT_ELEMENT,
            id: newId,
            text: "NEW TEXT",
            fontFamily: selectedElement?.fontFamily || BOARD_VARIANTS.normal.fontFamily,
            color: selectedElement?.color || DEFAULT_TEXT_ELEMENT.color,
            strokeColor: selectedElement?.strokeColor || DEFAULT_TEXT_ELEMENT.strokeColor,
        };
        setTextElements((prev) => [...prev, newElement]);
        setSelectedId(newId);
    }, [setTextElements, selectedElement]);

    const duplicateElement = useCallback(() => {
        if (!selectedElement) return;
        const newId = generateId();
        const newElement: TextElement = {
            ...selectedElement,
            id: newId,
            x: Math.min(selectedElement.x + 5, 95),
            y: Math.min(selectedElement.y + 5, 95),
        };
        setTextElements((prev) => [...prev, newElement]);
        setSelectedId(newId);
        showToast("Duplicated layer");
    }, [selectedElement, setTextElements, showToast]);

    // Font loading
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
            fonts.load(`16px ${variant.fontFamily}`).catch(() => {}),
        );

        Promise.all(fontLoadPromises)
            .then(() => setFontsReady(true))
            .catch(() => setFontsReady(true));
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInputFocused =
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable;

            // Undo
            if (e.ctrlKey && e.key === "z" && !e.shiftKey && !isInputFocused) {
                e.preventDefault();
                if (canUndo) {
                    undo();
                    showToast("Undo");
                }
            }

            // Redo
            if (
                ((e.ctrlKey && e.shiftKey && e.key === "z") || (e.ctrlKey && e.key === "y")) &&
                !isInputFocused
            ) {
                e.preventDefault();
                if (canRedo) {
                    redo();
                    showToast("Redo");
                }
            }

            // Copy
            if (e.ctrlKey && e.key === "c" && !isInputFocused && selectedElement) {
                setClipboard({ ...selectedElement });
                showToast("Copied layer");
            }

            // Paste
            if (e.ctrlKey && e.key === "v" && !isInputFocused && clipboard) {
                const newId = generateId();
                const newElement = {
                    ...clipboard,
                    id: newId,
                    x: Math.min(clipboard.x + 5, 95),
                    y: Math.min(clipboard.y + 5, 95),
                };
                setTextElements((prev) => [...prev, newElement]);
                setSelectedId(newId);
                showToast("Pasted layer");
            }

            // Delete
            if (
                (e.key === "Delete" || e.key === "Backspace") &&
                !isInputFocused &&
                selectedElement &&
                textElements.length > 1
            ) {
                e.preventDefault();
                deleteTextElement(selectedElement.id);
                showToast("Deleted layer");
            }

            // Shortcuts modal
            if (e.key === "?" && !isInputFocused) {
                setShowShortcuts((prev) => !prev);
            }

            // Toggle grid
            if (e.key === "g" && !isInputFocused) {
                setShowGrid((prev) => !prev);
                showToast("Grid toggled");
            }

            // Arrow keys
            if (
                ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) &&
                !isInputFocused &&
                selectedElement
            ) {
                e.preventDefault();
                const step = e.shiftKey ? 5 : 1;
                const updates: Partial<TextElement> = {};

                if (e.key === "ArrowUp") updates.y = Math.max(0, selectedElement.y - step);
                if (e.key === "ArrowDown") updates.y = Math.min(100, selectedElement.y + step);
                if (e.key === "ArrowLeft") updates.x = Math.max(0, selectedElement.x - step);
                if (e.key === "ArrowRight") updates.x = Math.min(100, selectedElement.x + step);

                updateTextElement(selectedId, updates);
            }

            // Center horizontally
            if (e.key === "h" && !isInputFocused && selectedElement) {
                updateTextElement(selectedId, { x: 50 });
                showToast("Centered horizontally");
            }

            // Center vertically
            if (e.key === "v" && !e.ctrlKey && !isInputFocused && selectedElement) {
                updateTextElement(selectedId, { y: 50 });
                showToast("Centered vertically");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        canUndo,
        canRedo,
        undo,
        redo,
        selectedElement,
        clipboard,
        textElements.length,
        selectedId,
        showToast,
        setTextElements,
        deleteTextElement,
        updateTextElement,
    ]);

    const PREVIEW_WIDTH = useMemo(() => (500 * zoom) / 100, [zoom]);

    // Canvas rendering
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

        // Draw grid
        if (showGrid) {
            ctx.strokeStyle = "rgba(34, 197, 94, 0.3)";
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);

            ctx.beginPath();
            ctx.moveTo(width / 2, 0);
            ctx.lineTo(width / 2, height);
            ctx.moveTo(0, height / 2);
            ctx.lineTo(width, height / 2);
            ctx.stroke();

            ctx.strokeStyle = "rgba(34, 197, 94, 0.15)";
            ctx.beginPath();
            ctx.moveTo(width / 3, 0);
            ctx.lineTo(width / 3, height);
            ctx.moveTo((width * 2) / 3, 0);
            ctx.lineTo((width * 2) / 3, height);
            ctx.moveTo(0, height / 3);
            ctx.lineTo(width, height / 3);
            ctx.moveTo(0, (height * 2) / 3);
            ctx.lineTo(width, (height * 2) / 3);
            ctx.stroke();

            ctx.setLineDash([]);
        }

        // Draw text elements
        textElements.forEach((element) => {
            if (!element.text || !element.visible) return;

            const scale = height / FALLBACK_BOARD_SIZE.height;
            const fontSize = Math.round(element.fontSize * scale);

            ctx.save();

            const textX = (element.x / 100) * width;
            const textY = (element.y / 100) * height;

            ctx.translate(textX, textY);
            ctx.rotate((element.rotation * Math.PI) / 180);

            ctx.font = `${fontSize}px ${element.fontFamily}, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
            ctx.fillStyle = element.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineJoin = "round";
            ctx.lineWidth = Math.max(element.strokeWidth * scale, 2);
            ctx.strokeStyle = element.strokeColor;

            ctx.strokeText(element.text, 0, 0);
            ctx.fillText(element.text, 0, 0);

            // Selection indicator
            if (element.id === selectedId) {
                const metrics = ctx.measureText(element.text);
                const textWidth = metrics.width;
                const textHeight = fontSize;

                ctx.strokeStyle = "rgba(34, 197, 94, 0.8)";
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.strokeRect(
                    -textWidth / 2 - 8,
                    -textHeight / 2 - 4,
                    textWidth + 16,
                    textHeight + 8,
                );
                ctx.setLineDash([]);
            }

            ctx.restore();
        });
    }, [textElements, image, fontsReady, showGrid, selectedId, PREVIEW_WIDTH]);

    const handleCanvasInteraction = useCallback(
        (event: React.MouseEvent<HTMLCanvasElement>, forceUpdate = false) => {
            if (!canvasRef.current || (!isDragging && !forceUpdate)) return;

            const rect = canvasRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
            const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));

            if (selectedElement) {
                updateTextElement(selectedId, { x, y });
            }
        },
        [isDragging, selectedElement, selectedId, updateTextElement],
    );

    const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true);
        handleCanvasInteraction(event, true);
    };

    const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        handleCanvasInteraction(event);
    };

    const handleCanvasMouseUp = () => {
        setIsDragging(false);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setTextElements((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const canDownload =
        Boolean(canvasRef.current) && textElements.some((el) => el.text.trim() && el.visible);

    const handleDownload = () => {
        if (!image) return;

        const downloadCanvas = document.createElement("canvas");
        const ctx = downloadCanvas.getContext("2d");
        if (!ctx) return;

        const width = image.naturalWidth;
        const height = image.naturalHeight;

        downloadCanvas.width = width;
        downloadCanvas.height = height;

        ctx.drawImage(image, 0, 0, width, height);

        textElements.forEach((element) => {
            if (!element.text || !element.visible) return;

            const scale = height / FALLBACK_BOARD_SIZE.height;
            const fontSize = Math.round(element.fontSize * scale);

            ctx.save();

            const textX = (element.x / 100) * width;
            const textY = (element.y / 100) * height;

            ctx.translate(textX, textY);
            ctx.rotate((element.rotation * Math.PI) / 180);

            ctx.font = `${fontSize}px ${element.fontFamily}, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
            ctx.fillStyle = element.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.lineJoin = "round";
            ctx.lineWidth = Math.max(element.strokeWidth * scale, 2);
            ctx.strokeStyle = element.strokeColor;

            ctx.strokeText(element.text, 0, 0);
            ctx.fillText(element.text, 0, 0);

            ctx.restore();
        });

        const link = document.createElement("a");
        link.download = `pepe-board-${Date.now()}.png`;
        link.href = downloadCanvas.toDataURL("image/png");
        link.click();
    };

    const handleReset = () => {
        const resetId = generateId();
        resetHistory([{ ...DEFAULT_TEXT_ELEMENT, id: resetId }]);
        setSelectedId(resetId);
        showToast("Reset to default");
    };

    return (
        <>
            <div className="grid w-full gap-6 lg:grid-cols-[400px_1fr]">
                {/* Left Panel */}
                <div className="space-y-4 rounded-xl border border-green-900/30 bg-slate-900/50 p-6 shadow-lg">
                    {/* Header with undo/redo */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Text Layers</h2>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => {
                                    undo();
                                    showToast("Undo");
                                }}
                                disabled={!canUndo}
                                className="rounded p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                title="Undo (Ctrl+Z)"
                            >
                                <Undo2 size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    redo();
                                    showToast("Redo");
                                }}
                                disabled={!canRedo}
                                className="rounded p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                title="Redo (Ctrl+Shift+Z)"
                            >
                                <Redo2 size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowShortcuts(true)}
                                className="rounded p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                                title="Keyboard shortcuts (?)"
                            >
                                <Keyboard size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={addTextElement}
                                className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-green-900/30 transition hover:bg-green-500"
                            >
                                <Plus size={14} /> Add
                            </button>
                        </div>
                    </div>

                    {/* Sortable layers */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={textElements.map((el) => el.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {textElements.map((element) => (
                                    <SortableLayerItem
                                        key={element.id}
                                        element={element}
                                        isSelected={selectedId === element.id}
                                        onSelect={() => setSelectedId(element.id)}
                                        onDelete={() => deleteTextElement(element.id)}
                                        onToggleVisibility={() =>
                                            updateTextElement(element.id, {
                                                visible: !element.visible,
                                            })
                                        }
                                        canDelete={textElements.length > 1}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {/* Selected element editor */}
                    {selectedElement && (
                        <div className="space-y-4 border-t border-slate-700/50 pt-4">
                            {/* Text input */}
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

                            {/* Font selection */}
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

                            {/* Color picker */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Text Color
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {PRESET_COLORS.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() =>
                                                updateTextElement(selectedId, { color })
                                            }
                                            className={`h-8 w-8 rounded-lg border-2 transition ${
                                                selectedElement.color === color
                                                    ? "border-green-500 ring-2 ring-green-500/50"
                                                    : "border-slate-600 hover:border-slate-400"
                                            }`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                    <input
                                        type="color"
                                        value={selectedElement.color}
                                        onChange={(e) =>
                                            updateTextElement(selectedId, { color: e.target.value })
                                        }
                                        className="h-8 w-8 cursor-pointer rounded-lg border-2 border-slate-600 bg-transparent"
                                        title="Custom color"
                                    />
                                </div>
                            </div>

                            {/* Font size */}
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

                            {/* Stroke width */}
                            <div>
                                <label className="text-sm font-medium text-slate-300">
                                    Stroke Width: {selectedElement.strokeWidth}px
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    step="1"
                                    value={selectedElement.strokeWidth}
                                    onChange={(e) =>
                                        updateTextElement(selectedId, {
                                            strokeWidth: Number(e.target.value),
                                        })
                                    }
                                    className="mt-2 w-full"
                                />
                            </div>

                            {/* Rotation */}
                            <div>
                                <label className="text-sm font-medium text-slate-300">
                                    Rotation: {selectedElement.rotation}°
                                </label>
                                <input
                                    type="range"
                                    min="-180"
                                    max="180"
                                    step="5"
                                    value={selectedElement.rotation}
                                    onChange={(e) =>
                                        updateTextElement(selectedId, {
                                            rotation: Number(e.target.value),
                                        })
                                    }
                                    className="mt-2 w-full"
                                />
                            </div>

                            {/* Position controls */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium text-slate-300">
                                        X: {selectedElement.x.toFixed(0)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={selectedElement.x}
                                        onChange={(e) =>
                                            updateTextElement(selectedId, {
                                                x: Number(e.target.value),
                                            })
                                        }
                                        className="mt-2 w-full"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-300">
                                        Y: {selectedElement.y.toFixed(0)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="1"
                                        value={selectedElement.y}
                                        onChange={(e) =>
                                            updateTextElement(selectedId, {
                                                y: Number(e.target.value),
                                            })
                                        }
                                        className="mt-2 w-full"
                                    />
                                </div>
                            </div>

                            {/* Quick actions */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => updateTextElement(selectedId, { x: 50, y: 50 })}
                                    className="flex-1 rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-700/50"
                                >
                                    Center
                                </button>
                                <button
                                    type="button"
                                    onClick={duplicateElement}
                                    className="flex-1 rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-700/50"
                                >
                                    <Copy size={12} className="mr-1 inline" />
                                    Duplicate
                                </button>
                            </div>
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
                                Drag to position • Scroll to zoom
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowGrid((prev) => !prev)}
                                className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                                    showGrid
                                        ? "border-green-600 bg-green-950/40 text-green-300"
                                        : "border-slate-700/50 bg-slate-800/30 text-slate-400 hover:text-white"
                                }`}
                                title="Toggle grid (G)"
                            >
                                <Grid3X3 size={14} />
                            </button>
                            <div className="flex items-center gap-1 rounded-lg border border-slate-700/50 bg-slate-800/30 px-2 py-1">
                                <button
                                    type="button"
                                    onClick={() => setZoom((z) => Math.max(50, z - 25))}
                                    className="rounded p-0.5 text-slate-400 transition hover:text-white"
                                    disabled={zoom <= 50}
                                >
                                    <ZoomOut size={14} />
                                </button>
                                <span className="min-w-10 text-center text-xs font-medium text-slate-300">
                                    {zoom}%
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setZoom((z) => Math.min(150, z + 25))}
                                    className="rounded p-0.5 text-slate-400 transition hover:text-white"
                                    disabled={zoom >= 150}
                                >
                                    <ZoomIn size={14} />
                                </button>
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
                    </div>

                    <div className="flex flex-1 items-center justify-center overflow-auto rounded-lg border border-slate-700/50 bg-slate-950/60 p-6">
                        <canvas
                            ref={canvasRef}
                            aria-label="Board preview"
                            onMouseDown={handleCanvasMouseDown}
                            onMouseMove={handleCanvasMouseMove}
                            onMouseUp={handleCanvasMouseUp}
                            onMouseLeave={handleCanvasMouseUp}
                            style={{
                                width: `${PREVIEW_WIDTH}px`,
                                maxWidth: "100%",
                                height: "auto",
                            }}
                            className={`cursor-crosshair transition-shadow ${isDragging ? "shadow-lg shadow-green-500/20" : ""}`}
                        />
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={!canDownload}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-900/30 transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-slate-700/50 disabled:text-slate-500 disabled:shadow-none"
                        >
                            <Download size={16} /> Download PNG
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

            {/* Modals and overlays */}
            {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </>
    );
}
