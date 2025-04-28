import Header from "@/components/layout/Header";
import { useTranslation } from "react-i18next";

const MainLayout = ({ children }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">{children}</main>
      <footer className="bg-primary text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            {t(
              "© 2025 Mini Movie. All rights reserved by Diw Sirawit Developer."
            )}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
