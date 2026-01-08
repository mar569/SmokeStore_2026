import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Добавлен для анимаций
import { useParams, Link } from 'react-router-dom';

import { ArrowLeft, Percent, Gift, Star, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/components/integrations/supabase/client';

const PromotionDetail = () => {
    const { id } = useParams();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [promotion, setPromotion] = useState(null);
    const [loading, setLoading] = useState(true);

    const iconMap = {
        bonus: Gift,
        percentage: Percent,
        fixed: Percent,
        gift: Gift,
        loyalty: Star,
    };

    useEffect(() => {
        const fetchPromotion = async () => {
            const { data, error } = await supabase
                .from('promotions')
                .select('*')
                .eq('id', id)
                .single();
            if (error) {
                console.error('Ошибка загрузки акции:', error);
                setPromotion(null);
            } else {
                setPromotion(data);
            }
            setLoading(false);
        };
        fetchPromotion();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
            />
            <p className="ml-4 text-muted-foreground">Загрузка акции...</p>
        </div>
    );

    if (!promotion) return (
        <div className="min-h-screen bg-background">

            <main className="container mx-auto px-4 py-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="font-display text-3xl font-bold mb-8 uppercase">Акция не найдена</h1>
                    <p className="text-muted-foreground mb-4">Возможно, акция была удалена или ссылка неверна.</p>
                    <Link to="/promotions" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                        <ArrowLeft className="h-4 w-4" />
                        Вернуться к акциям
                    </Link>
                </motion.div>
            </main>

        </div>
    );

    const Icon = iconMap[promotion.discount_type] || Percent;

    return (
        <div className="min-h-screen bg-background">

            <main className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/promotions" className="inline-flex items-center gap-2 text-primary font-medium hover:underline mb-8">
                        <ArrowLeft className="h-4 w-4" />
                        Вернуться к акциям
                    </Link>
                </motion.div>

                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Изображение */}
                    {promotion.image_url ? (
                        <img
                            src={promotion.image_url}
                            alt={promotion.name}
                            className="object-cover w-full max-w-[50%] rounded-2xl mb-8 shadow-lg"
                        />
                    ) : (
                        <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl mb-8 flex items-center justify-center">
                            <Icon className="h-16 w-16 text-primary/50" />
                        </div>
                    )}

                    {/* Иконка и заголовок */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md">
                            <Icon className="h-8 w-8 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="font-display text-4xl font-bold uppercase mb-2">{promotion.name}</h1>
                            <Badge variant="secondary" className="text-sm">
                                {promotion.discount_type === 'percentage' ? `Скидка ${promotion.discount_value}%` :
                                    promotion.discount_type === 'fixed' ? `Скидка ${promotion.discount_value} ₽` :
                                        promotion.discount_type === 'bonus' ? `Бонус ${promotion.discount_value} баллов` : 'Подарок'}
                            </Badge>
                        </div>
                    </div>

                    {/* Описание */}
                    <p className="text-muted-foreground text-lg mb-6 leading-relaxed">{promotion.description}</p>

                    <Separator className="mb-6" />

                    {/* Даты акции */}
                    <Card className="bg-card rounded-2xl border border-border shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-display text-2xl font-bold uppercase">
                                <Calendar className="h-5 w-5 text-primary" />
                                Сроки акции
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Дата начала:</span>
                                <span className="text-sm">{new Date(promotion.start_date).toLocaleDateString('ru-RU')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Дата окончания:</span>
                                <span className="text-sm">{new Date(promotion.end_date).toLocaleDateString('ru-RU')}</span>
                            </div>
                            <Badge variant={promotion.is_active ? 'default' : 'secondary'} className="mt-2">
                                {promotion.is_active ? 'Активна' : 'Неактивна'}
                            </Badge>
                        </CardContent>
                    </Card>

                    {/* Кнопка для перехода в каталог */}
                    <motion.div
                        className="mt-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Button asChild size="lg" className="shadow-md hover:shadow-lg transition-shadow">
                            <Link to="/catalog">Перейти в каталог</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

export default PromotionDetail;