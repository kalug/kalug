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
  const ylink = "https://www.youtube.com/watch?v=" + frontmatter.youtube;
  const mlink = "https://meet.google.com/" + frontmatter.googlemeet;
  const maplink = "https://maps.app.goo.gl/" + frontmatter.googlemap;
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
          <h2 {...headerProps}>
            {" "}
            {author} - {title}
          </h2>
        ) : (
          <h3 {...headerProps}>
            {" "}
            {author} - {title}
          </h3>
        )}
      </a>

      <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} />

      {frontmatter.youtube && (
        <p>
          {" "}
          <a href={ylink} target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon-tabler"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                fill="#F61C0D"
                d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
              ></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
            - YouTube -{" "}
          </a>
        </p>
      )}
      {frontmatter.googlemeet && (
        <p>
          {" "}
          <a href={mlink} target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 87.5 72"
            >
              <path
                fill="#00832d"
                d="M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z"
              />
              <path
                fill="#0066da"
                d="M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z"
              />
              <path
                fill="#e94235"
                d="M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z"
              />
              <path fill="#2684fc" d="M20.5 20.5H0v31h20.5z" />
              <path
                fill="#00ac47"
                d="M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z"
              />
              <path
                fill="#ffba00"
                d="M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z"
              />
            </svg>
            - Google Meet -{" "}
          </a>
        </p>
      )}
      {frontmatter.googlemap && (
        <p>
          {" "}
          <a href={maplink} target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-116.685 -278.925 1011.27 1673.55"
              fill="none"
            >
              <path
                fill="#34A853"
                d="M214.3 826.7c34.5 43.1 69.5 97.1 87.9 129.8 22.4 42.5 31.6 71.2 48.3 122.4 9.8 28.2 19 36.8 38.5 36.8 21.3 0 31-14.4 38.5-36.8 15.5-48.3 27.6-85 46.5-120.1 37.3-67.2 84.5-127 130.4-184.4 12.6-16.1 93.1-110.9 129.3-186.1 0 0 44.2-82.2 44.2-197.1 0-107.4-43.7-182.1-43.7-182.1L607.8 243l-77 202.2-19 27.6-4 5.2-5.2 6.3-8.6 10.3-12.6 12.6-68.4 55.7-170.6 98.8z"
              />
              <path
                fill="#FBBC04"
                d="M37.9 574.5c41.9 95.4 121.8 178.7 176.4 252.2l289-342.4s-40.8 53.4-114.3 53.4c-82.2 0-148.8-65.5-148.8-148.2 0-56.9 33.9-95.9 33.9-95.9l-196 52.3z"
              />
              <path
                fill="#4285F4"
                d="M506.7 17.8c95.9 31 178.1 95.9 227.5 191.9l-231 275.2s33.9-39.6 33.9-95.9c0-84.5-71.2-148.2-148.2-148.2-73 0-114.9 52.9-114.9 52.9V120.1z"
              />
              <path
                fill="#1A73E8"
                d="M90.7 139c57.4-68.4 158-139 297-139C454.9 0 506 17.8 506 17.8L274 293.6H109.7z"
              />
              <path
                fill="#EA4335"
                d="M37.9 574.5S0 499.2 0 390.7c0-102.8 40.2-192.5 91.3-251.1l183.3 154.5z"
              />
            </svg>
            - {frontmatter.meetupLocation} -{" "}
          </a>
        </p>
      )}

      <p>{description}</p>
    </li>
  );
}
