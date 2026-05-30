export type CardType = 'thought' | 'link' | 'snippet';

export interface BaseCard {
  id: string;
  type: CardType;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  imageUrl?: string;
}

export interface ThoughtCard extends BaseCard {
  type: 'thought';
  content: string;
}

export interface LinkCard extends BaseCard {
  type: 'link';
  title: string;
  url: string;
  summary: string;
}

export interface SnippetCard extends BaseCard {
  type: 'snippet';
  code: string;
  language: string;
  description?: string;
}

export type Card = ThoughtCard | LinkCard | SnippetCard;
