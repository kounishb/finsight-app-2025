import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock, User, ArrowLeft, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArticleViewer } from "@/components/ArticleViewer";

interface Article {
  id: number;
  title: string;
  author: string;
  readTime: string;
  category: string;
  description: string;
  url: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "The Beginner's Guide to Stock Market Investing",
    author: "Investopedia",
    readTime: "10 min read",
    category: "Education",
    description: "Learn the fundamentals of stock market investing, from basic concepts to advanced strategies.",
    url: "https://www.investopedia.com/articles/basics/06/invest1000.asp"
  },
  {
    id: 2,
    title: "Dollar-Cost Averaging: A Simple Investment Strategy",
    author: "The Motley Fool",
    readTime: "8 min read", 
    category: "Strategy",
    description: "Discover how dollar-cost averaging can help reduce investment risk and build wealth over time.",
    url: "https://www.fool.com/investing/how-to-invest/dollar-cost-averaging/"
  },
  {
    id: 3,
    title: "Understanding Risk and Return in Investing",
    author: "Morningstar",
    readTime: "12 min read",
    category: "Education",
    description: "Learn about the relationship between risk and return and how to build a balanced portfolio.",
    url: "https://www.morningstar.com/investing/risk-return-relationship"
  },
  {
    id: 4,
    title: "The Power of Compound Interest",
    author: "SEC Investor.gov",
    readTime: "6 min read",
    category: "Fundamentals",
    description: "Understand how compound interest can exponentially grow your investments over time.",
    url: "https://www.investor.gov/introduction-investing/investing-basics/how-compound-interest-works"
  },
  {
    id: 5,
    title: "Diversification: Don't Put All Your Eggs in One Basket",
    author: "Vanguard",
    readTime: "9 min read",
    category: "Strategy",
    description: "Learn why portfolio diversification is crucial for managing investment risk.",
    url: "https://investor.vanguard.com/investing/investment/diversification"
  },
  {
    id: 6,
    title: "How to Read Financial Statements",
    author: "Khan Academy",
    readTime: "15 min read",
    category: "Analysis",
    description: "Master the art of reading and interpreting company financial statements.",
    url: "https://www.khanacademy.org/economics-finance-domain/core-finance/stocks-and-bonds/stocks-intro-tutorial/v/introduction-to-stocks"
  },
  {
    id: 7,
    title: "The Psychology of Investing",
    author: "Behavioral Economics",
    readTime: "11 min read",
    category: "Psychology",
    description: "Learn about common behavioral biases that affect investment decisions.",
    url: "https://www.investopedia.com/articles/01/030801.asp"
  },
  {
    id: 8,
    title: "ETFs vs Mutual Funds: Which is Better?",
    author: "Bogleheads",
    readTime: "7 min read",
    category: "Education",
    description: "Compare exchange-traded funds and mutual funds to make informed investment choices.",
    url: "https://www.bogleheads.org/wiki/ETFs_vs_mutual_funds"
  },
  {
    id: 9,
    title: "401(k) vs IRA: Which Retirement Account is Right for You?",
    author: "Fidelity",
    readTime: "13 min read",
    category: "Retirement",
    description: "Compare retirement account options and learn which one best fits your financial goals.",
    url: "https://www.fidelity.com/viewpoints/retirement/401k-vs-ira"
  },
  {
    id: 10,
    title: "Building an Emergency Fund: Your Financial Safety Net",
    author: "NerdWallet",
    readTime: "9 min read",
    category: "Fundamentals",
    description: "Learn how to build and maintain an emergency fund to protect your financial future.",
    url: "https://www.nerdwallet.com/article/banking/how-to-build-emergency-fund"
  },
  {
    id: 11,
    title: "Value Investing: Finding Undervalued Stocks",
    author: "Warren Buffett Institute",
    readTime: "14 min read",
    category: "Strategy",
    description: "Master the principles of value investing and learn to identify undervalued opportunities.",
    url: "https://www.investopedia.com/terms/v/valueinvesting.asp"
  },
  {
    id: 12,
    title: "Understanding Market Volatility and How to Navigate It",
    author: "Charles Schwab",
    readTime: "10 min read",
    category: "Education",
    description: "Learn how to stay calm during market turbulence and make rational investment decisions.",
    url: "https://www.schwab.com/learn/story/managing-investment-volatility"
  },
  {
    id: 13,
    title: "The Importance of Asset Allocation in Your Portfolio",
    author: "BlackRock",
    readTime: "11 min read",
    category: "Strategy",
    description: "Discover how proper asset allocation can help optimize your investment returns.",
    url: "https://www.blackrock.com/us/individual/education/asset-allocation"
  },
  {
    id: 14,
    title: "Tax-Efficient Investing Strategies",
    author: "Tax Foundation",
    readTime: "16 min read",
    category: "Strategy",
    description: "Learn how to minimize taxes on your investments and maximize after-tax returns.",
    url: "https://www.investopedia.com/articles/investing/090115/tax-efficient-investing-strategies.asp"
  },
  {
    id: 15,
    title: "Cryptocurrency Basics: What Every Investor Should Know",
    author: "CoinDesk",
    readTime: "12 min read",
    category: "Crypto",
    description: "Get up to speed on cryptocurrency fundamentals and potential investment considerations.",
    url: "https://www.coindesk.com/learn/what-is-cryptocurrency/"
  }
];

const Articles = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showArticleViewer, setShowArticleViewer] = useState(false);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["All", "Education", "Strategy", "Fundamentals", "Analysis", "Psychology", "Retirement", "Crypto"];

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      <div className="pt-8 pb-6">
        <Button variant="ghost" onClick={() => navigate("/explore")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </Button>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Investment Articles
        </h1>
        <p className="text-muted-foreground mt-1">Expand your financial knowledge</p>
      </div>

      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search articles..."
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
                {filteredArticles
                  .filter(article => category === "All" || article.category === category)
                  .map((article) => (
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
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {article.category}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{article.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {article.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
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
    </div>
  );
};

export default Articles;