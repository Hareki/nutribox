import { Clear } from '@mui/icons-material';
import {
  alpha,
  Box,
  IconButton,
  styled,
  TableCell,
  TableRow,
} from '@mui/material';

// styled components
const StyledTableCell = styled(TableCell)<{ font_weight?: number }>(
  ({ theme, font_weight }) => ({
    fontSize: 15,
    paddingTop: 10,
    fontWeight: font_weight || 400,
    paddingBottom: 10,
    color: theme.palette.grey[900],
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  }),
);

const CategoryWrapper = styled(Box)(({ theme }) => ({
  fontSize: 13,
  fontWeight: 500,
  padding: '3px 12px',
  borderRadius: '16px',
  display: 'inline-block',
  color: theme.palette.grey[900],
  backgroundColor: theme.palette.grey[200],
}));

const StyledTableRow = styled(TableRow)<{ cursor?: string }>(
  ({ theme, cursor }) => ({
    cursor: cursor || 'pointer',
    transition: `all 0.2s ${theme.transitions.easing.easeInOut}`,
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
    ':last-child .MuiTableCell-root': { border: 0 },
    '&.Mui-selected': {
      backgroundColor: 'transparent',
      ':hover': { backgroundColor: 'transparent' },
    },
  }),
);

const StyledIconButton = styled(IconButton)<{ is_delete?: boolean }>(
  ({ theme, is_delete = false }) => ({
    color: theme.palette.grey[600],
    '& .MuiSvgIcon-root': { fontSize: 19 },
    ':hover': {
      color: is_delete ? theme.palette.error.main : theme.palette.info.main,
    },
  }),
);

type StatusType = {
  status:
    | 'Accepted'
    | 'Rejected'
    | 'Processing'
    | 'Pending'
    | 'Delivered'
    | 'Normal'
    | 'Urgent'
    | 'Cancelled';
};

const StatusWrapper = styled(Box)<StatusType>(({ theme, status }) => {
  let color = theme.palette.secondary.main;
  let backgroundColor = theme.palette.secondary[100];

  if (status === 'Accepted' || status === 'Delivered' || status === 'Normal') {
    color = theme.palette.success.main;
    backgroundColor = theme.palette.success[100];
  }

  if (status === 'Rejected' || status === 'Urgent' || status === 'Cancelled') {
    color = theme.palette.error.main;
    backgroundColor = theme.palette.error[100];
  }

  if (status === 'Processing') {
    color = theme.palette.warning.main;
    backgroundColor = theme.palette.warning[100];
  }

  if (status === 'Pending') {
    color = theme.palette.info.main;
    backgroundColor = theme.palette.info[100];
  }

  return {
    color,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor,
    borderRadius: '8px',
    padding: '3px 12px',
    display: 'inline-flex',
  };
});

const UploadImageBox = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  display: 'flex',
  overflow: 'hidden',
  borderRadius: '8px',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.info.light, 0.1),
}));

const StyledClear = styled(Clear)({
  top: 5,
  right: 5,
  fontSize: 14,
  cursor: 'pointer',
  position: 'absolute',
});

export {
  CategoryWrapper,
  StyledIconButton,
  StyledTableRow,
  StyledTableCell,
  StatusWrapper,
  UploadImageBox,
  StyledClear,
};
