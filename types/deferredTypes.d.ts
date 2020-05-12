interface DeferredPromise<T> extends Promise<T> {
    resolve?: Function,
    reject?: Function
}

export = DeferredPromise
