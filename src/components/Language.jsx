import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import images from "../constants/images";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Language = ({ onLanguageChange = null }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const languages = [
    { code: "th", nameTh: "ภาษาไทย", nameEn: "Thai", flag: images.thailand },
    { code: "en", nameTh: "ภาษาอังกฤษ", nameEn: "English", flag: images.usa },
  ];

  useEffect(() => {
    if (!languages.some((lang) => lang.code === currentLanguage)) {
      i18n.changeLanguage("en");
    }
  }, []);

  const getCurrentFlag = () => {
    const current = languages.find((lang) => lang.code === currentLanguage);
    return current ? current.flag : images.usa;
  };

  const handleLanguageChange = (languageCode) => {
    i18n.changeLanguage(languageCode);

    if (onLanguageChange) {
      onLanguageChange(languageCode);
    }

    const event = new CustomEvent("languageChanged", {
      detail: { language: languageCode },
    });
    window.dispatchEvent(event);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none h-6 w-6 rounded-full overflow-hidden">
        <img
          src={getCurrentFlag()}
          alt="current language"
          className="w-full h-full object-cover rounded-full transition-transform hover:scale-105"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[130px] bg-popover border border-border ml-2"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
          >
            <img
              src={language.flag}
              alt={language.name}
              className="h-4 w-4 rounded-full object-cover"
            />
            <span className="font-medium">
              {currentLanguage === "th" ? language.nameTh : language.nameEn}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Language;
