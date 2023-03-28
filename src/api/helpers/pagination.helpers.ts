import type { NextApiRequest } from 'next';

interface PaginationInput {
  docsPerPage: string;
  page: string;
  totalDocs: number;
}

interface PaginationOutput {
  skip: number;
  limit: number;
  nextPageNum: number;
  totalPages: number;
}

export const getPaginationParams: (
  input: PaginationInput,
) => PaginationOutput = ({ docsPerPage, page, totalDocs }) => {
  if (totalDocs === 0) {
    return { skip: 0, limit: 0, nextPageNum: -1, totalPages: 0 };
  }

  const docsPerPageNum = parseInt(docsPerPage) || 9999;
  let pageNum = parseInt(page) || 1;
  const totalPages = Math.ceil(totalDocs / docsPerPageNum);

  if (pageNum > totalPages) {
    pageNum = totalPages;
  }

  const nextPageNum = pageNum === totalPages ? -1 : pageNum + 1;
  const skip = docsPerPageNum * (pageNum - 1);
  const limit = docsPerPageNum;

  return { skip, limit, nextPageNum, totalPages };
};

export const processPaginationParams = async (
  req: NextApiRequest,
  getTotal: () => Promise<number>,
) => {
  const { docsPerPage, page } = req.query;
  const totalDocs = await getTotal();

  const { skip, limit, nextPageNum, totalPages } = getPaginationParams({
    docsPerPage: docsPerPage as string,
    page: page as string,
    totalDocs,
  });

  return { skip, limit, nextPageNum, totalPages, totalDocs };
};
