import styles from "./layouts.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { regular } from "@fortawesome/fontawesome-svg-core/import.macro";

export default function header() {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.header_logo}>
          <Link href="/">
            <a className={styles.link}>hadits App</a>
          </Link>
        </div>

        <div className={styles.header_nav}>
          <Link href="/notifications">
            <FontAwesomeIcon icon={regular("bell")} size="lg" />
          </Link>
        </div>
      </div>
    </>
  );
}
