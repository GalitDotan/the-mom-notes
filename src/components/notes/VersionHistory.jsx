
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import { X, History, Clock, ArrowLeft, Star, UserCircle, ThumbsUp, ThumbsDown, Link as LinkIcon, Tag as TopicIcon, MessageSquare, Image as ImageIcon, Download } from "lucide-react";
import { NoteVersion } from "@/entities/NoteVersion";
import { format } from "date-fns";

const EMOJI_LABELS = {
  "🙂": "Excited", "🙁": "Angry", "😳": "Embarrassed", "💥": "Pain/Problem",
  "🥅": "Goal", "🟥": "Obstacle", "↪️": "Workaround", "🏔": "Context",
  "☑️": "Feature Request", "💲": "Budget", "♀️": "Person/Company", "⭐": "Follow-up"
};

// Utility to get domain from URL for display (same as in NoteCard)
const getDomainFromUrl = (url) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch (e) {
    return url;
  }
};

export default function VersionHistory({ note, isOpen, onClose }) {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && note) {
      loadVersions();
      setSelectedVersion(null); 
    }
  }, [isOpen, note]);

  const loadVersions = async () => {
    if (!note) return;
    setIsLoading(true);
    try {
      const versionData = await NoteVersion.filter(
        { note_id: note.id }, 
        "-created_date" // Sort by most recent first
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
          className="w-full max-w-3xl md:max-w-4xl max-h-[85vh] flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Version List Pane */}
          <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <History className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Version History</CardTitle>
                  <p className="text-xs text-gray-500">{versions.length} versions</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            
            <CardContent className="p-2 flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-6 text-center text-gray-500">
                  <Clock className="w-6 h-6 mx-auto mb-2 animate-spin text-purple-500" />
                  Loading versions...
                </div>
              ) : versions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <History className="w-6 h-6 mx-auto mb-2 opacity-50" />
                  No version history available.
                </div>
              ) : (
                <div className="space-y-1">
                  {versions.map((version, index) => (
                    <button
                      key={version.id}
                      onClick={() => setSelectedVersion(version)}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-150 ${
                        selectedVersion?.id === version.id
                          ? 'bg-[var(--ruby-dust-100)] border border-[var(--ruby-dust-300)] shadow-sm'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 mb-1.5">
                        <span className="text-xl mt-0.5">{version.symbol}</span>
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between">
                            <Badge 
                              variant={selectedVersion?.id === version.id ? "default" : "secondary"}
                              className={`text-xs px-1.5 py-0.5 ${selectedVersion?.id === version.id ? 'bg-[var(--ruby-dust-600)] text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                              {note.current_version_id === version.id ? "Current" : `Version ${versions.length - index}`}
                            </Badge>
                           </div>
                          <p className="text-sm text-gray-700 line-clamp-2 break-words mt-1">
                            {version.content}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 ml-[34px]">
                        {version.created_date ? format(new Date(version.created_date), "MMM d, yyyy, h:mm a") : 'No date'}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </div>

          {/* Version Detail Pane */}
          <div className="w-full md:w-2/3 flex flex-col">
            <CardHeader className="p-4 border-b">
                {selectedVersion ? (
                     <div className="flex items-start gap-3">
                        <div className="text-3xl">{selectedVersion.symbol}</div>
                        <div className="flex-1 space-y-1.5">
                            <h3 className="text-lg font-semibold">
                            {EMOJI_LABELS[selectedVersion.symbol] || "Note Details"}
                            </h3>
                            <p className="text-xs text-gray-500">
                              Saved on: {selectedVersion.created_date ? format(new Date(selectedVersion.created_date), "MMMM d, yyyy 'at' h:mm a") : 'No Date'}
                            </p>
                            
                            {/* Client Tags */}
                            {selectedVersion.client_reference && Array.isArray(selectedVersion.client_reference) && selectedVersion.client_reference.length > 0 && (
                              <div className="flex flex-wrap gap-1 items-center">
                                <UserCircle className="w-3.5 h-3.5 text-gray-400 mr-1" />
                                {selectedVersion.client_reference.map((tag, index) => (
                                  <Badge key={`client-${tag}-${index}`} variant="outline" className="text-xs bg-[var(--ruby-dust-50)] text-[var(--ruby-dust-700)] border-[var(--ruby-dust-200)]">{tag}</Badge>
                                ))}
                              </div>
                            )}

                            {/* Handle legacy single string client_reference */}
                            {selectedVersion.client_reference && typeof selectedVersion.client_reference === 'string' && (
                              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <UserCircle className="w-3.5 h-3.5" />
                                <span>{selectedVersion.client_reference}</span>
                              </div>
                            )}
                            
                            {/* Topics */}
                            {selectedVersion.topics && Array.isArray(selectedVersion.topics) && selectedVersion.topics.length > 0 && (
                              <div className="flex flex-wrap gap-1 items-center">
                                <TopicIcon className="w-3.5 h-3.5 text-gray-400 mr-1" />
                                {selectedVersion.topics.map((topic, index) => (
                                  <Badge key={`topic-${topic}-${index}`} variant="outline" className="text-xs bg-sky-50 text-sky-700 border-sky-200">{topic}</Badge>
                                ))}
                              </div>
                            )}
                            
                            {/* References */}
                            {selectedVersion.references && Array.isArray(selectedVersion.references) && selectedVersion.references.length > 0 && (
                               <div className="flex flex-wrap gap-1 items-center">
                                <LinkIcon className="w-3.5 h-3.5 text-gray-400 mr-1" />
                                {selectedVersion.references.map((refUrl, index) => (
                                  <a key={`ref-${index}`} href={refUrl} target="_blank" rel="noopener noreferrer"
                                     className="text-xs text-blue-600 hover:underline bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200 max-w-[150px] truncate" title={refUrl}>
                                    {getDomainFromUrl(refUrl)}
                                  </a>
                                ))}
                              </div>
                            )}
                            
                            {/* Importance and Votes */}
                            <div className="flex items-center gap-1" title={`Importance: ${selectedVersion.importance || 1}/7`}>
                                {Array.from({length: selectedVersion.importance || 1}).map((_,i) => <Star key={`s-filled-${i}`} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                                {Array.from({length: Math.max(0, 7 - (selectedVersion.importance || 1))}).map((_,i) => <Star key={`s-empty-${i}`} className="w-3.5 h-3.5 text-gray-300" />)}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                                <div className="flex items-center gap-1">
                                    <ThumbsUp className="w-3.5 h-3.5 text-green-500"/>
                                    <span>{selectedVersion.upvote_count === undefined ? 'N/A' : selectedVersion.upvote_count}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <ThumbsDown className="w-3.5 h-3.5 text-red-500"/>
                                    <span>{selectedVersion.downvote_count === undefined ? 'N/A' : selectedVersion.downvote_count}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ): (
                    <CardTitle className="text-lg text-gray-700">Version Details</CardTitle>
                )}
            </CardHeader>
            <CardContent className="p-6 flex-1 overflow-y-auto space-y-4">
              {selectedVersion ? (
                <>
                  <div className="bg-gray-50 rounded-lg p-4 h-full prose prose-sm max-w-none text-gray-800 leading-relaxed">
                     <ReactMarkdown>{selectedVersion.content}</ReactMarkdown>
                  </div>
                  {selectedVersion.internal_comments && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-600"><MessageSquare className="w-4 h-4"/> Internal Comments</h4>
                       <div className="bg-yellow-50 rounded-lg p-4 h-full prose prose-sm max-w-none text-yellow-900 leading-relaxed">
                         <ReactMarkdown>{selectedVersion.internal_comments}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                  {selectedVersion.images && selectedVersion.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-gray-600"><ImageIcon className="w-4 h-4"/> Attached Images</h4>
                      <div className="space-y-3">
                      {selectedVersion.images.map((image, index) => (
                        <div key={image.url || index} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                          <img src={image.url} alt={image.alt} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 break-words">{image.alt || 'No description provided.'}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <a href={image.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">View Full Size</a>
                              <span className="text-gray-300">|</span>
                              <a href={image.url} download target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                <Download className="w-3 h-3" /> Download
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <ArrowLeft className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-center">Select a version from the list <br className="sm:hidden"/> to view its details.</p>
                </div>
              )}
            </CardContent>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
