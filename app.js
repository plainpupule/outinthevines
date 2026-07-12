const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let favorites=JSON.parse(localStorage.getItem("oitv-favorites")||"[]");
let myDay=JSON.parse(localStorage.getItem("oitv-day")||"[]");
let activeFilter="all";
let matcher={};

function showView(id){
  $$(".view").forEach(v=>v.classList.remove("active"));
  const view=$("#"+id); if(view) view.classList.add("active");
  $$(".bottom-nav button").forEach(b=>b.classList.toggle("active",b.dataset.nav===id));
  if(id==="favorites") renderFavorites();
  if(id==="myday") renderDay();
  window.scrollTo({top:0,behavior:"smooth"});
}
function quickFilter(filter){ activeFilter=filter; showView("explore"); setTimeout(()=>{ $$("#filters button").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter)); renderExplore();},30); }
function card(w){
 const saved=favorites.includes(w.id);
 return `<article class="winery-card">
  <div class="card-image photo-card" style="background-image:linear-gradient(180deg,transparent 30%,rgba(22,10,18,.72)),url('${w.image}')" role="img" aria-label="${w.imageAlt}">
   <span>${w.icon}</span><button class="heart ${saved?"saved":""}" onclick="event.stopPropagation();toggleFavorite('${w.id}')">${saved?"♥":"♡"}</button>
  </div><div class="card-body"><div class="area">${w.area.toUpperCase()}</div><div class="card-welcome"><span>◆</span>${w.welcome?.designation||"Review in Progress"}</div><h3>${w.name}</h3><p><strong>${w.vibe}</strong></p><p>${w.short}</p>
  <div class="tags">${w.tags.slice(0,3).map(t=>`<span class="tag">${t}</span>`).join("")}</div>
  <div class="card-actions"><button onclick="openWinery('${w.id}')">View profile</button><button onclick="addToDay('${w.id}')">+ My Day</button></div></div></article>`;
}
function renderFeatured(){ $("#featuredWineries").innerHTML=WINERIES.map(card).join(""); }
function renderExplore(){
 const q=($("#searchInput")?.value||"").toLowerCase();
 const list=WINERIES.filter(w=>(activeFilter==="all"||w.tags.includes(activeFilter))&&(w.name+" "+w.vibe+" "+w.short+" "+w.tags.join(" ")).toLowerCase().includes(q));
 $("#exploreGrid").innerHTML=list.length?list.map(card).join(""):`<div class="empty"><span>🍇</span>No matches. Try another vibe.</div>`;
}
function toggleFavorite(id){
 favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];
 localStorage.setItem("oitv-favorites",JSON.stringify(favorites)); updateCounts(); renderFeatured(); renderExplore();
 if($("#favorites").classList.contains("active"))renderFavorites();
}
function updateCounts(){ $("#favCountTop").textContent=favorites.length; }
function renderFavorites(){
 const list=WINERIES.filter(w=>favorites.includes(w.id));
 $("#favoritesGrid").innerHTML=list.length?list.map(card).join(""):`<div class="empty"><span>♡</span><h2>No favorites yet</h2><p>Save a winery and Vinny will keep it here.</p><button class="primary" onclick="showView('explore')">Explore wineries</button></div>`;
}
function addToDay(id){
 if(myDay.includes(id)) return toast("Already in your day.");
 if(myDay.length>=3) return toast("Vinny says three stops is plenty. Remove one first.");
 myDay.push(id);localStorage.setItem("oitv-day",JSON.stringify(myDay));toast("Added to My Day.");
}
function removeDay(id){myDay=myDay.filter(x=>x!==id);localStorage.setItem("oitv-day",JSON.stringify(myDay));renderDay();}
function renderDay(){
 const list=myDay.map(id=>WINERIES.find(w=>w.id===id)).filter(Boolean);
 $("#dayList").innerHTML=list.length?list.map((w,i)=>`<div class="day-item"><div class="day-num">${i+1}</div><div><strong>${w.name}</strong><small style="display:block;color:#756a71">${w.area} · ${w.vibe}</small></div><button onclick="removeDay('${w.id}')">Remove</button></div>`).join("")+`<div class="notice">🐦 Vinny’s prototype route logic will eventually consider location, hours, reservations, and drive time.</div>`:`<div class="empty"><span>☷</span><h2>Your day is deliciously empty</h2><p>Add up to three wineries. We are planning a wine day, not speed dating.</p><button class="primary" onclick="showView('explore')">Find wineries</button></div>`;
}
function openWinery(id){
 const w=WINERIES.find(x=>x.id===id); if(!w)return;
 const hours=(w.hours||[]).map(h=>`<div class="hours-row"><b>${h[0]}</b><span>${h[1]}</span></div>`).join("");
 const events=(w.events||[]).map(e=>`<article class="profile-event"><span>${e.date}</span><div><small>${e.type}</small><h4>${e.title}</h4><p>${e.time}</p></div></article>`).join("");
 const known=(w.knownFor||[]).map(x=>`<span>${x}</span>`).join("");
 const amenities=(w.amenities||[]).map(x=>`<span>✓ ${x}</span>`).join("");
 const visitorNotes=(w.reviews?.visitors||[]).map(x=>`<li>${x}</li>`).join("");
 const reviewLinks=(w.reviews?.links||[]).map(x=>`<a href="${x[1]}" target="_blank" rel="noopener">${x[0]} ↗</a>`).join("");
 const p=w.planning||{};
 const t=w.theme||{name:"default",accent:"#7A2E6B",surface:"#F1E8D9",ink:"#241c24",display:"Playfair Display"};
 const quickFacts=(w.quickFacts||[]).map(q=>quickFact(q)).join("");
 const perfect=(w.perfectFor||[]).map(x=>`<span>${x}</span>`).join("");
 const skip=(w.skipIf||[]).map(x=>`<li>${x}</li>`).join("");
 const score=Object.entries(w.scorecard||{}).map(([k,v])=>scoreRow(k,v)).join("");
 $("#wineryDetail").innerHTML=`<div class="winery-profile theme-${t.name}" style="--profile-accent:${t.accent};--profile-surface:${t.surface};--profile-ink:${t.ink};--profile-display:'${t.display}'">
  <div class="winery-hero photo-hero themed-hero" style="background-image:linear-gradient(180deg,rgba(20,10,18,.05),rgba(20,10,18,.82)),url('${w.image}')" role="img" aria-label="${w.imageAlt}">
   <div class="hero-ornament"></div>
   <div class="winery-hero-content"><button class="back" onclick="showView('explore')">← Back to explore</button><p class="eyebrow gold">${w.area.toUpperCase()}</p><h1>${w.name}</h1><p>${w.vibe}</p>
   <div class="profile-hero-actions"><button onclick="toggleFavorite('${w.id}')">${favorites.includes(w.id)?"♥ Saved":"♡ Save"}</button><button onclick="addToDay('${w.id}')">+ My Day</button><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(w.address)}" target="_blank" rel="noopener">Directions ↗</a></div></div></div>
  <div class="profile-welcome-strip"><button class="profile-welcome-badge" onclick="scrollProfile('welcome-profile')"><div class="welcome-icon"><img src="assets/brand/vinny-pride.png" alt=""></div><div class="welcome-copy"><small>${w.welcome?.recognition||"WELCOME INDEX™"}</small><strong>${w.welcome?.designation||"Review in Progress"}</strong><span>${w.welcome?.confidence||"Low"} confidence · Reviewed ${w.welcome?.reviewed||w.lastVerified}</span></div><div class="welcome-arrow">See why →</div></button></div><div class="profile-nav themed-nav"><button onclick="scrollProfile('overview')">Overview</button><button onclick="scrollProfile('quick-look')">Quick Look</button><button onclick="scrollProfile('hours')">Hours</button><button onclick="scrollProfile('events-profile')">Events</button><button onclick="scrollProfile('reviews-profile')">Reviews</button><button onclick="scrollProfile('welcome-profile')">Welcome</button></div>

  <div class="profile-signature">${profileSignature(w)}</div>

  <div class="section rich-profile">
   <main>
    <section id="overview"><div class="verdict themed-verdict">🐦 “${w.verdict}”</div>
    <p class="profile-intro">${w.short}</p>
    <h2>Known for</h2><div class="known-for">${known}</div></section>

    <section id="quick-look" class="profile-section">
      <div class="profile-title"><div><p class="eyebrow plum">SCAN IT IN SECONDS</p><h2>Vinny Quick Look</h2></div></div>
      <div class="quick-facts-grid">${quickFacts}</div>
      <div class="fit-grid">
        <article><h3>Perfect for</h3><div class="perfect-pills">${perfect}</div></article>
        <article><h3>Maybe skip if…</h3><ul>${skip}</ul></article>
      </div>
      <h2>Vinny Scorecard</h2><div class="scorecard">${score}</div>
    </section>

    <section class="profile-section"><h2>Plan your visit</h2>
    <div class="planning-grid">
      <article><small>IDEAL VISIT</small><strong>${p.visitLength||"Check profile"}</strong></article>
      <article><small>RESERVATIONS</small><strong>${p.reservations||"Check official site"}</strong></article>
      <article><small>FOOD</small><strong>${p.food||"Varies"}</strong></article>
      <article><small>BEST TIME</small><strong>${p.bestTime||"Varies"}</strong></article>
    </div>
    <h2>What you’ll find</h2><div class="amenity-grid">${amenities}</div></section>

    <section id="hours" class="profile-section"><div class="profile-title"><div><p class="eyebrow plum">PLAN AHEAD</p><h2>Hours</h2></div><span>Verified ${w.lastVerified}</span></div>
    <div class="hours-table">${hours}</div><p class="profile-disclaimer">Hours can change for private events, holidays, weather, and seasonal service. Confirm with the winery before driving.</p></section>

    <section id="events-profile" class="profile-section"><div class="profile-title"><div><p class="eyebrow teal">WHAT’S HAPPENING</p><h2>Upcoming & recurring events</h2></div><a href="${w.eventsUrl}" target="_blank" rel="noopener">Official calendar ↗</a></div>
    <div class="events-list">${events}</div>
    <div class="dynamic-note"><strong>Prototype event feed:</strong> curated data lives in <code>data.js</code>. Production can use APIs, RSS/ICS, or an approved scheduled sync, always with a refreshed date and official-calendar fallback.</div></section>

    <section id="reviews-profile" class="profile-section"><p class="eyebrow gold">THE BIG PICTURE</p><h2>Review snapshot</h2>
    <div class="editorial-review themed-review"><strong>Out in the Vines editorial take</strong><p>${w.reviews?.editorial||""}</p></div>
    <h3>Patterns worth knowing</h3><ul class="visitor-notes">${visitorNotes}</ul>
    <div class="external-reviews">${reviewLinks}</div>
    <p class="profile-disclaimer">We link to major third-party platforms rather than copying changing star ratings into the prototype.</p></section>

    <section class="profile-section"><h2>Andrew & Antonio recommend</h2><div class="duo-grid">
      <article class="pick-card andrew"><span class="person">ANDREW</span><h3>${w.andrew}</h3><p>${w.andrewNote}</p></article>
      <article class="pick-card antonio"><span class="person">ANTONIO</span><h3>${w.antonio}</h3><p>${w.antonioNote}</p></article>
    </div></section>
   </main>

   <aside>
    <div id="welcome-profile" class="rating-box themed-rating detailed-welcome"><p class="eyebrow gold">${w.welcome?.recognition||"WELCOME INDEX™"}</p><h3>${w.welcome?.designation||"Review in Progress"}</h3><p>${w.welcome?.summary||"Assessment in progress."}</p><div class="confidence-line"><b>${w.welcome?.confidence||"Low"} confidence</b><span>Reviewed ${w.welcome?.reviewed||w.lastVerified}</span></div><div class="welcome-evidence">${(w.welcome?.evidence||[]).map(x=>`<span>✓ ${x}</span>`).join("")}</div><small>Prototype assessment content for interface demonstration.</small><button onclick="showView('methodology')">Read the Welcome Index</button></div>
    <div class="profile-side-card themed-side"><h3>First-visit essentials</h3><div class="fact-list">${w.facts.map(f=>`<div class="fact">✓ ${f}</div>`).join("")}</div></div>
    <div class="profile-side-card themed-side"><h3>Group note</h3><p>${p.groups||"Contact the winery for larger parties."}</p></div>
    <div class="profile-side-card themed-side"><h3>Official information</h3><a href="${w.source}" target="_blank" rel="noopener">Visit official winery page ↗</a><p>Last checked: ${w.lastVerified}</p></div>
    <p class="photo-disclosure">Photography shown is prototype imagery and is not represented as a photograph of this property.</p>
   </aside>
  </div>
 </div>`;
 showView("winery");
}
function scrollProfile(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});}
function quickFact(q){
 const [type,label,value,state]=q;
 const icons={pets:"🐶",food:"🍽️",music:"🎶",reservations:"📅",family:"👨‍👩‍👧",patio:"☀️",groups:"👥",access:"♿"};
 return `<article class="quick-fact state-${state}"><span>${icons[type]||"•"}</span><div><small>${label}</small><strong>${value}</strong></div></article>`;
}
function scoreRow(label,value){
 const labels={wine:"Wine",hospitality:"Hospitality",food:"Food",photos:"Photo-worthy",romance:"Romance",energy:"Energy",value:"Value",groups:"Groups"};
 return `<div class="score-row"><span>${labels[label]||label}</span><div>${[1,2,3,4,5].map(i=>`<i class="${i<=value?"on":""}"></i>`).join("")}</div><b>${value}/5</b></div>`;
}
function profileSignature(w){
 const signatures={
  leoness:`<div class="signature-estate"><span>ESTATE EXPERIENCE</span><strong>Vineyard elegance, designed to linger.</strong></div>`,
  akash:`<div class="signature-modern"><span>OPEN-AIR ENERGY</span><strong>Modern wine country with a social pulse.</strong></div>`,
  doffo:`<div class="signature-moto"><span>MOTO + MALBEC</span><strong>Family wine culture with horsepower.</strong></div>`,
  europa:`<div class="signature-european"><span>THREE VILLAGES</span><strong>A little Europe, one glass at a time.</strong></div>`,
  wilson:`<div class="signature-celebration"><span>POP THE ALMOND</span><strong>Built for celebrations, groups, and good news.</strong></div>`
 };
 return signatures[w.id]||"";
}
function scrollProfile(id){document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});}
function runMatcher(){
 const selections=Object.values(matcher);
 const ranked=WINERIES.map(w=>({w,score:selections.reduce((s,v)=>s+(v==="anything"||w.tags.includes(v)?1:0),0)})).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.w);
 $("#matchGrid").innerHTML=ranked.map(card).join("");$("#matchResults").classList.remove("hidden");$("#matchResults").scrollIntoView({behavior:"smooth"});
}
function renderPicks(){
 $("#picksGrid").innerHTML=WINERIES.map((w,i)=>`<article class="pick-card ${i%2?"antonio":"andrew"}"><span class="person">${i%2?"ANTONIO’S PLACEHOLDER PICK":"ANDREW’S PLACEHOLDER PICK"}</span><h3>${i%2?w.antonio:w.andrew}</h3><p>${w.name}<br>${i%2?w.antonioNote:w.andrewNote}</p><button onclick="openWinery('${w.id}')">Open winery →</button></article>`).join("");
}
function toast(msg){
 let t=document.createElement("div");t.textContent=msg;t.style.cssText="position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#241c24;color:white;padding:13px 18px;border-radius:999px;z-index:99;font-weight:700;box-shadow:0 12px 30px #0004";document.body.appendChild(t);setTimeout(()=>t.remove(),2200);
}
$$(".filter-row button").forEach(b=>b.addEventListener("click",()=>{activeFilter=b.dataset.filter;$$(".filter-row button").forEach(x=>x.classList.toggle("active",x===b));renderExplore();}));
$$(".choice-row button").forEach(b=>b.addEventListener("click",()=>{const row=b.parentElement;row.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");matcher[row.dataset.group]=b.dataset.value;}));
renderFeatured();renderExplore();renderPicks();updateCounts();renderDay();
if("serviceWorker"in navigator) navigator.serviceWorker.register("./service-worker.js");

const VIBE_LABELS={
  romantic:"Romantic escapes",
  reds:"Big-red destinations",
  sparkling:"Celebration-ready wineries",
  food:"Foodie-day favorites",
  social:"Live and lively stops",
  unique:"Something different",
  relaxed:"Lower-key hidden gems"
};

function startVibe(filter){
  const list=WINERIES.filter(w=>w.tags.includes(filter)).slice(0,3);
  const fallback=WINERIES.slice(0,3);
  document.getElementById("vibeTitle").textContent=VIBE_LABELS[filter]||"Your wine-day matches";
  document.getElementById("vibeGrid").innerHTML=(list.length?list:fallback).map(card).join("");
  document.getElementById("vibeResults").classList.remove("hidden");
  document.getElementById("vibeResults").scrollIntoView({behavior:"smooth",block:"start"});
}

function renderNearby(mode="quick"){
  const distances={leoness:3.2,akash:5.8,doffo:8.4,europa:6.1,wilson:4.5};
  let list=[...WINERIES];
  if(mode==="food") list=list.filter(w=>w.tags.includes("food"));
  if(mode==="welcome") list=list.sort((a,b)=>parseFloat(b.demoRating)-parseFloat(a.demoRating));
  else list=list.sort((a,b)=>distances[a.id]-distances[b.id]);
  const tips={
    open:"Prototype hours would be checked live in the production version.",
    food:"A real meal beats pretending four crackers were lunch.",
    quick:"Closest is helpful. Best fit is better.",
    welcome:"Welcome signals are shown with status and confidence, never as unexplained stars."
  };
  document.getElementById("nearbyTip").textContent=tips[mode]||tips.quick;
  document.getElementById("nearbyGrid").innerHTML=list.map(w=>`
    <article class="nearby-card">
      <div class="nearby-photo" style="background-image:linear-gradient(180deg,transparent,rgba(20,10,18,.7)),url('${w.image}')"></div>
      <div><span class="distance">${distances[w.id]} mi away</span><h3>${w.name}</h3><p>${w.vibe}</p>
      <div class="card-actions"><button onclick="openWinery('${w.id}')">Open</button><button onclick="addToDay('${w.id}')">+ My Day</button></div></div>
    </article>`).join("");
}

function renderPassport(){
  const visited=["leoness","akash"];
  document.getElementById("passportGrid").innerHTML=WINERIES.map(w=>`
    <article class="${visited.includes(w.id)?"visited":""}">
      <span>${visited.includes(w.id)?"✓":"○"}</span>
      <strong>${w.name}</strong>
      <small>${visited.includes(w.id)?"Visited":"Not yet"}</small>
    </article>`).join("");
}

const lastSips=[
  "The best tasting room is the one where you feel like you belong.",
  "Never rush a sunset tasting.",
  "Hydrate. Seriously.",
  "Cab Franc solves more problems than you’d think.",
  "The best bottle is the one shared with people you love."
];
const lastSipEl=document.getElementById("lastSip");
if(lastSipEl) lastSipEl.textContent="“"+lastSips[Math.floor(Math.random()*lastSips.length)]+"”";

renderNearby();
renderPassport();
