import {Configuration, OpenAIApi} from 'openai';

export class Chatgpt {
  openai: OpenAIApi;
  constructor(apiKey: string) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async sendRequest(message: string, prompt: string) {
    const completion = await this.openai.createChatCompletion({
      model: 'gpt-4-0613',
      temperature: 1,
      top_p: 1,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {role: 'user', content: message},
      ],
    });

    return completion.data.choices[0].message?.content;
  }
}
