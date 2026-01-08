import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground relative">
      <div className="absolute inset-0 pattern-diagonal opacity-30" />
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4 uppercase">
              <span className="text-primary">Smoke</span> Store
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Магазин табачной продукции. Кальяны, табак, вейпы и аксессуары.
            </p>
            <p className="text-xs text-muted-foreground">
              18+ Продажа лицам младше 18 лет запрещена
            </p>
          </div>

          {/* Категории */}
          <div className='relative'>
            <h4 className="font-display font-bold mb-4 uppercase ">Каталог</h4>
            <nav className="space-y-2 text-sm">
              <Link to="/catalog?category=hookahs" className="block hover:text-primary transition-colors">
                Кальяны
              </Link>
              <Link to="/catalog?category=hookah-tobacco" className="block hover:text-primary transition-colors">
                Табак для кальяна
              </Link>
              <Link to="/catalog?category=vapes" className="block hover:text-primary transition-colors">
                Вейпы
              </Link>
              <Link to="/catalog?category=e-cigarettes" className="block hover:text-primary transition-colors">
                Электронные сигареты
              </Link>
              <Link to="/catalog?category=accessories" className="block hover:text-primary transition-colors">
                Аксессуары
              </Link>
            </nav>
          </div>

          {/* Информация */}
          <div className='relative'>
            <h4 className="font-display font-bold mb-4 uppercase ">Информация</h4>
            <nav className="space-y-2 text-sm">
              <Link to="/promotions" className="block hover:text-primary transition-colors">
                Акции
              </Link>
              <Link to="/stores" className="block hover:text-primary transition-colors">
                Магазин
              </Link>
              <Link to="/contacts" className="block hover:text-primary transition-colors">
                Контакты
              </Link>
            </nav>
          </div>

          {/* Контакты */}
          <div className='relative'>
            <h4 className="font-display font-bold mb-4 uppercase">Контакты</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+79991234567" className="hover:text-primary transition-colors">
                  +7 (999) 123-45-67
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:info@pitersmoke.ru" className="hover:text-primary transition-colors">
                  info@smokestore.ru
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>г. Шлиссельбург, ул Жука, д. 4</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-primary" />
                <span>Ежедневно 10:00 - 22:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть футера с копирайтом и информацией */}
        <div className="border-t border-border/30 mt-8 pt-8 relative">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p className="font-semibold">© «Smoke Store», 2026</p>
            <p>ИП x x x, ИНН: 7841000xxxxx</p>
            <p>
              <Link to="/agreement" className="hover:text-primary transition-colors underline">
                Правила пользования сайтом
              </Link>
            </p>
            <div>
              <p className="font-medium text-muted-foreground uppercase mb-2">
                Минздрав предупреждает: Курение вредит вашему здоровью
              </p>
              <p className="text-xs max-w-4xl mx-auto">
                Мы не осуществляем дистанционную торговлю никотинсодержащими изделиями в соответствии с Федеральным законом от 23.02.2013 N 15-ФЗ (ред. от 28.12.2016) "Об охране здоровья граждан от воздействия окружающего табачного дыма и последствий потребления табака". <br />
                Информация на сайте не является публичной офертой.
              </p>
              <p className='mb-2'>
                <span>
                  Условия пользования сайтом
                </span >{' '}
                <Link to="/agreement" className="hover:text-red-500 text-red-700 cursor-pointer transition-colors underline">
                  Пользовательское соглашение
                </Link>
              </p>
              <p className="text-xs leading-relaxed max-w-4xl mx-auto">
                В соответствии со ст. 20 ФЗ №15 «Об охране здоровья граждан» лицам, не достигшим 18 лет пользование данным сайтом запрещено.
              </p>
              <p className="text-xs leading-relaxed max-w-4xl mx-auto">
                Данный сайт не является рекламой, а служит лишь для предоставления достоверной информации о свойствах, характеристиках продукции и её наличии в магазине. (п.1 и п.2 ст.10 Закона «О защите прав потребителей»).
              </p>
            </div>
          </div>
        </div>
      </div>

      <a
        href="https://t.me/pitersmoke"
        target="_blank"
        rel="noopener noreferrer"
        className="telegram-btn"
        title="Написать в Telegram"
      >
        <Send className="h-6 w-6 text-primary-foreground" />
      </a>
    </footer>
  );
};

export default Footer;