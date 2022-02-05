declare namespace ViewTypes {
    type Action = {
        name?: string
        overlay?: string
        soundPath?: string
        imageLocation?: string
    }

    type Command = {
        name?: string
        text?: string
        enabled?: boolean
    }

    type ControlViewParameters = {
        discordChannels: DiscordChannel[]
        spotifyPlaylists: SpotifyPlaylist[]
        actions: Action[]
    }

    type DiscordChannel = {
        name?: string
        guildId?: string
        channelId?: string
    }

    type HomeViewParameters = {
        // TODO
    }

    type IndexViewParameters = {
        head: string
        html: string
    }

    type Option = {
        text?: string
        value: string
    }

    type RoncliGaming = {
        title: string
        game: string
        info: string
        analysis: string
    }

    type SpotifyPlaylist = {
        name?: string
        uri?: string
    }
}

export = ViewTypes
