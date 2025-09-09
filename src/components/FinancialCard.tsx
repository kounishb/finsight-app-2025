import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
interface FinancialCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  children?: React.ReactNode;
}
export const FinancialCard = ({
  title,
  value,
  change,
  className,
  children
}: FinancialCardProps) => {
  return <Card className={cn("p-4 bg-gradient-to-br from-card to-card/80", "border-border/50 shadow-lg", className)}>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && <div className={cn("text-sm font-medium flex items-center gap-1", change.isPositive ? "text-success" : "text-danger")}>
            {change.isPositive ? '+' : ''}{change.value}
          </div>}
        {children}
      </div>
    </Card>;
};