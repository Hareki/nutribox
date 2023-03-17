import Link from 'next/link';
import type { FC } from 'react';

import { Small } from 'components/abstract/Typography';

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
      <Small
        fontWeight='900'
        borderBottom={2}
        color={color}
        borderColor={borderColor}
      >
        {title}
      </Small>
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
