import newsApiClient from '@/clients/newsApiClient';

interface Source {
  id: string | null;
  name: string;
}

export interface Article {
  source: Source;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsResponse {
  status: string;
  totalResults: number;
  articles: Article[];
}

const getArticles = async (): Promise<Article[]> => {
  try {
    const params = new URLSearchParams({
      country: 'kr',
      category: 'entertainment',
      pageSize: '100',
    });
    const response = await newsApiClient.get<NewsResponse>('top-headlines?', params);
    return response.articles.filter((article) => article.urlToImage);
  } catch (e) {
    console.error(e);
    return [];
  }
};

export { getArticles };
