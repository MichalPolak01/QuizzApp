export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "QuizzApp",
  description: "Create quizzes, explore, learn and have fun.",
  navItems: [
    {
      label: "Home",
      href: "/home",
      authRequired: true
    },
    {
      label: "Quizy",
      href: "/quizzes",
      authRequired: true
    },
    {
      label: "Stwórz quiz",
      href: "/quizzes/wizard",
      authRequired: true
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/home",
      authRequired: true
    },
    {
      label: "Quizy",
      href: "/quizzes",
      authRequired: true
    },
    {
      label: "Stwórz quiz",
      href: "/quizzes/wizard",
      authRequired: true
    },
    {
      label: "Ustwaienia profilowe",
      href: "/profile",
      authRequired: true
    },
    {
      label: "Logowanie",
      href: "/login",
      authRequired: false
    },
    {
      label: "Rejestracja",
      href: "/register",
      authRequired: false
    },
    {
      label: "Logout",
      href: "/logout",
      authRequired: true
    }
  ],
  navMenuAuth: [
    {
      label: "Login",
      href: "/login"
    },
    {
      label: "Register",
      href: "/register"
    }
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
