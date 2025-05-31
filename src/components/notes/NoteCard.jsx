import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  Edit3, 
  Share2, 
  History, 
  MoreVertical,
  Trash2,
  Copy
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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

export default function NoteCard({ 
  note, 
  onEdit, 
  onShare, 
  onViewHistory, 
  onDelete,
  isShared = false 
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(note.content);
    toast.success("Note content copied to clipboard");
  };

  const truncatedContent = note.content.length > 120 
    ? note.content.substring(0, 120) + "..." 
    : note.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-blue-100 border-0 bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{note.symbol}</div>
              <div>
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-gray-100 text-gray-600 font-medium"
                >
                  {EMOJI_LABELS[note.symbol]}
                </Badge>
                {isShared && (
                  <Badge 
                    variant="outline" 
                    className="ml-2 text-xs border-blue-200 text-blue-600"
                  >
                    Shared
                  </Badge>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(note)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyContent}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy content
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(note)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewHistory(note)}>
                  <History className="w-4 h-4 mr-2" />
                  Version history
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onDelete(note)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div 
            className="text-gray-700 mb-4 line-clamp-3 cursor-pointer"
            onClick={() => onEdit(note)}
          >
            {truncatedContent}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {format(new Date(note.updated_date), "MMM d, yyyy 'at' h:mm a")}
            </span>
            
            <div className={`flex items-center gap-2 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(note)}
                className="h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}