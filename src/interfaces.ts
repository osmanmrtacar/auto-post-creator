export interface TimelineResponse {
  data: Data;
}

export interface Data {
  home: Home;
}

export interface Home {
  home_timeline_urt: HomeTimelineUrt;
}

export interface HomeTimelineUrt {
  instructions: Instruction[];
  responseObjects: ResponseObjects;
  metadata: Metadata;
}

export interface Instruction {
  type: string;
  entries: Entry[];
}

export interface Entry {
  entryId: string;
  sortIndex: string;
  content: Content;
}

export interface Content {
  entryType: string;
  __typename: string;
  itemContent?: ItemContent;
  feedbackInfo?: FeedbackInfo;
  clientEventInfo?: ClientEventInfo;
  items?: Item[];
  displayType?: string;
  header?: Header;
  footer?: Footer;
  value?: string;
  cursorType?: string;
}

export interface ItemContent {
  itemType: string;
  __typename: string;
  tweet_results: TweetResults;
  tweetDisplayType: string;
  socialContext?: SocialContext;
  promotedMetadata?: PromotedMetadata;
}

export interface TweetResults {
  result: Result;
}

export interface Result {
  __typename: string;
  rest_id: string;
  core: Core;
  edit_control: EditControl;
  edit_perspective: EditPerspective;
  is_translatable: boolean;
  views: Views;
  source: string;
  legacy: Legacy2;
  card?: Card;
  unified_card?: UnifiedCard;
}

export interface Core {
  user_results: UserResults;
}

export interface UserResults {
  result: Result2;
}

export interface Result2 {
  __typename: string;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: AffiliatesHighlightedLabel;
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  profile_image_shape: string;
  legacy: Legacy;
  super_follow_eligible?: boolean;
  professional?: Professional;
}

export interface AffiliatesHighlightedLabel {
  label?: Label;
}

export interface Label {
  url: Url;
  badge: Badge;
  description: string;
  userLabelType: string;
  userLabelDisplayType: string;
}

export interface Url {
  url: string;
  urlType: string;
}

export interface Badge {
  url: string;
}

export interface Legacy {
  following?: boolean;
  can_dm: boolean;
  can_media_tag: boolean;
  created_at: string;
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  entities: Entities;
  fast_followers_count: number;
  favourites_count: number;
  followers_count: number;
  friends_count: number;
  has_custom_timelines: boolean;
  is_translator: boolean;
  listed_count: number;
  location: string;
  media_count: number;
  name: string;
  normal_followers_count: number;
  pinned_tweet_ids_str: string[];
  possibly_sensitive: boolean;
  profile_banner_url: string;
  profile_image_url_https: string;
  profile_interstitial_type: string;
  screen_name: string;
  statuses_count: number;
  translator_type: string;
  url?: string;
  verified: boolean;
  verified_type?: string;
  want_retweets: boolean;
  withheld_in_countries: any[];
  followed_by?: boolean;
}

export interface Entities {
  description: Description;
  url?: Url3;
}

export interface Description {
  urls: Url2[];
}

export interface Url2 {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: number[];
}

export interface Url3 {
  urls: Url4[];
}

export interface Url4 {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: number[];
}

export interface Professional {
  rest_id: string;
  professional_type: string;
  category: Category[];
}

export interface Category {
  id: number;
  name: string;
  icon_name: string;
}

export interface EditControl {
  edit_tweet_ids: string[];
  editable_until_msecs: string;
  is_edit_eligible: boolean;
  edits_remaining: string;
}

export interface EditPerspective {
  favorited: boolean;
  retweeted: boolean;
}

export interface Views {
  count: string;
  state: string;
}

export interface Legacy2 {
  bookmark_count: number;
  bookmarked: boolean;
  created_at: string;
  conversation_id_str: string;
  display_text_range: number[];
  entities: Entities2;
  extended_entities?: ExtendedEntities;
  favorite_count: number;
  favorited: boolean;
  full_text: string;
  is_quote_status: boolean;
  lang: string;
  possibly_sensitive: boolean;
  possibly_sensitive_editable: boolean;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  retweeted: boolean;
  user_id_str: string;
  id_str: string;
  place?: Place;
  scopes?: Scopes;
}

export interface Entities2 {
  media?: Medum[];
  user_mentions: any[];
  urls: Url5[];
  hashtags: Hashtag[];
  symbols: any[];
}

