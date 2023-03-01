import Link from 'next/link';
import { FC } from 'react';

import { Small } from 'components/Typography';

// ==============================================================
type NavLinkProps = {
  title: string;
  url?: string;
  color?: string;
  borderColor?: string;
};
// ==============================================================

const NavLink2: FC<NavLinkProps> = ({
  url,
  title = 'SHOP NOW',
  color,
  borderColor = 'primary.600',
}) => {
  return url ? (
    <Link href={url}>
      <a>
        <Small
          fontWeight='900'
          borderBottom={2}
          color={color}
          borderColor={borderColor}
        >
          {title}
        </Small>
      </a>
    </Link>
  ) : (
    <Small
      fontWeight='900'
      borderBottom={2}
      color={color}
      borderColor={borderColor}
    >
      {title}
    </Small>
  );
};

export default NavLink2;
