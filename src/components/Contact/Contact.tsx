import React from "react";
import presentingImage from "../../assets/MaritePresenting.png";
import intl from "../../locales/en.json";
import {
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  ArrowUpRight,
} from "../SocialMedia/SocialMedia";
import styles from "./Contacts.module.css";

const contactHighlights = [
  intl.AvailablePaintingsOrPricing,
  intl.GalleryExhibitionOrCurationOpportunities,
  intl.StudioVisitsInTheShawWashingtonDCNeighborhood,
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/vidalesmarite/",
    cardClassName: styles.instagramCard,
    icon: <InstagramIcon iconClass={styles.instagramIcon} />,
    arrowClassName: `${styles.instagramArrow} group-hover:text-pink-600`,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/marite.vidales",
    cardClassName: styles.facebookCard,
    icon: <FacebookIcon iconClass={styles.facebookIcon} />,
    arrowClassName: `${styles.facebookArrow} group-hover:text-blue-600`,
  },
];

export const Contact: React.FC = () => {
  return (
    <div className={styles.contactContainer}>
      <div className={styles.contactColumn}>
        <section className={styles.contactSection}>
          <div className={styles.contentBlock}>
            <h2 className={styles.sectionTitle}>{intl.ContactMe}</h2>
            <ul className={styles.highlightList}>
              {contactHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className={styles.emailCardWrapper}>
              <a
                href="mailto:paulzye@aol.com"
                className={`group group/link ${styles.emailLink}`}
              >
                <div className={styles.emailContent}>
                  <MailIcon className={styles.emailIcon} />
                  <span>paulzye@aol.com</span>
                </div>

                <ArrowUpRight
                  className={`group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:opacity-100 group-hover:text-yellow-500 ${styles.emailArrow} `}
                />
              </a>
            </div>
          </div>
        </section>

        <section className={styles.socialSection}>
          <div className={styles.socialContent}>
            <h2 className={styles.sectionTitleCompact}>{intl.SocialMedia}</h2>
            <p className={styles.socialDescription}>
              {intl.ExploreSocialMedia}
            </p>

            <div className={styles.socialList}>
              {socialLinks.map(
                ({ label, href, cardClassName, icon, arrowClassName }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group ${styles.socialLink} ${cardClassName}`}
                  >
                    <div className={styles.socialLinkContent}>
                      {icon}
                      <span>{label}</span>
                    </div>

                    <ArrowUpRight
                      className={`group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${styles.socialArrow} ${arrowClassName}`}
                    />
                  </a>
                ),
              )}
            </div>
          </div>
        </section>
      </div>

      <div className={styles.portraitWrapper}>
        <img
          src={presentingImage}
          alt="Marite Vidales presenting her work"
          className={styles.portraitImage}
        />
      </div>
    </div>
  );
};

export default Contact;
