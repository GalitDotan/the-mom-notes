import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, History, Clock, ArrowLeft } from "lucide-react";
import { NoteVersion } from "@/api/entities";
import { format } from "date-fns";

const EMOJI_LABELS = {
  "🙂": "Excited",
  "🙁": "Angry", 
  "😳": "Embarrassed",
  "⚡": "Pain/Problem",
  "🥅": "Goal",
  "🟥": "Obstacle", 
  "↪️": "Workaround",
  "🏔": "Context",
  "☑️": "Feature Request",
  "💲": "Budget",
  "♀️": "Person/Company", 
  "⭐": "Follow-up"
};

export default function VersionHistory({ note, isOpen, onClose }) {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && note) {
      loadVersions();
    }
  }, [isOpen, note]);

  const loadVersions = async () => {
    if (!note) return;
    setIsLoading(true);
    try {
      const versionData = await NoteVersion.filter(
        { note_id: note.id }, 
        "-created_date"
      );
      setVersions(versionData);
    } catch (error) {
      console.error("Failed to load versions:", error);
    }
    setIsLoading(false);
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
          className="w-full max-w-4xl max-h-[80vh] flex"
        >
          <div className="flex-1 flex">
            {/* Version List */}
            <Card className="shadow-2xl border-0 rounded-r-none w-80">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <History className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Version History</CardTitle>
                    <p className="text-sm text-gray-500">{versions.length} versions</p>
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
              
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-6 text-center text-gray-500">
                      <Clock className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                      Loading versions...
                    </div>
                  ) : versions.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No version history available
                    </div>
                  ) : (
                    <div className="space-y-1 p-2">
                      {versions.map((version, index) => (
                        <button
                          key={version.id}
                          onClick={() => setSelectedVersion(version)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                            selectedVersion?.id === version.id
                              ? 'bg-blue-100 border border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg">{version.symbol}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={index === 0 ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {index === 0 ? "Current" : `Version ${versions.length - index}`}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {version.content}
                          </p>
                          <p className="text-xs text-gray-400">
                            {format(new Date(version.created_date), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Version Detail */}
            <Card className="shadow-2xl border-0 rounded-l-none flex-1 border-l">
              <CardContent className="p-6 h-full">
                {selectedVersion ? (
                  <div className="h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl">{selectedVersion.symbol}</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {EMOJI_LABELS[selectedVersion.symbol]}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(selectedVersion.created_date), "MMMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedVersion.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <ArrowLeft className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Select a version to view its details</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}