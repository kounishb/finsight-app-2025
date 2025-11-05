import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, User, Building2, X } from "lucide-react";
import { NewsArticle } from "@/services/alphaVantageService";

interface NewsViewerProps {
  article: NewsArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NewsViewer = ({ article, isOpen, onClose }: NewsViewerProps) => {
  if (!article) return null;

  const formatDate = (dateString: string) => {
    try {
      // Handle ISO format (e.g., 2025-11-05T02:40:50.000000Z)
      if (dateString.includes('T') && dateString.includes('-')) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // Handle Alpha Vantage format: 20241201T123000
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(9, 11);
      const minute = dateString.substring(11, 13);
      
      const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  const getRelevantTickers = () => {
    return article.ticker_sentiment
      ?.filter(ticker => parseFloat(ticker.relevance_score) > 0.2)
      ?.slice(0, 5) || [];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold leading-tight pr-8">
            {article.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              <span>{article.source}</span>
            </div>
            {formatDate(article.time_published) && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(article.time_published)}</span>
              </div>
            )}
            {article.authors && article.authors.length > 0 && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{article.authors.slice(0, 2).join(', ')}</span>
                {article.authors.length > 2 && <span>+{article.authors.length - 2} more</span>}
              </div>
            )}
          </div>

          {/* Banner Image */}
          {article.banner_image && (
            <div className="w-full">
              <img
                src={article.banner_image}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Category and Topics */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {article.category_within_source}
            </Badge>
            {article.topics?.slice(0, 3).map((topic, index) => (
              <Badge key={index} variant="outline">
                {topic.topic.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>

          {/* Relevant Tickers */}
          {getRelevantTickers().length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Related Stocks:</h4>
              <div className="flex flex-wrap gap-2">
                {getRelevantTickers().map((ticker, index) => {
                  const sentimentColor = 
                    ticker.ticker_sentiment_label === 'Bullish' ? 'text-green-600' :
                    ticker.ticker_sentiment_label === 'Bearish' ? 'text-red-600' :
                    'text-gray-600';
                  
                  return (
                    <Badge key={index} variant="outline" className={sentimentColor}>
                      {ticker.ticker} ({ticker.ticker_sentiment_label})
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Article Summary */}
          <div>
            <h4 className="font-semibold mb-3">Summary</h4>
            <p className="text-muted-foreground leading-relaxed">
              {article.summary}
            </p>
          </div>

          {/* External Link */}
          <div className="pt-4 border-t">
            <Button asChild variant="outline" className="w-full">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Read Full Article on {article.source}
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};