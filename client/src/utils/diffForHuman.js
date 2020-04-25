export const diffForHumans = (time) => {
  let unixTime = new Date(time);
  let d = new Date();
  // // get total seconds between the times
  let delta = Math.abs(d.getTime() - unixTime) / 1000;

  // calculate (and subtract) whole days
  let days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  let hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  let minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;
  // what's left is seconds

  let remainTime = `${days > 0 ? days : ''} ${days === 0 ? '' : days === 1 ? 'day, ' : 'days, '}
  ${hours > 0 ? hours : ''} ${hours === 0 ? '' : hours === 1 ? 'hour, ' : 'hours, '} 
  ${minutes > 0 ? minutes : ''} ${minutes === 0 ? '' : minutes === 1 ? 'minute' : 'minutes'}`

  return ((unixTime > d.getTime()) ? remainTime : 'Overdue')
}

export const convertDate = (date) => {
  const ISOdate = new Date(date);
  return ISOdate.toLocaleString('en', { month: 'short', year: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export const timeSince = date => {
  const timeStamp = new Date(date);
  let secondsPast = (Date.now() - timeStamp) / 1000;
  if (secondsPast < 60) {
    return parseInt(secondsPast) + ' seconds ago';
  }
  if (secondsPast < 3600) {
    return parseInt(secondsPast / 60) + ' minutes ago';
  }
  if (secondsPast <= 86400) {
    return parseInt(secondsPast / 3600) + ' hours ago';
  }
  if (secondsPast > 86400) {
    return convertDate(timeStamp);
  }
}