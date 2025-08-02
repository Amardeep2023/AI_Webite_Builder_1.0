
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
}= require('@google/generative-ai');

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI= new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model:"gemini-2.0-flash-exp"
});

const generationConfig={
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const CodeGenerationConfig={
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

  export const chatSession=model.startChat({
    generationConfig,
    history: [

    ],
  });

  export const GenAiCode=model.startChat({
    generationConfig:CodeGenerationConfig,
    history:[
      {
    role: 'user',
    parts: [
      {
        text: `generate todo app Generate a Project in React. Create multiple components, organizing them in separate folders with filenames using the .js extension, if needed. The output should use Tailwind CSS for styling, 
without any third-party dependencies or libraries, except for icons from the lucide-react library, which should only be used when necessary. Available icons include: Heart, Shield, Clock, Users, Play, Home, Search, Menu, User, Settings, Mail, Bell, Calendar, Star, Upload, Download, Trash, Edit, Plus, Minus, Check, X, and ArrowRight. For example, you can import an icon as import { Heart } from "lucide-react" and use it in JSX as <Heart className="" />.
also you can use date-fns for date format and react-chartjs-2 chart, graph library

Return the response in JSON format with the following schema:
{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/App.js": {
      "code": ""
    },
    ...
  },
  "generatedFiles": []
}`
      },
    ],
  },
  {
    role: 'model',
    parts: [
      {
        text: `Okay, I will generate a React project structure for a to-do application using Vite, Tailwind CSS, and lucide-react icons where necessary... [rest of the model response]`
      },
    ],
  }
    ]
  })

  //const result= await chatSession.sendMessage("INSERT_INPUT_HERE");
  //console.log(result.response.text());
