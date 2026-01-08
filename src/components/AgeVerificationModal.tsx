import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const AgeVerificationModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('age_verified');
    if (!verified) {
      setIsOpen(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('age_verified', 'true');
    setIsOpen(false);
  };

  const handleDecline = () => {
    window.location.href = 'https://google.com';
  };

  if (!isOpen) return null;

  return (
    <div className="age-modal-overlay animate-fade-in">
      <div className="age-modal animate-scale-in">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-display font-bold text-primary-foreground">18+</span>
        </div>
        
        <h2 className="font-display text-2xl font-bold mb-4 uppercase">
          Подтверждение возраста
        </h2>
        
        <p className="text-muted-foreground mb-2">
          Для доступа к сайту необходимо подтвердить, что вам исполнилось 18 лет.
        </p>
        
        <p className="text-sm text-muted-foreground mb-6">
          Продажа табачной продукции лицам младше 18 лет запрещена законодательством РФ.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleVerify}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
          >
            Мне есть 18 лет
          </Button>
          <Button 
            onClick={handleDecline}
            variant="outline"
            className="font-semibold"
          >
            Мне нет 18 лет
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          <span>Информация на сайте не является рекламой</span>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
