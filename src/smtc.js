/**
 * @typedef {import("../types/smtcTypes").Track} SMTCTypes.Track
 */

const WinSMTC = require("@coooookies/windows-smtc-monitor");

// MARK: class SMTC
/**
 * A class that reads System Media Transport Controls (SMTC) information.
 */
class SMTC {
    // MARK: static #splitArtistAndAlbum
    /**
     * Splits a raw artist and album string into separate artist and album strings.
     * @param {string} raw The raw artist and album string.
     * @returns {{artist: string, album: string}} The separated artist and album strings.
     */
    static #splitArtistAndAlbum(raw) {
        if (!raw) {
            return {artist: "", album: ""};
        }

        const separators = [" — ", " – ", " - ", " · ", " | "];

        for (const sep of separators) {
            if (raw.includes(sep)) {
                const [artist, album] = raw.split(sep).map(s => s.trim());
                return {artist, album};
            }
        }

        return {artist: raw.trim(), album: ""};
    }

    // MARK: static getCurrentTrack
    /**
     * Gets the current track information.
     * @returns {SMTCTypes.Track} The current track information.
     */
    static getCurrentTrack() {
        const sessions = WinSMTC.SMTCMonitor.getMediaSessions();

        if (sessions.length === 0) {
            return {};
        }

        const session = sessions.find(s => s.sourceAppId.includes("AppleMusic"));
        let imageUrl = "";
        if (session?.media?.thumbnail && Buffer.isBuffer(session.media.thumbnail)) {
            const buf = session.media.thumbnail;
            let mimeType;
            if (buf.length >= 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) {
                mimeType = "image/jpeg";
            } else if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
                mimeType = "image/png";
            } else if (buf.length >= 12 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
                mimeType = "image/webp";
            }
            if (mimeType) {
                imageUrl = `data:${mimeType};base64,${buf.toString("base64")}`;
            }
        }
        return {
            playing: session?.playback?.playbackStatus === WinSMTC.PlaybackStatus.PLAYING,
            progress: session?.timeline?.position || 0,
            duration: session?.timeline?.duration || 0,
            imageUrl,
            title: session?.media?.title || "",
            artist: SMTC.#splitArtistAndAlbum(session?.media?.artist || "")?.artist || "",
        }
    }
}

module.exports = SMTC;
