import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Target, DollarSign, Calendar, BarChart3, Brain, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SurveyData {
  age: string;
  experience: string;
  riskTolerance: string;
  goals: string[];
  timeHorizon: string;
  investmentAmount: string;
  sectors: string[];
  investmentStyle: string[];
}

interface Recommendation {
  symbol: string;
  name: string;
  price: string;
  description: string;
  reason: string;
}

const surveySteps = [
  {
    id: 'age',
    title: 'What is your age range?',
    icon: Target,
    options: [
      { value: '18-25', label: '18-25 years old' },
      { value: '26-35', label: '26-35 years old' },
      { value: '36-45', label: '36-45 years old' },
      { value: '46-55', label: '46-55 years old' },
      { value: '56-65', label: '56-65 years old' },
      { value: '65+', label: '65+ years old' }
    ]
  },
  {
    id: 'experience',
    title: 'What is your investment experience level?',
    icon: BarChart3,
    options: [
      { value: 'beginner', label: 'Beginner (0-1 years)' },
      { value: 'intermediate', label: 'Intermediate (2-5 years)' },
      { value: 'experienced', label: 'Experienced (5+ years)' },
      { value: 'expert', label: 'Expert (10+ years)' }
    ]
  },
  {
    id: 'riskTolerance',
    title: 'What is your risk tolerance?',
    icon: TrendingUp,
    options: [
      { value: 'conservative', label: 'Conservative - Minimize risk' },
      { value: 'moderate', label: 'Moderate - Balanced approach' },
      { value: 'aggressive', label: 'Aggressive - High growth potential' }
    ]
  },
  {
    id: 'goals',
    title: 'What are your investment goals? (Select all that apply)',
    icon: Target,
    multiple: true,
    options: [
      { value: 'growth', label: 'Long-term wealth building' },
      { value: 'income', label: 'Regular dividend income' },
      { value: 'retirement', label: 'Retirement planning' },
      { value: 'education', label: 'Education funding' },
      { value: 'house', label: 'Home purchase' },
      { value: 'preservation', label: 'Capital preservation' },
      { value: 'emergency', label: 'Emergency fund' },
      { value: 'travel', label: 'Travel and vacation' },
      { value: 'business', label: 'Starting a business' },
      { value: 'debt', label: 'Paying off debt' },
      { value: 'legacy', label: 'Wealth transfer/inheritance' },
      { value: 'passive', label: 'Passive income generation' }
    ]
  },
  {
    id: 'timeHorizon',
    title: 'What is your investment time horizon?',
    icon: Calendar,
    options: [
      { value: 'short', label: 'Short-term (1-3 years)' },
      { value: 'medium', label: 'Medium-term (3-7 years)' },
      { value: 'long', label: 'Long-term (7+ years)' }
    ]
  },
  {
    id: 'investmentAmount',
    title: 'How much are you planning to invest?',
    icon: DollarSign,
    options: [
      { value: 'under-1k', label: 'Under $1,000' },
      { value: '1k-5k', label: '$1,000 - $5,000' },
      { value: '5k-25k', label: '$5,000 - $25,000' },
      { value: '25k-100k', label: '$25,000 - $100,000' },
      { value: 'over-100k', label: 'Over $100,000' }
    ]
  },
  {
    id: 'sectors',
    title: 'Which sectors interest you? (Select all that apply)',
    icon: BarChart3,
    multiple: true,
    options: [
      { value: 'technology', label: 'Technology' },
      { value: 'healthcare', label: 'Healthcare & Biotech' },
      { value: 'finance', label: 'Financial Services' },
      { value: 'energy', label: 'Energy & Oil' },
      { value: 'consumer', label: 'Consumer Goods' },
      { value: 'real-estate', label: 'Real Estate' },
      { value: 'utilities', label: 'Utilities' },
      { value: 'materials', label: 'Materials & Mining' },
      { value: 'industrials', label: 'Industrials & Manufacturing' },
      { value: 'telecommunications', label: 'Telecommunications' },
      { value: 'retail', label: 'Retail & E-commerce' },
      { value: 'automotive', label: 'Automotive & Transportation' },
      { value: 'aerospace', label: 'Aerospace & Defense' },
      { value: 'entertainment', label: 'Media & Entertainment' },
      { value: 'agriculture', label: 'Agriculture & Food' },
      { value: 'crypto', label: 'Cryptocurrency & Blockchain' },
      { value: 'renewable', label: 'Renewable Energy & ESG' },
      { value: 'gaming', label: 'Gaming & Software' }
    ]
  },
  {
    id: 'investmentStyle',
    title: 'What investment styles appeal to you? (Select all that apply)',
    icon: Brain,
    multiple: true,
    options: [
      { value: 'value', label: 'Value investing - Buy undervalued stocks' },
      { value: 'growth', label: 'Growth investing - Focus on growing companies' },
      { value: 'dividend', label: 'Dividend investing - Regular income focus' },
      { value: 'index', label: 'Index investing - Diversified market exposure' }
    ]
  }
];

