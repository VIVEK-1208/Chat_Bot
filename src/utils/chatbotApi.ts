import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';

export const fetchChatResponse = async (message: string) => {
  const apiKey = import.meta.env.VITE_OPENAI4O_API_KEY;

  const response = await axios.post(
    API_URL,
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content;
};
