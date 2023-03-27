import { Button } from '@mui/material';
import { useRouter } from 'next/router';

import { H3 } from 'components/abstract/Typography';
import { FlexBox } from 'components/flex-box';

interface AdminDetailsViewHeaderProps {
  label: string;
  hrefBack: string;
}
const AdminDetailsViewHeader = ({
  label,
  hrefBack,
}: AdminDetailsViewHeaderProps) => {
  const router = useRouter();
  return (
    <FlexBox justifyContent='space-between' mb={4}>
      <H3 mb={2}>{label}</H3>
      <Button
        onClick={() => router.push(hrefBack)}
        variant='text'
        color='primary'
        sx={{
          backgroundColor: 'primary.light',
          px: 4,
        }}
      >
        Quay lại
      </Button>
    </FlexBox>
  );
};

export default AdminDetailsViewHeader;
