import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Download, ZoomIn, ZoomOut } from "lucide-react";

export default function ImageLightbox({ image, isOpen, onClose }) {
    const [zoom, setZoom] = React.useState(1);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
        if (isOpen) {
            setZoom(1);
            setPosition({ x: 0, y: 0 });
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === '+' || e.key === '=') {
                handleZoomIn();
            } else if (e.key === '-') {
                handleZoomOut();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev * 1.5, 5));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev / 1.5, 0.5));
    };

    const handleMouseDown = (e) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !image) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center"
                onClick={handleBackdropClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                {/* Controls */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <div className="flex bg-black/50 rounded-lg p-1 gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20 h-8 w-8"
                            onClick={handleZoomOut}
                            disabled={zoom <= 0.5}
                            title="Zoom out (-)"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </Button>
                        <span className="text-white text-sm px-2 py-1 self-center min-w-[60px] text-center">
                            {Math.round(zoom * 100)}%
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20 h-8 w-8"
                            onClick={handleZoomIn}
                            disabled={zoom >= 5}
                            title="Zoom in (+)"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 bg-black/50 h-8 w-8"
                        asChild
                    >
                        <a href={image.url} download title="Download image">
                            <Download className="w-4 h-4" />
                        </a>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 bg-black/50 h-8 w-8"
                        onClick={onClose}
                        title="Close (Esc)"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Image */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative max-w-[90vw] max-h-[90vh] overflow-hidden"
                >
                    <img
                        src={image.url}
                        alt={image.alt || 'Full size view'}
                        className={`max-w-full max-h-full object-contain transition-transform ${zoom > 1 ? 'cursor-move' : 'cursor-zoom-in'
                            }`}
                        style={{
                            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                        }}
                        onMouseDown={handleMouseDown}
                        onClick={zoom === 1 ? handleZoomIn : undefined}
                        draggable={false}
                    />
                </motion.div>

                {/* Image info */}
                {image.alt && (
                    <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg max-w-md mx-auto">
                        <p className="text-sm">{image.alt}</p>
                    </div>
                )}

                {/* Instructions */}
                <div className="absolute bottom-4 right-4 text-white/70 text-xs">
                    Click to zoom • Drag to pan • Esc to close
                </div>
            </motion.div>
        </AnimatePresence>
    );
}