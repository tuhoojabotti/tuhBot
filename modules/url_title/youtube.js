var request = require('request')
  , format = require('util').format
  , c = require('irc').colors.wrap;

function handler(results, cb) {
  if (!results) { return; }

  request('http://gdata.youtube.com/feeds/api/videos/' + results[1] + '?alt=jsonc&v=2',
    function (err, res, body) {
      if (err || res.statusCode !== 200) { return; }
      var data = JSON.parse(body).data;
      if (data) { cb(data); } // No data found.
    }
  );
}

function formatter(i) {
  var duration, dur = secondsToTime(i.duration)
    , rating, rat = Math.round(i.rating)
    , nsfw = i.contentRating ? ' - ' + c('light_red', 'NSFW') : ''
    // Add spaces between thousands to enhance reading experience.
    , viewCount = String(i.viewCount).replace(/(\d)(?=(\d{3})+$)/g, '$1,');

  // Format rating into stars.
  rating = c('yellow', new Array(rat + 1).join('*')
         + new Array(5 - rat + 1).join(''));

  // Format duration into hms format.
  duration = (dur.h ? dur.h + 'h' : '')
           + (dur.m ? dur.m + 'm' : '')
           + (dur.s ? dur.s + 's' : '');

  return format('%s %s by %s [%s - [%s] - %s views%s]',
    c('yellow', '└→'), i.title, c('gray', i.uploader), duration, rating, viewCount, nsfw);
}

function secondsToTime(secs) {
  var hours = Math.floor(secs / (60 * 60));

  var divisor_for_minutes = secs % (60 * 60);
  var minutes = Math.floor(divisor_for_minutes / 60);

  var divisor_for_seconds = divisor_for_minutes % 60;
  var seconds = Math.ceil(divisor_for_seconds);

  return {"h": hours, "m": minutes, "s": seconds};
}

module.exports = {
  handler: handler,
  formatter: formatter
};