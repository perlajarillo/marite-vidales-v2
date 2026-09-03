import styles from "./SocialMedia.module.css";

const instagram =
  "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z";
const facebook =
  "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z";
const email =
  "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75";

interface SocialMediaIconProps {
  iconClass?: string;
  text?: string;
}
export const EmailIcon = (props: SocialMediaIconProps) => {
  const { iconClass, text } = props;
  return (
    <div className="flex items-center space-x-2">
      <a
        href="mailto:paulzye@aol.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.sidebarSocialLink}
      >
        <svg
          className={iconClass || styles.sidebarIcon}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={email} />
        </svg>
      </a>
      {text && (
        <a
          href="mailto:paulzye@aol.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.socialText}>{text}</span>
        </a>
      )}
    </div>
  );
};
export const FacebookIcon = (props: SocialMediaIconProps) => {
  const { iconClass, text } = props;
  return (
    <a
      href="https://www.facebook.com/marite.vidales"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.sidebarSocialLink}
    >
      <svg
        className={iconClass || styles.sidebarIcon}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d={facebook} />
      </svg>
      {text && <span className={styles.socialText}>{text}</span>}
    </a>
  );
};
export const InstagramIcon = (props: SocialMediaIconProps) => {
  const { iconClass, text } = props;
  return (
    <a
      href="https://www.instagram.com/vidalesmarite/"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.sidebarSocialLink}
    >
      <svg
        className={iconClass || styles.sidebarInstagramIcon}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d={instagram} />
      </svg>
      {text && <span className={styles.socialText}>{text}</span>}
    </a>
  );
};

export const ArrowUpRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-arrow-up-right"
    {...props}
  >
    <path d="M7 17l10-10" />
    <path d="M17 17v-10H7" />
  </svg>
);

export const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-mail"
    {...props}
  >
    <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
    <rect x="2" y="4" width="20" height="16" rx="2" />
  </svg>
);
