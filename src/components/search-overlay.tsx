'use client'

import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useEffect } from "react"

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        } else {
            document.removeEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={onClose} // Fermer en cliquant en dehors du contenu
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 50 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-lg rounded-lg bg-background p-6 shadow-lg md:p-8"
                        onClick={(e) => e.stopPropagation()} // Empêcher la propagation du clic pour ne pas fermer
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center space-x-2">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Rechercher dans le tableau de bord..."
                                className="flex-1 border-0 bg-transparent pl-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
