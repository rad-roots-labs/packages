export type SearchServiceResult = Record<string, any> & { id: string, result_k: string; result_v: string; };
export type SearchServiceFlattenedData = Record<string, any> & { list: string; };

export type ISearchService = {
    search(input: string): SearchServiceResult[]
};