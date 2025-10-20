import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  Json: { input: any; output: any; }
  Long: { input: any; output: any; }
};

export type Author = _Document & _Linkable & {
  __typename?: 'Author';
  _linkType?: Maybe<Scalars['String']['output']>;
  _meta: Meta;
  avatar?: Maybe<Scalars['Json']['output']>;
  description?: Maybe<Scalars['Json']['output']>;
  job_title?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of items. */
export type AuthorConnectionConnection = {
  __typename?: 'AuthorConnectionConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AuthorConnectionEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Long']['output'];
};

/** An edge in a connection. */
export type AuthorConnectionEdge = {
  __typename?: 'AuthorConnectionEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Author;
};

export type Blogpost = _Document & _Linkable & {
  __typename?: 'Blogpost';
  _linkType?: Maybe<Scalars['String']['output']>;
  _meta: Meta;
  author?: Maybe<_Linkable>;
  body?: Maybe<Scalars['Json']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  feed_date?: Maybe<Scalars['Date']['output']>;
  hero?: Maybe<Scalars['Json']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

/** A connection to a list of items. */
export type BlogpostConnectionConnection = {
  __typename?: 'BlogpostConnectionConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<BlogpostConnectionEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Long']['output'];
};

/** An edge in a connection. */
export type BlogpostConnectionEdge = {
  __typename?: 'BlogpostConnectionEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: Blogpost;
};

export type Meta = {
  __typename?: 'Meta';
  /** Alternate languages the document. */
  alternateLanguages: Array<RelatedDocument>;
  /** The first publication date of the document. */
  firstPublicationDate?: Maybe<Scalars['DateTime']['output']>;
  /** The id of the document. */
  id: Scalars['String']['output'];
  /** The language of the document. */
  lang: Scalars['String']['output'];
  /** The last publication date of the document. */
  lastPublicationDate?: Maybe<Scalars['DateTime']['output']>;
  /** The tags of the document. */
  tags: Array<Scalars['String']['output']>;
  /** The type of the document. */
  type: Scalars['String']['output'];
  /** The uid of the document. */
  uid?: Maybe<Scalars['String']['output']>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  _allDocuments: _DocumentConnection;
  allAuthors: AuthorConnectionConnection;
  allBlogposts: BlogpostConnectionConnection;
  author?: Maybe<Author>;
  blogpost?: Maybe<Blogpost>;
};


export type Query_AllDocumentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  firstPublicationDate?: InputMaybe<Scalars['DateTime']['input']>;
  firstPublicationDate_after?: InputMaybe<Scalars['DateTime']['input']>;
  firstPublicationDate_before?: InputMaybe<Scalars['DateTime']['input']>;
  fulltext?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lang?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastPublicationDate?: InputMaybe<Scalars['DateTime']['input']>;
  lastPublicationDate_after?: InputMaybe<Scalars['DateTime']['input']>;
  lastPublicationDate_before?: InputMaybe<Scalars['DateTime']['input']>;
  similar?: InputMaybe<Similar>;
  sortBy?: InputMaybe<SortDocumentsBy>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  tags_in?: InputMaybe<Array<Scalars['String']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_in?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryAllAuthorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  firstPublicationDate?: InputMaybe<Scalars['DateTime']['input']>;
  firstPublicationDate_after?: InputMaybe<Scalars['DateTime']['input']>;
  firstPublicationDate_before?: InputMaybe<Scalars['DateTime']['input']>;
  fulltext?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lang?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastPublicationDate?: InputMaybe<Scalars['DateTime']['input']>;
  lastPublicationDate_after?: InputMaybe<Scalars['DateTime']['input']>;
  lastPublicationDate_before?: InputMaybe<Scalars['DateTime']['input']>;
  similar?: InputMaybe<Similar>;
  sortBy?: InputMaybe<SortAuthory>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  tags_in?: InputMaybe<Array<Scalars['String']['input']>>;
  uid?: InputMaybe<Scalars['String']['input']>;
  uid_in?: InputMaybe<Array<Scalars['String']['input']>>;
  where?: InputMaybe<WhereAuthor>;
};


