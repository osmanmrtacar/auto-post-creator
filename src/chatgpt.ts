import {AxiosError} from 'axios';
import {ChatCompletionRequestMessage, Configuration, OpenAIApi} from 'openai';

const MESSAGES: Array<ChatCompletionRequestMessage> = [
  {
    role: 'user',
    content:
      '#Eternals2 is scheduled to release on November 6, 2026\n#MarvelStudios',
  },
  {
    role: 'assistant',
    content:
      '{"target_audience_tweet": "#Eternals2, 6 Kasım 2026\'da vizyona girecek! #MarvelStudios"}',
  },
  {
    role: 'user',
    content:
      '‘NO HARD FEELINGS,’ starring Jennifer Lawrence, has crossed $50M at the worldwide box-office.\n\nIt is on track to become the highest grossing original R-rated comedy since ‘GOOD BOYS’ (2019).',
  },
  {
    role: 'assistant',
    content:
      "{\"target_audience_tweet\": \"Jennifer Lawrence'ın başrolünde olduğu 'NO HARD FEELINGS' filmi dünya genelinde 50 milyon doları geçti. 'GOOD BOYS'un ardından R-kategorisinde en çok hasılat yapan orijinal komedi filmi olmaya doğru ilerliyor. #JenniferLawrence #NoHardFeelings\"}",
  },
  {
    role: 'user',
    content:
      'Greta Gerwig to write and direct at least 2 ‘THE CHRONICLES OF NARNIA’ films for Netflix.\n\n(Source: @NewYorker)',
  },
  {
    role: 'assistant',
    content:
      '{"target_audience_tweet": "Greta Gerwig, Netflix için en az 2 \'NARNIA GÜNLÜKLERİ\' filmi yazıp yönetecekmiş. Gerçekten heyecan verici bir haber, Narnia evreni onun ellerinde nasıl hayat bulacak merakla bekliyoruz! 🦁📷 (via: @NewYorker) \\n#Netflix #Narnia #GretaGerwig"}',
  },
  {
    role: 'user',
    content:
      'Greig Fraser will return as cinematographer for ‘THE BATMAN - PART 2’',
  },
  {
    role: 'assistant',
    content:
      '{"target_audience_tweet": "Greig Fraser, \'THE BATMAN - PART 2\' filminde yine görüntü yönetmeni olarak yer alacak. #TheBatman"}',
  },
  {
    role: 'user',
    content:
      '‘MISSION IMPOSSIBLE: DEAD RECKONING - PART ONE’ is the biggest action blockbuster of all time, says Cary Elwes.\n\n(Source: https://collider.com/cary-elwes-mission-impossible-dead-reckoning-rebel-moon-knuckles-comments/)',
  },
  {
    role: 'assistant',
    content:
      '{"target_audience_tweet": "Cary Elwes\'e göre \'MISSION IMPOSSIBLE: DEAD RECKONING - PART ONE\', tüm zamanların en büyük aksiyon filmi olmuş. 💥🎬 #MissionImpossible #DeadReckoning"}',
  },
  {
    role: 'user',
    content:
      'Christopher Nolan on not casting Robert Pattinson in ‘OPPENHEIMER’:\n\n“He was busy… he’s very much in demand these days.”',
  },
  {
    role: 'assistant',
    content:
      "{\"target_audience_tweet\": \"Christopher Nolan, 'OPPENHEIMER' filminde Robert Pattinson'ı neden oyuncu kadrosuna almadığı hakkında şunları söyledi: 'O meşguldü... bu günlerde çok talep görüyor.' #ChristopherNolan #Oppenheimer #RobertPattinson\"}",
  },
];

export class Chatgpt {
  openai: OpenAIApi;
  constructor(apiKey: string) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async sendRequest(message: string, prompt: string) {
    const messages: Array<ChatCompletionRequestMessage> = [
      {
        role: 'system',
        content: prompt,
      },
      ...MESSAGES,
      {
        role: 'user',
        content: message,
      },
    ];
    try {
      const completion = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        temperature: 0,
        top_p: 1,
        messages,
      });

      return completion.data.choices[0].message?.content;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(JSON.stringify({chatgptError: error.response?.data}));
      }
    }
  }
}
