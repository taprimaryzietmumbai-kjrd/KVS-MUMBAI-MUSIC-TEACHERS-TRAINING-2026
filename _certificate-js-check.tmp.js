
const $=id=>document.getElementById(id);
const get=(k)=>{try{return JSON.parse(localStorage.getItem('sangeet_'+k)||'[]')}catch(e){return[]}};
const put=(k,v)=>localStorage.setItem('sangeet_'+k,JSON.stringify(v));
function showSection(id){document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.section===id));document.querySelectorAll('.section').forEach(x=>x.classList.toggle('active',x.id===id));}
const requestedSection=new URLSearchParams(location.search).get('section');if(requestedSection&&document.getElementById(requestedSection)){showSection(requestedSection);}
document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.nav').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.section').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.section).classList.add('active');}));
const days=[['Day 1','Monday · 23 November 2026'],['Day 2','Tuesday · 24 November 2026'],['Day 3','Wednesday · 25 November 2026'],['Day 4','Thursday · 26 November 2026'],['Day 5','Friday · 27 November 2026']];
$('days').innerHTML=days.map(d=>'<div class="day"><strong>'+d[0]+' — '+d[1]+'</strong><div class="muted">Session details and timings to be announced.</div></div>').join('');
function renderParticipants(){let a=get('participants');$('participantCount').textContent=a.length;$('participantRows').innerHTML=a.map((p,i)=>'<tr><td>'+esc(p.name)+'</td><td>'+esc(p.school)+'</td><td>'+esc(p.region)+'</td><td>'+esc(p.designation)+'</td><td><button class="btn danger" onclick="removeItem(\'participants\','+i+')">Remove</button></td></tr>').join('');$('participantEmpty').style.display=a.length?'none':'block'}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
$('participantForm').addEventListener('submit',e=>{e.preventDefault();let a=get('participants');a.push({name:$('pname').value,school:$('pschool').value,region:$('pregion').value,designation:$('pdesignation').value});put('participants',a);e.target.reset();$('pregion').value='Mumbai Region';$('pdesignation').value='Music Teacher';renderParticipants()});
function removeItem(k,i){let a=get(k);a.splice(i,1);put(k,a);renderAll()}
function csv(rows){let q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return rows.map(r=>r.map(q).join(',')).join('\r\n')}
function download(name,content){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8'}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
function exportParticipants(){let a=get('participants');download('music-training-participants.csv',csv([['Name','KV','Region','Designation'],...a.map(p=>[p.name,p.school,p.region,p.designation])]));}
function renderResources(){let a=get('resources');$('resourceList').innerHTML=a.map((r,i)=>'<div class="tile resource"><span class="tag">'+esc(r.type)+'</span><h3>'+esc(r.title)+'</h3><a href="'+esc(r.url)+'" target="_blank" rel="noopener">Open resource ↗</a><div class="actions"><button class="btn danger" onclick="removeItem(\'resources\','+i+')">Remove</button></div></div>').join('');$('resourceEmpty').style.display=a.length?'none':'block'}
$('resourceForm').addEventListener('submit',e=>{e.preventDefault();let a=get('resources');a.push({title:$('rtitle').value,type:$('rtype').value,url:$('rurl').value});put('resources',a);e.target.reset();renderResources()});
$('feedbackForm').addEventListener('submit',e=>{e.preventDefault();let a=get('reflections');a.push({name:$('fname').value,day:$('fday').value,learning:$('flearn').value,application:$('fapply').value});put('reflections',a);e.target.reset();renderReflections();alert('Reflection saved on this device. It has not been sent to the organisers.')});
function renderReflections(){let a=get('reflections');$('reflectionList').innerHTML=a.length?a.map((r,i)=>'<div class="day"><b>'+esc(r.day)+' · '+esc(r.name)+'</b><p>'+esc(r.learning)+'</p><small>'+esc(r.application)+'</small></div>').join(''):'No reflections saved on this device.'}
function exportReflections(){let a=get('reflections');download('music-training-reflections.csv',csv([['Name','Day','Learning','Application'],...a.map(r=>[r.name,r.day,r.learning,r.application])]));}
function renderGlimpses(){let a=get('glimpses');$('glimpseList').innerHTML=a.map((r,i)=>'<div class="tile resource"><h3>'+esc(r.title)+'</h3><a href="'+esc(r.url)+'" target="_blank" rel="noopener">Open link ↗</a><div class="actions"><button class="btn danger" onclick="removeItem(\'glimpses\','+i+')">Remove</button></div></div>').join('');$('glimpseEmpty').style.display=a.length?'none':'block'}
$('glimpseForm').addEventListener('submit',e=>{e.preventDefault();let a=get('glimpses');a.push({title:$('gtitle').value,url:$('gurl').value});put('glimpses',a);e.target.reset();renderGlimpses()});
const SANGEET_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwrpDbjAwYE06Gkl6qAvqd5pAzAEFHW-WKB-gcuaByGPWDclUI8mDCQWk9pHc-eBdUj/exec";
function openDatePicker(textId,pickerId){const text=$(textId),picker=$(pickerId);const m=text.value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);if(m)picker.value=m[3]+"-"+m[2]+"-"+m[1];if(typeof picker.showPicker==="function"){picker.showPicker();}else{picker.focus();picker.click();}}
function setDateFromPicker(pickerId,textId){const v=$(pickerId).value;if(v){const m=v.match(/^(\d{4})-(\d{2})-(\d{2})$/);if(m)$(textId).value=m[3]+"/"+m[2]+"/"+m[1];}}
function toDDMMYYYY(value){const m=String(value||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?m[3]+"/"+m[2]+"/"+m[1]:String(value||"");}
function formatDateDisplay(value){const m=String(value||"").match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?m[3]+"/"+m[2]+"/"+m[1]:String(value||"");}
function verifyProfile(){
 const code=$("verifyCode").value.trim(),dob=toDDMMYYYY($("verifyDOB").value),doj=toDDMMYYYY($("verifyDOJ").value);
 $("verifiedProfile").innerHTML="";
 if(!code||!dob||!doj){$("verifyStatus").textContent="Please enter Employee Code, DOB and DOJ in DD/MM/YYYY format.";return;}
 
 $("verifyStatus").textContent="Checking participant record…";
 const cb="sangeetCallback"+Date.now();
 window[cb]=function(data){
  delete window[cb];const old=document.getElementById("sangeetJsonp");if(old)old.remove();
  if(!data||!data.ok){$("verifyStatus").textContent=(data&&data.message)||"Verification failed.";return;}
  const p=data.profile||{};verifiedParticipantProfile=p;liveSelfieDataUrl='';capturedGps=null;$("verifyStatus").textContent="Participant record verified.";
  const fields=[["Participant Name",p.name],["Designation",p.designation],["Kendriya Vidyalaya",p.school],["KVS Region",p.region],["Employee Code",p.employeeCode],["Date of Birth",formatDateDisplay(p.dob)],["Date of Joining KVS",formatDateDisplay(p.doj)],["Gender",p.gender],["Social Category",p.category],["WhatsApp",p.whatsapp],["Personal Email ID",p.email||p.personalEmail||p.emailId],["Vidyalaya Official Email ID",p.officialEmail||p.vidyalayaEmail||p.vidyalayaMail],["Educational Qualification",p.education],["Target Group",p.targetGroup],["School Code",p.schoolCode],["District",p.district],["State",p.state],["Revenue Division",p.division],["Training Title",p.trainingTitle],["Training Dates",(p.trainingFrom||"")+" – "+(p.trainingTo||"")],["Training Days",p.trainingDays]];
  const bilingualRows=[["Participant Name",p.name,p.nameHindi],["Designation",p.designation,p.designationHindi],["Kendriya Vidyalaya",p.school,p.schoolHindi],["Target Group",p.targetGroup,p.targetGroupHindi]].filter(x=>String(x[2]||"").trim());
  $("verifiedProfile").innerHTML='<div class="tile" style="margin-top:14px"><span class="tag">Record matched</span><h3>'+esc(p.name||"Participant profile")+'</h3><div class="tablewrap"><table>'+fields.filter(x=>x[1]||x[0]==="Personal Email ID"||x[0]==="Vidyalaya Official Email ID").map(x=>'<tr><th>'+esc(x[0])+'</th><td>'+esc(x[1]||"Not available in the participant sheet")+(String(x[0]).includes("Email")&&x[1]?' <a href="mailto:'+esc(x[1])+'">Send email</a>':"")+'</td></tr>').join("")+'</table></div>'+(bilingualRows.length?'<h3 style="margin-top:18px">Bilingual details · As recorded in the sheet</h3><div class="tablewrap"><table><thead><tr><th>English record</th><th>Hindi record (हिंदी)</th></tr></thead><tbody>'+bilingualRows.map(x=>'<tr><td><b>'+esc(x[0])+'</b><br>'+esc(x[1]||"—")+'</td><td>'+esc(x[2])+'</td></tr>').join("")+'</tbody></table></div>':'')+'<small class="muted">'+esc(p.locationStatus||"")+'</small><div class="camera-box"><h3>Live selfie and GPS attendance details</h3><p class="muted">Select your salutation first. Then take a fresh selfie using the front camera only; gallery uploads are not accepted. GPS is captured only after you grant browser permission. The selfie will appear at the bottom of the same landscape A4 participant particulars PDF.</p><label for="participantSalutation">Salutation / संबोधन *</label><select id="participantSalutation" required><option value="">Select salutation</option><option value="Shri">Shri</option><option value="Smt.">Smt.</option><option value="Km. / सुश्री">Km. / सुश्री</option><option value="Dr.">Dr.</option></select><video id="selfieVideo" class="camera-preview" autoplay playsinline muted style="display:none"></video><img id="selfiePreview" class="camera-preview" alt="Captured live selfie preview" style="display:none"><canvas id="selfieCanvas" width="480" height="640" style="display:none"></canvas><div class="camera-actions"><button class="btn secondary" type="button" onclick="startSelfieCamera()">Open front camera</button><button class="btn secondary" type="button" onclick="captureLiveSelfie()" id="captureSelfieBtn" disabled>Capture selfie</button><button class="btn ghost" type="button" onclick="retakeLiveSelfie()" id="retakeSelfieBtn" style="display:none">Retake</button><button class="btn secondary" type="button" onclick="captureGpsLocation()">Capture GPS location</button></div><div id="selfieStatus" class="muted" aria-live="polite" style="margin-top:8px"></div><div id="gpsStatus" class="muted" aria-live="polite" style="margin-top:6px"></div><label style="display:flex;gap:8px;align-items:flex-start;font-weight:500"><input id="evidenceConsent" type="checkbox" style="width:auto;margin-top:4px"> I consent to including this live selfie and my current GPS location in my participant particulars PDF.</label><div class="actions"><button class="btn" type="button" onclick="submitSelfieGpsEvidence()" id="submitEvidenceBtn" disabled>Save the complete landscape A4 participant PDF</button></div><div id="evidenceSaveStatus" class="muted" aria-live="polite"></div></div></div>';
 };
 const s=document.createElement("script");s.id="sangeetJsonp";
 s.src=SANGEET_APPS_SCRIPT_URL+"?action=verify&employeeCode="+encodeURIComponent(code)+"&dob="+encodeURIComponent(dob)+"&doj="+encodeURIComponent(doj)+"&callback="+cb;
 s.onerror=function(){delete window[cb];$("verifyStatus").textContent="Could not reach the verification service. Please check deployment access and URL.";s.remove();};
 document.body.appendChild(s);
}
function saveParticipantPdf(){
 const code=$("verifyCode").value.trim(),dob=toDDMMYYYY($("verifyDOB").value),doj=toDDMMYYYY($("verifyDOJ").value);
 $("pdfSaveStatus").textContent="Preparing your one-page A4 portrait PDF…";
 const cb="sangeetPdfCallback"+Date.now();
 window[cb]=function(data){delete window[cb];const old=document.getElementById("sangeetPdfJsonp");if(old)old.remove();
  if(!data||!data.ok){$("pdfSaveStatus").textContent=(data&&data.message)||"PDF could not be saved.";return;}
  $("pdfSaveStatus").innerHTML="PDF saved successfully: <a href=\""+esc(data.fileUrl)+"\" target=\"_blank\" rel=\"noopener\">Open / download "+esc(data.fileName||"Participant PDF")+"</a>";
 };
 const s=document.createElement("script");s.id="sangeetPdfJsonp";
 s.src=SANGEET_APPS_SCRIPT_URL+"?action=saveProfilePdf&employeeCode="+encodeURIComponent(code)+"&dob="+encodeURIComponent(dob)+"&doj="+encodeURIComponent(doj)+"&callback="+cb;
 s.onerror=function(){delete window[cb];$("pdfSaveStatus").textContent="Could not reach the PDF service. Check the Apps Script deployment.";s.remove();};
 document.body.appendChild(s);
}
let verifiedParticipantProfile=null;
let liveSelfieDataUrl='';
let liveCameraStream=null;
let capturedGps=null;
async function startSelfieCamera(){
  try{
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error('Camera access is unavailable. Open this page over HTTPS in a modern browser.');
    stopSelfieCamera();
    liveCameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'user'},width:{ideal:640},height:{ideal:800}},audio:false});
    const video=$('selfieVideo');video.srcObject=liveCameraStream;video.style.display='block';
    $('selfiePreview').style.display='none';$('captureSelfieBtn').disabled=false;
    $('selfieStatus').textContent='Front camera is active. Keep your face centred and tap Capture selfie.';
  }catch(err){$('selfieStatus').textContent='Camera could not be opened: '+(err.message||err);}
}
function stopSelfieCamera(){if(liveCameraStream){liveCameraStream.getTracks().forEach(t=>t.stop());liveCameraStream=null;}}
function captureLiveSelfie(){
  const video=$('selfieVideo');if(!liveCameraStream||!video.videoWidth){$('selfieStatus').textContent='Open the front camera first.';return;}
  const canvas=$('selfieCanvas'),ctx=canvas.getContext('2d'),targetRatio=3/4,sourceRatio=video.videoWidth/video.videoHeight;
  let sx=0,sy=0,sw=video.videoWidth,sh=video.videoHeight;
  if(sourceRatio>targetRatio){sw=video.videoHeight*targetRatio;sx=(video.videoWidth-sw)/2;}else{sh=video.videoWidth/targetRatio;sy=(video.videoHeight-sh)/2;}
  canvas.width=480;canvas.height=640;ctx.drawImage(video,sx,sy,sw,sh,0,0,480,640);
  liveSelfieDataUrl=canvas.toDataURL('image/jpeg',0.68);
  $('selfiePreview').src=liveSelfieDataUrl;$('selfiePreview').style.display='block';video.style.display='none';
  stopSelfieCamera();$('captureSelfieBtn').disabled=true;$('retakeSelfieBtn').style.display='inline-block';
  $('selfieStatus').textContent='Live selfie captured on this device.';updateEvidenceSubmitState();
}
function retakeLiveSelfie(){liveSelfieDataUrl='';$('selfiePreview').removeAttribute('src');$('selfiePreview').style.display='none';$('retakeSelfieBtn').style.display='none';$('selfieStatus').textContent='Please capture a fresh selfie.';updateEvidenceSubmitState();startSelfieCamera();}
function captureGpsLocation(){
  if(!navigator.geolocation){$('gpsStatus').textContent='This browser does not support GPS location.';return;}
  $('gpsStatus').textContent='Requesting location permission…';
  navigator.geolocation.getCurrentPosition(pos=>{
    capturedGps={latitude:pos.coords.latitude,longitude:pos.coords.longitude,accuracy:pos.coords.accuracy,capturedAt:new Date(pos.timestamp||Date.now()).toISOString()};
    $('gpsStatus').textContent='GPS captured. Accuracy approximately '+Math.round(pos.coords.accuracy)+' metres.';updateEvidenceSubmitState();
  },err=>{$('gpsStatus').textContent='Location not captured: '+(err.code===1?'Permission denied. Please allow location access in browser settings.':err.message);capturedGps=null;updateEvidenceSubmitState();},{enableHighAccuracy:true,timeout:20000,maximumAge:0});
}
function updateEvidenceSubmitState(){const b=$('submitEvidenceBtn');if(b)b.disabled=!(liveSelfieDataUrl&&capturedGps&&$('participantSalutation')&&$('participantSalutation').value&&$('evidenceConsent')&&$('evidenceConsent').checked);}
document.addEventListener('change',e=>{if(e.target&&(e.target.id==='evidenceConsent'||e.target.id==='participantSalutation'))updateEvidenceSubmitState();});
window.addEventListener('message',e=>{
  if(!e.data||e.data.type!=='SANGEET_EVIDENCE_RESULT')return;
  const d=e.data.data||{};$('submitEvidenceBtn').disabled=false;
  if(d.ok&&d.fileUrl)$('evidenceSaveStatus').innerHTML='Participant PDF saved: <a target="_blank" rel="noopener" href="'+esc(d.fileUrl)+'">Open / download PDF</a>';
  else $('evidenceSaveStatus').textContent='Unable to save PDF: '+(d.message||'Please try again.');
});
function submitSelfieGpsEvidence(){
  if(!verifiedParticipantProfile){$('evidenceSaveStatus').textContent='Please verify your participant record again.';return;}
  if(!liveSelfieDataUrl||!capturedGps||!$('evidenceConsent').checked){$('evidenceSaveStatus').textContent='Capture the selfie and GPS location and give consent.';return;}
  $('submitEvidenceBtn').disabled=true;$('evidenceSaveStatus').textContent='Creating your single landscape A4 participant particulars PDF with selfie and GPS…';
  const payload={action:'saveProfileEvidence',employeeCode:$('verifyCode').value.trim(),dob:toDDMMYYYY($('verifyDOB').value),doj:toDDMMYYYY($('verifyDOJ').value),evidence:{salutation:$('participantSalutation').value,selfieData:liveSelfieDataUrl,...capturedGps}};
  let frame=$('sangeetEvidenceFrame');if(!frame){frame=document.createElement('iframe');frame.name='sangeetEvidenceFrame';frame.id='sangeetEvidenceFrame';frame.style.display='none';document.body.appendChild(frame);}
  const form=document.createElement('form');form.method='POST';form.action=SANGEET_APPS_SCRIPT_URL;form.target='sangeetEvidenceFrame';form.style.display='none';
  const input=document.createElement('input');input.type='hidden';input.name='payload';input.value=JSON.stringify(payload);form.appendChild(input);document.body.appendChild(form);form.submit();form.remove();
}
function generateCertificatePassword(){
 const surname=String($('certSurname').value||'').trim().split(/\s+/).filter(Boolean).pop()||'';
 const year=String($('certYOJ').value||'').replace(/\D/g,'');
 const phone=String($('certWhatsApp').value||'').replace(/\D/g,'').slice(-4);
 const email=String($('certEmail').value||'').trim().split('@')[0];
 const cleanSurname=surname.toLowerCase().replace(/[^a-z]/g,'');
 const cleanEmail=email.toLowerCase().replace(/\s+/g,'');
 const ready=/^\d{4}$/.test(year)&&/^\d{4}$/.test(phone)&&cleanSurname&&cleanEmail;
 $('certPassword').value=ready?cleanSurname+year+phone+cleanEmail:'';
}
function openParticipantCertificate(){
 generateCertificatePassword();
 const password=$('certPassword').value;
 if(!password){$('certStatus').textContent='Please complete all four fields. Year of Joining and WhatsApp ending must each contain four digits.';return;}
 $('certStatus').textContent='Checking the participant record and searching for the matching certificate image…';
 const url=SANGEET_APPS_SCRIPT_URL+'?action=certificate&password='+encodeURIComponent(password);
 const win=window.open(url,'_blank');
 if(win)win.opener=null;
 if(!win){$('certStatus').textContent='Your browser blocked the certificate tab. Please allow pop-ups for this website and try again.';return;}
 $('certStatus').textContent='Certificate request opened in a new tab. If no matching certificate is found, check the spelling of the surname and the other details.';
}
function refreshParticipantCount(){
 const el=$('participantCount');
 el.textContent='…';
 const cb='sangeetCountCallback'+Date.now();
 let finished=false;
 const cleanup=()=>{const node=$('sangeetCountJsonp');if(node)node.remove();try{delete window[cb]}catch(e){}};
 const timer=setTimeout(()=>{if(finished)return;finished=true;cleanup();el.textContent='—';el.title='Could not load the count from the official participant sheet.';},15000);
 window[cb]=function(data){
  if(finished)return;finished=true;clearTimeout(timer);cleanup();
  if(data&&data.ok&&Number.isFinite(Number(data.count))){el.textContent=String(Number(data.count));el.title='Live count from LOP PRTM MUMBAI / PRTM MUMBAI';}
  else{el.textContent='—';el.title=(data&&data.message)||'Count unavailable from the participant sheet.';}
 };
 const s=document.createElement('script');s.id='sangeetCountJsonp';
 s.src=SANGEET_APPS_SCRIPT_URL+'?action=participantCount&callback='+encodeURIComponent(cb);
 s.onerror=function(){if(finished)return;finished=true;clearTimeout(timer);cleanup();el.textContent='—';el.title='Could not reach the participant count service.';};
 document.body.appendChild(s);
}
function renderAll(){renderParticipants();renderResources();renderReflections();renderGlimpses()}
renderAll();
refreshParticipantCount();
const savedUrl=localStorage.getItem('sangeet_service_url');if(savedUrl)$('appsScriptUrl').value=savedUrl;