export type QueryAllBlogpostsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  firstPublicationDate?: InputMaybe<Scalars['DateTime']['input']>;
  firstPublicationDate_after?: InputMaybe<Scalars['DateTime']['input']>;
  firstPublicationDate_before?: InputMaybe<Scalars['DateTime']['input']>;
  fulltext?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  lang?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastPublicationDate?: InputMaybe<Scalars['DateTime']['input']>;
  lastPublicationDate_after?: InputMaybe<Scalars['DateTime']['input']>;
  lastPublicationDate_before?: InputMaybe<Scalars['DateTime']['input']>;
  similar?: InputMaybe<Similar>;
  sortBy?: InputMaybe<SortBlogposty>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  tags_in?: InputMaybe<Array<Scalars['String']['input']>>;
  uid?: InputMaybe<Scalars['String']['input']>;
  uid_in?: InputMaybe<Array<Scalars['String']['input']>>;
  where?: InputMaybe<WhereBlogpost>;
};


export type QueryAuthorArgs = {
  lang: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};


export type QueryBlogpostArgs = {
  lang: Scalars['String']['input'];
  uid: Scalars['String']['input'];
};

export type RelatedDocument = {
  __typename?: 'RelatedDocument';
  /** The id of the document. */
  id: Scalars['String']['output'];
  /** The language of the document. */
  lang: Scalars['String']['output'];
  /** The type of the document. */
  type: Scalars['String']['output'];
  /** The uid of the document. */
  uid?: Maybe<Scalars['String']['output']>;
};

export enum SortAuthory {
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  JobTitleAsc = 'job_title_ASC',
  JobTitleDesc = 'job_title_DESC',
  MetaFirstPublicationDateAsc = 'meta_firstPublicationDate_ASC',
  MetaFirstPublicationDateDesc = 'meta_firstPublicationDate_DESC',
  MetaLastPublicationDateAsc = 'meta_lastPublicationDate_ASC',
  MetaLastPublicationDateDesc = 'meta_lastPublicationDate_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC'
}

export enum SortBlogposty {
  BodyAsc = 'body_ASC',
  BodyDesc = 'body_DESC',
  DescriptionAsc = 'description_ASC',
  DescriptionDesc = 'description_DESC',
  FeedDateAsc = 'feed_date_ASC',
  FeedDateDesc = 'feed_date_DESC',
  MetaFirstPublicationDateAsc = 'meta_firstPublicationDate_ASC',
  MetaFirstPublicationDateDesc = 'meta_firstPublicationDate_DESC',
  MetaLastPublicationDateAsc = 'meta_lastPublicationDate_ASC',
  MetaLastPublicationDateDesc = 'meta_lastPublicationDate_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC'
}

export enum SortDocumentsBy {
  MetaFirstPublicationDateAsc = 'meta_firstPublicationDate_ASC',
  MetaFirstPublicationDateDesc = 'meta_firstPublicationDate_DESC',
  MetaLastPublicationDateAsc = 'meta_lastPublicationDate_ASC',
  MetaLastPublicationDateDesc = 'meta_lastPublicationDate_DESC'
}

export type WhereAuthor = {
  /** description */
  description_fulltext?: InputMaybe<Scalars['String']['input']>;
  job_title?: InputMaybe<Scalars['String']['input']>;
  job_title_fulltext?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_fulltext?: InputMaybe<Scalars['String']['input']>;
};

export type WhereBlogpost = {
  /** author */
  author?: InputMaybe<Scalars['String']['input']>;
  /** body */
  body_fulltext?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_fulltext?: InputMaybe<Scalars['String']['input']>;
  /** feed_date */
  feed_date?: InputMaybe<Scalars['Date']['input']>;
  /** feed_date */
  feed_date_after?: InputMaybe<Scalars['Date']['input']>;
  /** feed_date */
  feed_date_before?: InputMaybe<Scalars['Date']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_fulltext?: InputMaybe<Scalars['String']['input']>;
};

/** A prismic document */
export type _Document = {
  _meta: Meta;
};

/** A connection to a list of items. */
export type _DocumentConnection = {
  __typename?: '_DocumentConnection';
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<_DocumentEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  totalCount: Scalars['Long']['output'];
};

