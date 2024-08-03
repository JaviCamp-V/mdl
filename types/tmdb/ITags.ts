export interface Tags {
    id: number;
    name: string;
}

export default interface TagsResponse {
    id: number;
    keywords: Tags[];
    results: Tags[];
}