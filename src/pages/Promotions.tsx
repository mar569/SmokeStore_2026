import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Добавлен для анимаций

import { Link } from 'react-router-dom';
import { ArrowRight, Percent, Gift, Star, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/components/integrations/supabase/client';
import SEO from '@/components/SEO';

const Promotions = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Маппинг иконок на основе discount_type
  const iconMap = {
    bonus: Gift,
    percentage: Percent,
    fixed: Percent,
    gift: Gift,
    loyalty: Star,
  };

  // Загрузка акций из Supabase (только активные)
  useEffect(() => {
    const fetchPromotions = async () => {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true);
      if (error) {
        console.error('Ошибка загрузки акций:', error);
      } else {
        setPromotions(data);
      }
      setLoading(false);
    };
    fetchPromotions();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
      />
      <p className="ml-4 text-muted-foreground">Загрузка акций...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Акции и спецпредложения"
        description="Текущие акции и спецпредложения магазина Smoke Store в Шлиссельбурге. Скидки на табак, кальяны и аксессуары."
        canonical="/promotions"
      />
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          className="font-display text-3xl md:text-4xl font-bold mb-8 uppercase text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Акции и спецпредложения
        </motion.h1>

        {/* Баннер с бонусами */}
        <motion.div
          className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 mb-8 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full flex flex-col items-center justify-center">
            <div className=" gap-2 mb-4">
              <h2 className="font-display text-3xl font-bold text-primary-foreground uppercase">
                Получай кешбек 10% при покупке товаров
              </h2>
            </div>
            <p className="text-primary-foreground/90 mb-6">
              Зарегистрируйтесь в системе лояльности нашего магазина и получайте 10% кешбек на все покупки!
            </p>
            <Button variant="outline" className="bg-card text-foreground border-0 hover:bg-card/90 font-semibold shadow-md">
              Узнать подробнее
            </Button>
          </div>
        </motion.div>

        {/* Список акций */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {promotions.map((promo, index) => {
            const Icon = iconMap[promo.discount_type] || Percent;
            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-card rounded-2xl p-6 border border-border hover:border-primary hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2 uppercase group-hover:text-primary transition-colors">
                      {promo.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {promo.description}
                    </p>
                    <Badge variant="secondary" className="mb-4">
                      {promo.discount_type === 'percentage' ? 'Процентная скидка' :
                        promo.discount_type === 'fixed' ? 'Фиксированная скидка' :
                          promo.discount_type === 'bonus' ? 'Бонус' : 'Подарок'}
                    </Badge>
                    <div>
                      <Link
                        to={`/promotions/${promo.id}`}
                        className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline group-hover:text-primary/80 transition-colors"
                      >
                        Подробнее
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </main>


    </div>
  );
};

export default Promotions;