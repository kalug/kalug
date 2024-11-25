import type { Site, SocialObjects } from "./types";
import type { GiscusProps } from "@giscus/react";

// GiscusProps
//
// https://astro-paper.pages.dev/posts/how-to-integrate-giscus-comments/
// https://giscus.app/


export const GISCUS: GiscusProps = {
  repo: "kalug/kalug.tw",
  repoId: "MDEwOlJlcG9zaXRvcnk0NjM5OTI2Mg==",
  category: "General",
  categoryId: "DIC_kwDOAsP_Hs4CjuBs",
  mapping: "pathname",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "bottom",
  lang: "en",
  loading: "lazy",
};


export const SITE: Site = {
  website: "https://kalug.tw/", // replace this with your deployed domain
  author: "KaLUG",
  profile: "https://kalig.tw/",
  desc: "kaohsiung linux User Group",
  title: "KaLUG.tw",
  ogImage: "kalug-people.jpg",
  lightAndDarkMode: true,
  postPerIndex: 5,
  postPerPage: 10,
  //scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  scheduledPostMargin: 30 * 24 * 60 * 60 * 1000, // 15 minutes
  showArchives: true,
  editPost: {
    url: "https://github.com/kalug/kalug/edit/main/src/content/blog",
    text: "Suggest Changes",
    appendFilePath: true,
  },
};

export const LOCALE = {
  lang: "en", // html lang code. Set this empty and default will be "en"
  langTag: ["en-EN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/kalug/kalug",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/groups/kalug.tw",
    linkTitle: `${SITE.title} on Facebook`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Instagram`,
    active: false,
  },
  {
    name: "Calendar",
    href: "https://calendar.google.com/calendar/u/0?cid=OWJkcmZqMGxoY2Rpc3A1cjlkdXB0ZmYwNmNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ",
    linkTitle: `${SITE.title} on calendar.google`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: false,
  },
  {
    name: "Mail",
    href: "mailto:yourmail@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: false,
  },
  {
    name: "Twitter",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitter`,
    active: false,
  },
  {
    name: "Twitch",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Twitch`,
    active: false,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@kalug-tw",
    linkTitle: `${SITE.title} on YouTube`,
    active: true,
  },
  {
    name: "WhatsApp",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on WhatsApp`,
    active: false,
  },
  {
    name: "Snapchat",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Snapchat`,
    active: false,
  },
  {
    name: "Pinterest",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Pinterest`,
    active: false,
  },
  {
    name: "TikTok",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on TikTok`,
    active: false,
  },
  {
    name: "CodePen",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on CodePen`,
    active: false,
  },
  {
    name: "Discord",
    href: "https://discord.gg/YQ4mvuVQHj",
    linkTitle: `${SITE.title} on Discord`,
    active: true,
  },
  {
    name: "GitLab",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on GitLab`,
    active: false,
  },
  {
    name: "Reddit",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Reddit`,
    active: false,
  },
  {
    name: "Skype",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Skype`,
    active: false,
  },
  {
    name: "Steam",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Steam`,
    active: false,
  },
  {
    name: "Telegram",
    href: "https://t.me/+PQGfF2IkjlYxOTA1",
    linkTitle: `${SITE.title} on Telegram`,
    active: true,
  },
  {
    name: "Mastodon",
    href: "https://github.com/satnaing/astro-paper",
    linkTitle: `${SITE.title} on Mastodon`,
    active: false,
  },
  {
    name: "GoogleMeet",
    href: "https://meet.google.com/rmy-hugp-zwk",
    linkTitle: `${SITE.title} on Google Meets`,
    active: false,
  },
];
