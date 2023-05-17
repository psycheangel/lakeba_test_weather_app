/**
 * Created on Wed Feb 09 2022
 *
 * implementation redux store without heavy typescript integration
 *
 * @param ..
 * @return ..
 * @throws ..
 * @todo ..
 * @author Dwinanto Saputra
 */

 //import { applyMiddleware, compose, combineReducers} from 'redux';
 import {configureStore, StoreEnhancer} from '@reduxjs/toolkit';
 import originReducer from './reducer';
 import {persistStore, persistReducer,  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,} from 'redux-persist';
 import axios, { AxiosRequestConfig } from "axios"
 import { offline } from '@redux-offline/redux-offline';
 import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
 import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
 import {OpenWeatherAPI} from "openweather-api-node";
 import thunk from 'redux-thunk';
 
export const _weatherAPI = new OpenWeatherAPI({
  key: "f7846c170ced9a2f7f8737378b21bb25",
})

 const persistConfig = {
    key: 'root',
    storage,
  }
  
  const effect = (effect: AxiosRequestConfig<any>, _action: any) => axios(effect);
  const discard = (error: { request: any; response: any; }, _action: any, _retries: any) => {
    const { request, response } = error;
    if (!request) throw error; // There was an error creating the request
    if (!response) return false; // There was no response
    return 400 <= response.status && response.status < 500;
  };
 const persistedReducer = persistReducer(persistConfig, originReducer)
 
 const store = configureStore({
  reducer:persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, "SET_GEOCODING_LIST", "SET_WEATHERDATA_LIST"],
    },
    thunk: {
      extraArgument: _weatherAPI
    },
  }),
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: [offline({ 
    ...offlineConfig,
    effect,
    discard}) as StoreEnhancer]
});
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export default store;
