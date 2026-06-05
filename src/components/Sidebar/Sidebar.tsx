import { NavLink } from "react-router";
//TODO: import { useTranslation } from "react-i18next";
import intl from "../../locales/en.json";
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
  const year = new Date().getFullYear();

  const instagram =
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z";
  const facebook =
    "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z";
  const email =
    "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75";

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>{intl.siteTitle}</h2>
      </div>
      <nav className={styles.sidebarNav}>
        <NavLink to="/" className={styles.sidebarLink}>
          {intl.home}
        </NavLink>
        <NavLink to="/under-construction" className={styles.sidebarLink}>
          {intl.artwork}
        </NavLink>
        <NavLink to="/under-construction" className={styles.sidebarLink}>
          {intl.exhibits}
        </NavLink>
        <NavLink to="/under-construction" className={styles.sidebarLink}>
          {intl.biography}
        </NavLink>
        <NavLink to="/under-construction" className={styles.sidebarLink}>
          {intl.reviews}
        </NavLink>
        <NavLink to="/under-construction" className={styles.sidebarLink}>
          {intl.contact}
        </NavLink>
      </nav>
      <div className={styles.sidebarFooter}>
        <p className={styles.sidebarCopyright}>
          {intl.copyright} {year} {intl.paintingsOf}, {intl.location}
        </p>
        <div className={styles.sidebarSocial}>
          <a
            href="mailto:paulzye@aol.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sidebarSocialLink}
          >
            <svg
              className={styles.sidebarIcon}
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d={email} />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/marite.vidales"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sidebarSocialLink}
          >
            <svg
              className={styles.sidebarIcon}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d={facebook} />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/vidalesmarite/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sidebarSocialLink}
          >
            <svg
              className={styles.sidebarInstagramIcon}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d={instagram} />
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
