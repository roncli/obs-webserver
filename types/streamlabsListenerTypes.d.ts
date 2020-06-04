declare namespace StreamlabsListenerTypes {
    type DonationEvent = {
        id?: number
        name: string
        amount: number
        formatted_amount: string
        formattedAmount?: string
        message: string
        currency: string
        iconClassName?: string
        to: {
            name: string
        }
        from: string
        from_user_id?: number
        donation_currency?: string
        _id: string
        priority: number
        platform: string
        isTest: boolean
    }
}

export = StreamlabsListenerTypes
