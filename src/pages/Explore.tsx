import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock, User, Play, Eye, BookOpen, ArrowLeft, Newspaper, GraduationCap, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArticleViewer } from "@/components/ArticleViewer";
import { VideoViewer } from "@/components/VideoViewer";
import { NewsViewer } from "@/components/NewsViewer";
import { AlphaVantageNewsService, AlphaVantageNewsArticle } from "@/services/alphaVantageNewsService";
import { useToast } from "@/hooks/use-toast";

interface Article {
  id: number;
  title: string;
  author: string;
  readTime: string;
  category: string;
  description: string;
  url: string;
}

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

import { expandedArticles, expandedVideos } from "@/data/expandedContent";

// Use expanded content
const articles = expandedArticles;
const videos = expandedVideos;

const Explore = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedNews, setSelectedNews] = useState<AlphaVantageNewsArticle | null>(null);
  const [showArticleViewer, setShowArticleViewer] = useState(false);
  const [showVideoViewer, setShowVideoViewer] = useState(false);
  const [showNewsViewer, setShowNewsViewer] = useState(false);
  const [liveNews, setLiveNews] = useState<AlphaVantageNewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [activeTab, setActiveTab] = useState<"news" | "learn">("news");
  const [activeSubTab, setActiveSubTab] = useState<"articles" | "videos">("articles");

  // Load live news on component mount
  useEffect(() => {
    loadLiveNews();
  }, []);

  const loadLiveNews = async () => {
    setLoadingNews(true);
    try {
      const news = await AlphaVantageNewsService.getLatestNews();
      setLiveNews(news);
      
      // Check if we're using mock data (API rate limit reached)
      if (news.length > 0 && news[0].source === "Financial Times") {
        toast({
          title: "API Rate Limit Reached",
          description: "Showing sample financial news. API limit exceeded, please try again later.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error loading live news:', error);
      toast({
        title: "Error",
        description: "Failed to load latest financial news. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingNews(false);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNews = liveNews.filter(news =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatNewsDate = (dateString: string) => {
    return AlphaVantageNewsService.formatDate(dateString);
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      <div className="pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Financial Education Hub
        </h1>
        <p className="text-muted-foreground mt-1">Stay informed and expand your financial knowledge</p>
      </div>

      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={
              activeTab === "news" 
                ? "Search latest news..."
                : activeSubTab === "articles"
                ? "Search articles..."
                : "Search videos..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs for Latest News and Learn */}
        <Tabs defaultValue="news" className="w-full" onValueChange={(value) => setActiveTab(value as "news" | "learn")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="news" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              Latest News
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Learn
            </TabsTrigger>
          </TabsList>

          {/* Latest News Tab */}
          <TabsContent value="news" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                Live Financial News
              </h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadLiveNews}
                disabled={loadingNews}
              >
                {loadingNews ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  'Refresh News'
                )}
              </Button>
            </div>

            {loadingNews ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading latest financial news...</span>
              </div>
            ) : filteredNews.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {searchQuery ? 'No news found matching your search.' : 'No news available at the moment.'}
              </p>
            ) : (
              <div className="grid gap-4">
                {filteredNews.map((news, index) => (
                  <Card 
                    key={index}
                    className="p-4 bg-gradient-to-br from-card to-card/80 border-border/50 cursor-pointer hover:bg-accent/20 transition-colors"
                    onClick={() => {
                      setSelectedNews(news);
                      setShowNewsViewer(true);
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{news.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{news.summary}</p>
                        </div>
                        {news.banner_image && (
                          <img 
                            src={news.banner_image} 
                            alt={news.title}
                            className="w-20 h-16 object-cover rounded-lg ml-4 shrink-0"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium">{news.source}</span>
                        <span>{formatNewsDate(news.time_published)}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6">
            <Tabs defaultValue="articles" className="w-full" onValueChange={(value) => setActiveSubTab(value as "articles" | "videos")}>
              <TabsList className="inline-flex h-8 items-center justify-center rounded-md bg-muted p-0.5 text-muted-foreground w-auto">
                <TabsTrigger 
                  value="articles" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  Articles
                </TabsTrigger>
                <TabsTrigger 
                  value="videos"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  Videos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="articles" className="space-y-4 mt-4">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Educational Articles
                </h2>
              
                {filteredArticles.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No articles found matching your search.
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {filteredArticles.map((article) => (
                      <Card 
                        key={article.id} 
                        className="p-4 bg-gradient-to-br from-card to-card/80 border-border/50 cursor-pointer hover:bg-accent/20 transition-colors"
                        onClick={() => {
                          setSelectedArticle(article);
                          setShowArticleViewer(true);
                        }}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">{article.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                            </div>
                            <Badge variant="secondary" className="ml-2 shrink-0">
                              {article.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{article.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{article.readTime}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="videos" className="space-y-4 mt-4">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Educational Videos
                </h2>
              
                {filteredVideos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No videos found matching your search.
                  </p>
                ) : (
                  <div className="grid gap-4">
                    {filteredVideos.map((video) => (
                      <Card 
                        key={video.id} 
                        className="p-4 bg-gradient-to-br from-card to-card/80 border-border/50 cursor-pointer hover:bg-accent/20 transition-colors"
                        onClick={() => {
                          setSelectedVideo(video);
                          setShowVideoViewer(true);
                        }}
                      >
                         <div className="flex gap-3 sm:gap-4">
                           <div className="relative shrink-0">
                             <div className="w-20 sm:w-32 h-12 sm:h-20 bg-primary/20 rounded-lg flex items-center justify-center">
                               <Play className="h-4 w-4 sm:h-8 sm:w-8 text-primary" />
                             </div>
                           </div>
                          
                           <div className="flex-1 space-y-1 sm:space-y-2 min-w-0">
                             <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2">{video.title}</h3>
                             <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                               <span className="truncate max-w-[80px] sm:max-w-none">{video.channel}</span>
                               <div className="flex items-center gap-1">
                                 <Clock className="h-3 w-3" />
                                 <span>{video.duration}</span>
                               </div>
                               <div className="flex items-center gap-1 hidden sm:flex">
                                 <Eye className="h-3 w-3" />
                                 <span>{video.views}</span>
                               </div>
                               <Badge variant="secondary" className="text-xs">{video.category}</Badge>
                             </div>
                           </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Article Viewer */}
      <ArticleViewer 
        article={selectedArticle}
        isOpen={showArticleViewer}
        onClose={() => {
          setShowArticleViewer(false);
          setSelectedArticle(null);
        }}
      />

      {/* Video Viewer */}
      <VideoViewer 
        video={selectedVideo}
        isOpen={showVideoViewer}
        onClose={() => {
          setShowVideoViewer(false);
          setSelectedVideo(null);
        }}
      />

      {/* News Viewer */}
      <NewsViewer 
        article={selectedNews}
        isOpen={showNewsViewer}
        onClose={() => {
          setShowNewsViewer(false);
          setSelectedNews(null);
        }}
      />
    </div>
  );
};

export default Explore;