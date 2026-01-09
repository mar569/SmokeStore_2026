-- -- Создание enum для ролей пользователей
-- CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- -- Создание enum для единиц измерения
-- CREATE TYPE public.weight_unit AS ENUM ('g', 'ml', 'pcs');

-- -- Таблица профилей пользователей
-- CREATE TABLE public.profiles (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
--   email TEXT,
--   full_name TEXT,
--   avatar_url TEXT,
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
-- );

-- -- Таблица ролей пользователей (отдельно от профилей для безопасности)
-- CREATE TABLE public.user_roles (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
--   role app_role NOT NULL DEFAULT 'user',
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   UNIQUE (user_id, role)
-- );

-- -- Таблица категорий (добавлено product_type для гибкости отображения характеристик)
-- CREATE TABLE public.categories (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   slug TEXT NOT NULL UNIQUE,
--   description TEXT,
--   image_url TEXT,
--   parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
--   sort_order INTEGER DEFAULT 0,
--   is_active BOOLEAN DEFAULT true,
--   product_type TEXT, -- Новое поле: 'tobacco', 'hookah', 'flask', 'coal', 'other' или null для общих
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
-- );

-- -- Таблица брендов
-- CREATE TABLE public.brands (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   slug TEXT NOT NULL UNIQUE,
--   logo_url TEXT,
--   description TEXT,
--   is_active BOOLEAN DEFAULT true,
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
-- );

-- -- Таблица товаров (добавлено specific для специфических характеристик в JSON)
-- CREATE TABLE public.products (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   slug TEXT NOT NULL UNIQUE,
--   description TEXT,
--   short_description TEXT,
--   category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
--   brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
--   price DECIMAL(10, 2) NOT NULL DEFAULT 0,
--   compare_at_price DECIMAL(10, 2),
--   weight DECIMAL(10, 2),
--   weight_unit weight_unit DEFAULT 'g',
--   flavor TEXT,
--   strength TEXT,
--   sku TEXT UNIQUE,
--   stock_quantity INTEGER DEFAULT 0,
--   is_active BOOLEAN DEFAULT true,
--   is_featured BOOLEAN DEFAULT false,
--   sort_order INTEGER DEFAULT 0,
--   specific TEXT, -- Новое поле: JSON строка для специфических характеристик (например, для колб, кальянов и т.д.)
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
-- );

-- -- Таблица изображений товаров
-- CREATE TABLE public.product_images (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
--   url TEXT NOT NULL,
--   alt_text TEXT,
--   is_primary BOOLEAN DEFAULT false,
--   sort_order INTEGER DEFAULT 0,
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
-- );

-- -- Таблица акций
-- CREATE TABLE public.promotions (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   description TEXT,
--   discount_type TEXT NOT NULL DEFAULT 'percentage',
--   discount_value DECIMAL(10, 2) NOT NULL DEFAULT 0,
--   start_date TIMESTAMP WITH TIME ZONE,
--   end_date TIMESTAMP WITH TIME ZONE,
--   is_active BOOLEAN DEFAULT true,
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
-- );

-- -- Таблица связи товаров и акций
-- CREATE TABLE public.product_promotions (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
--   promotion_id UUID REFERENCES public.promotions(id) ON DELETE CASCADE NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   UNIQUE (product_id, promotion_id)
-- );

-- -- Таблица ценовых правил (массовое управление ценами)
-- CREATE TABLE public.price_rules (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   name TEXT NOT NULL,
--   brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
--   category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
--   weight DECIMAL(10, 2),
--   weight_unit weight_unit,
--   price DECIMAL(10, 2) NOT NULL,
--   is_active BOOLEAN DEFAULT true,
--   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
--   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
-- );

-- -- Включение RLS для всех таблиц
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.product_promotions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.price_rules ENABLE ROW LEVEL SECURITY;

-- -- Функция для проверки роли пользователя (security definer для избежания рекурсии)
-- CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
-- RETURNS BOOLEAN
-- LANGUAGE sql
-- STABLE
-- SECURITY DEFINER
-- SET search_path = public
-- AS $$
--   SELECT EXISTS (
--     SELECT 1
--     FROM public.user_roles
--     WHERE user_id = _user_id
--       AND role = _role
--   )
-- $$;

-- -- Функция для проверки админа
-- CREATE OR REPLACE FUNCTION public.is_admin()
-- RETURNS BOOLEAN
-- LANGUAGE sql
-- STABLE
-- SECURITY DEFINER
-- SET search_path = public
-- AS $$
--   SELECT public.has_role(auth.uid(), 'admin')
-- $$;

-- -- Функция обновления updated_at
-- CREATE OR REPLACE FUNCTION public.update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = now();
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SET search_path = public;

