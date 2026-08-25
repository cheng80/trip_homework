import Image from "next/image";
import Link from "next/link";
import styles from "./back-link.module.css";

type BackLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function BackLink({ href, children, className = "" }: BackLinkProps) {
  return (
    <Link className={`${styles.backLink} ${className}`} href={href}>
      <Image src="/icon/outline/left_arrow.svg" alt="" width={20} height={20} />
      {children}
    </Link>
  );
}
