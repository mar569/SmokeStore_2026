import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    window.location.href = 'https://www.consultant.ru/document/cons_doc_LAW_142515/';
  };


  if (!isOpen) return null;

  return (
    <div
      className="age-modal-overlay animate-fade-in fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="age-modal animate-scale-in bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className='mb-3 text-center'>Добро пожаловать на сайт <br />SMOKE-STORE-SHLISSELBURG.RU</h2>
        <p className='text-muted-foreground mb-2 text-left'>Мы <span className='font-semibold text-black'>не осуществляем дистанционную продажу</span> табачной и никотиносодержащей продукции, а также кальянов и устройств!</p>
        <p className="text-muted-foreground mb-2 text-left">
          Для доступа к сайту необходимо подтвердить, что вам исполнилось 18 лет.
        </p>

        <p className="text-sm text-muted-foreground mb-6 text-left">
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
        <div className="mt-6 gap-2 text-xs text-black/80 text-center">
          <h3>Пользуясь сайтом вы принимаете</h3>
          <Link to='/agreement'>
            <h4 className='text-red-600 underline cursor-pointer'>Условия пользовательского соглашения</h4>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;