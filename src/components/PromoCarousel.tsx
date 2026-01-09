import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
}

const PromoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      id: 1,
      title: 'ДАРИМ КЕШБЕК ПРИ КАЖДОЙ ПОКУПКЕ',
      subtitle: '',
      buttonText: 'Узнать подробнее',
      buttonLink: '/promotions',
      bgColor: 'bg-primary',
    },
    {
      id: 2,
      title: 'БОЛЬШОЙ ВЫБОР ТАБАКОВ И КАЛЬЯНОВ',
      subtitle: '',
      buttonText: 'Смотреть каталог',
      buttonLink: '/catalog?category=tobacco',
      bgColor: 'bg-primary',
    },
  ];

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`min-w-full ${slide.bgColor} p-8 md:p-12`}
          >
            <div className="max-w-full text-center">
              <h2 className="font-display text-2xl md:text-4xl font-bold text-primary-foreground mb-3 uppercase">
                {slide.title}
              </h2>
              <p className="text-primary-foreground/80 mb-6">
                {slide.subtitle}
              </p>
              <a href={slide.buttonLink}>
                <Button
                  variant="outline"
                  className="bg-card text-foreground border-0 hover:bg-card/90 font-semibold px-6 mb-2"
                >
                  {slide.buttonText}
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 rounded-full flex items-center justify-center hover:bg-card transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 rounded-full flex items-center justify-center hover:bg-card transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-card' : 'bg-card/40'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoCarousel;