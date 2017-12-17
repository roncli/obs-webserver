const express = require("express"),
    bodyParser = require("body-parser"),
    config = require("./config"),
    api = require("./api"),
    Spotify = require("spotify-web-api-node"),
    spotify = new Spotify(config.spotify),
    app = express();

app.use(express.static("public", {index: "index.htm"}));
app.use(bodyParser.urlencoded({extended: true}));

/*
//                    #                ##                 ##
//    #                       #         #                #  #
//   #    ###  ###   ##      #   ###    #     ###  #  #   #     ##   ###    ###
//  #    #  #  #  #   #     #    #  #   #    #  #  #  #    #   #  #  #  #  #  #
// #     # ##  #  #   #    #     #  #   #    # ##   # #  #  #  #  #  #  #   ##
//        # #  ###   ###         ###   ###    # #    #    ##    ##   #  #  #
//             #                 #                  #                       ###
app.post("/api/playSong", (req, res) => {
    getSpotifyToken().then(() => {
        spotify.play({uris: req.body.track ? [req.body.track] : void 0, context_uri: req.body.playlist}, (err) => {
            if (err) {
                console.log(err);
                res.status(500);
                res.end();
                return;
            }

            if (req.body.stop) {
                spotify.getMyCurrentPlayingTrack({}, (err, response) => {
                    if (err) {
                        if (err.statusCode === 400) {
                            return;
                        }
                        console.log(err);
                        return;
                    }

                    if (response.item) {
                        setTimeout(() => {
                            spotify.pause({}, () => {});
                        }, response.item.duration_ms - response.progress_ms);
                    }
                });
            }

            res.status(204);
            res.end();
        });
    });
});
*/
app.use("/api", api);

app.listen(60577);
console.log("Listening on port 60577.");

process.on("unhandledRejection", (err) => {
    console.log(err);
});
