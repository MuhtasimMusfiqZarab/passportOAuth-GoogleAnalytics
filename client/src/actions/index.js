import axios from 'axios';

import { FETCH_USER, FETCH_ANALYTICS } from './types';

export const fetchUser = () => async (dispatch) => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

//fetching google analytics data
export const fetchAnalytics = () => async (dispatch) => {
  const res = await axios.get('/analytics');
  dispatch({ type: FETCH_ANALYTICS, payload: res.data });
};
