import { Rating } from '@mui/material';
import { compose, spacing, styled, typography } from '@mui/system';

const CustomRating = styled(Rating)(compose(spacing, typography));

CustomRating.defaultProps = { fontSize: '1.25rem' };

export default CustomRating;
