-- Auto-assign admin role on registration (for initial setup, you can change this later)
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin');
  RETURN NEW;
END;
$$;

-- Create trigger for auto-assigning admin role
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Create category_attributes table for custom category-specific fields
CREATE TABLE public.category_attributes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  attribute_type TEXT NOT NULL DEFAULT 'text', -- text, number, select, multiselect
  options JSONB, -- for select/multiselect types
  is_required BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.category_attributes ENABLE ROW LEVEL SECURITY;

-- Policies for category_attributes
CREATE POLICY "Admins can manage category attributes"
  ON public.category_attributes
  FOR ALL
  USING (is_admin());

CREATE POLICY "Anyone can view category attributes"
  ON public.category_attributes
  FOR SELECT
  USING (true);

-- Create product_attributes table for storing custom attribute values
CREATE TABLE public.product_attributes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_id UUID NOT NULL REFERENCES public.category_attributes(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, attribute_id)
);

-- Enable RLS
ALTER TABLE public.product_attributes ENABLE ROW LEVEL SECURITY;

-- Policies for product_attributes
CREATE POLICY "Admins can manage product attributes"
  ON public.product_attributes
  FOR ALL
  USING (is_admin());

CREATE POLICY "Anyone can view product attributes"
  ON public.product_attributes
  FOR SELECT
  USING (true);

-- Add country column to brands table
ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS country TEXT;

-- Add more columns to products for tobacco-specific fields
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS tobacco_type TEXT,
  ADD COLUMN IF NOT EXISTS heat_resistance TEXT,
  ADD COLUMN IF NOT EXISTS composition TEXT,
  ADD COLUMN IF NOT EXISTS flavor_notes JSONB;

-- Triggers for updated_at
CREATE TRIGGER update_category_attributes_updated_at
  BEFORE UPDATE ON public.category_attributes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_product_attributes_updated_at
  BEFORE UPDATE ON public.product_attributes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default categories for hookah shop
