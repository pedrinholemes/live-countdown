export function fnBrowserDetect() {
  const userAgent = navigator.userAgent;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    return "Chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    return "Mozilla Firefox";
  } else if (userAgent.match(/safari/i)) {
    return "Safari";
  } else if (userAgent.match(/opr\//i)) {
    return "Opera";
  } else if (userAgent.match(/edg/i)) {
    return "Microsoft Edge";
  } else {
    return "Unknown";
  }
}

