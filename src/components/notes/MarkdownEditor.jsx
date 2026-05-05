import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle, Eye, Pencil } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MarkdownCheatSheet = () => (
  <div className="p-4 space-y-2 text-sm w-64">
    <h4 className="font-bold text-gray-800">Markdown Quick Guide</h4>
    <ul className="space-y-1 text-gray-600">
      <li><code className="text-xs bg-gray-100 p-0.5 rounded">**bold**</code> → <strong>bold</strong></li>
      <li><code className="text-xs bg-gray-100 p-0.5 rounded">*italic*</code> → <em>italic</em></li>
      <li><code className="text-xs bg-gray-100 p-0.5 rounded"># H1</code></li>
      <li><code className="text-xs bg-gray-100 p-0.5 rounded">## H2</code></li>
      <li><code className="text-xs bg-gray-100 p-0.5 rounded">- List item</code></li>
      <li><code className="text-xs bg-gray-100 p-0.5 rounded">[Link](http://a.com)</code></li>
      <li><code className="text-xs bg-gray-100 p-0.5 rounded">`inline code`</code></li>
      <li><code className="text-xs bg-gray-100 p-0.5 rounded">&gt; Blockquote</code></li>
    </ul>
  </div>
);

export default function MarkdownEditor({ value, onChange, placeholder, height, disabled, label, onKeyDown }) {
  return (
    <div className="space-y-2">
       {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Tabs defaultValue="write" className="rounded-lg border border-gray-200 bg-white/80 focus-within:border-[var(--ruby-dust-300)] focus-within:ring-2 focus-within:ring-[var(--ruby-dust-300)] focus-within:ring-offset-2 transition-all">
        <div className="flex justify-between items-center px-3 py-1.5 border-b bg-gray-50/70 rounded-t-md">
          <TabsList className="grid grid-cols-2 h-8 bg-gray-200/80">
            <TabsTrigger value="write" className="h-6 text-xs data-[state=active]:bg-white data-[state=active]:text-[var(--ruby-dust-700)]"><Pencil className="w-3 h-3 mr-1.5" /> Write</TabsTrigger>
            <TabsTrigger value="preview" className="h-6 text-xs data-[state=active]:bg-white data-[state=active]:text-[var(--ruby-dust-700)]"><Eye className="w-3 h-3 mr-1.5" /> Preview</TabsTrigger>
          </TabsList>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-xs h-7 text-gray-500 hover:bg-gray-200">
                <HelpCircle className="w-3.5 h-3.5 mr-1" />
                Markdown
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <MarkdownCheatSheet />
            </PopoverContent>
          </Popover>
        </div>
        <TabsContent value="write" className="p-0 m-0">
          <Textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            style={{ height }}
            className="resize-none w-full bg-transparent border-0 rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base leading-relaxed p-4"
            disabled={disabled}
          />
        </TabsContent>
        <TabsContent value="preview" className="p-0 m-0">
          <div
            style={{ minHeight: height }}
            className="prose prose-sm max-w-none p-4 rounded-b-md"
          >
            {value ? <ReactMarkdown>{value}</ReactMarkdown> : <p className="text-gray-400 not-prose">{placeholder}</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}