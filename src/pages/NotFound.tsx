import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";
import { Home, AlertCircle } from "lucide-react"; // Импорт иконок из lucide-react

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800">
      <SEO
        title="Страница не найдена"
        description="Запрашиваемая страница не существует. Вернитесь на главную страницу магазина Smoke Store."
        canonical="/404"
      />
      <div className="text-center animate-fade-in">
        {/* Иконка ошибки */}
        <AlertCircle className="mx-auto mb-6 h-24 w-24 text-red-500 " />

        {/* Заголовок */}
        <h1 className="mb-4 text-6xl font-extrabold text-gray-800 dark:text-gray-200">
          404
        </h1>

        {/* Описание */}
        <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">
          Oops! Страница не найдена. Возможно, она была перемещена или удалена.
        </p>


        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Home className="h-5 w-5" />
          Вернуться на главную
        </a>
      </div>
    </div>
  );
};

export default NotFound;