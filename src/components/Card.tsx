import { slugifyStr } from "@utils/slugify";
//import socialIcons from "@assets/socialIcons";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime, description, author } = frontmatter;
  const  ylink  = "https://www.youtube.com/watch?v="+frontmatter.youtube;
  //Astro.props;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  // FIXME use socialIcons seems much better then svg source directly
  return (
    <li className="my-6">
      <a
        href={href}
        className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {secHeading ? (
          <h2 {...headerProps}> {author} - {title}</h2>
        ) : (
          <h3 {...headerProps}> {author} - {title}</h3>
        )}
      </a>

      <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} />

      {frontmatter.youtube ? (
	  <p> <a href={ylink}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
      className="icon-tabler"
      stroke-linecap="round"
      stroke-linejoin="round"
      >
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
      </svg>
           YouTube </a>
	  </p>
      ):(
          <></>
      )}

      <p>{description}</p>
    </li>
  );
}
