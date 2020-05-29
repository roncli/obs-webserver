//   ###                         ###                                       #     #   #    #
//  #   #                       #   #                                      #     #   #
//  #       ###   ## #    ###   #      #   #  # ##   # ##    ###   # ##   ####   #   #   ##     ###   #   #
//  #          #  # # #  #   #   ###   #   #  ##  #  ##  #  #   #  ##  #   #      # #     #    #   #  #   #
//  #  ##   ####  # # #  #####      #  #   #  ##  #  ##  #  #   #  #       #      # #     #    #####  # # #
//  #   #  #   #  # # #  #      #   #  #  ##  # ##   # ##   #   #  #       #  #   # #     #    #      # # #
//   ###    ####  #   #   ###    ###    ## #  #      #       ###   #        ##     #     ###    ###    # #
//                                            #      #
//                                            #      #
/**
 * A class that represents the game support view.
 */
class GameSupportView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered page template.
     * @returns {string} An HTML string of the page.
     */
    static get() {
        if (!GameSupportView.Home || !GameSupportView.Home.data) {
            return "";
        }

        const data = GameSupportView.Home.data;

        if (!data || Object.keys(data).length === 0) {
            return "";
        }

        const bits = data.bits ? Object.keys(data.bits).reduce((prev, cur) => prev + data.bits[cur].bits, 0) : 0,
            followers = data.follow ? Object.keys(data.follow).length : 0,
            primeGifts = data.giftPrime ? Object.keys(data.giftPrime).reduce((prev, cur) => prev + data.giftPrime[cur].length, 0) : 0,
            hosts = data.hosted ? Object.keys(data.hosted).length : 0,
            hostedViewers = data.hosted ? Object.keys(data.hosted).reduce((prev, cur) => prev + data.hosted[cur].viewerCount, 0) : 0,
            raids = data.raided ? Object.keys(data.raided).length : 0,
            raiders = data.raided ? Object.keys(data.raided).reduce((prev, cur) => prev + data.raided[cur].viewerCount, 0) : 0,
            primeSubs = data.sub ? Object.keys(data.sub).filter((sub) => data.sub[sub].isPrime || data.sub[sub].tier === "Prime").length : 0,
            tier1Subs = data.sub ? Object.keys(data.sub).filter((sub) => !data.sub[sub].isPrime && data.sub[sub].tier === "1000").length : 0,
            tier2Subs = data.sub ? Object.keys(data.sub).filter((sub) => !data.sub[sub].isPrime && data.sub[sub].tier === "2000").length : 0,
            tier3Subs = data.sub ? Object.keys(data.sub).filter((sub) => !data.sub[sub].isPrime && data.sub[sub].tier === "3000").length : 0,
            giftedTier1Subs = data.subGifts ? Object.keys(data.subGifts).reduce((prev, cur) => prev + data.subGifts[cur].gifts.filter((gift) => gift.tier === "1000").length, 0) : 0,
            giftedTier2Subs = data.subGifts ? Object.keys(data.subGifts).reduce((prev, cur) => prev + data.subGifts[cur].gifts.filter((gift) => gift.tier === "2000").length, 0) : 0,
            giftedTier3Subs = data.subGifts ? Object.keys(data.subGifts).reduce((prev, cur) => prev + data.subGifts[cur].gifts.filter((gift) => gift.tier === "3000").length, 0) : 0;

        if (bits + followers + primeGifts + hosts + hostedViewers + raids + raiders + primeSubs + tier1Subs + tier2Subs + tier3Subs + giftedTier1Subs + giftedTier2Subs + giftedTier3Subs === 0) {
            return "";
        }

        const format = Intl.NumberFormat().format;

        return /* html */`
            <div class="support">
                <div class="header">Stream Support</div>
                ${bits ? /* html */`
                    <div class="text">${format(bits)} ${bits === 1 ? "Bit" : "Bits"}</div>
                ` : ""}
                ${followers ? /* html */`
                    <div class="text">${format(followers)} ${followers === 1 ? "Follower" : "Followers"}</div>
                ` : ""}
                ${primeGifts ? /* html */`
                    <div class="text">${format(primeGifts)} Prime ${primeGifts === 1 ? "Gift" : "Gifts"}</div>
                ` : ""}
                ${hosts ? /* html */`
                    <div class="text">${format(hosts)} ${hosts === 1 ? "Host" : "Hosts"}</div>
                ` : ""}
                ${hostedViewers ? /* html */`
                    <div class="text">${format(hostedViewers)} Hosted ${hostedViewers === 1 ? "Viewer" : "Viewers"}</div>
                ` : ""}
                ${raids ? /* html */`
                    <div class="text">${format(raids)} ${raids === 1 ? "Raid" : "Raids"}</div>
                ` : ""}
                ${raiders ? /* html */`
                    <div class="text">${format(raiders)} ${raiders === 1 ? "Raider" : "Raiders"}</div>
                ` : ""}
                ${primeSubs ? /* html */`
                    <div class="text">${format(primeSubs)} Prime ${primeSubs === 1 ? "Demolitionist" : "Demolitionists"}</div>
                ` : ""}
                ${tier1Subs ? /* html */`
                    <div class="text">${format(tier1Subs)} ${tier1Subs === 1 ? "Demolitionist" : "Demolitionists"}</div>
                ` : ""}
                ${tier2Subs ? /* html */`
                    <div class="text">${format(tier2Subs)} ${tier2Subs === 1 ? "Firebomber" : "Firebombers"}</div>
                ` : ""}
                ${tier3Subs ? /* html */`
                    <div class="text">${format(tier3Subs)} ${tier3Subs === 1 ? "Pyromaniac" : "Pyromaniacs"}</div>
                ` : ""}
                ${giftedTier1Subs ? /* html */`
                    <div class="text">${format(giftedTier1Subs)} ${giftedTier1Subs === 1 ? "Demolitionist" : "Demolitionists"} Gifted</div>
                ` : ""}
                ${giftedTier2Subs ? /* html */`
                    <div class="text">${format(giftedTier2Subs)} ${giftedTier2Subs === 1 ? "Firebomber" : "Firebombers"} Gifted</div>
                ` : ""}
                ${giftedTier3Subs ? /* html */`
                    <div class="text">${format(giftedTier3Subs)} ${giftedTier3Subs === 1 ? "Pyromaniac" : "Pyromaniacs"} Gifted</div>
                ` : ""}
            </div>
        `;
    }
}

// @ts-ignore
GameSupportView.Home = typeof Home === "undefined" ? void 0 : Home; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.GameSupportView = GameSupportView;
} else {
    module.exports = GameSupportView; // eslint-disable-line no-undef
}
