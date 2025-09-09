import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, X, Play } from "lucide-react";

interface Video {
  title: string;
  channel: string;
  duration: string;
  views: string;
  thumbnail: string;
  category: string;
  description: string;
  url: string;
}

interface VideoViewerProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoViewer = ({ video, isOpen, onClose }: VideoViewerProps) => {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold pr-8">{video.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>By {video.channel}</span>
            <span>{video.duration}</span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
              {video.category}
            </span>
          </div>
          
          <div className="text-muted-foreground leading-relaxed">
            {video.description}
          </div>
          
          <div className="bg-accent/20 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">
              This video is hosted externally. Click below to watch the full content.
            </p>
            <Button 
              onClick={() => {
                if (video.url) {
                  window.open(video.url, '_blank', 'noopener,noreferrer');
                }
              }} 
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Watch Full Video
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};