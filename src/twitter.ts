import axios, {AxiosRequestConfig} from 'axios';
import {uuid} from 'uuidv4';

import {Entry, Medum2, TimelineResponse, TwitterPost} from './interfaces';

const CONSTANTS = {
  FOLLOWERS_COUNT_THRESHOLD: 5000,
  RETWEET_BY_ITSELF_COUNT_THRESHOLD: 10,
  RETWEET_WITH_FAVORITE_COUNT_THRESHOLD: 10,
  FAVORITE_COUNT_THRESHOLD: 10,
};

export class Twitter {
  private _headers: {[key: string]: any};
  constructor(headers: {[key: string]: any}) {
    this._headers = headers;
  }

  getVia(media?: Medum2[]) {
    const sourceMedia = media?.find(m => m.additional_media_info?.source_user);

    return sourceMedia?.additional_media_info?.source_user?.user_results.result
      .legacy.screen_name;
  }

  removeAllTwitterUrls(s: string): string {
    return s.replace(/https:\/\/t\.co\/\S*/g, '').trim();
  }

  getData(seenTweetIds?: string[]) {
    return JSON.stringify({
      variables: {
        count: 20,
        includePromotedContent: true,
        latestControlAvailable: true,
        requestContext: 'launch',
        withCommunity: true,
        seenTweetIds: seenTweetIds,
      },
      features: {
        rweb_lists_timeline_redesign_enabled: true,
        responsive_web_graphql_exclude_directive_enabled: true,
        verified_phone_label_enabled: false,
        creator_subscriptions_tweet_preview_api_enabled: true,
        responsive_web_graphql_timeline_navigation_enabled: true,
        responsive_web_graphql_skip_user_profile_image_extensions_enabled:
          false,
        tweetypie_unmention_optimization_enabled: true,
        responsive_web_edit_tweet_api_enabled: true,
        graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
        view_counts_everywhere_api_enabled: true,
        longform_notetweets_consumption_enabled: true,
        responsive_web_twitter_article_tweet_consumption_enabled: false,
        tweet_awards_web_tipping_enabled: false,
        freedom_of_speech_not_reach_fetch_enabled: true,
        standardized_nudges_misinfo: true,
        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled:
          true,
        longform_notetweets_rich_text_read_enabled: true,
        longform_notetweets_inline_media_enabled: true,
        responsive_web_enhance_cards_enabled: false,
      },
      queryId: 'zmpJ47b7DYqZ0sQzKJvbeA',
    });
  }

  async getTimeLinePosts(
    seenTweetIdLookup: Object,
    seenTweetIds?: string[]
  ): Promise<TwitterPost[]> {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://twitter.com/i/api/graphql/zmpJ47b7DYqZ0sQzKJvbeA/HomeTimeline',
      headers: this._headers,
      data: this.getData(seenTweetIds),
    };

    const timeLineResponse = await this._sendRequest<TimelineResponse>(config);

    console.log(
      JSON.stringify({
        timeLineResponse:
          timeLineResponse.data.home.home_timeline_urt.instructions[0].entries
            .length,
      })
    );

    const entries =
      timeLineResponse.data.home.home_timeline_urt.instructions[0].entries;

    const filteredEntries = this.filterEntries(entries, seenTweetIdLookup);

    const timeLinePosts = filteredEntries.map(entry => {
      const tweetResult = entry.content.itemContent?.tweet_results.result;

      return {
        id: tweetResult?.legacy.id_str,
        media: tweetResult?.legacy.entities.media?.map(m => m.display_url),
        fullText: this.removeAllTwitterUrls(
          tweetResult?.legacy.full_text ?? ''
        ),
        postId: tweetResult?.legacy.id_str,
        via: this.getVia(tweetResult?.legacy.extended_entities?.media),
      };
    });

    return timeLinePosts;
  }

  filterEntries(entries: Entry[], seenTweetIdLookup: Object) {
    const filteredPosts = entries.filter(entry => {
      const tweetResult = entry.content.itemContent?.tweet_results.result;
      const followersCount =
        tweetResult?.core?.user_results.result.legacy.followers_count ?? 0;
      const tweetLanguage = tweetResult?.legacy?.lang;
      const retweetCount = tweetResult?.legacy?.retweet_count ?? 0;
      const favoriteCount = tweetResult?.legacy?.favorite_count ?? 0;

      return (
        tweetResult?.legacy?.id_str &&
        !(tweetResult?.legacy.id_str in seenTweetIdLookup) &&
        !entry.entryId.includes('promoted') &&
        followersCount > CONSTANTS.FOLLOWERS_COUNT_THRESHOLD &&
        this.checkPostRetweetFavoriteThresholds(retweetCount, favoriteCount) &&
        tweetLanguage === 'en'
      );
    });

    return filteredPosts;
  }

  checkPostRetweetFavoriteThresholds(
    retweetCount: number,
    favoriteCount: number
  ) {
    return (
      retweetCount > CONSTANTS.RETWEET_BY_ITSELF_COUNT_THRESHOLD ||
      (retweetCount > CONSTANTS.RETWEET_WITH_FAVORITE_COUNT_THRESHOLD &&
        favoriteCount > CONSTANTS.FAVORITE_COUNT_THRESHOLD)
    );
  }

  async sendDm(conversation_id: string, text: string) {
    const data = JSON.stringify({
      conversation_id,
      recipient_ids: false,
      request_id: uuid(),
      text,
      cards_platform: 'Web-12',
      include_cards: 1,
      include_quote_count: true,
      dm_users: false,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://twitter.com/i/api/1.1/dm/new2.json?ext=mediaColor%2CaltText%2CmediaStats%2ChighlightedLabel%2ChasNftAvatar%2CvoiceInfo%2CbirdwatchPivot%2CsuperFollowMetadata%2CunmentionInfo%2CeditControl&include_ext_alt_text=true&include_ext_limited_action_results=true&include_reply_count=1&tweet_mode=extended&include_ext_views=true&include_groups=true&include_inbox_timelines=true&include_ext_media_color=true&supports_reactions=true',
      headers: this._headers,
      data,
    };

    await this._sendRequest(config);
  }

  async _sendRequest<T>(config: AxiosRequestConfig<any>): Promise<T> {
    try {
      const response = await axios.request(config);

      return response.data;
    } catch (error) {
      console.log(JSON.stringify(error));

      throw error;
    }
  }
}
