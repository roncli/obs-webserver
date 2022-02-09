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
            primeGifts = data.giftPrime ? Object.keys(data.giftPrime).reduce((prev, cur) => prev + data.giftPrime[cur].gifts.length, 0) : 0,
            hosts = data.hosted ? Object.keys(data.hosted).length : 0,
            hostedViewers = data.hosted ? Object.keys(data.hosted).reduce((prev, cur) => prev + data.hosted[cur].viewerCount, 0) : 0,
            raids = data.raided ? Object.keys(data.raided).length : 0,
            raiders = data.raided ? Object.keys(data.raided).reduce((prev, cur) => prev + data.raided[cur].viewerCount, 0) : 0,
            primeSubs = data.sub ? Object.keys(data.sub).filter((sub) => data.sub[sub].isPrime || data.sub[sub].tier === "Prime").length : 0,
            tier1Subs = data.sub ? Object.keys(data.sub).filter((sub) => !data.sub[sub].isPrime && data.sub[sub].tier === "1000").length : 0,
            tier2Subs = data.sub ? Object.keys(data.sub).filter((sub) => !data.sub[sub].isPrime && data.sub[sub].tier === "2000").length : 0,
            tier3Subs = data.sub ? Object.keys(data.sub).filter((sub) => !data.sub[sub].isPrime && data.sub[sub].tier === "3000").length : 0,
            giftedTier1Subs = data.subGift ? Object.keys(data.subGift).reduce((prev, cur) => prev + data.subGift[cur].gifts.filter((gift) => gift.tier === "1000").length, 0) : 0,
            giftedTier2Subs = data.subGift ? Object.keys(data.subGift).reduce((prev, cur) => prev + data.subGift[cur].gifts.filter((gift) => gift.tier === "2000").length, 0) : 0,
            giftedTier3Subs = data.subGift ? Object.keys(data.subGift).reduce((prev, cur) => prev + data.subGift[cur].gifts.filter((gift) => gift.tier === "3000").length, 0) : 0,
            achievementPoints = data.achievementPoints || 0;

        const donations = data.donation ? Object.keys(data.donation).reduce((prev, cur) => {
            Object.keys(data.donation[cur]).forEach((currency) => {
                if (!prev[currency]) {
                    prev[currency] = 0;
                }

                prev[currency] += data.donation[cur][currency];
            });

            return prev;
        }, {}) : {};

        const donation = Object.keys(donations).map((d) => ({currency: d, amount: donations[d]})).sort((a, b) => a.currency === b.currency ? 0 : a.currency === "USD" ? -1 : b.currency === "USD" ? 1 : a.currency.localeCompare(b.currency));

        if (bits + followers + primeGifts + hosts + hostedViewers + raids + raiders + primeSubs + tier1Subs + tier2Subs + tier3Subs + giftedTier1Subs + giftedTier2Subs + giftedTier3Subs + achievementPoints + donation.length === 0) {
            return "";
        }

        const format = Intl.NumberFormat().format;

        return /* html */`
            <div class="support">
                <div class="header">Stream Support</div>
                ${bits ? /* html */`
                    <div class="text">${format(bits)} ${bits === 1 ? "Bit" : "Bits"}</div>
                ` : ""}
                ${donation ? donation.map((d) => /* html */`
                    <div class="text">${Intl.NumberFormat("en-US", {style: "currency", currency: d.currency}).format(d.amount)}${d.currency === "USD" ? "" : ` ${d.currency}`} Donations</div>
                `).join("") : ""}
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
                ${achievementPoints > 0 ? /* html */`
                    <div class="text">${format(achievementPoints)} Achievement Points</div>
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
