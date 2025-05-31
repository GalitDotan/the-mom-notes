import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EMOJI_OPTIONS = [
  { emoji: "🙂", label: "Excited", description: "User shows enthusiasm" },
  { emoji: "🙁", label: "Angry", description: "User expresses frustration" },
  { emoji: "😳", label: "Embarrassed", description: "User feels awkward or uncomfortable" },
  { emoji: "⚡", label: "Pain/Problem", description: "User pain point or problem" },
  { emoji: "🥅", label: "Goal", description: "User goal or job-to-be-done" },
  { emoji: "🟥", label: "Obstacle", description: "Barrier preventing progress" },
  { emoji: "↪️", label: "Workaround", description: "User's creative solution" },
  { emoji: "🏔", label: "Context", description: "Background information" },
  { emoji: "☑️", label: "Feature Request", description: "Requested functionality" },
  { emoji: "💲", label: "Budget", description: "Budget or purchasing discussion" },
  { emoji: "♀️", label: "Person/Company", description: "Specific person or company" },
  { emoji: "⭐", label: "Follow-up", description: "Action item or follow-up task" },
];

export default function EmojiPicker({ selectedEmoji, onSelect, size = "default" }) {
  const isLarge = size === "large";
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={`${isLarge ? 'w-16 h-16 text-2xl' : 'w-12 h-12 text-xl'} border-2 hover:border-blue-300 transition-all duration-200`}
        >
          {selectedEmoji}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700 mb-3">Choose an emoji for your note:</div>
          <div className="grid grid-cols-4 gap-2">
            {EMOJI_OPTIONS.map((option) => (
              <Button
                key={option.emoji}
                variant={selectedEmoji === option.emoji ? "default" : "ghost"}
                className={`h-12 text-xl transition-all duration-200 ${
                  selectedEmoji === option.emoji 
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelect(option.emoji)}
                title={`${option.emoji} ${option.label}: ${option.description}`}
              >
                {option.emoji}
              </Button>
            ))}
          </div>
          <div className="text-xs text-gray-500 pt-2 border-t">
            Hover over emojis to see their meanings
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}