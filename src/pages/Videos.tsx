import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock, User, Play, Eye, ArrowLeft, Video, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VideoViewer } from "@/components/VideoViewer";

interface Video {
  id: number;
  title: string;
  channel: string;
  duration: string;
  views: string;
  thumbnail: string;
  category: string;
  description: string;
  url: string;
}

const videos: Video[] = [
  {
    id: 1,
    title: "Stock Market Basics: Course for Beginners",
    channel: "Investopedia",
    duration: "18:32",
    views: "2.1M views",
    thumbnail: "📈",
    category: "Education",
    description: "A comprehensive introduction to stock market fundamentals, covering basic concepts, terminology, and investment principles for new investors.",
    url: "https://www.youtube.com/watch?v=p7HKvqRI_Bo"
  },
  {
    id: 2,
    title: "How to Build a Balanced Investment Portfolio",
    channel: "The Plain Bagel",
    duration: "12:45",
    views: "850K views",
    thumbnail: "💼",
    category: "Strategy",
    description: "Learn the art of portfolio diversification and asset allocation to create a well-balanced investment strategy that manages risk and maximizes returns.",
    url: "https://www.youtube.com/watch?v=fwe-PjrX23o"
  },
  {
    id: 3,
    title: "Warren Buffett's Investment Strategy",
    channel: "Berkshire Hathaway",
    duration: "25:18",
    views: "1.3M views",
    thumbnail: "📊",
    category: "Strategy",
    description: "Deep dive into Warren Buffett's value investing philosophy and the principles that made him one of the world's most successful investors.",
    url: "https://www.youtube.com/watch?v=VJgHkAqohbE"
  },
  {
    id: 4,
    title: "Dividend Investing Strategy Explained",
    channel: "Dividend Sensei",
    duration: "14:22",
    views: "645K views",
    thumbnail: "💰",
    category: "Income",
    description: "Comprehensive guide to dividend investing, including how to identify quality dividend stocks and build a passive income portfolio.",
    url: "https://www.youtube.com/watch?v=6xLfFNiAB-s"
  },
  {
    id: 5,
    title: "Technical Analysis Basics for Beginners",
    channel: "Trading 212",
    duration: "16:55",
    views: "920K views",
    thumbnail: "📉",
    category: "Analysis",
    description: "Master the fundamentals of technical analysis including chart patterns, indicators, and how to time your market entries and exits.",
    url: "https://www.youtube.com/watch?v=08c4YvEb22w"
  },
  {
    id: 6,
    title: "Real Estate vs Stock Market Investing",
    channel: "Two Cents",
    duration: "11:30",
    views: "780K views",
    thumbnail: "🏠",
    category: "Comparison",
    description: "Compare the pros and cons of real estate and stock market investing to determine which investment strategy aligns with your goals.",
    url: "https://www.youtube.com/watch?v=IuIC6Rs7wpQ"
  },
  {
    id: 7,
    title: "The Efficient Market Hypothesis Explained",
    channel: "CrashCourse",
    duration: "13:44",
    views: "1.1M views",
    thumbnail: "📚",
    category: "Theory",
    description: "Understand the efficient market hypothesis and how it affects investment strategies and market behavior in modern finance.",
    url: "https://www.youtube.com/watch?v=0ECqDaPjjV0"
  },
  {
    id: 8,
    title: "Index Fund Investing for Beginners",
    channel: "Bogleheads",
    duration: "22:15",
    views: "1.8M views",
    thumbnail: "₿",
    category: "Education",
    description: "Learn why index fund investing is considered one of the most effective long-term investment strategies for building wealth.",
    url: "https://www.youtube.com/watch?v=VYWc9dFqROI"
  },
  {
    id: 9,
    title: "Understanding Market Psychology",
    channel: "The Investor Channel",
    duration: "19:45",
    views: "1.5M views",
    thumbnail: "🎯",
    category: "Psychology",
    description: "Explore the psychological factors that drive market movements and learn how to make rational investment decisions despite emotional biases.",
    url: "https://www.youtube.com/watch?v=oMQNF-cGb8k"
  },
  {
    id: 10,
    title: "How Compound Interest Works",
    channel: "Khan Academy",
    duration: "15:20",
    views: "675K views",
    thumbnail: "🧠",
    category: "Education",
    description: "Discover the power of compound interest and how it can exponentially grow your investments over time through reinvestment and patience.",
    url: "https://www.youtube.com/watch?v=r8GxFbL8WQ8"
  },
  {
    id: 11,
    title: "How to Research Stocks Like a Pro",
    channel: "Morningstar",
    duration: "21:30",
    views: "890K views",
    thumbnail: "🔍",
    category: "Analysis",
    description: "Learn professional stock research techniques including fundamental analysis, financial statement evaluation, and company assessment methods.",
    url: "https://www.youtube.com/watch?v=t5QfL8K8MfM"
  },
  {
    id: 12,
    title: "ETF vs Mutual Fund: Which is Better?",
    channel: "Vanguard",
    duration: "13:15",
    views: "720K views",
    thumbnail: "📋",
    category: "Education",
    description: "Compare exchange-traded funds and mutual funds to understand the differences and determine which investment vehicle suits your needs.",
    url: "https://www.youtube.com/watch?v=8fZbXGZr-zk"
  },
  {
    id: 13,
    title: "Retirement Planning in Your 20s and 30s",
    channel: "Fidelity",
    duration: "17:40",
    views: "1.2M views",
    thumbnail: "🎯",
    category: "Retirement",
    description: "Essential retirement planning strategies for young professionals, including 401(k) optimization and long-term wealth building techniques.",
    url: "https://www.youtube.com/watch?v=r8eF-mR_k9s"
  },
  {
    id: 14,
    title: "Understanding Economic Indicators",
    channel: "Economics Explained",
    duration: "20:10",
    views: "950K views",
    thumbnail: "📈",
    category: "Economics",
    description: "Learn how to interpret key economic indicators and understand their impact on markets, inflation, and investment opportunities.",
    url: "https://www.youtube.com/watch?v=qM8A8K6F6i8"
  },
  {
    id: 15,
    title: "Dollar Cost Averaging Strategy",
    channel: "Charles Schwab",
    duration: "16:25",
    views: "1.1M views",
    thumbnail: "📊",
    category: "Strategy",
    description: "Master the dollar-cost averaging investment strategy to reduce risk and build wealth systematically over time through consistent investing.",
    url: "https://www.youtube.com/watch?v=F4QKK6f8cD4"
  }
];

