import type { ReactNode } from 'react';

export const getMessageList = (
  messagesObject: Record<string, string>,
): ReactNode => {
  const messagesJSX = Object.keys(messagesObject).map((key) => {
    const message = messagesObject[key];
    return <li key={key}>{message}</li>;
  });
  return <ul>{messagesJSX}</ul>;
};