/** An edge in a connection. */
export type _DocumentEdge = {
  __typename?: '_DocumentEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge. */
  node: _Document;
};

/** An external link */
export type _ExternalLink = _Linkable & {
  __typename?: '_ExternalLink';
  _linkType?: Maybe<Scalars['String']['output']>;
  target?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

/** A linked file */
export type _FileLink = _Linkable & {
  __typename?: '_FileLink';
  _linkType?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  size: Scalars['Long']['output'];
  url: Scalars['String']['output'];
};

/** A linked image */
export type _ImageLink = _Linkable & {
  __typename?: '_ImageLink';
  _linkType?: Maybe<Scalars['String']['output']>;
  height: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  size: Scalars['Long']['output'];
  url: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

/** A prismic link */
export type _Linkable = {
  _linkType?: Maybe<Scalars['String']['output']>;
};

export type Similar = {
  documentId: Scalars['String']['input'];
  max: Scalars['Int']['input'];
};

export const BlogPostFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BlogPostFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BlogpostConnectionConnection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"feed_date"}},{"kind":"Field","name":{"kind":"Name","value":"hero"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"_meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastPublicationDate"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BlogPostFieldsFragment, unknown>;
export const GetBlogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBlog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blogpost"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"uid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uid"}}},{"kind":"Argument","name":{"kind":"Name","value":"lang"},"value":{"kind":"StringValue","value":"en-us","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"feed_date"}},{"kind":"Field","name":{"kind":"Name","value":"hero"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"_meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastPublicationDate"}}]}}]}}]}}]} as unknown as DocumentNode<GetBlogQuery, GetBlogQueryVariables>;
export const GetBlogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBlogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SortBlogposty"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"WhereBlogpost"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allBlogposts"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"BlogPostFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"BlogPostFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BlogpostConnectionConnection"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"feed_date"}},{"kind":"Field","name":{"kind":"Name","value":"hero"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Author"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"_meta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastPublicationDate"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetBlogsQuery, GetBlogsQueryVariables>;
export type GetBlogQueryVariables = Exact<{
  uid: Scalars['String']['input'];
}>;


export type GetBlogQuery = { __typename?: 'Query', blogpost?: { __typename?: 'Blogpost', title?: string | null, feed_date?: any | null, hero?: any | null, body?: any | null, author?: { __typename: 'Author', name?: string | null } | { __typename: 'Blogpost' } | { __typename: '_ExternalLink' } | { __typename: '_FileLink' } | { __typename: '_ImageLink' } | null, _meta: { __typename?: 'Meta', uid?: string | null, type: string, tags: Array<string>, id: string, lastPublicationDate?: any | null } } | null };

export type BlogPostFieldsFragment = { __typename?: 'BlogpostConnectionConnection', totalCount: any, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges?: Array<{ __typename?: 'BlogpostConnectionEdge', cursor: string, node: { __typename?: 'Blogpost', title?: string | null, description?: string | null, feed_date?: any | null, hero?: any | null, author?: { __typename: 'Author', name?: string | null } | { __typename: 'Blogpost' } | { __typename: '_ExternalLink' } | { __typename: '_FileLink' } | { __typename: '_ImageLink' } | null, _meta: { __typename?: 'Meta', uid?: string | null, type: string, tags: Array<string>, id: string, lastPublicationDate?: any | null } } } | null> | null };

export type GetBlogsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<SortBlogposty>;
  where?: InputMaybe<WhereBlogpost>;
}>;


export type GetBlogsQuery = { __typename?: 'Query', allBlogposts: { __typename?: 'BlogpostConnectionConnection', totalCount: any, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, endCursor?: string | null, startCursor?: string | null }, edges?: Array<{ __typename?: 'BlogpostConnectionEdge', cursor: string, node: { __typename?: 'Blogpost', title?: string | null, description?: string | null, feed_date?: any | null, hero?: any | null, author?: { __typename: 'Author', name?: string | null } | { __typename: 'Blogpost' } | { __typename: '_ExternalLink' } | { __typename: '_FileLink' } | { __typename: '_ImageLink' } | null, _meta: { __typename?: 'Meta', uid?: string | null, type: string, tags: Array<string>, id: string, lastPublicationDate?: any | null } } } | null> | null } };
