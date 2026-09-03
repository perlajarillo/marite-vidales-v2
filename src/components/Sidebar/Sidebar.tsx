import { NavLink } from "react-router";
//TODO: import { useTranslation } from "react-i18next";
import intl from "../../locales/en.json";
import styles from "./Sidebar.module.css";
import { useState } from "react";
import {
  EmailIcon,
  FacebookIcon,
  InstagramIcon,
} from "../SocialMedia/SocialMedia";

const Sidebar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const year = new Date().getFullYear();

  const tabsData = [
    { label: intl.home, to: "/" },
    { label: intl.artwork, to: "/series" },
    { label: intl.exhibits, to: "/exhibits" },
    { label: intl.biography, to: "/biography" },
    { label: intl.reviews, to: "/under-construction" },
    { label: intl.contact, to: "/contact" },
  ];
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2 className={styles.sidebarTitle}>{intl.siteTitle}</h2>
      </div>
      <nav className={styles.sidebarNav}>
        {tabsData.map((tab, index) => (
          <NavLink
            key={index}
            to={tab.to}
            className={
              activeIndex === index
                ? `${styles.sidebarLinkActive} ${styles.sidebarLink}`
                : styles.sidebarLink
            }
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        <p className={styles.sidebarCopyright}>
          {intl.copyright} {year} {intl.paintingsOf}, {intl.location}
        </p>
        <div className={styles.sidebarSocial}>
          <EmailIcon />
          <FacebookIcon />
          <InstagramIcon />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
