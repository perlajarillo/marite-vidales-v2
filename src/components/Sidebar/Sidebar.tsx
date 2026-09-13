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
import { useLocation } from "react-router";
import { useAuth } from "../../Login/AuthContext";

const getActiveIndexFromPath = (currentUrl: string): number => {
  if (currentUrl.includes("series")) {
    return 1;
  } else if (currentUrl.includes("exhibits")) {
    return 2;
  } else if (currentUrl.includes("biography")) {
    return 3;
  } else if (currentUrl.includes("reviews")) {
    return 4;
  } else if (currentUrl.includes("contact")) {
    return 5;
  } else {
    return 0;
  }
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(
    getActiveIndexFromPath(location.pathname),
  );

  const year = new Date().getFullYear();
  const { user, logout } = useAuth();

  const notAuthTabsData = [
    { label: intl.home, to: "/" },
    { label: intl.artwork, to: "/series" },
    { label: intl.exhibits, to: "/exhibits" },
    { label: intl.biography, to: "/biography" },
    { label: intl.reviews, to: "/reviews" },
    { label: intl.contact, to: "/contact" },
  ];

  const authUserTabsData = [
    { label: intl.home, to: "/" },
    { label: intl.myseries, to: "/myseries" },
    { label: intl.myExhibits, to: "/myexhibits" },
    { label: intl.myBiography, to: "/mybiography" },
    { label: intl.myReviews, to: "/myreviews" },
    {
      label: intl.LogoutButton,
      to: "/",
    },
  ];

  const tabsData = user ? authUserTabsData : notAuthTabsData;

  const handleLogout = async () => {
    try {
      await logout();
      setActiveIndex(0); // Reset active index to home after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <NavLink
          key={0}
          to={tabsData[0].to}
          className={""}
          onClick={() => setActiveIndex(0)}
        >
          <h2 className={styles.sidebarTitle}>{intl.siteTitle}</h2>
        </NavLink>
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
            onClick={() =>
              tab.label === intl.LogoutButton
                ? handleLogout()
                : setActiveIndex(index)
            }
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
