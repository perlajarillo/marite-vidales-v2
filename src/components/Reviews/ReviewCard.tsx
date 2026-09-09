import type { Review } from "../../types/reviews";
import style from "./Reviews.module.css";

export const ReviewCard = ({ quote, author, role }: Review) => {
  return (
    <div className={style.reviewCard}>
      <blockquote className={style.reviewQuote}>“{quote}”</blockquote>
      <div className={style.reviewAuthorRoleWrapper}>
        <p className={style.reviewAuthor}>{author}</p>
        {role && <p className={style.reviewRole}>{role}</p>}
      </div>
    </div>
  );
};
