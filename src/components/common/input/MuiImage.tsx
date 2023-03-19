import { compose, display, spacing, styled } from '@mui/system';

const MuiImage = styled('img')(compose(spacing, display));

MuiImage.defaultProps = { display: 'block' };

export default MuiImage;