export interface Medum {
  display_url: string;
  expanded_url: string;
  id_str: string;
  indices: number[];
  media_url_https: string;
  type: string;
  url: string;
  features: Features;
  sizes: Sizes;
  original_info: OriginalInfo;
  source_status_id_str?: string;
  source_user_id_str?: string;
}

export interface Features {
  large?: Large;
  medium?: Medium;
  small?: Small;
  orig?: Orig;
  all?: All;
}

export interface Large {
  faces: Face[];
}

export interface Face {
  x: number;
  y: number;
  h: number;
  w: number;
}

export interface Medium {
  faces: Face2[];
}

export interface Face2 {
  x: number;
  y: number;
  h: number;
  w: number;
}

export interface Small {
  faces: Face3[];
}

export interface Face3 {
  x: number;
  y: number;
  h: number;
  w: number;
}

export interface Orig {
  faces: Face4[];
}

export interface Face4 {
  x: number;
  y: number;
  h: number;
  w: number;
}

export interface All {
  tags: Tag[];
}

export interface Tag {
  user_id: string;
  name: string;
  screen_name: string;
  type: string;
}

export interface Sizes {
  large: Large2;
  medium: Medium2;
  small: Small2;
  thumb: Thumb;
}

export interface Large2 {
  h: number;
  w: number;
  resize: string;
}

export interface Medium2 {
  h: number;
  w: number;
  resize: string;
}

export interface Small2 {
  h: number;
  w: number;
  resize: string;
}

export interface Thumb {
  h: number;
  w: number;
  resize: string;
}

export interface OriginalInfo {
  height: number;
  width: number;
  focus_rects?: FocusRect[];
}

export interface FocusRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Url5 {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: number[];
}

export interface Hashtag {
  indices: number[];
  text: string;
}

export interface ExtendedEntities {
  media: Medum2[];
}

export interface Medum2 {
  display_url: string;
  expanded_url: string;
  id_str: string;
  indices: number[];
  media_key: string;
  media_url_https: string;
  type: string;
  url: string;
  additional_media_info?: AdditionalMediaInfo;
  mediaStats?: MediaStats;
  ext_media_availability: ExtMediaAvailability;
  features: Features2;
  sizes: Sizes2;
  original_info: OriginalInfo2;
  video_info?: VideoInfo;
  source_status_id_str?: string;
  source_user_id_str?: string;
}

export interface AdditionalMediaInfo {
  title?: string;
  description?: string;
  embeddable?: boolean;
  monetizable: boolean;
  source_user?: SourceUser;
}

export interface SourceUser {
  user_results: UserResults2;
}

export interface UserResults2 {
  result: Result3;
}

export interface Result3 {
  __typename: string;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: {};
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  profile_image_shape: string;
  legacy: Legacy3;
}

export interface Legacy3 {
  following?: boolean;
  can_dm: boolean;
  can_media_tag: boolean;
  created_at: string;
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  entities: Entities3;
  fast_followers_count: number;
  favourites_count: number;
  followers_count: number;
  friends_count: number;
  has_custom_timelines: boolean;
  is_translator: boolean;
  listed_count: number;
  location: string;
  media_count: number;
  name: string;
  normal_followers_count: number;
  pinned_tweet_ids_str: string[];
  possibly_sensitive: boolean;
  profile_banner_url: string;
  profile_image_url_https: string;
  profile_interstitial_type: string;
  screen_name: string;
  statuses_count: number;
  translator_type: string;
  url: string;
  verified: boolean;
  verified_type?: string;
  want_retweets: boolean;
  withheld_in_countries: any[];
}

export interface Entities3 {
  description: Description2;
  url: Url7;
}

export interface Description2 {
  urls: Url6[];
}

export interface Url6 {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: number[];
}

export interface Url7 {
  urls: Url8[];
}

export interface Url8 {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: number[];
}

export interface MediaStats {
  viewCount: number;
}

export interface ExtMediaAvailability {
  status: string;
}

export interface Features2 {
  large?: Large3;
  medium?: Medium3;
  small?: Small3;
  orig?: Orig2;
  all?: All2;
}

export interface Large3 {
  faces: Face5[];
}

export interface Face5 {
  x: number;
  y: number;
  h: number;
  w: number;
}

export interface Medium3 {
  faces: Face6[];
}

export interface Face6 {
  x: number;
  y: number;
  h: number;
  w: number;
}

export interface Small3 {
  faces: Face7[];
}