const Recommend = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [surveyResponses, setSurveyResponses] = useState<SurveyData>({
    age: '',
    experience: '',
    riskTolerance: '',
    goals: [],
    timeHorizon: '',
    investmentAmount: '',
    sectors: [],
    investmentStyle: []
  });

  // Load saved survey progress and check for existing recommendations
  useEffect(() => {
    const saved = localStorage.getItem('survey-progress');
    const savedRecommendations = localStorage.getItem('saved-recommendations');
    
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSurveyResponses(data.responses);
        setCurrentStep(data.step);
        
        // If survey is completed and we have recommendations, show them
        if (data.completed && savedRecommendations) {
          try {
            const recs = JSON.parse(savedRecommendations);
            setRecommendations(recs);
            setShowRecommendations(true);
          } catch (error) {
            console.error('Error loading saved recommendations:', error);
          }
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
    
    if (location.state?.showRecommendations && recommendations.length > 0) {
      setShowRecommendations(true);
    }
  }, [location.state]);

  // Save survey progress
  useEffect(() => {
    if (currentStep > 0 || Object.values(surveyResponses).some(v => v !== '' && (!Array.isArray(v) || v.length > 0))) {
      localStorage.setItem('survey-progress', JSON.stringify({
        responses: surveyResponses,
        step: currentStep,
        completed: showRecommendations
      }));
    }
  }, [surveyResponses, currentStep, showRecommendations]);

  // Save recommendations when generated
  useEffect(() => {
    if (recommendations.length > 0) {
      localStorage.setItem('saved-recommendations', JSON.stringify(recommendations));
    }
  }, [recommendations]);

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    try {
      // Call the Supabase edge function to generate recommendations
      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: { surveyData: surveyResponses }
      });

      if (error) {
        console.error('Error generating recommendations:', error);
        toast({
          title: "Error",
          description: "Failed to generate recommendations. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (data?.recommendations) {
        setRecommendations(data.recommendations);
        setShowRecommendations(true);
        // Update localStorage to mark survey as completed
        localStorage.setItem('survey-progress', JSON.stringify({
          responses: surveyResponses,
          step: currentStep,
          completed: true
        }));
        toast({
          title: "Recommendations Generated!",
          description: "Your personalized stock recommendations are ready.",
        });
      }
    } catch (error) {
      console.error('Error calling edge function:', error);
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = (stepId: string, value: string, isMultiple = false) => {
    setSurveyResponses(prev => {
      if (isMultiple) {
        const currentValues = prev[stepId as keyof SurveyData] as string[];
        const newValues = currentValues.includes(value) 
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [stepId]: newValues };
      }
      return { ...prev, [stepId]: value };
    });
  };

  const canProceed = () => {
    const step = surveySteps[currentStep];
    const value = surveyResponses[step.id as keyof SurveyData];
    
    if (step.multiple) {
      return Array.isArray(value) && value.length > 0;
    }
    return value !== '';
  };

  const handleNext = () => {
    if (currentStep < surveySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateRecommendations();
    }
  };

  const resetSurvey = () => {
    setCurrentStep(0);
    setShowRecommendations(false);
    setRecommendations([]);
    setSurveyResponses({
      age: '',
      experience: '',
      riskTolerance: '',
      goals: [],
      timeHorizon: '',
      investmentAmount: '',
      sectors: [],
      investmentStyle: []
    });
    localStorage.removeItem('survey-progress');
    localStorage.removeItem('saved-recommendations');
  };

  if (showRecommendations && recommendations.length > 0) {
    return (
      <div className="min-h-screen bg-background pb-20 px-4">
        <div className="pt-8 pb-6">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Your Personalized Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">AI-driven picks based on your profile</p>
        </div>

        <div className="space-y-4 mb-6">
          {recommendations.map((stock, index) => (
            <Card 
              key={stock.symbol} 
              className="p-4 bg-gradient-to-br from-card to-card/80 border-border/50 cursor-pointer hover:bg-accent/20 transition-colors"
              onClick={() => navigate(`/stock/${stock.symbol}`, { 
                state: { 
                  fromRecommendations: true,
                  recommendationReason: stock.reason 
                } 
              })}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-bold text-lg text-foreground">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{stock.price}</div>
                  </div>
                </div>
                
                <div className="text-sm bg-accent/20 p-3 rounded-lg">
                  <div className="font-semibold text-foreground mb-1">Why we recommend this:</div>
                  <div className="text-muted-foreground">
                    {/* Show only first sentence or up to 120 characters as summary */}
                    {stock.reason.split('.')[0].substring(0, 120)}
                    {stock.reason.length > 120 ? '...' : '.'}
                  </div>
                </div>
                
                <div className="text-center pt-2">
                  <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
                    Click to learn more
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div className="text-xs text-muted-foreground text-center p-4 bg-accent/10 rounded-lg">
            <strong>Disclaimer:</strong> We are not qualified financial advisors. Please consult with a qualified financial advisor before making any investment decisions.
          </div>
          
          <Button 
            onClick={resetSurvey} 
            variant="outline" 
            className="w-full"
          >
            Take Quiz Again
          </Button>
        </div>
      </div>
    );
  }

  const currentSurveyStep = surveySteps[currentStep];
  const Icon = currentSurveyStep.icon;

  return (
    <div className="min-h-screen bg-background pb-20 px-4">
      <div className="pt-8 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Investment Recommendation Quiz</h1>
        <p className="text-muted-foreground mt-1">Tell us about your goals to get personalized stock picks</p>
        
        <div className="flex items-center gap-2 mt-4">
          {surveySteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Step {currentStep + 1} of {surveySteps.length}
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-border/50">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {currentSurveyStep.title}
          </h2>
        </div>

        <div className="space-y-3 mb-8">
          {currentSurveyStep.options.map((option) => {
            const isSelected = currentSurveyStep.multiple
              ? (surveyResponses[currentSurveyStep.id as keyof SurveyData] as string[])?.includes(option.value)
              : surveyResponses[currentSurveyStep.id as keyof SurveyData] === option.value;

            return (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(currentSurveyStep.id, option.value, currentSurveyStep.multiple)}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-accent/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.label}</span>
                  {isSelected && <CheckCircle className="h-5 w-5" />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1"
            >
              Previous
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : currentStep === surveySteps.length - 1 ? (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Get Recommendations
              </>
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Recommend;