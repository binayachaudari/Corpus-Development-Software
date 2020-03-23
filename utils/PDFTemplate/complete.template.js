module.exports = (payload) => {
  const { assignment_type, submitted_by_email, submitted_by, filename, file_id, num_of_sentences, submitted_to, submitted_to_role, start_index, end_index, deadline, is_overdue } = payload;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Corpus Developement Software</title><style>@import url('https://fonts.googleapis.com/css?family=Montserrat:500,700&display=swap');*{box-sizing:border-box;font-family:'Montserrat',sans-serif;font-size:16px}h1{font-size:20px}.container{margin:1.5cm}img{max-height:100px;max-width:100%;display:block;margin:0 auto}.today{text-align:right}.assignment{text-align:center}table{border-collapse:collapse;width:100%}table th{text-transform:uppercase;font-size:16px;color:#2e74b5;background:#e1e9f4}td,th{border-top:1px solid #719ad2;border-bottom:1px solid #719ad2;padding:12px;text-align:center}.deadline{color:red}.justify{text-align:justify}.copyright{text-align:center;padding-top:10px;line-height:0}</style></head><body><div class="container"> <img src="http://ilprl.ku.edu.np/wp-content/uploads/2019/01/IlPRL-logo-1.png" alt="Corpus Developement Software"><p class="today">${getToday()}</p><h1 class="assignment">Task Concluded (${assignment_type})</h2><p>Greetings <b>${submitted_to}</b> (${submitted_to_role}),</p><p class="justify">A ${assignment_type.toLowerCase()} task assigned to <b>${submitted_by}</b> with filename <b>(${filename})</b>, starting from line number <b>${start_index}</b> and ending at <b>${end_index}</b>, has been completed.</p><table><tr><th>File ID</th><th>No. of Sentences</th><th>Submitted By</th><th>Submitted To</th><th>Submission Time</th><th>Deadline</th></tr><tr><td><b>${file_id}</b></td><td><b>${num_of_sentences}</b></td><td>${submitted_by}</td><td>${submitted_to}</td><td>${convertDate(Date.now())}</td><td class="deadline"><b>${convertDate(deadline)}</b></td></tr></table><p>You will find the submitted file itself on your application Dashboard.</p>${is_overdue ? `<p>The file is overdue by: <b class="deadline" style="font-size: 18px; text-transform: uppercase;">${calcTimeDiff(deadline)}</b></p>` : ``} <br> <br><h3>Submitted By:</h3><p>${submitted_by}</p><p>${submitted_by_email}</p><div class="copyright"> <script>document.write(new Date().toLocaleString('en',{month:'short',year:'numeric',day:'numeric'}));</script> <p>Corpus Development Software</p></div></body></html>`
}

function getToday() {
  const today = new Date;
  return today.toLocaleString('en', { month: 'short', year: 'numeric', day: 'numeric' })
}

function convertDate(date) {
  const ISOdate = new Date(date);
  return ISOdate.toLocaleString('en', { month: 'short', year: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function calcTimeDiff(deadline) {
  let dateNow = Date.now();
  deadline = new Date(deadline);

  let diffInMilliSeconds = Math.abs(dateNow - deadline) / 1000;

  //calculate Days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  //calculate Hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  //calculate Minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  let difference = '';
  if (days > 0)
    difference += (days === 1) ? `${days} day, ` : `${days} days, `;

  difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

  difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;

  return difference;
}

