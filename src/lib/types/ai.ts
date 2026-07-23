import { Product } from "./product";

export interface AiRecommendInput {
    roomType?: string;
    style?: string;
    notes?: string;
}

export interface AiRecommendation {
    product: Product;
    reason: string;
}

export interface AiRecommendResult {
    summary: string;
    recommendations: AiRecommendation[];
}
