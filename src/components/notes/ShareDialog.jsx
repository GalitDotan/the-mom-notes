import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Mail, Plus, Trash2, Users, Send } from "lucide-react";
import { Share } from "@/api/entities";
import { User } from "@/api/entities";
import { toast } from "sonner";

export default function ShareDialog({ note, isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [shares, setShares] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen && note) {
      loadShares();
    }
  }, [isOpen, note]);

  const loadShares = async () => {
    if (!note) return;
    try {
      const shareData = await Share.filter({ note_id: note.id });
      setShares(shareData);
    } catch (error) {
      console.error("Failed to load shares:", error);
    }
  };

  const handleShare = async () => {
    if (!email.trim()) return;
    
    setIsSending(true);
    try {
      // Check if already shared with this email
      const existingShare = shares.find(s => s.shared_with_email === email.trim());
      if (existingShare) {
        toast.error("Note is already shared with this email");
        setIsSending(false);
        return;
      }

      await Share.create({
        note_id: note.id,
        shared_with_email: email.trim()
      });

      setEmail("");
      await loadShares();
      toast.success("Note shared successfully!");
    } catch (error) {
      toast.error("Failed to share note");
      console.error("Share error:", error);
    }
    setIsSending(false);
  };

  const handleRemoveShare = async (shareId) => {
    try {
      await Share.delete(shareId);
      await loadShares();
      toast.success("Share removed");
    } catch (error) {
      toast.error("Failed to remove share");
      console.error("Remove share error:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleShare();
    }
  };

  if (!isOpen || !note) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Share Note</CardTitle>
                  <p className="text-sm text-gray-500">Invite others to view this note</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Note Preview */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{note.symbol}</span>
                  <span className="text-sm font-medium text-gray-600">Note Preview</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {note.content}
                </p>
              </div>

              {/* Share Input */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                    disabled={isSending}
                  />
                  <Button
                    onClick={handleShare}
                    disabled={!email.trim() || isSending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSending ? (
                      <Mail className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  They'll be able to view this note once they sign in
                </p>
              </div>

              {/* Current Shares */}
              {shares.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Shared with:</h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {shares.map((share) => (
                      <div
                        key={share.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs text-blue-600 font-medium">
                              {share.shared_with_email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-700">
                            {share.shared_with_email}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveShare(share.id)}
                          className="h-6 w-6 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {shares.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">This note isn't shared with anyone yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}