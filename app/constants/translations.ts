// app/constants/translations.ts

export type Language = "mg" | "en" | "fr";

export interface Translations {
  // Tabs
  tabs: {
    home: string;
    settings: string;
  };

  // Settings Screen
  settings: {
    title: string;
    theme: {
      title: string;
      description: string;
      light: string;
      dark: string;
      system: string;
    };
    language: {
      title: string;
      description: string;
      malagasy: string;
      english: string;
      french: string;
    };
    features: {
      title: string;
      description: string;
      autoDetect: string;
      saveHistory: string;
      quickAccess: string;
    };
    contact: {
      title: string;
      description: string;
      developedBy: string;
    };
  };

  // Common
  common: {
    version: string;
    allRightsReserved: string;
    copyrightDetails: string;
    ok: string;
    cancel: string;
    error: string;
    processing: string;
  };

  // Home Screen
  home: {
    noCodeFound: string;
    noCodeFoundMessage: string;
    dialCodeCopied: string;
    openDialer: string;
    noAd: string;
  };

  // Errors
  errors: {
    emailFailed: string;
    emailFailedMessage: string;
    cannotOpenEmail: string;
  };
}

export const translations: Record<Language, Translations> = {
  // English
  en: {
    tabs: {
      home: "Home",
      settings: "Settings",
    },
    settings: {
      title: "Settings",
      theme: {
        title: "Theme",
        description: "Choose your preferred theme for the app.",
        light: "Light Mode",
        dark: "Dark Mode",
        system: "System Default",
      },
      language: {
        title: "Language",
        description: "Choose your preferred language for the app.",
        malagasy: "Malagasy",
        english: "English",
        french: "French",
      },
      features: {
        title: "Extra Features",
        description: "Coming soon...",
        autoDetect: "Auto-detect operator",
        saveHistory: "Save scan history",
        quickAccess: "Quick access shortcuts",
      },
      contact: {
        title: "Contact Us",
        description: "Get in touch with us for support or feedback.",
        developedBy: "Developed by",
      },
    },
    common: {
      version: "Version",
      allRightsReserved: "© 2025 Shine Randriamialison. All rights reserved.",
      copyrightDetails:
        "Unauthorized reproduction, distribution, or modification of this application or any of its content is strictly prohibited.",
      ok: "OK",
      cancel: "Cancel",
      error: "Error",
      processing: "Processing...",
    },
    home: {
      noCodeFound: "No Code Found",
      noCodeFoundMessage: "Could not find a valid 14-digit code in the image.",
      dialCodeCopied: "Dial code copied to clipboard!",
      openDialer: "Open Dialer",
      noAd: "No Advertisement Available",
    },
    errors: {
      emailFailed: "Error",
      emailFailedMessage:
        "Failed to open email client. Please try again later.",
      cannotOpenEmail: "Cannot open email client. Please contact us at:",
    },
  },

  // French
  fr: {
    tabs: {
      home: "Accueil",
      settings: "Paramètres",
    },
    settings: {
      title: "Paramètres",
      theme: {
        title: "Thème",
        description: "Choisissez votre thème préféré pour l'application.",
        light: "Mode clair",
        dark: "Mode sombre",
        system: "Par défaut du système",
      },
      language: {
        title: "Langue",
        description: "Choisissez votre langue préférée pour l'application.",
        malagasy: "Malagasy",
        english: "Anglais",
        french: "Français",
      },
      features: {
        title: "Plus de Fonctionnalités",
        description: "Bientôt disponible...",
        autoDetect: "Détecter automatiquement l'opérateur",
        saveHistory: "Enregistrer l'historique des scans",
        quickAccess: "Raccourcis d'accès rapide",
      },
      contact: {
        title: "Contactez-nous",
        description:
          "Contactez-nous pour obtenir de l'aide ou des commentaires.",
        developedBy: "Développé par",
      },
    },
    common: {
      version: "Version",
      allRightsReserved: "© 2025 Shine Randriamialison. Tous droits réservés.",
      copyrightDetails:
        "La reproduction, la distribution ou la modification non autorisée de cette application ou de l'un de ses contenus est strictement interdite.",
      ok: "OK",
      cancel: "Annuler",
      error: "Erreur",
      processing: "Traitement en cours...",
    },
    home: {
      noCodeFound: "Aucun code trouvé",
      noCodeFoundMessage: "Impossible de trouver un code valide dans l'image.",
      dialCodeCopied: "Code copié dans le presse-papiers !",
      openDialer: "Ouvrir le composeur",
      noAd: "Aucune publicité disponible",
    },
    errors: {
      emailFailed: "Erreur",
      emailFailedMessage:
        "Échec de l'ouverture du client de messagerie. Veuillez réessayer plus tard.",
      cannotOpenEmail:
        "Impossible d'ouvrir le client de messagerie. Veuillez nous contacter à :",
    },
  },

  // Malagasy
  mg: {
    tabs: {
      home: "Fandraisana",
      settings: "Fikirakirana",
    },
    settings: {
      title: "Fikirakirana",
      theme: {
        title: "Endrika",
        description: "Safidio ny endrika tianao.",
        light: "Mazava",
        dark: "Maizina",
        system: "Endrikin'ny finday",
      },
      language: {
        title: "Fiteny",
        description: "Safidio ny fiteny tianao.",
        malagasy: "Malagasy",
        english: "Anglisy",
        french: "Frantsay",
      },
      features: {
        title: "Zavatra fanampiny",
        description: "Mbola hoavy...",
        autoDetect: "Mamantatra ho azy ny operatera",
        saveHistory: "Mitahiry ny tantaran'ny scan",
        quickAccess: "Fomba haingana hampiasaina ny App",
      },
      contact: {
        title: "Mifandraisa aminay",
        description: "Mifandraisa aminay mba hahazoana fanampiana na hevitra.",
        developedBy: "Namboarin'i",
      },
    },
    common: {
      version: "Version",
      allRightsReserved: "© 2025 Shine Randriamialison. Tous droits réservés.",
      copyrightDetails:
        "La reproduction, la distribution ou la modification non autorisée de cette application ou de l'un de ses contenus est strictement interdite.",
      ok: "OK",
      cancel: "Annuler",
      error: "Erreur",
      processing: "Eo ampiasana...",
    },
    home: {
      noCodeFound: "Tsy nahita kaody",
      noCodeFoundMessage: "Tsy nahita kaody tao amin'ny sary.",
      dialCodeCopied: "Kaody ao amin'ny clipboard!",
      openDialer: "Hanokatra ny dialer",
      noAd: "Tsy misy doka",
    },
    errors: {
      emailFailed: "Erreur",
      emailFailedMessage:
        "Tsy afaka nanokatra ny mpanjifa mailaka. Andramo indray avy eo.",
      cannotOpenEmail:
        "Tsy afaka manokatra ny mpanjifa mailaka. Mifandraisa aminay amin'ny:",
    },
  },
};
