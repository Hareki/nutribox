import { FC } from "react";
import { Box, styled, SxProps } from "@mui/material";
import LazyImage from "components/LazyImage";
import { H6, Paragraph } from "components/Typography";

// styled components
const StyledCard = styled(Box)(({ theme }) => ({
  textAlign: "center",
  transition: "all 0.3s",
  "&:hover": { "& h6": { color: theme.palette.primary.main } },
}));

const ImgBox = styled(Box)(({ theme }) => ({
  padding: "0 40px 20px 40px",
  background: theme.palette.primary[100],
}));

// ===================================================
type Props = {
  sx?: SxProps;
  title: string;
  imgUrl: string;
  available: string;
};
// ===================================================

const ProductCard15: FC<Props> = (props) => {
  const { sx, imgUrl, title, available } = props;

  return (
    <StyledCard sx={sx}>
      <ImgBox>
        <LazyImage
          alt={title}
          width={100}
          height={100}
          src={imgUrl}
          objectFit="contain"
          layout="responsive"
        />
      </ImgBox>

      <H6 fontSize={15} mt="8px" mb="2px">
        {title}
      </H6>
      <Paragraph color="grey.600">{available}</Paragraph>
    </StyledCard>
  );
};

export default ProductCard15;