const Videos = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showVideoViewer, setShowVideoViewer] = useState(false);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["All", "Education", "Strategy", "Advanced", "Analysis", "Crypto", "Economics", "Retirement"];

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      <div className="pt-8 pb-6">
        <Button variant="ghost" onClick={() => navigate("/explore")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </Button>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Video className="h-6 w-6 text-primary" />
          Investment Videos
        </h1>
        <p className="text-muted-foreground mt-1">Learn through video content</p>
      </div>

      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="All" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            {categories.slice(0, 4).map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="grid w-full grid-cols-4">
            {categories.slice(4).map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4 mt-6">
              <div className="grid gap-4">
                {filteredVideos
                  .filter(video => category === "All" || video.category === category)
                  .map((video) => (
                  <Card 
                    key={video.id}
                    className="p-4 bg-gradient-to-br from-card to-card/80 border-border/50 cursor-pointer hover:bg-accent/20 transition-colors"
                    onClick={() => {
                      setSelectedVideo(video);
                      setShowVideoViewer(true);
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-12 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-xl">{video.thumbnail}</span>
                          <Play className="absolute w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {video.category}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{video.title}</h3>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {video.channel}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {video.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {video.views}
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Video Viewer */}
      <VideoViewer
        video={selectedVideo}
        isOpen={showVideoViewer}
        onClose={() => {
          setShowVideoViewer(false);
          setSelectedVideo(null);
        }}
      />
    </div>
  );
};

export default Videos;