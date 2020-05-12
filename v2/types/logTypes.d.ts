declare namespace LogTypes {
    type LogEntry = {
        type: string
        date: Date
        obj?: any
        message?: string
    }
}

export = LogTypes
