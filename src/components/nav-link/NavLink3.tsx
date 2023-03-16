import { ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import { FC } from 'react';

import { Span } from 'components/abstract/Typography';

//   ==========================================
type NavLink3Props = {
  href: string;
  text: string;
  color?: string;
  hoverColor?: string;
};
//   ==========================================

const NavLink3: FC<NavLink3Props> = ({
  color,
  href,
  text,
  hoverColor,
  ...props
}) => {
  return (
    <Link href={href}>
      <Span
        sx={{
          color,
          gap: 1,
          lineHeight: 1,
          fontWeight: 600,
          alignItems: 'center',
          position: 'relative',
          paddingBottom: '4px',
          display: 'inline-flex',
          ':after': {
            left: 0,
            bottom: 0,
            width: '0%',
            content: "''",
            height: '2px',
            transition: '0.3s',
            position: 'absolute',
            backgroundColor: color,
          },
          ':hover': {
            color: hoverColor,
            '&::after': { width: '100%', backgroundColor: hoverColor },
          },
        }}
        {...props}
      >
        {text}{' '}
        <ArrowForward
          sx={{
            fontSize: 14,
            flexShrink: 0,
            transform: ({ direction }) =>
              `rotate(${direction === 'rtl' ? '180deg' : '0deg'})`,
          }}
        />
      </Span>
    </Link>
  );
};

// set default props
NavLink3.defaultProps = { color: 'text.primary', hoverColor: 'primary.main' };

export default NavLink3;
