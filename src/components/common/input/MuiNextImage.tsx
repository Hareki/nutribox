import { compose, display, spacing, styled } from '@mui/system';
import Image from 'next/image';

const MuiNextImage = styled(Image)(compose(spacing, display));

MuiNextImage.defaultProps = { display: 'block' };

export default MuiNextImage;
