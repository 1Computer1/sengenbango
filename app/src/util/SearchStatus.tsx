export enum SearchStatus {
	UNSENT,
	LOADING,
	LOADING_UNSENT,
	DONE,
	DONE_UNSENT,
}

export function isUnsent(status: SearchStatus) {
	return (
		status === SearchStatus.UNSENT || status === SearchStatus.LOADING_UNSENT || status === SearchStatus.DONE_UNSENT
	);
}

export function isInvalidated(status: SearchStatus) {
	return status !== SearchStatus.UNSENT && isUnsent(status);
}

export function isLoading(status: SearchStatus) {
	return status === SearchStatus.LOADING || status === SearchStatus.LOADING_UNSENT;
}

export function isDone(status: SearchStatus) {
	return status === SearchStatus.DONE || status === SearchStatus.DONE_UNSENT;
}

export function transitionUnsent(status: SearchStatus) {
	if (status === SearchStatus.DONE) {
		return SearchStatus.DONE_UNSENT;
	} else if (status === SearchStatus.LOADING) {
		return SearchStatus.LOADING_UNSENT;
	}
	return status;
}

export function transitionDone(status: SearchStatus) {
	if (status === SearchStatus.LOADING_UNSENT) {
		return SearchStatus.DONE_UNSENT;
	}
	return SearchStatus.DONE;
}