export interface Face7 {
  x: number;
  y: number;
  h: number;
  w: number;
}

export interface Orig2 {
  faces: Face8[];
}

export interface Face8 {
  x: number;
  y: number;
  h: number;
  w: number;
}

export interface All2 {
  tags: Tag2[];
}

export interface Tag2 {
  user_id: string;
  name: string;
  screen_name: string;
  type: string;
}

export interface Sizes2 {
  large: Large4;
  medium: Medium4;
  small: Small4;
  thumb: Thumb2;
}

export interface Large4 {
  h: number;
  w: number;
  resize: string;
}

export interface Medium4 {
  h: number;
  w: number;
  resize: string;
}

export interface Small4 {
  h: number;
  w: number;
  resize: string;
}

export interface Thumb2 {
  h: number;
  w: number;
  resize: string;
}

export interface OriginalInfo2 {
  height: number;
  width: number;
  focus_rects?: FocusRect2[];
}

export interface FocusRect2 {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface VideoInfo {
  aspect_ratio: number[];
  duration_millis?: number;
  variants: Variant[];
}

export interface Variant {
  bitrate?: number;
  content_type: string;
  url: string;
}

export interface Place {
  attributes: {};
  bounding_box: BoundingBox;
  contained_within: any[];
  country: string;
  country_code: string;
  full_name: string;
  name: string;
  id: string;
  place_type: string;
  url: string;
}

export interface BoundingBox {
  coordinates: number[][][];
  type: string;
}

export interface Scopes {
  followers: boolean;
}

export interface Card {
  rest_id: string;
  legacy: Legacy4;
}

export interface Legacy4 {
  binding_values: BindingValue[];
  card_platform: CardPlatform;
  name: string;
  url: string;
  user_refs_results: any[];
}

export interface BindingValue {
  key: string;
  value: Value;
}

export interface Value {
  string_value: string;
  type: string;
  scribe_key?: string;
}

export interface CardPlatform {
  platform: Platform;
}

export interface Platform {
  audience: Audience;
  device: Device;
}

export interface Audience {
  name: string;
}

export interface Device {
  name: string;
  version: string;
}

export interface UnifiedCard {
  card_fetch_state: string;
}

export interface SocialContext {
  type: string;
  topic?: Topic;
  functionalityType?: string;
  contextType?: string;
  text?: string;
  landingUrl?: LandingUrl;
}

export interface Topic {
  description: string;
  following: boolean;
  icon_url: string;
  id: string;
  topic_id: string;
  name: string;
  not_interested: boolean;
}

export interface LandingUrl {
  url: string;
  urlType: string;
  urtEndpointOptions?: UrtEndpointOptions;
}

export interface UrtEndpointOptions {
  title: string;
  requestParams: RequestParam[];
}

export interface RequestParam {
  key: string;
  value: string;
}

export interface PromotedMetadata {
  advertiser_results: AdvertiserResults;
  disclosureType: string;
  experimentValues: ExperimentValue[];
  impressionId: string;
  impressionString: string;
  clickTrackingInfo: ClickTrackingInfo;
}

export interface AdvertiserResults {
  result: Result4;
}

export interface Result4 {
  __typename: string;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: {};
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  profile_image_shape: string;
  legacy: Legacy5;
  professional?: Professional2;
}

export interface Legacy5 {
  can_dm: boolean;
  can_media_tag: boolean;
  created_at: string;
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  entities: Entities4;
  fast_followers_count: number;
  favourites_count: number;
  followers_count: number;
  friends_count: number;
  has_custom_timelines: boolean;
  is_translator: boolean;
  listed_count: number;
  location: string;
  media_count: number;
  name: string;
  normal_followers_count: number;
  pinned_tweet_ids_str: string[];
  possibly_sensitive: boolean;
  profile_banner_url: string;
  profile_image_url_https: string;
  profile_interstitial_type: string;
  screen_name: string;
  statuses_count: number;
  translator_type: string;
  url: string;
  verified: boolean;
  want_retweets: boolean;
  withheld_in_countries: any[];
  verified_type?: string;
}

export interface Entities4 {
  description: Description3;
  url: Url10;
}

export interface Description3 {
  urls: Url9[];
}

export interface Url9 {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: number[];
}

export interface Url10 {
  urls: Url11[];
}

export interface Url11 {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: number[];
}

export interface Professional2 {
  rest_id: string;
  professional_type: string;
  category: Category2[];
}

export interface Category2 {
  id: number;
  name: string;
  icon_name: string;
}

export interface ExperimentValue {
  key: string;
  value: string;
}

export interface ClickTrackingInfo {
  urlParams: UrlParam[];
}

export interface UrlParam {
  key: string;
  value: string;
}

export interface FeedbackInfo {
  feedbackKeys: string[];
  feedbackMetadata?: string;
}

export interface ClientEventInfo {
  component: string;
  element?: string;
  entityToken?: string;
  details: Details;
}

export interface Details {
  timelinesDetails: TimelinesDetails;
}

export interface TimelinesDetails {
  injectionType: string;
  controllerData?: string;
  sourceData?: string;
}

export interface Item {
  entryId: string;
  item: Item2;
}

export interface Item2 {
  itemContent: ItemContent2;
  clientEventInfo: ClientEventInfo2;
}

export interface ItemContent2 {
  itemType: string;
  __typename: string;
  user_results: UserResults3;
  userDisplayType: string;
  socialContext?: SocialContext2;
}

export interface UserResults3 {
  result: Result5;
}

export interface Result5 {
  __typename: string;
  id: string;
  rest_id: string;
  affiliates_highlighted_label: {};
  has_graduated_access: boolean;
  is_blue_verified: boolean;
  profile_image_shape: string;
  legacy: Legacy6;
  professional?: Professional3;
  super_follow_eligible?: boolean;
}

export interface Legacy6 {
  can_dm: boolean;
  can_media_tag: boolean;
  created_at: string;
  default_profile: boolean;
  default_profile_image: boolean;
  description: string;
  entities: Entities5;
  fast_followers_count: number;
  favourites_count: number;
  followers_count: number;
  friends_count: number;
  has_custom_timelines: boolean;
  is_translator: boolean;
  listed_count: number;
  location: string;
  media_count: number;
  name: string;
  normal_followers_count: number;
  pinned_tweet_ids_str: string[];
  possibly_sensitive: boolean;
  profile_banner_url: string;
  profile_image_url_https: string;
  profile_interstitial_type: string;
  screen_name: string;
  statuses_count: number;
  translator_type: string;
  url?: string;
  verified: boolean;
  want_retweets: boolean;
  withheld_in_countries: any[];
}

export interface Entities5 {
  description: Description4;
  url?: Url13;
}

export interface Description4 {
  urls: Url12[];
}

export interface Url12 {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: number[];
}

export interface Url13 {
  urls: Url14[];
}

export interface Url14 {
  display_url: string;
  expanded_url: string;
  url: string;
  indices: number[];
}

export interface Professional3 {
  rest_id: string;
  professional_type: string;
  category: any[];
}

export interface SocialContext2 {
  type: string;
  contextType: string;
  text: string;
}

export interface ClientEventInfo2 {
  component: string;
  element: string;
  details: Details2;
}

export interface Details2 {
  timelinesDetails: TimelinesDetails2;
}

export interface TimelinesDetails2 {
  injectionType: string;
  controllerData?: string;
  sourceData: string;
}

export interface Header {
  displayType: string;
  text: string;
  socialContext?: SocialContext3;
  sticky: boolean;
}

export interface SocialContext3 {
  type: string;
  contextType: string;
  text: string;
}

export interface Footer {
  displayType: string;
  text: string;
  landingUrl: LandingUrl2;
}

export interface LandingUrl2 {
  url: string;
  urlType: string;
}

export interface ResponseObjects {
  feedbackActions: FeedbackAction[];
}

export interface FeedbackAction {
  key: string;
  value: Value2;
}

export interface Value2 {
  feedbackType: string;
  prompt?: string;
  confirmation?: string;
  childKeys?: string[];
  feedbackUrl?: string;
  hasUndoAction: boolean;
  icon?: string;
  richBehavior?: RichBehavior;
  encodedFeedbackRequest?: string;
}

export interface RichBehavior {
  type: string;
  topic: Topic2;
}

export interface Topic2 {
  description: string;
  following: boolean;
  icon_url: string;
  id: string;
  topic_id: string;
  name: string;
  not_interested: boolean;
}

export interface Metadata {
  scribeConfig: ScribeConfig;
}

export interface ScribeConfig {
  page: string;
}

export interface CLASSIFY_RESPONSE {
  primary?: string;
  secondary?: string;
}

export interface TwitterPost {
  id?: string;
  media?: string[];
  fullText: string;
  postId?: string;
}
