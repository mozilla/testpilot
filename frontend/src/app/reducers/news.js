// @flow

export type NewsUpdate = {
  title: string,
  link?: string,
  content: string,
  type: string,
  experimentSlug?: string,
  created: string,
  published?: string,
  dev?: boolean
};

export type NewsState = {
  updates: Array<NewsUpdate>
}

function defaultState(): NewsState {
  return {
    updates: []
  };
}

export type SetStateAction = {
  type: 'NEWS_SET_STATE',
  payload: NewsState
};

export default function newsReducer(state: NewsState, action: SetStateAction): NewsState {
  if (!state) {
    return defaultState();
  }
  switch (action.type) {
    case "NEWS_SET_STATE":
      return action.payload;
    default:
      return state;
  }
}
