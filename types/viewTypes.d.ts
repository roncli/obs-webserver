declare namespace ViewTypes {
    type Action = {
        name?: string
        overlay?: string
        soundPath?: string
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
        info: string
    }

    type SpotifyPlaylist = {
        name?: string
        uri?: string
    }
}

export = ViewTypes
