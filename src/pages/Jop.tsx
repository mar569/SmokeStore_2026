import { useState } from 'react';
import { motion } from 'framer-motion';
import SearchModal from '@/components/SearchModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Phone, Clock, Send, Users, Zap, Heart, } from 'lucide-react';

const Job = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <motion.main
                className="container mx-auto px-4 py-8 pt-10 pb-64"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Заголовок */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
                        Работа в нашем магазине <span className="text-primary">Smoke Store</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Стань частью нашей команды! Мы магазин, специализирующийся на продаже табачной продукции, в том числе электронных сигарет.
                    </p>
                </motion.div>

                {/* Почему выбирают нас */}
                <motion.section
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-center">
                        Почему выбирают нас?
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-card p-6 rounded-lg border border-border text-center">
                            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Стабильность и надежность</h3>
                            <p className="text-sm text-muted-foreground">Работайте в стабильной компании с надежными условиями.</p>
                        </div>
                        <div className="bg-card p-6 rounded-lg border border-border text-center">
                            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Быстрый старт</h3>
                            <p className="text-sm text-muted-foreground">Начните работать уже сегодня и получайте опыт сразу.</p>
                        </div>
                        <div className="bg-card p-6 rounded-lg border border-border text-center">
                            <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Фокус на клиента</h3>
                            <p className="text-sm text-muted-foreground">Работайте с клиентами и помогайте им находить идеальные продукты.</p>
                        </div>
                        <div className="bg-card p-6 rounded-lg border border-border text-center">
                            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Дружелюбный коллектив</h3>
                            <p className="text-sm text-muted-foreground">Присоединяйтесь к команде единомышленников.</p>
                        </div>
                    </div>
                </motion.section>

                <Separator className="my-12" />

                {/* Кто нам нужен */}
                <motion.section
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-center">
                        Кто нам нужен?
                    </h2>
                    <div className="bg-card p-8 rounded-lg border border-border max-w-4xl mx-auto">
                        <p className="text-lg text-muted-foreground text-center mb-6">
                            Мы ищем энергичных, открытых и ответственных людей, заинтересованных в развитии и готовых расти вместе с нами.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <Badge variant="secondary">Энергичность</Badge>
                            <Badge variant="secondary">Открытость</Badge>
                            <Badge variant="secondary">Ответственность</Badge>
                            <Badge variant="secondary">Желание развиваться</Badge>
                        </div>
                    </div>
                </motion.section>

                <Separator className="my-12" />

                {/* Присоединяйся к нам */}
                <motion.section
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
                        Присоединяйся к нам!
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Готов стать частью нашей команды? Свяжитесь с нами прямо сейчас!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="flex items-center gap-2">
                            <a href="tel:+79633124653">
                                <Phone className="h-5 w-5" />
                                Позвонить: +7 (963) 312-46-53
                            </a>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                            <a href="https://t.me/yourtelegram" target="_blank" rel="noopener noreferrer">
                                <Send className="h-5 w-5" />
                                Написать в Telegram
                            </a>
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                        Мы ответим на ваше сообщение в ближайшее время!
                    </p>
                </motion.section>
            </motion.main>
        </div>
    );
};

export default Job;