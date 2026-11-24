/**
 * Sangeet Sadhana 2026 — Training Needs Assessment PDF receiver
 *
 * Paste this file into a Google Apps Script project and deploy it as a Web App.
 * The script saves one PDF per submission in the designated Drive folder.
 */
const DESTINATION_FOLDER_ID = '1ogj2ti1sbSyHF7Qn4NwYNhvtNv7PdA3I';

function doGet() {
  return ContentService
    .createTextOutput('Sangeet Sadhana TNA PDF receiver is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (payload && (payload.reportType === 'Session Report' || payload.reportType === 'Day Proceedings Report')) {\n      return handleReportSubmission(payload);\n    }\n    if (!payload || !payload.participantName || !payload.employeeCode || !Array.isArray(payload.rows)) {
      throw new Error('Required participant details or response rows are missing.');
    }

    const folder = DriveApp.getFolderById(DESTINATION_FOLDER_ID);
    const safeName = String(payload.participantName).replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'Participant';
    const safeCode = String(payload.employeeCode).replace(/[^a-z0-9._-]+/gi, '-').slice(0, 40) || 'No-Code';
    const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
    const fileName = 'Sangeet-Sadhana-TNA-' + safeName + '-' + safeCode + '-' + timestamp + '.pdf';

    const html = buildPdfHtml(payload);
    const pdfBlob = HtmlService.createHtmlOutput(html)
      .getBlob()
      .getAs(MimeType.PDF)
      .setName(fileName);
    const file = folder.createFile(pdfBlob);

    return jsonOutput({
      ok: true,
      message: 'PDF saved successfully.',
      fileName: fileName,
      fileUrl: file.getUrl()
    });
  } catch (err) {
    return jsonOutput({ ok: false, message: String(err && err.message || err) });
  }
}

function buildPdfHtml(payload) {
  const esc = value => String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const rows = payload.rows.map(row =>
    '<tr><th>' + esc(row[0]) + '</th><td>' + esc(row[1]) + '</td></tr>'
  ).join('');

  return '<!doctype html><html><head><meta charset="utf-8"><style>' +
    'body{font:10pt Arial,sans-serif;color:#172033;padding:24px}' +
    'h1{font-size:20pt;color:#172554;margin:0 0 5px}' +
    '.sub{color:#64748b;margin-bottom:20px;font-size:9pt}' +
    'table{width:100%;border-collapse:collapse}th,td{border:1px solid #dbe2ea;padding:7px;text-align:left;vertical-align:top}' +
    'th{width:31%;background:#f1f5f9;color:#172554}tr{page-break-inside:avoid}' +
    '.foot{margin-top:18px;color:#64748b;font-size:8pt}' +
    '</style></head><body>' +
    '<h1>Training Needs Assessment</h1>' +
    '<div class="sub">Sangeet Sadhana 2026 · KVS Mumbai Region · ZIET Mumbai · 23–27 November 2026</div>' +
    '<table>' + rows + '</table>' +
    '<div class="foot">Generated automatically from the participant-submitted online assessment.</div>' +
    '</body></html>';
}

function jsonOutput(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


/**
 * Stores Session Report / Day Proceedings Report submissions in the existing
 * Sangeet Sadhana Drive folder. The report is saved as a PDF; an uploaded
 * Word/PDF original is also retained when supplied.
 */
function handleReportSubmission(payload) {
  try {
    const required = ['participantName','workshopName','targetGroup','vidyalaya','region',
      'gender','socialCategory','differentlyAbled','submissionDate','sessionNo','facilitator'];
    required.forEach(key => {
      if (!String(payload[key] || '').trim()) throw new Error('Missing required field: ' + key);
    });
    if (!String(payload.reportText || '').trim() && !(payload.file && payload.file.base64)) {
      throw new Error('Please provide report text or upload a file.');
    }
    const folder = DriveApp.getFolderById(DESTINATION_FOLDER_ID);
    const clean = value => String(value || '').replace(/[^a-z0-9._-]+/gi,'-').replace(/^-+|-+$/g,'').slice(0,55) || 'Participant';
    const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
    const reference = 'SS-' + stamp + '-' + Math.floor(1000 + Math.random()*9000);
    const title = payload.reportType + ' — ' + payload.participantName;
    const esc = value => String(value == null ? '' : value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    const labels = [
      ['Name of the Participant','participantName'],['Name of the Workshop','workshopName'],
      ['Target Group','targetGroup'],['Vidyalaya','vidyalaya'],['Region','region'],
      ['Gender','gender'],['Social Category','socialCategory'],['Differently Abled','differentlyAbled'],
      ['Day & Date of Submission','submissionDate'],['Session No.','sessionNo'],['Facilitator','facilitator']
    ];
    const rows = labels.map(pair => '<tr><th>'+esc(pair[0])+'</th><td>'+esc(payload[pair[1]])+'</td></tr>').join('');
    const report = esc(payload.reportText || '').replace(/\n/g,'<br>');
    const html = '<html><head><meta charset="utf-8"><style>body{font:10pt Arial;color:#172033;padding:25px}h1{color:#172554;font-size:20pt}h2{color:#172554;margin-top:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #dbe2ea;padding:7px;text-align:left;vertical-align:top}th{width:32%;background:#f1f5f9}.report{line-height:1.55;white-space:normal}</style></head><body><h1>'+esc(title)+'</h1><p>Kendriya Vidyalaya Sangathan · ZIET Mumbai<br>Sangeet Sadhana · 23–27 November 2026<br>Submission Reference: '+esc(reference)+'</p><h2>Participant & Workshop Details</h2><table>'+rows+'</table><h2>Report</h2><div class="report">'+(report || 'Report submitted as an attached file.')+'</div></body></html>';
    const pdfName = clean(payload.reportType)+'-'+clean(payload.participantName)+'-'+stamp+'.pdf';
    const pdf = HtmlService.createHtmlOutput(html).getBlob().getAs(MimeType.PDF).setName(pdfName);
    const savedPdf = folder.createFile(pdf);
    let uploadedUrl = '';
    if (payload.file && payload.file.base64) {
      const bytes = Utilities.base64Decode(payload.file.base64);
      const blob = Utilities.newBlob(bytes, payload.file.mimeType || 'application/octet-stream', clean(payload.file.name || 'report-file'));
      uploadedUrl = folder.createFile(blob).getUrl();
    }
    return jsonOutput({ok:true,message:'Report submitted successfully.',reference:reference,fileUrl:savedPdf.getUrl(),uploadedFileUrl:uploadedUrl});
  } catch (err) {
    return jsonOutput({ok:false,message:String(err && err.message || err)});
  }
}
