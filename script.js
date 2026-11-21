const translations = {
  ar: {
    navHome: "الرئيسية", navServices: "خدماتنا", navAbout: "عن المنصة", navTools: "الأدوات",
    eyebrow: "TECHNOLOGY FOR EVERYONE",
    heroTitle: "عالم أسهل.. بإمكانياتك أنت.",
    heroText: "منصة رقمية تساعد ذوي الإعاقة على التواصل والتعلم والاستقلالية.",
    heroCta: "اكتشف خدماتنا", artCaption: "التكنولوجيا للجميع",
    servicesTitle: "كيف يمكننا مساعدتك؟", servicesText: "اختر الأداة التي تناسب احتياجاتك.",
    visualTitle: "المساعدة البصرية", visualText: "أدوات لقراءة النصوص وتكبير المحتوى وتحسين وضوحه.",
    hearingTitle: "المساعدة السمعية", hearingText: "أدوات لتحويل الكلام إلى نص لدعم التواصل.",
    communicationTitle: "التواصل بالصور", communicationText: "كوّن جملة من عبارات واضحة واستمع إليها بصوت مسموع.",
    learningTitle: "التعلم المبسط", learningText: "محتوى تعليمي منظم وسهل القراءة.",
    dailyTitle: "الحياة اليومية", dailyText: "أدوات لتنظيم المهام والروتين اليومي.",
    workTitle: "التعليم والعمل", workText: "مسارات لتطوير المهارات والاستعداد للعمل.",
    openTool: "افتح الأداة ←",
    comingSoon: "قريبًا", comingSoon2: "قريبًا", comingSoon3: "قريبًا",
    comingSoon4: "قريبًا", comingSoon5: "قريبًا",
    aboutTitle: "التكنولوجيا للجميع.. دون استثناء.",
    aboutText: "تمكين مشروع يهدف إلى تقديم أدوات رقمية تساعد الأشخاص ذوي الإعاقة على التعبير عن احتياجاتهم، والتعلم، وزيادة استقلاليتهم والمشاركة في المجتمع.",
    footerLine: "قدرات مختلفة.. فرص متساوية."
  },
  en: {
    navHome: "Home", navServices: "Services", navAbout: "About", navTools: "Tools",
    eyebrow: "TECHNOLOGY FOR EVERYONE",
    heroTitle: "A Better World, On Your Own Terms.",
    heroText: "A digital platform helping people with disabilities communicate, learn and live independently.",
    heroCta: "Explore Services", artCaption: "Technology for everyone",
    servicesTitle: "How Can We Help You?", servicesText: "Choose the tool that fits your needs.",
    visualTitle: "Visual Assistance", visualText: "Tools to read text, magnify content and improve clarity.",
    hearingTitle: "Hearing Assistance", hearingText: "Speech-to-text tools to support communication.",
    communicationTitle: "Picture Communication", communicationText: "Build a sentence from clear phrases and listen to it aloud.",
    learningTitle: "Simplified Learning", learningText: "Organized educational content that is easier to read.",
    dailyTitle: "Daily Life", dailyText: "Tools for daily tasks and routine management.",
    workTitle: "Education & Work", workText: "Paths to develop skills and prepare for work.",
    openTool: "Open the tool →",
    comingSoon: "Coming soon", comingSoon2: "Coming soon", comingSoon3: "Coming soon",
    comingSoon4: "Coming soon", comingSoon5: "Coming soon",
    aboutTitle: "Technology for Everyone. Without Exception.",
    aboutText: "TAMKEEN aims to provide digital tools that help people with disabilities express their needs, learn, become more independent and participate in society.",
    footerLine: "Different Abilities. Equal Opportunities."
  }
};

let currentLanguage = "ar";
const languageButton = document.getElementById("languageButton");

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (Object.prototype.hasOwnProperty.call(translations[language], key)) {
      element.textContent = translations[language][key];
    }
  });

  languageButton.textContent = language === "ar" ? "English" : "العربية";
}

languageButton.addEventListener("click", () => {
  setLanguage(currentLanguage === "ar" ? "en" : "ar");
});

document.getElementById("year").textContent = new Date().getFullYear();
setLanguage("ar");
