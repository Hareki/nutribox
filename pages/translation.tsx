import type { SelectChangeEvent } from '@mui/material';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import type { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
// import type { InferGetStaticPropsType } from "next";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';

import { H2, Paragraph } from 'components/abstract/Typography';

const languageList = [
  { title: 'EN', value: 'en' },
  { title: 'VN', value: 'vn' },
];

const Translation = () => {
  const router = useRouter();
  const { t } = useTranslation('customer');
  const [language, setLanguage] = useState(router.locale);

  const { pathname, asPath, query } = router;

  const handleLanguage = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;

    setLanguage(value);
    router.push({ pathname, query }, asPath, { locale: value });
  };

  return (
    <Box bgcolor='background.paper' p={6}>
      <H2>{t('Customer.LastName.Required')} </H2>
      <Paragraph mb={4}>{t('description')}</Paragraph>

      <FormControl>
        <InputLabel id='demo-simple-select-label'>Age</InputLabel>
        <Select
          label='Age'
          value={language}
          onChange={handleLanguage}
          id='demo-simple-select'
          labelId='demo-simple-select-label'
        >
          {languageList.map((item) => (
            <MenuItem value={item.value} key={item.value}>
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const locales = await serverSideTranslations(locale ?? 'vn', [
    'common',
    'customer',
  ]);

  return { props: { ...locales } };
};

export default Translation;
