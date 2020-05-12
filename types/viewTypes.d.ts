declare namespace ViewTypes {
    type Action = {
        name?: string
        reward?: string
        soundPath?: string
        imagePath?: string
        imageLocation?: string
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

    type IndexViewParameters = {
        head: string
        html: string
    }

    type Option = {
        text?: string
        value: string
    }

    type SpotifyPlaylist = {
        name?: string
        uri?: string
    }
}

export = ViewTypes
