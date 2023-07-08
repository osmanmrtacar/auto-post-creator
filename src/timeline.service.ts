import {Chatgpt} from './chatgpt';
import {CLASSIFY_RESPONSE, TwitterPost} from './interfaces';

const CLASSIFICATION_CATEGORIES = {
  MOVIE: 'Movie',
  TV: 'TV Shows',
  MUSIC: 'Music',
  PERSON: 'Person',
  TRAVEL: 'Travel',
  FINANCE: 'Finance',
  CRYPTO: ' Digital Assets & Crypto',
  NAN: 'NaN',
};

export class TimeLineService {
  private _chatgpt: Chatgpt;
  constructor(chatgpt: Chatgpt) {
    this._chatgpt = chatgpt;
  }
  async getSharablePosts(posts: TwitterPost[], prompt: string) {
    const classifiedPosts = await this.classifyPosts(posts, prompt);

    const shareablePosts = classifiedPosts.filter(post => {
      const {primary, secondary} = post;
      return (
        primary === CLASSIFICATION_CATEGORIES.MOVIE ||
        primary === CLASSIFICATION_CATEGORIES.TV ||
        secondary === CLASSIFICATION_CATEGORIES.MOVIE ||
        secondary === CLASSIFICATION_CATEGORIES.TV
      );
    });

    return shareablePosts;
  }
  async classifyPosts(posts: TwitterPost[], prompt: string) {
    return await Promise.all(
      posts.map(async post => {
        const resp = await this._chatgpt.sendRequest(post.fullText, prompt);

        let parsedResp: CLASSIFY_RESPONSE = {};

        try {
          parsedResp = JSON.parse(resp ?? '{}');
        } catch (error) {
          console.log(JSON.stringify({error}));
        }

        return {
          primary: parsedResp.primary,
          secondary: parsedResp.secondary,
          ...post,
        };
      })
    );
  }
}
