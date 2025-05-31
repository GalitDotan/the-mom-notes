import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const EMOJI_OPTIONS = [
  { emoji: "🙂", label: "Excited", description: "Positive emotions or enthusiasm" },
  { emoji: "🙁", label: "Angry", description: "Frustration, complaints, or negative feelings" },
  { emoji: "😳", label: "Embarrassed", description: "Awkwardness, discomfort, or uncertainty" },
  { emoji: "⚡", label: "Pain/Problem", description: "💥 Critical insight: the core challenge or pain the user urgently needs solved" },
  { emoji: "🥅", label: "Goal", description: "What the user ultimately wants to achieve or accomplish" },
  { emoji: "🟥", label: "Obstacle", description: "Something blocking progress or creating friction" },
  { emoji: "↪️", label: "Workaround", description: "A clever or improvised solution the user employs" },
  { emoji: "🏔", label: "Context", description: "Additional background details that shape the situation" },
  { emoji: "☑️", label: "Feature Request", description: "A suggestion for new functionality or improvements" },
  { emoji: "💲", label: "Budget", description: "Conversations about pricing, spending, or funding" },
  { emoji: "♀️", label: "Person/Company", description: "Mention of a specific individual, organization, competitor, collaborator, or a key decision-maker" },
  { emoji: "⭐", label: "Follow-up", description: "Topics that require a future action, a next step, a to-track-later" },
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
        <TooltipProvider delayDuration={200}>
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700 mb-3">Choose an emoji for your note:</div>
            <div className="grid grid-cols-4 gap-2">
              {EMOJI_OPTIONS.map((option) => (
                <Tooltip key={option.emoji}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={selectedEmoji === option.emoji ? "default" : "ghost"}
                      className={`h-12 text-xl transition-all duration-200 ${
                        selectedEmoji === option.emoji 
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => onSelect(option.emoji)}
                    >
                      {option.emoji}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-center">
                    <p className="font-semibold">{option.emoji} {option.label}</p>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
            <div className="text-xs text-gray-500 pt-2 border-t">
              Hover over emojis to see their meanings.
            </div>
          </div>
        </TooltipProvider>
      </PopoverContent>
    </Popover>
  );
}