INSERT INTO public.categories (name, slug, description, sort_order) VALUES
  ('Табак для кальяна', 'tobacco', 'Табак различных брендов и вкусов', 1),
  ('Кальяны', 'hookahs', 'Кальяны и комплектующие', 2),
  ('Аксессуары для кальяна', 'accessories', 'Чаши, шланги, мундштуки и прочее', 3),
  ('Уголь', 'charcoal', 'Уголь для кальяна', 4),
  ('Жидкости', 'liquids', 'Жидкости для вейпов', 5),
  ('Вейпы', 'vapes', 'Электронные сигареты и вейпы', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert default brands for tobacco
INSERT INTO public.brands (name, slug, description, is_active) VALUES
  ('Adalya', 'adalya', 'Табак для кальяна', true),
  ('Afzal', 'afzal', 'Табак для кальяна', true),
  ('Aircraft', 'aircraft', 'Табак для кальяна', true),
  ('Banger', 'banger', 'Табак для кальяна', true),
  ('Black Burn', 'black-burn', 'Табак для кальяна', true),
  ('Blansh', 'blansh', 'Табак для кальяна', true),
  ('Bliss', 'bliss', 'Табак для кальяна', true),
  ('Bonche', 'bonche', 'Табак для кальяна', true),
  ('Brusko', 'brusko', 'Табак для кальяна', true),
  ('Burn', 'burn', 'Табак для кальяна', true),
  ('Chaba', 'chaba', 'Табак для кальяна', true),
  ('Chabacco', 'chabacco', 'Табак для кальяна', true),
  ('Codex Nubium', 'codex-nubium', 'Табак для кальяна', true),
  ('DAIM', 'daim', 'Табак для кальяна', true),
  ('DarkSide', 'darkside', 'Табак для кальяна', true),
  ('Deus', 'deus', 'Табак для кальяна', true),
  ('Dogma', 'dogma', 'Табак для кальяна', true),
  ('Duft', 'duft', 'Табак для кальяна', true),
  ('Element', 'element', 'Табак для кальяна', true),
  ('Everest', 'everest', 'Табак для кальяна', true),
  ('Frigate', 'frigate', 'Табак для кальяна', true),
  ('HiT', 'hit', 'Табак для кальяна', true),
  ('Hook', 'hook', 'Табак для кальяна', true),
  ('IzziBro', 'izzibro', 'Табак для кальяна', true),
  ('Jent', 'jent', 'Табак для кальяна', true),
  ('Jent Cigar', 'jent-cigar', 'Табак для кальяна', true),
  ('JOY', 'joy', 'Табак для кальяна', true),
  ('Ka Rai', 'ka-rai', 'Табак для кальяна', true),
  ('Khan Burley', 'khan-burley', 'Табак для кальяна', true),
  ('LeTeam', 'leteam', 'Табак для кальяна', true),
  ('MattPear', 'mattpear', 'Табак для кальяна', true),
  ('Mayram', 'mayram', 'Табак для кальяна', true),
  ('MustHave', 'musthave', 'Табак для кальяна', true),
  ('NАШ', 'nash', 'Табак для кальяна', true),
  ('Original Virginia', 'original-virginia', 'Табак для кальяна', true),
  ('Overdose', 'overdose', 'Табак для кальяна', true),
  ('Peter Ralf', 'peter-ralf', 'Табак для кальяна', true),
  ('Sapphire Crown', 'sapphire-crown', 'Табак для кальяна', true),
  ('Satyr Tobacco', 'satyr-tobacco', 'Табак для кальяна', true),
  ('Scent', 'scent', 'Табак для кальяна', true),
  ('Sebero', 'sebero', 'Табак для кальяна', true),
  ('Smoke Angels', 'smoke-angels', 'Табак для кальяна', true),
  ('Spectrum', 'spectrum', 'Табак для кальяна', true),
  ('Starline', 'starline', 'Табак для кальяна', true),
  ('Take', 'take', 'Табак для кальяна', true),
  ('Tangiers', 'tangiers', 'Табак для кальяна', true),
  ('Trofimoff''s', 'trofimoffs', 'Табак для кальяна', true),
  ('WTO', 'wto', 'Табак для кальяна', true),
  ('Zomo', 'zomo', 'Табак для кальяна', true),
  ('Северный', 'severnyy', 'Табак для кальяна', true),
  ('Сарма', 'sarma', 'Табак для кальяна', true),
  ('Хулиган', 'huligan', 'Табак для кальяна', true),
  ('Энтузиаст', 'entuziast', 'Табак для кальяна', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert default brands for hookahs
INSERT INTO public.brands (name, slug, description, is_active) VALUES
  ('Alpha Hookah', 'alpha-hookah', 'Кальяны', true),
  ('Avanti', 'avanti', 'Кальяны', true),
  ('BeeSmoke', 'beesmoke', 'Кальяны', true),
  ('DDI', 'ddi', 'Кальяны', true),
  ('El Bomber', 'el-bomber', 'Кальяны', true),
  ('Euro Shisha', 'euro-shisha', 'Кальяны', true),
  ('Euroshisha', 'euroshisha', 'Кальяны', true),
  ('Hoob', 'hoob', 'Кальяны', true),
  ('Hookah Box', 'hookah-box', 'Кальяны', true),
  ('Japona Hookah', 'japona-hookah', 'Кальяны', true),
  ('Just Stick', 'just-stick', 'Кальяны', true),
  ('Kaya', 'kaya', 'Кальяны', true),
  ('Maklaud Shisha', 'maklaud-shisha', 'Кальяны', true),
  ('Misha', 'misha', 'Кальяны', true),
  ('Nanosmoke', 'nanosmoke', 'Кальяны', true),
  ('RF', 'rf', 'Кальяны', true),
  ('Runner', 'runner', 'Кальяны', true),
  ('Union Hookah', 'union-hookah', 'Кальяны', true),
  ('На Грани', 'na-grani', 'Кальяны', true),
  ('Solomon', 'solomon', 'Кальяны', true),
  ('Tortuga', 'tortuga', 'Кальяны', true),
  ('Wookah', 'wookah', 'Кальяны', true),
  ('Y.K.A.P.', 'y-k-a-p', 'Кальяны', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert default attributes for tobacco category
INSERT INTO public.category_attributes (category_id, name, label, attribute_type, options, sort_order)
SELECT 
  c.id,
  attr.name,
  attr.label,
  attr.attribute_type,
  attr.options::jsonb,
  attr.sort_order
FROM public.categories c
CROSS JOIN (VALUES
  ('country', 'Страна', 'text', NULL, 1),
  ('tobacco_type', 'Тип табака', 'select', '["Virginia", "Burley", "Dark Leaf", "Blonde Leaf", "Oriental"]', 2),
  ('strength_level', 'Крепость', 'select', '["Легкий", "Средний", "Крепкий", "Очень крепкий"]', 3),
  ('flavor_notes', 'Вкусовые ноты', 'multiselect', '["Фруктовый", "Ягодный", "Цитрусовый", "Мятный", "Пряный", "Сладкий", "Освежающий", "Экзотический"]', 4),
  ('composition', 'Состав', 'text', NULL, 5),
  ('heat_resistance', 'Жаростойкость', 'select', '["Низкая", "Средняя", "Высокая"]', 6)
) AS attr(name, label, attribute_type, options, sort_order)
WHERE c.slug = 'tobacco';