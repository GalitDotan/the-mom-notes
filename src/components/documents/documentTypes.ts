export type DocumentBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "list";
      items: string[];
    };

export type DocumentSection = {
  title: string;
  blocks: DocumentBlock[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: DocumentSection[];
};
