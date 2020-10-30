interface DeferredPromise<T> extends Promise<T> {
    resolve?: Function
    reject?: Function
    isFulfilled?(): boolean
    isPending?(): boolean
    isRejected?(): boolean
}

export = DeferredPromise
