import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Loader2 } from "lucide-react";
import EmojiPicker from "./EmojiPicker";

export default function NoteEditor({ 
  note, 
  onSave, 
  onCancel, 
  isOpen, 
  isSaving = false 
}) {
  const [content, setContent] = useState("");
  const [symbol, setSymbol] = useState("🙂");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (note) {
      setContent(note.content || "");
      setSymbol(note.symbol || "🙂");
    } else {
      setContent("");
      setSymbol("🙂");
    }
  }, [note]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSave = () => {
    if (content.trim()) {
      onSave({
        content: content.trim(),
        symbol
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onCancel()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-4">
                <EmojiPicker 
                  selectedEmoji={symbol}
                  onSelect={setSymbol}
                  size="large"
                />
                <div>
                  <h2 className="text-xl font-semibold">
                    {note ? 'Edit Note' : 'New Note'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {note ? 'Update your research note' : 'Capture your insights'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Textarea
                  ref={textareaRef}
                  placeholder="What did you learn? What insights did you capture?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-32 resize-none border-0 bg-gray-50 focus:bg-white transition-colors text-base leading-relaxed"
                  disabled={isSaving}
                />
                <div className="text-xs text-gray-400 flex justify-between">
                  <span>Press Ctrl+Enter to save quickly</span>
                  <span>{content.length} characters</span>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!content.trim() || isSaving}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {note ? 'Update Note' : 'Save Note'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}