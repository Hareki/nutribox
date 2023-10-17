type User = {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
};

export const getAvatarUrl = (user?: User) => {
  if (user?.avatarUrl) {
    return user.avatarUrl;
  } else if (user) {
    const urlName = encodeURIComponent(`${user.lastName} ${user.firstName}`);
    return `https://ui-avatars.com/api/?name=${urlName}&background=3bb77e`;
  }
  return '';
};

export const getFullName = (user?: User) => {
  if (!user) return '';
  return `${user.lastName} ${user.firstName}`;
};
