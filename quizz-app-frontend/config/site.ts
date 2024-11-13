export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/home",
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
      label: "Stwórz quiz",
      href: "/quizzes/wizard",
      authRequired: true
    },
    // {
    //   label: "Dashboard",
    //   href: "/dashboard",
    // },
    // {
    //   label: "Projects",
    //   href: "/projects",
    // },
    // {
    //   label: "Team",
    //   href: "/team",
    // },
    // {
    //   label: "Calendar",
    //   href: "/calendar",
    // },
    // {
    //   label: "Settings",
    //   href: "/settings",
    // },
    // {
    //   label: "Help & Feedback",
    //   href: "/help-feedback",
    // },
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
