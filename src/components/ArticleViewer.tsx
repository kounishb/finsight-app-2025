import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, X } from "lucide-react";

interface Article {
  title: string;
  author: string;
  readTime: string;
  category: string;
  description: string;
  url: string;
}

interface ArticleViewerProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ArticleViewer = ({ article, isOpen, onClose }: ArticleViewerProps) => {
  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold pr-8">{article.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>By {article.author}</span>
            <span>{article.readTime}</span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
              {article.category}
            </span>
          </div>
          
          <div className="text-muted-foreground leading-relaxed">
            {article.description}
          </div>
          
          <div className="bg-accent/20 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">
              This article is hosted externally. Click below to read the full content.
            </p>
            <Button 
              onClick={() => {
                if (article.url) {
                  window.open(article.url, '_blank', 'noopener,noreferrer');
                }
              }} 
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Read Full Article
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};