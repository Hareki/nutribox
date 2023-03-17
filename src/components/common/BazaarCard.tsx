import type { CardProps } from '@mui/material';
import { Card, styled } from '@mui/material';
import type { FC } from 'react';

// ===============================================
interface BazaarCardProps extends CardProps {
  hoverEffect?: boolean;
}
// ===============================================

const BazaarCard = styled<FC<BazaarCardProps>>(
  ({ hoverEffect, children, ...rest }) => <Card {...rest}>{children}</Card>,
)<BazaarCardProps>(({ theme, hoverEffect }) => ({
  overflow: 'unset',
  borderRadius: '8px',
  transition: 'all 250ms ease-in-out',
  '&:hover': { ...(hoverEffect && { boxShadow: theme.shadows[3] }) },
}));

BazaarCard.defaultProps = { hoverEffect: false };

export default BazaarCard;
