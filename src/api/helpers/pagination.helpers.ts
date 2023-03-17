interface PaginationInput {
  docsPerPage: string;
  page: string;
  totalDocs: number;
}

interface PaginationOutput {
  skip: number;
  limit: number;
  nextPageNum: number;
}

export const getPaginationParams: (
  input: PaginationInput,
) => PaginationOutput = ({ docsPerPage, page, totalDocs }) => {
  const docsPerPageNum = parseInt(docsPerPage) || 9999;
  let pageNum = parseInt(page) || 1;
  const totalPages = Math.ceil(totalDocs / docsPerPageNum);

  if (pageNum > totalPages) {
    pageNum = totalPages;
  }

  const nextPageNum = pageNum === totalPages ? -1 : pageNum + 1;
  const skip = docsPerPageNum * (pageNum - 1);
  const limit = docsPerPageNum;

  return { skip, limit, nextPageNum };
};