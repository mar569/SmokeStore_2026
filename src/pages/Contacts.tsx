import { useState } from 'react';

import SearchModal from '@/components/SearchModal';
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react'; // Добавлено Loader2
import SEO from '@/components/SEO';

const Contacts = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true); // Состояние загрузки карты

  const handleMapLoad = () => {
    setIsMapLoading(false); // Устанавливаем false при загрузке карты
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Контакты — адрес, телефон, карта"
        description="Контакты магазина Smoke Store в Шлиссельбурге. Телефон, email, Telegram, адрес в ТЦ Акватория и карта проезда."
        canonical="/contacts"
      />
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
          <div className="aspect-video bg-muted rounded-xl overflow-hidden relative">
            {isMapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-xl">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Карта загружается...</p>
                </div>
              </div>
            )}
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=31.032922%2C59.945907&mode=poi&poi%5Bpoint%5D=31.032692%2C59.945786&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D226903573250&z=19.59"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Карта магазина"
              onLoad={handleMapLoad}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contacts;