-- -- Триггеры для updated_at
-- CREATE TRIGGER update_profiles_updated_at
--   BEFORE UPDATE ON public.profiles
--   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CREATE TRIGGER update_categories_updated_at
--   BEFORE UPDATE ON public.categories
--   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CREATE TRIGGER update_brands_updated_at
--   BEFORE UPDATE ON public.brands
--   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CREATE TRIGGER update_products_updated_at
--   BEFORE UPDATE ON public.products
--   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CREATE TRIGGER update_promotions_updated_at
--   BEFORE UPDATE ON public.promotions
--   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- CREATE TRIGGER update_price_rules_updated_at
--   BEFORE UPDATE ON public.price_rules
--   FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- -- Функция для создания профиля при регистрации
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- SECURITY DEFINER SET search_path = public
-- AS $$
-- BEGIN
--   INSERT INTO public.profiles (user_id, email, full_name)
--   VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
--   RETURN NEW;
-- END;
-- $$;

-- -- Триггер для автоматического создания профиля
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -- RLS политики для profiles
-- CREATE POLICY "Users can view their own profile"
--   ON public.profiles FOR SELECT
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Users can update their own profile"
--   ON public.profiles FOR UPDATE
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Admins can view all profiles"
--   ON public.profiles FOR SELECT
--   USING (public.is_admin());

-- -- RLS политики для user_roles
-- CREATE POLICY "Users can view their own roles"
--   ON public.user_roles FOR SELECT
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Admins can manage all roles"
--   ON public.user_roles FOR ALL
--   USING (public.is_admin());

-- -- RLS политики для категорий (публичное чтение, админ для записи)
-- CREATE POLICY "Anyone can view active categories"
--   ON public.categories FOR SELECT
--   USING (is_active = true);

-- CREATE POLICY "Admins can manage categories"
--   ON public.categories FOR ALL
--   USING (public.is_admin());

-- -- RLS политики для брендов
-- CREATE POLICY "Anyone can view active brands"
--   ON public.brands FOR SELECT
--   USING (is_active = true);

-- CREATE POLICY "Admins can manage brands"
--   ON public.brands FOR ALL
--   USING (public.is_admin());

-- -- RLS политики для товаров
-- CREATE POLICY "Anyone can view active products"
--   ON public.products FOR SELECT
--   USING (is_active = true);

-- CREATE POLICY "Admins can manage products"
--   ON public.products FOR ALL
--   USING (public.is_admin());

-- -- RLS политики для изображений товаров
-- CREATE POLICY "Anyone can view product images"
--   ON public.product_images FOR SELECT
--   USING (true);

-- CREATE POLICY "Admins can manage product images"
--   ON public.product_images FOR ALL
--   USING (public.is_admin());

-- -- RLS политики для акций
-- CREATE POLICY "Anyone can view active promotions"
--   ON public.promotions FOR SELECT
--   USING (is_active = true);

-- CREATE POLICY "Admins can manage promotions"
--   ON public.promotions FOR ALL
--   USING (public.is_admin());

-- -- RLS политики для связи товаров и акций
-- CREATE POLICY "Anyone can view product promotions"
--   ON public.product_promotions FOR SELECT
--   USING (true);

-- CREATE POLICY "Admins can manage product promotions"
--   ON public.product_promotions FOR ALL
--   USING (public.is_admin());

-- -- RLS политики для ценовых правил
-- CREATE POLICY "Admins can view price rules"
--   ON public.price_rules FOR SELECT
--   USING (public.is_admin());

-- CREATE POLICY "Admins can manage price rules"
--   ON public.price_rules FOR ALL
--   USING (public.is_admin());

-- -- Создание хранилища для изображений товаров
-- INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);

-- -- Политики для хранилища
-- CREATE POLICY "Anyone can view product images storage"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'products');

-- CREATE POLICY "Admins can upload product images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'products' AND public.is_admin());

-- CREATE POLICY "Admins can update product images"
--   ON storage.objects FOR UPDATE
--   USING (bucket_id = 'products' AND public.is_admin());

-- CREATE POLICY "Admins can delete product images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'products' AND public.is_admin());

