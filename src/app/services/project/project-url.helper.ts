// `?project=<folder>` names the open project modal, so it can be linked to (see HomeView.onEnter()).
export const PROJECT_PARAM = 'project';

/**
 * Sets (or, with null, removes) the project param on the current history entry.
 * replaceState, not the router: a navigation would rebuild the view, and Back must
 * behave as without the param. Core's NavigationManager.replaceState() drops the query.
 */
export function setProjectParam(folder: ProjectFolderName | null): void {
  if (typeof location === 'undefined') return; // SSR prerendering
  const url = new URL(location.href);
  if (folder) url.searchParams.set(PROJECT_PARAM, folder);
  else url.searchParams.delete(PROJECT_PARAM);
  const next = url.pathname + url.search + url.hash;
  if (next !== location.pathname + location.search + location.hash) {
    history.replaceState(history.state, '', next);
  }
}
