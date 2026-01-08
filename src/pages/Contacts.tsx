import { useState } from 'react';

import SearchModal from '@/components/SearchModal';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';

const Contacts = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold mb-8 uppercase">Контакты</h1>

        <div className="grid lg:grid-cols-1 gap-8">
          {/* Контактная информация */}
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-display text-xl font-bold mb-6 uppercase">Как с нами связаться</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Phone className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Телефон</p>
                    <a href="tel:+79991234567" className="font-semibold hover:text-primary transition-colors">
                      +7 (999) xxx-xx-xx
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a href="mailto:info@pitersmoke.ru" className="font-semibold hover:text-primary transition-colors">
                      info@smokestore.ru
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Send className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telegram</p>
                    <a href="https://t.me/pitersmoke" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary transition-colors">
                      @smokestore
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Режим работы</p>
                    <p className="font-semibold">Ежедневно 10:00 - 22:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Адреса магазинов */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="font-display text-xl font-bold mb-6 uppercase">Наши магазин</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">ТЦ "Акватория"</p>
                    <p className="text-sm text-muted-foreground">Шлиссельбург, ул. Жука, д. 4</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="mt-8 bg-card rounded-2xl p-2 border border-border">
          <div className="aspect-video bg-muted rounded-xl overflow-hidden">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=31.032922%2C59.945907&mode=poi&poi%5Bpoint%5D=31.032692%2C59.945786&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D226903573250&z=19.59"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Карта магазина"
            >
            </iframe>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contacts;
