import type { IAccount } from 'api/models/Account.model/types';

interface IAvatarUrl
  extends Pick<IAccount, 'avatarUrl' | 'firstName' | 'lastName'> {}

export const getAvatarUrl = ({
  avatarUrl,
  firstName,
  lastName,
}: IAvatarUrl) => {
  if (avatarUrl) {
    return avatarUrl;
  } else {
    const urlName = encodeURIComponent(`${lastName} ${firstName}`);
    return `https://ui-avatars.com/api/?name=${urlName}&background=3bb77e`;
  }
};