-- -- Функция для создания продукта с изображениями (исправленный цикл, добавлен _specific)
-- CREATE OR REPLACE FUNCTION public.create_product_with_images(
--   _name TEXT,
--   _slug TEXT,
--   _price DECIMAL(10, 2),
--   _description TEXT DEFAULT NULL,
--   _short_description TEXT DEFAULT NULL,
--   _category_id UUID DEFAULT NULL,
--   _brand_id UUID DEFAULT NULL,
--   _compare_at_price DECIMAL(10, 2) DEFAULT NULL,
--   _weight DECIMAL(10, 2) DEFAULT NULL,
--   _weight_unit weight_unit DEFAULT 'g',
--   _flavor TEXT DEFAULT NULL,
--   _strength TEXT DEFAULT NULL,
--   _sku TEXT DEFAULT NULL,
--   _stock_quantity INTEGER DEFAULT 0,
--   _is_active BOOLEAN DEFAULT true,
--   _is_featured BOOLEAN DEFAULT false,
--   _sort_order INTEGER DEFAULT 0,
--   _specific TEXT DEFAULT NULL, -- Добавлено для специфических данных
--   _image_urls TEXT[] DEFAULT NULL
-- )
-- RETURNS UUID
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- SET search_path = public
-- AS $$
-- DECLARE
--   new_product_id UUID;
--   i INTEGER;
-- BEGIN
--   -- Вставляем продукт
--   INSERT INTO public.products (
--     name, slug, description, short_description, category_id, brand_id,
--     price, compare_at_price, weight, weight_unit, flavor, strength,
--     sku, stock_quantity, is_active, is_featured, sort_order, specific
--   ) VALUES (
--     _name, _slug, _description, _short_description, _category_id, _brand_id,
--     _price, _compare_at_price, _weight, _weight_unit, _flavor, _strength,
--     _sku, _stock_quantity, _is_active, _is_featured, _sort_order, _specific
--   ) RETURNING id INTO new_product_id;

--   -- Если переданы URL изображений, вставляем их
--   IF _image_urls IS NOT NULL AND array_length(_image_urls, 1) > 0 THEN
--     FOR i IN 1 .. array_length(_image_urls, 1) LOOP
--       INSERT INTO public.product_images (
--         product_id, url, is_primary, sort_order
--       ) VALUES (
--         new_product_id, _image_urls[i], (i = 1), i  -- Первое изображение - первичное
--       );
--     END LOOP;
--   END IF;

--   RETURN new_product_id;
-- END;
-- $$;

-- -- Функция для обновления продукта с изображениями (заменяет существующие изображения, исправленный цикл, добавлен _specific)
-- CREATE OR REPLACE FUNCTION public.update_product_with_images(
--   _product_id UUID,
--   _name TEXT DEFAULT NULL,
--   _slug TEXT DEFAULT NULL,
--   _price DECIMAL(10, 2) DEFAULT NULL,
--   _description TEXT DEFAULT NULL,
--   _short_description TEXT DEFAULT NULL,
--   _category_id UUID DEFAULT NULL,
--   _brand_id UUID DEFAULT NULL,
--   _compare_at_price DECIMAL(10, 2) DEFAULT NULL,
--   _weight DECIMAL(10, 2) DEFAULT NULL,
--   _weight_unit weight_unit DEFAULT NULL,
--   _flavor TEXT DEFAULT NULL,
--   _strength TEXT DEFAULT NULL,
--   _sku TEXT DEFAULT NULL,
--   _stock_quantity INTEGER DEFAULT NULL,
--   _is_active BOOLEAN DEFAULT NULL,
--   _is_featured BOOLEAN DEFAULT NULL,
--   _sort_order INTEGER DEFAULT NULL,
--   _specific TEXT DEFAULT NULL, -- Добавлено для специфических данных
--   _image_urls TEXT[] DEFAULT NULL
-- )
-- RETURNS VOID
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- SET search_path = public
-- AS $$
-- DECLARE
--   i INTEGER;
-- BEGIN
--   -- Обновляем продукт (только переданные поля)
--   UPDATE public.products
--   SET
--     name = COALESCE(_name, name),
--     slug = COALESCE(_slug, slug),
--     description = COALESCE(_description, description),
--     short_description = COALESCE(_short_description, short_description),
--     category_id = COALESCE(_category_id, category_id),
--     brand_id = COALESCE(_brand_id, brand_id),
--     price = COALESCE(_price, price),
--     compare_at_price = _compare_at_price,  -- NULL разрешен
--     weight = _weight,  -- NULL разрешен
--     weight_unit = COALESCE(_weight_unit, weight_unit),
--     flavor = COALESCE(_flavor, flavor),
--     strength = COALESCE(_strength, strength),
--     sku = COALESCE(_sku, sku),
--     stock_quantity = COALESCE(_stock_quantity, stock_quantity),
--     is_active = COALESCE(_is_active, is_active),
--     is_featured = COALESCE(_is_featured, is_featured),
--     sort_order = COALESCE(_sort_order, sort_order),
--     specific = COALESCE(_specific, specific), -- Обновление specific
--     updated_at = now()
--   WHERE id = _product_id;

--   -- Если переданы новые URL изображений, удаляем старые и вставляем новые
--   IF _image_urls IS NOT NULL THEN
--     DELETE FROM public.product_images WHERE product_id = _product_id;
--     IF array_length(_image_urls, 1) > 0 THEN
--       FOR i IN 1 .. array_length(_image_urls, 1) LOOP
--         INSERT INTO public.product_images (
--           product_id, url, is_primary, sort_order
--         ) VALUES (
--           _product_id, _image_urls[i], (i = 1), i
--         );
--       END LOOP;
--     END IF;
--   END IF;
-- END;
-- $$;

-- -- Индекс для оптимизации запросов изображений по продукту
-- CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images (product_id);


