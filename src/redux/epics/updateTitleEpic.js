import { merge } from 'rxjs';
import { debounceTime, map, filter } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';
import { CHANGE_FILE_TEXT, INIT_FILES } from '../actionTypes';
import { setTitle } from '../actionCreators';
import { runDebounceTime } from '../../constants';
import { getFile } from '../selectors';

const extractTitle = html => {
  const titleMatch = html.text.match(/<title>(.*?)<\/title>/i);
  return titleMatch ? titleMatch[1] : 'Untitled';
};

export const updateTitleEpic = (action$, state$) =>
  merge(
    action$.ofType(INIT_FILES),
    action$.ofType(CHANGE_FILE_TEXT).pipe(
      filter(action => action.fileName === 'index.html'),
      debounceTime(runDebounceTime)
    ),
  )
  .pipe(map(action => {
    console.log('setting title');
    return setTitle(extractTitle(getFile(state$.value, 'index.html')))
  }));
