import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Link
        to="/contacts"
        className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-primary transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold uppercase">
              СВЯЗАТЬСЯ С МЕНЕДЖЕРОМ
            </h3>
            <p className="text-muted-foreground text-sm">
              Поможем с выбором
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default QuickActions;
