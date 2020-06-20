module.exports = (payload) => {
  const { assignment_type, assigned_to, assigned_to_role, filename, start_index, end_index, file_id, num_of_sentences, assigned_by, deadline, assigned_by_email } = payload;
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Corpus Developement Software</title><style>@import url('https://fonts.googleapis.com/css?family=Montserrat:500,700&display=swap');*{box-sizing:border-box;font-family:'Montserrat',sans-serif;font-size:16px}h1{font-size:20px}.container{margin:1.5cm}img{max-height:100px;max-width:100%;display:block;margin:0 auto}.today{text-align:right}.assignment{text-align:center}table{border-collapse:collapse;width:100%}table th{text-transform:uppercase;font-size:16px;color:#2e74b5;background:#e1e9f4}td,th{border-top:1px solid #719ad2;border-bottom:1px solid #719ad2;padding:12px;text-align:center}.deadline{color:red}.justify{text-align:justify}.copyright{text-align:center;padding-top:10px;line-height:0;}</style></head><body><div class="container"> <img src="http://ilprl.ku.edu.np/wp-content/uploads/2019/01/IlPRL-logo-1.png" alt="Corpus Developement Software"><p class="today">${getToday()}</p><h1 class="assignment">Assignment (${assignment_type})</h2><p>Greetings <b>${assigned_to}</b> (${assigned_to_role}),</p><p class="justify">You’ve been assigned to ${assignment_type.toLowerCase()} the file <b>(${filename})</b>, starting from line number <b>${start_index}</b> and ending at <b>${end_index}</b>, further details of the file are as follows:</p><table><tr><th>File ID</th><th>No. of Sentences</th><th>Assigned To</th><th>Assigned By</th><th>Assigned Date</th><th>Deadline</th></tr><tr><td><b>${file_id}</b></td><td><b>${num_of_sentences}</b></td><td>${assigned_to}</td><td>${assigned_by}</td><td>${convertDate(Date.now())}</td><td class="deadline"><b>${convertDate(deadline)}</b></td></tr></table><p>You will find the assignment itself on your application Dashboard.</p><p>The due date to submit the assignment is: <b class="deadline" style="font-size: 18px; text-transform: uppercase;">${convertDate(deadline)}</b></p> <br> <br><h3>Assigned By:</h3><p>${assigned_by}</p><p>${assigned_by_email}</p><div class="copyright"> <script>document.write(new Date().toLocaleString('en',{month:'short',year:'numeric',day:'numeric'}));</script> <p>Corpus Development Software</p></div></body></html>`
}


function getToday() {
  const today = new Date;
  return today.toLocaleString('en', { month: 'short', year: 'numeric', day: 'numeric' })
}

function convertDate(date) {
  const ISOdate = new Date(date);
  return ISOdate.toLocaleString('en', { month: 'short', year: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
