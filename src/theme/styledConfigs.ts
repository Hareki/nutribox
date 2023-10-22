// use global search with keyword ")<" to find all possible invalid props
export const exclude = (bannedProps: string[]) => (prop: string) =>
  !bannedProps.includes(prop);
