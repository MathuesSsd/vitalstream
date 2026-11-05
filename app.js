const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
let patients = [
 {id:1,name:"Alberto dos Santos",cpf:"123.456.789-00",age:35,phone:"(11) 99999-0001",email:"alberto@email.com",emergency:"(11) 98888-0001",bpm:100,status:"Normal",band:"VS-001",history:[120,100,90,100,95]},
 {id:2,name:"Maria da Silva",cpf:"987.654.321-00",age:37,phone:"(11) 99999-0002",email:"maria@email.com",emergency:"(11) 98888-0002",bpm:30,status:"Perigo",band:"VS-002",history:[90,80,60,80,90]},
 {id:3,name:"João Pereira",cpf:"456.123.789-00",age:52,phone:"(11) 99999-0003",email:"joao@email.com",emergency:"(11) 98888-0003",bpm:115,status:"Atenção",band:"VS-003",history:[88,95,105,110,115]},
 {id:4,name:"Ana Oliveira",cpf:"321.654.987-00",age:29,phone:"(11) 99999-0004",email:"ana@email.com",emergency:"(11) 98888-0004",bpm:82,status:"Normal",band:"VS-004",history:[78,80,85,83,82]},
 {id:5,name:"Carlos Souza",cpf:"741.852.963-00",age:64,phone:"(11) 99999-0005",email:"carlos@email.com",emergency:"(11) 98888-0005",bpm:48,status:"Perigo",band:"VS-005",history:[75,68,55,50,48]},
 {id:6,name:"Fernanda Lima",cpf:"852.963.741-00",age:41,phone:"(11) 99999-0006",email:"fernanda@email.com",emergency:"(11) 98888-0006",bpm:92,status:"Normal",band:"VS-006",history:[88,90,94,91,92]}
];
let currentPage="dashboard", nextId=7, selectedPatient=null, toastTimer;
const timeLabels=["10:10","10:15","10:20","10:25","10:30"];
function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2800)}
function statusClass(s){return s==="Atenção"?"Atenção":s}
function badge(s){return `<span class="status ${statusClass(s)}"><span>●</span>${s}</span>`}
function initials(n){return n.split(" ").slice(0,2).map(x=>x[0]).join("").toUpperCase()}
function patientCell(p){return `<div class="patient-cell"><span class="avatar">${initials(p.name)}</span>${p.name}</div>`}
function updateStats(){
 const normal=patients.filter(p=>p.status==="Normal").length, attention=patients.filter(p=>p.status==="Atenção").length, danger=patients.filter(p=>p.status==="Perigo").length;
 $("#activeWristbands").textContent=patients.length;$("#monitoredCount").textContent=patients.length;$("#alertCount").textContent=attention+danger;
 $("#normalCount").textContent=normal;$("#attentionCount").textContent=attention;$("#dangerCount").textContent=danger;$("#totalPatients").textContent=patients.length;
 const total=Math.max(patients.length,1), a=normal/total*100,b=attention/total*100;
 $(".donut-chart").style.background=`conic-gradient(var(--green) 0 ${a}%,var(--amber) ${a}% ${a+b}%,var(--red) ${a+b}% 100%)`;
}
function renderPriority(){
 const list=patients.filter(p=>p.status!=="Normal").sort((a,b)=>a.status==="Perigo"?-1:1).slice(0,4);
 $("#priorityRows").innerHTML=list.map(p=>`<tr><td>${patientCell(p)}</td><td>${p.age}</td><td><strong>${p.bpm} bpm</strong></td><td>${badge(p.status)}</td><td><button class="small-action" data-detail="${p.id}">Detalhes</button></td></tr>`).join("")||'<tr><td colspan="5">Nenhum alerta ativo.</td></tr>';
}
function renderPatients(){
 const q=$("#patientSearch").value.toLowerCase(), filter=$("#statusFilter").value;
 const list=patients.filter(p=>(p.name.toLowerCase().includes(q)||p.cpf.includes(q))&&(filter==="all"||p.status===filter));
 $("#patientRows").innerHTML=list.map(p=>`<tr><td>${patientCell(p)}</td><td>${p.age}</td><td><strong>${p.bpm} bpm</strong></td><td>${p.band}</td><td>${badge(p.status)}</td><td><button class="small-action" data-detail="${p.id}">Visualizar</button></td></tr>`).join("")||'<tr><td colspan="6">Nenhum paciente encontrado.</td></tr>';
 $("#patientResultCount").textContent=`Exibindo ${list.length} de ${patients.length} pacientes`;
}
function chartSvg(p){
 const vals=p.history, min=0,max=140, pts=vals.map((v,i)=>`${30+i*85},${130-(v-min)/(max-min)*105}`).join(" ");
 const color=p.status==="Perigo"?"#e5393f":p.status==="Atenção"?"#f2a51a":"#20a45a";
 return `<svg viewBox="0 0 400 170" role="img" aria-label="Gráfico de frequência cardíaca"><line x1="25" y1="25" x2="25" y2="132" stroke="#e5ebf4"/><line x1="25" y1="132" x2="380" y2="132" stroke="#e5ebf4"/><text x="2" y="30" class="chart-label">140</text><text x="7" y="82" class="chart-label">70</text><text x="12" y="135" class="chart-label">0</text><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${vals.map((v,i)=>`<circle cx="${30+i*85}" cy="${130-v/max*105}" r="4" fill="${color}"/>`).join("")}${timeLabels.filter((_,i)=>i%2===0).map((t,i)=>`<text x="${30+i*170}" y="153" class="chart-label">${t}</text>`).join("")}</svg>`;
}
function renderDetail(id){
 const p=patients.find(x=>x.id===id);if(!p)return;selectedPatient=id;
 const isDanger=p.status==="Perigo";
 $("#detailContent").innerHTML=`<article class="panel detail-card"><div class="detail-top"><div class="person-info"><div class="big-avatar ${isDanger?"danger":""}">●</div><div><h2>${p.name}</h2>${badge(p.status)}<p>Idade: ${p.age} anos · Pulseira ${p.band}</p></div></div><div class="current-bpm"><span>Frequência cardíaca atual</span><strong class="${isDanger?"danger-text":""}">${p.bpm} bpm</strong></div></div><div class="detail-grid"><div class="history-box"><h3>Últimas medições</h3>${p.history.slice(-3).reverse().map((v,i)=>`<div class="history-row"><span>${timeLabels[4-i]}</span><strong class="${v<50||v>120?"bpm-bad":"bpm-good"}">${v} bpm</strong></div>`).join("")}</div><div class="chart-box"><h3>Frequência cardíaca por período</h3>${chartSvg(p)}</div></div><div class="detail-footer"><button class="secondary-btn" id="editStatusBtn">Alterar situação (demo)</button></div></article>`;
 $("#editStatusBtn").addEventListener("click",()=>{const opts=["Normal","Atenção","Perigo"],next=opts[(opts.indexOf(p.status)+1)%3];p.status=next;renderDetail(id);updateStats();renderPriority();renderPatients();showToast(`Situação alterada para ${next} (simulação).`)});
}
function navigate(page){
 currentPage=page;const titles={dashboard:"Dashboard",patients:"Pacientes",register:"Cadastro do Paciente",details:"Detalhes do Paciente"};
 $("#pageTitle").textContent=titles[page];["dashboard","patients","register","details"].forEach(x=>$("#"+x+"Page").classList.toggle("hidden",x!==page));
 $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));$("#sidebar").classList.remove("open");
 if(page==="dashboard"){updateStats();renderPriority()}if(page==="patients")renderPatients();
}
function openApp(){ $("#loginView").classList.add("hidden");$("#appView").classList.remove("hidden");navigate("dashboard") }
$("#loginForm").addEventListener("submit",e=>{e.preventDefault();openApp();showToast("Bem-vindo ao VitalStream!")});
$("#togglePassword").addEventListener("click",()=>{const p=$("#loginPassword");p.type=p.type==="password"?"text":"password"});
$("#forgotPassword").addEventListener("click",()=>showToast("Recuperação de senha: funcionalidade ilustrativa."));
$("#logoutBtn").addEventListener("click",()=>{$("#appView").classList.add("hidden");$("#loginView").classList.remove("hidden");showToast("Você saiu do sistema.")});
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#notificationsBtn").addEventListener("click",()=>$("#notificationPanel").classList.toggle("hidden"));
$("#profileBtn").addEventListener("click",()=>showToast("Perfil da equipe — demonstração."));
$("#patientSearch").addEventListener("input",renderPatients);$("#statusFilter").addEventListener("change",renderPatients);
document.addEventListener("click",e=>{const btn=e.target.closest("[data-detail]");if(btn){renderDetail(Number(btn.dataset.detail));navigate("details")}});
$("#backToPatients").addEventListener("click",()=>navigate("patients"));
$("#patientForm").addEventListener("submit",e=>{
 e.preventDefault();const d=new FormData(e.currentTarget),name=d.get("name").trim(),cpf=d.get("cpf").trim();
 if(patients.some(p=>p.cpf===cpf)){showToast("Já existe um paciente com esse CPF.");return}
 const p={id:nextId++,name,cpf,age:Number(d.get("age")),phone:d.get("phone"),email:d.get("email"),emergency:d.get("emergency"),bpm:75+Math.floor(Math.random()*30),status:"Normal",band:"VS-"+String(nextId).padStart(3,"0"),history:[78,82,80,85,90]};
 patients.push(p);e.currentTarget.reset();updateStats();navigate("patients");showToast("Paciente cadastrado com sucesso!");
});
$("#patientForm").querySelector('[name="cpf"]').addEventListener("input",e=>{let v=e.target.value.replace(/\D/g,"").slice(0,11);v=v.replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2");e.target.value=v});
updateStats();
