import React, { forwardRef, useId } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HelpCircle, Eye, Pencil } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/** Markdown syntax with translated example words; the syntax itself stays as is. */
const MarkdownCheatSheet = () => {
    const { t } = useTranslation();
    const bold = t('markdownEditor.cheatSheet.bold');
    const italic = t('markdownEditor.cheatSheet.italic');

    return (
        <div className="space-y-2 text-sm">
            <h4 className="font-semibold text-foreground">{t('markdownEditor.cheatSheet.title')}</h4>
            <ul className="space-y-1 text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">**{bold}**</code> → <strong>{bold}</strong></li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">*{italic}*</code> → <em>{italic}</em></li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded"># {t('markdownEditor.cheatSheet.heading1')}</code></li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">## {t('markdownEditor.cheatSheet.heading2')}</code></li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">- {t('markdownEditor.cheatSheet.listItem')}</code></li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">[{t('markdownEditor.cheatSheet.link')}](http://a.com)</code></li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">`{t('markdownEditor.cheatSheet.inlineCode')}`</code></li>
                <li><code className="text-xs bg-muted px-1 py-0.5 rounded">&gt; {t('markdownEditor.cheatSheet.blockquote')}</code></li>
            </ul>
        </div>
    );
};

type MarkdownEditorProps = {
    value: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
    placeholder?: string;
    height?: string;
    disabled?: boolean;
    label?: string;
};

/**
 * Markdown textarea with a Write/Preview toggle. Forwards its ref to the
 * textarea (NoteEditor focuses it on open; before, the ref was dropped).
 */
const MarkdownEditor = forwardRef<HTMLTextAreaElement, MarkdownEditorProps>(function MarkdownEditor(
    { value, onChange, placeholder, height, disabled, label, onKeyDown },
    ref,
) {
    const { t } = useTranslation();
    const textareaId = useId();

    return (
        <div className="space-y-2">
            {label && <label htmlFor={textareaId} className="text-sm font-medium text-foreground/80">{label}</label>}
            <Tabs defaultValue="write" className="rounded-xl border border-input bg-card transition-[border-color,box-shadow] duration-150 focus-within:border-ring/60 focus-within:ring-4 focus-within:ring-ring/15">
                <div className="flex justify-between items-center px-2 py-1.5 border-b border-border/70">
                    <TabsList className="grid grid-cols-2 h-8 bg-muted rounded-lg p-0.5">
                        <TabsTrigger value="write" className="h-7 rounded-md text-xs data-[state=active]:bg-card data-[state=active]:shadow-card"><Pencil className="w-3 h-3 me-1.5" aria-hidden /> {t('markdownEditor.write')}</TabsTrigger>
                        <TabsTrigger value="preview" className="h-7 rounded-md text-xs data-[state=active]:bg-card data-[state=active]:shadow-card"><Eye className="w-3 h-3 me-1.5" aria-hidden /> {t('markdownEditor.preview')}</TabsTrigger>
                    </TabsList>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground">
                                <HelpCircle className="w-3.5 h-3.5" aria-hidden />
                                {t('markdownEditor.help')}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-64">
                            <MarkdownCheatSheet />
                        </PopoverContent>
                    </Popover>
                </div>
                <TabsContent value="write" className="p-0 m-0">
                    <Textarea
                        id={textareaId}
                        ref={ref}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        style={{ height }}
                        className="resize-none w-full bg-transparent border-0 shadow-none rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base leading-relaxed p-4"
                        disabled={disabled}
                    />
                </TabsContent>
                <TabsContent value="preview" className="p-0 m-0">
                    <div
                        style={{ minHeight: height }}
                        className="prose prose-sm max-w-none p-4 rounded-b-xl"
                    >
                        {value ? <ReactMarkdown>{value}</ReactMarkdown> : <p className="text-muted-foreground not-prose">{placeholder}</p>}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
});

export default MarkdownEditor;
