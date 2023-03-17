import type { FC, ReactNode } from 'react';

import { H2 } from './abstract/Typography';
import { FlexBetween, FlexBox } from './flex-box';

import useSettings from 'hooks/useSettings';

// ===================================================
type CategorySectionHeaderProps = {
  title?: string;
  icon?: ReactNode;
  seeMoreLink?: string;
};
// ===================================================

const CategorySectionHeader: FC<CategorySectionHeaderProps> = (props) => {
  const { title, seeMoreLink, icon } = props;

  const { settings } = useSettings();

  return (
    <FlexBetween mb={3}>
      <FlexBox alignItems='center' gap={1}>
        {icon && <FlexBox alignItems='center'>{icon}</FlexBox>}
        <H2 fontWeight='bold' lineHeight='1'>
          {title}
        </H2>
      </FlexBox>

      {/* {seeMoreLink && (
        <Link href={seeMoreLink}>
          <FlexBox alignItems='center' color='grey.600'>
            Xem tất cả
            {settings.direction === 'ltr' ? (
              <ArrowRight fontSize='small' color='inherit' />
            ) : (
              <ArrowLeft fontSize='small' color='inherit' />
            )}
          </FlexBox>
        </Link>
      )} */}
    </FlexBetween>
  );
};

export default CategorySectionHeader;
