import { FETCH_ANALYTICS } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case FETCH_ANALYTICS:
      return action.payload || false;
    default:
      return state;
  }
}
