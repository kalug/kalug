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
  const  mlink  = "https://meet.google.com/"+frontmatter.googlemeet;
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

      {
      frontmatter.youtube && (
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
	  </p>)
      }
      {
      frontmatter.googlemeet && (
	  <p> <a href={mlink}>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 87.5 72">
                <path fill="#00832d" d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z"/>
                <path fill="#0066da" d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z"/>
                <path fill="#e94235" d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z"/>
                <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z"/>
                <path fill="#00ac47" d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z"/>
                <path fill="#ffba00" d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z"/>
             </svg>
		   Google Meet </a>
	  </p>)
      }

      <p>{description}</p>
    </li>
  );
}
