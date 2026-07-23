import axios from "axios";
import { serverApi } from "../../lib/config";
import { AiRecommendInput, AiRecommendResult } from "../../lib/types/ai";


class AiService {
    private readonly path: string;

    constructor() {
        this.path = serverApi;
    }

    public async getRecommendations(
        input: AiRecommendInput
    ): Promise<AiRecommendResult> {
        try {
            const url = `${this.path}/ai/recommend`;
            const result = await axios.post(url, input);
            console.log("getRecommendations:", result);

            return result.data;
        } catch (err) {
            console.log("Error, getRecommendations:", err);
            throw err;

        }
    }


}

export default AiService;
