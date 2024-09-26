export const convertDate = (data: string) => {
  const date = new Date(data);

  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
};
