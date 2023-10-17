import { useTranslation } from 'react-i18next';

export const useCustomTranslation = (namespaces: string[]) => {
  const { t, i18n } = useTranslation(namespaces);

  const customT = (key: string, options?: Record<string, any>): string => {
    for (const ns of namespaces) {
      if (i18n.exists(key, { ns })) {
        return t(key, { ...options, ns });
      }
    }

    // If not found in any namespace, return the key itself or any fallback.
    return t(key, options);
  };

  return {
    t: customT,
    i18n,
  };
};
