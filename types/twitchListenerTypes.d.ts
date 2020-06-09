declare namespace TwitchListenerTypes {
    type ActionEvent = {
        channel: string
        user: string
        name: string
        message: string
    }

    type BitsEvent = {
        userId: string
        user: string
        name: string
        bits: number
        totalBits: number
        message: string
        isAnonymous: boolean
    }

    type ErrorEvent = {
        message: string
        err: Error
    }

    type FollowEvent = {
        userId: string
        user: string
        name: string
        date: Date
    }

    type GiftPrimeEvent = {
        channel: string
        user: string
        name: string
        gift: string
    }

    type HostEvent = {
        channel: string
        user: string
        name: string
        viewerCount: number
    }

    type HostedEvent = {
        channel: string
        user: string
        name: string
        auto: boolean
        viewerCount: number
    }

    type MessageEvent = {
        channel: string
        user: string
        name: StringConstructor
        message: string
    }

    type RaidedEvent = {
        channel: string
        user: string
        name: string
        viewerCount: number
    }

    type RedemptionEvent = {
        userId: string
        user: string
        name: string
        message: string
        date: Date
        cost: number
        reward: string
        isQueued: boolean
    }

    type ResubEvent = {
        channel: string
        user: string
        name: string
        isPrime: boolean
        message?: string
        months: number
        streak?: number
        tier: string
    }

    type RitualEvent = {
        channel: string
        user: string
        name: string
        message: string
        ritual: string
    }

    type StreamEvent = {
        title: string
        game: string
        id: string
        startDate: Date
        thumbnailUrl: string
    }

    type SubEvent = {
        channel: string
        user: string
        name: string
        isPrime: boolean
        message?: string
        months: number
        streak?: number
        tier: string
    }

    type SubExtendEvent = {
        channel: string
        user: string
        name: string
        months: number
        tier: string
    }

    type SubGiftEvent = {
        channel: string
        user: string
        name: string
        gifterUser?: string
        gifterName?: string
        totalGiftCount?: number
        isPrime: boolean
        message?: string
        months: number
        streak?: number
        tier: string
    }

    type SubGiftCommunityEvent = {
        channel: string
        user: string
        name: string
        giftCount: number
        totalGiftCount?: number
        tier: string
    }

    type SubGiftCommunityPayForwardEvent = {
        channel: string
        user: string
        name: string
        originalGifter: string
    }

    type SubGiftPayForwardEvent = {
        channel: string
        user: string
        name: string
        originalGifter: string
        recipient: string
    }

    type SubGiftUpgradeEvent = {
        channel: string
        user: string
        name: string
        gifter: string
        tier: string
    }

    type SubPrimeUpgradedEvent = {
        channel: string
        user: string
        name: string
        tier: string
    }

    type WhisperEvent = {
        user: string
        name: string
        message: string
    }
}

export = TwitchListenerTypes
