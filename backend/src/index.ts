import { GoogleGenAI } from '@google/genai';
import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

const PORT = 3000;

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL!;

let ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
let prompt = `You are an Anime recommender. You're going to have a conversation 
    related to anime. If the question does not related to Anime, you should say you are the
    only recommender for Anime and not talking about other topics.
`;

app.post('/chat', async (request, response) => {
    const message = request.body.message;

    try{
        let aiResponse = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: message,
            config: {
                systemInstruction: prompt
            }
        })
        console.log(aiResponse.text);
        response.send(aiResponse.text);
    }
    catch(err){
        console.error(err);
        return `Error ${err}`;
    }
})

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`)
})