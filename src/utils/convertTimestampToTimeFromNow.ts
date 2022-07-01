import moment from "moment-timezone";

moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "%d seconds",
    ss: "%d seconds",
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    w: "a week",
    ww: "%d weeks",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

const sourceTimezone = "UTC";
const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const convertTimestampToTimeFromNow = (time: string) => {
  const timeMoment = moment.tz(time, sourceTimezone);
  const timeMomentBrowser = timeMoment.clone().tz(browserTimezone);

  const fromNow = timeMomentBrowser.fromNow();
  if (fromNow === "1 seconds ago") {
    return "1 second ago";
  }
  return fromNow;
};

export const formatDate = (timestamp: string) => {
  const timeMoment = moment.tz(timestamp, sourceTimezone);
  const timeMomentBrowser = timeMoment.clone().tz(browserTimezone);

  return timeMomentBrowser.format("MMM DD, YYYY h:mm A");
};
