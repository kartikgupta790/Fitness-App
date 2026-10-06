/* Pulse - Fitness Tracker | app.js
   Sections are numbered. Search for "=====" to jump between them. */

/* ===== 1. SMALL HELPERS =====
   $('#id') finds one element, $$('.class') finds all of them. */
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
/* ===== 2. DATA: EXERCISES, PLANS, FEATURES =====
   EXERCISE LIBRARY - one exercise per line: Name|Muscle|Equipment|How-to tip
   To add an exercise, add a new line in the same format. */
const EX =
  `Barbell Squat|Legs|Barbell|Bar on upper back, sit hips back and down, drive up through mid-foot.
Goblet Squat|Legs|Dumbbell|Hold a dumbbell at your chest and squat between your knees.
Bodyweight Squat|Legs|None|Feet shoulder-width, sit down until thighs are parallel, stand tall.
Lunge|Legs|None|Step forward, lower back knee toward the floor, push back to start.
Romanian Deadlift|Legs|Barbell|Soft knees, hinge at hips, bar slides down thighs, squeeze glutes up.
Leg Press|Legs|Machine|Feet shoulder-width on platform, lower with control, press without locking knees.
Glute Bridge|Legs|None|Lie on your back, drive hips up, pause and squeeze at the top.
Deadlift|Back|Barbell|Flat back, bar over mid-foot, push the floor away and stand up.
Bench Press|Chest|Barbell|Shoulder blades tucked, lower bar to mid-chest, press straight up.
Incline DB Press|Chest|Dumbbell|Bench at 30 degrees, press dumbbells up and slightly together.
Dumbbell Fly|Chest|Dumbbell|Soft elbows, open arms wide, squeeze chest to bring weights together.
Push-up|Chest|None|Body in a straight line, lower chest to the floor, press away.
Overhead Press|Shoulders|Barbell|Brace your core, press bar overhead, head through at the top.
Lateral Raise|Shoulders|Dumbbell|Lift dumbbells out to the sides to shoulder height, lower slowly.
Pike Push-up|Shoulders|None|Hips high in an inverted V, lower head toward the floor, press up.
Pull-up|Back|Bar|Hang, pull chest to the bar, lower fully with control.
Barbell Row|Back|Barbell|Hinge forward, pull bar to your belly, squeeze shoulder blades.
Lat Pulldown|Back|Machine|Pull the bar to upper chest, elbows down, control the way up.
Dumbbell Row|Back|Dumbbell|One hand on bench, pull the dumbbell to your hip.
Bicep Curl|Arms|Dumbbell|Elbows pinned to your sides, curl up, lower slowly.
Tricep Dip|Arms|None|Hands on a bench edge, lower until elbows hit 90 degrees, press up.
Tricep Pushdown|Arms|Machine|Elbows tucked, push the handle down until arms are straight.
Plank|Core|None|Forearms down, body in one line, hold and breathe.
Crunch|Core|None|Lift shoulders off the floor, exhale at the top, lower slowly.
Hanging Leg Raise|Core|Bar|Hang from a bar, lift legs to hip height, lower with control.
Burpee|Cardio|None|Squat, kick back to plank, push-up, jump up with hands overhead.`
    .split("\n")
    .map((l) => {
      const [n, m, q, i] = l.split("|");
      return { n, m, q, i };
    });
/* WORKOUT PLANS - n: name, t: subtitle, k: color, d: list of [day name, [exercises]]
   Exercise names must match names in the library above. */
const PL = [
  {
    n: "3-day Full Body",
    t: "Beginner, 3 days a week",
    k: "#FF5A47",
    d: [
      ["Day A", ["Barbell Squat", "Bench Press", "Barbell Row", "Plank"]],
      ["Day B", ["Deadlift", "Overhead Press", "Lat Pulldown", "Crunch"]],
      ["Day C", ["Leg Press", "Incline DB Press", "Dumbbell Row", "Bicep Curl"]],
    ],
  },
  {
    n: "Push / Pull / Legs",
    t: "Intermediate, 3 days a week",
    k: "#7CF2C0",
    d: [
      ["Push", ["Bench Press", "Overhead Press", "Lateral Raise", "Tricep Pushdown"]],
      ["Pull", ["Pull-up", "Barbell Row", "Lat Pulldown", "Bicep Curl"]],
      ["Legs", ["Barbell Squat", "Romanian Deadlift", "Leg Press", "Glute Bridge"]],
    ],
  },
  {
    n: "Home Workout",
    t: "No equipment, 2 days a week",
    k: "#FF8FD0",
    d: [
      ["Upper", ["Push-up", "Pike Push-up", "Tricep Dip", "Plank"]],
      ["Lower", ["Bodyweight Squat", "Lunge", "Glute Bridge", "Burpee"]],
    ],
  },
];
/* FEATURE CARDS on the landing page: [icon, title, text, background color, text color] */
const FT = [
  [
    "🏋️",
    "Workout logger",
    "Log sets, reps and weight with a built-in rest timer.",
    "#2B2BFF",
    "#fff",
  ],
  ["📚", "Exercise library", "Search 26 moves by muscle or equipment.", "#7CF2C0"],
  ["📈", "Progress charts", "Bodyweight chart and automatic personal records.", "#FFE14D"],
  ["🗓️", "Ready-made plans", "Full body, push/pull/legs and home programs.", "#FF8FD0"],
  ["🔥", "Weekly streaks", "Train once a week and the streak keeps growing.", "#FF5A47"],
  ["💡", "Overload hints", "See your last numbers and what to try next.", "#7CF2C0"],
  ["⏰", "Reminders", "A daily nudge at the time you choose.", "#FFE14D"],
  ["📤", "Your data, yours", "Export everything as CSV or JSON, or erase it.", "#FF8FD0"],
];
/* ===== 3. SAVED DATA =====
   S holds everything: profile (p), finished workouts (hist), bodyweight log (bw),
   reminder (rem) and the workout in progress (cur). It is saved in the phone's localStorage. */
let S;
try {
  S = JSON.parse(localStorage.getItem("pulse"));
} catch (e) {}
S = S || {
  p: {
    goal: "Build muscle",
    age: 25,
    h: 170,
    lvl: "Beginner",
    eq: "Gym",
    unit: "kg",
    rest: 90,
    goalW: 3,
  },
  hist: [],
  bw: [],
  rem: { on: false, t: "18:00" },
};
const save = () => {
  try {
    localStorage.setItem("pulse", JSON.stringify(S));
  } catch (e) {}
};
/* Weight units: data is always stored in kg. U() converts for display, K() converts back,
   inc() is the suggested weight jump. */
const U = (k) => (S.p.unit == "kg" ? +(+k).toFixed(1) : +(k * 2.2046).toFixed(1)),
  K = (v) => (S.p.unit == "kg" ? +v : +v / 2.2046),
  inc = () => (S.p.unit == "kg" ? 2.5 : 5);
/* Current tab, rest-timer seconds left, rest-timer interval id */
let tab = "home",
  rt = 0,
  rti;
/* Dark / light mode toggle */
function theme() {
  const r = document.documentElement;
  const light = r.dataset.theme
    ? r.dataset.theme == "light"
    : !matchMedia("(prefers-color-scheme:dark)").matches;
  r.dataset.theme = light ? "dark" : "light";
  S.theme = r.dataset.theme;
  save();
}
if (S.theme) document.documentElement.dataset.theme = S.theme;
/* Small message at the top of the screen */
function toast(t) {
  const e = $("#toast");
  e.textContent = t;
  e.classList.add("on");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove("on"), 2200);
}
/* Pop-up box: modal(html) opens it, closeM() closes it */
function modal(h) {
  $("#mc").innerHTML = h;
  $("#modal").classList.add("on");
}
const closeM = () => $("#modal").classList.remove("on");
/* ===== 4. LANDING PAGE =====
   Fills the features, plans and ticker, and runs the rep counter in the hero. */
$("#feat").innerHTML = FT.map(
  (f) =>
    `<div class="f rv" style="background:${f[3]};color:${f[4] || "var(--ink)"}"><i>${f[0]}</i><h3>${f[1]}</h3>${f[2]}</div>`,
).join("");
$("#lp").innerHTML = PL.map(
  (p, i) =>
    `<div class="pl rv" style="--k:${p.k}"><h3>${p.n}</h3><p style="margin:.5rem 0 1rem">${p.t}</p><button class="g" onclick="launch('plans')">See plan</button></div>`,
).join("");
$("#tk").innerHTML = (EX.map((e) => e.n.toUpperCase()).join("  ✺  ") + "  ✺  ").repeat(2);
const io = new IntersectionObserver(
  (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
  { threshold: 0.15 },
);
$$(".rv").forEach((e) => io.observe(e));
let rc = 0;
function rep() {
  rc++;
  $("#rc").textContent = rc;
  $("#fg").style.strokeDashoffset = 565 - (565 * rc) / 12;
  if (rc >= 12) {
    $("#rb").textContent = "Set done! Go again";
    setTimeout(() => {
      rc = 0;
      $("#rc").textContent = 0;
      $("#fg").style.strokeDashoffset = 565;
      $("#rb").textContent = "Tap to count a rep";
    }, 1600);
  }
}
/* ===== 5. NAVIGATION =====
   TABS = the app menu. launch() opens the app, site() goes back to the landing page,
   go('tab') switches the app screen. */
const TABS = [
  ["home", "Home"],
  ["log", "Workout"],
  ["lib", "Exercises"],
  ["hist", "History"],
  ["prog", "Progress"],
  ["plans", "Plans"],
  ["me", "Profile"],
];
function launch(t) {
  $("#nl").classList.remove("on");
  $("#site").style.display = "none";
  $("#app").style.display = "block";
  $(".nb").textContent = "Dashboard";
  scrollTo(0, 0);
  go(t);
}
function site() {
  $("#nl").classList.remove("on");
  $("#app").style.display = "none";
  $("#site").style.display = "block";
  $(".nb").textContent = "Open app";
}
function jump(id) {
  site();
  setTimeout(() => {
    const e = document.getElementById(id);
    e && e.scrollIntoView({ behavior: "smooth" });
  }, 30);
  return false;
}
function go(t) {
  tab = t;
  $("#tabs").innerHTML =
    TABS.map(
      (x) => `<button class="${x[0] == t ? "on" : ""}" onclick="go('${x[0]}')">${x[1]}</button>`,
    ).join("") + `<button onclick="site()">Back to site</button>`;
  $("#view").innerHTML = V[t]();
  $("#view").style.animation = "none";
  $("#view").offsetWidth;
  $("#view").style.animation = "";
  if (t == "lib") filt();
}
/* ===== 6. CALCULATIONS ===== */
/* week start (Monday) of a date */
const ws = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x.getTime();
};
/* Weekly streak: number of weeks in a row with at least one workout */
function streak() {
  const s = new Set(S.hist.map((h) => ws(h.date)));
  let w = ws(Date.now()),
    n = 0;
  if (!s.has(w)) w = ws(w - 3 * 864e5);
  while (s.has(w)) {
    n++;
    w = ws(w - 3 * 864e5);
  }
  return n;
}
/* Total volume of a workout = sum of reps x weight */
const vol = (h) =>
  Math.round(h.ex.reduce((a, e) => a + e.sets.reduce((b, s) => b + s.r * s.w, 0), 0));
/* Hint under each exercise: last numbers + suggested next weight */
function hint(n) {
  for (let i = S.hist.length - 1; i >= 0; i--) {
    const e = S.hist[i].ex.find((x) => x.n == n);
    if (e && e.sets.length) {
      const b = e.sets.reduce((a, s) => (s.w >= a.w ? s : a));
      const w = U(b.w);
      return `Last time: ${w}${S.p.unit} x ${b.r}. Try ${+(w + inc()).toFixed(1)}${S.p.unit} today.`;
    }
  }
  return "First time? Start light and focus on form.";
}
/* Personal records: heaviest set for each exercise */
function prs() {
  const m = {};
  S.hist.forEach((h) =>
    h.ex.forEach((e) =>
      e.sets.forEach((s) => {
        if (!m[e.n] || s.w > m[e.n].w) m[e.n] = { w: s.w, r: s.r, d: h.date };
      }),
    ),
  );
  return m;
}
/* ===== 7. SCREENS =====
   Each function in V returns the HTML for one tab: home, log (workout), lib (exercises),
   hist (history), prog (progress), plans, me (profile). Edit the text/layout here. */
const V = {
  home() {
    const h = S.hist,
      wk = h.filter((x) => x.date >= ws(Date.now())),
      last = h[h.length - 1],
      days = ["M", "T", "W", "T", "F", "S", "S"],
      st = ws(Date.now());
    const on = days
      .map((d, i) => {
        const a = st + i * 864e5;
        return `<i class="${h.some((x) => new Date(x.date).toDateString() == new Date(a + 3600e3).toDateString()) ? "on" : ""}">${d}</i>`;
      })
      .join("");
    const bw = S.bw.length ? U(S.bw[S.bw.length - 1].w) + S.p.unit : "Not logged";
    return `<h2>Hi there, goal: ${S.p.goal.toLowerCase()}</h2><div class="stats"><div class="st" style="background:var(--a)"><b>${streak()}</b>week streak</div><div class="st" style="background:var(--d)"><b>${wk.length}</b>workouts this week</div><div class="st" style="background:var(--e)"><b>${h.length}</b>total workouts</div><div class="st" style="background:var(--b)"><b style="font-size:1.4rem">${bw}</b>bodyweight</div></div>
<div class="card"><b>This week</b><div class="dots">${on}</div><div class="bar"><i style="width:${Math.min(100, (wk.length / (S.p.goalW || 3)) * 100)}%"></i></div><small>${wk.length} of ${S.p.goalW || 3} workouts${wk.length >= (S.p.goalW || 3) ? " - goal reached! 🎯" : ""}</small></div>
<div class="card"><b>${S.cur ? "Workout in progress" : "Ready to train?"}</b><small>${last ? "Last: " + last.name + ", " + new Date(last.date).toLocaleDateString() : "Log your first workout to start your streak."}</small><br><button class="b" onclick="${S.cur ? "go('log')" : "startW()"}">${S.cur ? "Continue workout" : "Start workout"}</button> <button class="g" onclick="go('plans')">Pick a plan</button></div>`;
  },
  log() {
    const c = S.cur;
    if (!c)
      return `<h2>Workout</h2><div class="card">No workout running.<br><button class="b" style="margin-top:.8rem" onclick="startW()">Start empty workout</button><button class="g" onclick="go('plans')">Use a plan</button></div>`;
    return (
      `<h2>${c.name}</h2><p id="el" style="color:var(--mu)"></p>` +
      c.ex
        .map(
          (e, i) =>
            `<div class="card"><b>${e.n}</b><button class="x" onclick="rmEx(${i})" aria-label="Remove">✕</button><small>${hint(e.n)}</small>${e.sets.map((s, j) => `<div class="set"><i>${j + 1}</i><input type="number" inputmode="decimal" placeholder="reps" value="${s.r}" oninput="setV(${i},${j},'r',this.value)"><input type="number" inputmode="decimal" step="0.5" placeholder="${S.p.unit}" value="${s.w === "" ? "" : U(s.w)}" oninput="setV(${i},${j},'w',this.value)"><button class="ck ${s.d ? "on" : ""}" onclick="ck(${i},${j})" aria-label="Done">✓</button></div>`).join("")}<button class="g" onclick="addSet(${i})">+ Add set</button></div>`,
        )
        .join("") +
      `<select onchange="addEx(this.value)"><option value="">+ Add exercise</option>${EX.map((e) => `<option>${e.n}</option>`).join("")}</select><br><button class="b" onclick="finish()">Finish workout</button> <button class="g" onclick="cancelW()">Discard</button>`
    );
  },
  lib() {
    return `<h2>Exercises</h2><div class="row"><input id="q" placeholder="Search exercises" oninput="filt()"><select id="m" onchange="filt()"><option value="">All muscles</option>${[...new Set(EX.map((e) => e.m))].map((x) => `<option>${x}</option>`).join("")}</select><select id="eq" onchange="filt()"><option value="">All equipment</option>${[...new Set(EX.map((e) => e.q))].map((x) => `<option>${x}</option>`).join("")}</select></div><div id="ll"></div>`;
  },
  hist() {
    if (!S.hist.length)
      return `<h2>History</h2><div class="card">No workouts yet. Finish one and it shows up here.</div>`;
    return (
      `<h2>History</h2>` +
      S.hist
        .map((h, i) => ({ h, i }))
        .reverse()
        .map(
          ({ h, i }) =>
            `<div class="card"><details><summary><b>${h.name}</b> <span class="chip">${new Date(h.date).toLocaleDateString()}</span><small>${Math.round(h.dur / 60)} min, ${U(vol(h))}${S.p.unit} volume</small></summary>${h.ex.map((e) => `<p><b>${e.n}</b>: ${e.sets.map((s) => s.r + "x" + U(s.w)).join(", ")}</p>`).join("")}</details><button class="g" onclick="repeatW(${i})">Repeat</button><button class="g" onclick="delW(${i})">Delete</button></div>`,
        )
        .join("")
    );
  },
  prog() {
    const bw = S.bw.slice(-12),
      p = prs(),
      k = Object.keys(p);
    let ch = '<p style="color:var(--mu)">Log your weight to see a chart.</p>';
    if (bw.length > 1) {
      const v = bw.map((x) => U(x.w)),
        mn = Math.min(...v) - 1,
        mx = Math.max(...v) + 1,
        pt = v.map((y, i) => [20 + i * (300 / (v.length - 1)), 130 - ((y - mn) / (mx - mn)) * 110]);
      ch = `<svg class="ch" viewBox="0 0 340 150" width="100%"><path d="M${pt.map((a) => a.join(",")).join("L")}" fill="none" stroke="var(--a)" stroke-width="4" stroke-linecap="round"/>${pt.map((a, i) => `<circle cx="${a[0]}" cy="${a[1]}" r="5" fill="var(--b)"><title>${v[i]}${S.p.unit}</title></circle>`).join("")}<text x="4" y="14" fill="var(--mu)" font-size="11">${+mx.toFixed(1)}</text><text x="4" y="144" fill="var(--mu)" font-size="11">${+mn.toFixed(1)}</text></svg>`;
    }
    return `<h2>Progress</h2><div class="card"><b>Bodyweight</b>${ch}<div class="row"><input id="bwi" type="number" step="0.1" placeholder="Today's weight (${S.p.unit})"><button class="b" onclick="addBw()">Log weight</button></div></div><div class="card"><b>Personal records</b>${k.length ? k.map((n) => `<p>🏆 ${n}: <b>${U(p[n].w)}${S.p.unit} x ${p[n].r}</b> <small style="display:inline">est. 1RM ${U(p[n].w * (1 + p[n].r / 30))}${S.p.unit}</small></p>`).join("") : "<small>Finish a workout with weight to set your first record.</small>"}</div>`;
  },
  plans() {
    return (
      `<h2>Plans</h2>` +
      PL.map(
        (p) =>
          `<div class="card" style="border-left:8px solid ${p.k}"><b>${p.n}</b><small>${p.t}</small>${p.d.map((d, i) => `<p><b>${d[0]}:</b> ${d[1].join(", ")}</p><button class="g" onclick="startPlan(${PL.indexOf(p)},${i})">Start ${d[0]}</button>`).join("")}</div>`,
      ).join("")
    );
  },
  me() {
    const p = S.p,
      o = (a, v) => a.map((x) => `<option ${x == v ? "selected" : ""}>${x}</option>`).join("");
    return `<h2>Profile</h2><div class="card"><div class="row"><label>Goal<select onchange="pf('goal',this.value)">${o(["Lose fat", "Build muscle", "Stay fit"], p.goal)}</select></label><label>Level<select onchange="pf('lvl',this.value)">${o(["Beginner", "Intermediate"], p.lvl)}</select></label><label>Equipment<select onchange="pf('eq',this.value)">${o(["Gym", "Home", "Both"], p.eq)}</select></label><label>Units<select onchange="pf('unit',this.value);go('me')">${o(["kg", "lb"], p.unit)}</select></label><label>Age<input type="number" value="${p.age}" onchange="pf('age',this.value)"></label><label>Height (cm)<input type="number" value="${p.h}" onchange="pf('h',this.value)"></label><label>Rest timer (sec)<input type="number" value="${p.rest || 90}" onchange="pf('rest',this.value)"></label><label>Weekly goal (workouts)<input type="number" value="${p.goalW || 3}" onchange="pf('goalW',this.value)"></label></div></div>
<div class="card"><b>Reminders</b><small>Get a daily workout nudge while Pulse is open.</small><div class="row"><input type="time" value="${S.rem.t}" onchange="S.rem.t=this.value;save()"><button class="b" onclick="remind()">${S.rem.on ? "Turn off" : "Turn on"}</button></div></div>
<div class="card"><b>Your data</b><br><button class="g" onclick="exp('json')">Export JSON</button><button class="g" onclick="exp('csv')">Export CSV</button><button class="g" onclick="imp()">Import JSON</button><button class="g" onclick="wipe()">Delete all data</button></div><small style="color:var(--mu)">Not medical advice. Data is stored only on this device.</small>`;
  },
};
/* ===== 8. ACTIONS (buttons and logic) ===== */
/* Save a profile field */
function pf(k, v) {
  S.p[k] = v;
  save();
}
/* Exercise library search + filters */
function filt() {
  const q = ($("#q").value || "").toLowerCase(),
    m = $("#m").value,
    e = $("#eq").value,
    r = EX.filter(
      (x) => (!q || x.n.toLowerCase().includes(q)) && (!m || x.m == m) && (!e || x.q == e),
    );
  $("#ll").innerHTML = r.length
    ? r
        .map(
          (x) =>
            `<div class="card"><b>${x.n}</b> <span class="chip">${x.m}</span><span class="chip" style="background:var(--b)">${x.q}</span><small>${x.i}</small><button class="g" onclick="addEx('${x.n}',1)">Add to workout</button></div>`,
        )
        .join("")
    : '<div class="card">No match. Clear a filter or try another name.</div>';
}
/* Start a workout (empty, or with a list of exercises) */
function startW(name, names) {
  S.cur = {
    name: name || "Workout",
    start: Date.now(),
    ex: (names || []).map((n) => ({ n, sets: [0, 1, 2].map(() => ({ r: "", w: "", d: 0 })) })),
  };
  save();
  go("log");
}
/* Confirm box (replaces the browser's confirm(), which phones often block) */
function ask(msg, yes, label) {
  modal(
    `<p style="margin-bottom:1rem;font-weight:600">${msg}</p><button class="b" id="yy">${label || "Yes"}</button> <button class="g" onclick="closeM()">Cancel</button>`,
  );
  $("#yy").onclick = () => {
    closeM();
    yes();
  };
}
/* Start a day from a ready-made plan */
function startPlan(p, d) {
  const f = () => startW(PL[p].n + ": " + PL[p].d[d][0], PL[p].d[d][1]);
  S.cur ? ask("Replace your current workout?", f, "Replace") : f();
}
/* Add / remove exercises and sets in the current workout */
function addEx(n, fromLib) {
  if (!n) return;
  if (!S.cur) {
    startW("Workout", [n]);
    return toast(n + " added");
  }
  S.cur.ex.push({ n, sets: [0, 1, 2].map(() => ({ r: "", w: "", d: 0 })) });
  save();
  fromLib ? toast(n + " added") : go("log");
}
function rmEx(i) {
  S.cur.ex.splice(i, 1);
  save();
  go("log");
}
function addSet(i) {
  const s = S.cur.ex[i].sets,
    l = s[s.length - 1] || {};
  s.push({ r: l.r || "", w: l.w || "", d: 0 });
  save();
  go("log");
}
/* Save typed reps / weight into the workout */
function setV(i, j, k, v) {
  S.cur.ex[i].sets[j][k] = v === "" ? "" : k == "w" ? K(v) : +v;
  save();
}
/* Tick a set as done (starts the rest timer) */
function ck(i, j) {
  const s = S.cur.ex[i].sets[j];
  if (!s.d && !(s.r > 0)) return toast("Enter reps first");
  s.d = s.d ? 0 : 1;
  save();
  go("log");
  if (s.d) rest(+S.p.rest || 90, 1);
}
/* Rest timer: rest(seconds, true) starts it, rest(15) adds time, rest(0) skips */
function rest(n, start) {
  if (start) rt = n;
  else rt = n ? rt + n : 0;
  clearInterval(rti);
  const e = $("#rest");
  if (rt <= 0) {
    e.classList.remove("on");
    return;
  }
  e.classList.add("on");
  $("#rt").textContent = rt;
  rti = setInterval(() => {
    rt--;
    $("#rt").textContent = rt;
    if (rt <= 0) {
      clearInterval(rti);
      e.classList.remove("on");
      toast("Rest over. Next set!");
      navigator.vibrate && navigator.vibrate(200);
    }
  }, 1000);
}
/* Discard the workout in progress */
function cancelW() {
  ask(
    "Discard this workout?",
    () => {
      S.cur = null;
      save();
      rest(0);
      go("home");
    },
    "Discard",
  );
}
/* Finish the workout: save it, check for new PRs, show the summary */
function finish() {
  const c = S.cur,
    old = prs(),
    ex = c.ex
      .map((e) => ({
        n: e.n,
        sets: e.sets.filter((s) => s.d && s.r > 0).map((s) => ({ r: +s.r, w: +s.w || 0 })),
      }))
      .filter((e) => e.sets.length);
  if (!ex.length) return toast("Check off at least one set");
  const w = { date: Date.now(), name: c.name, dur: (Date.now() - c.start) / 1e3, ex },
    np = [];
  ex.forEach((e) => {
    const m = Math.max(...e.sets.map((s) => s.w));
    if (m > 0 && (!old[e.n] || m > old[e.n].w)) np.push(e.n);
  });
  S.hist.push(w);
  S.cur = null;
  save();
  rest(0);
  go("home");
  modal(
    `<h2 style="font-size:1.6rem">Workout complete! 🎉</h2><p style="margin:1rem 0">${Math.max(1, Math.round(w.dur / 60))} min, ${ex.reduce((a, e) => a + e.sets.length, 0)} sets, ${U(vol(w))}${S.p.unit} total volume.</p>${np.length ? `<p>🏆 New PR: <b>${np.join(", ")}</b></p>` : ""}<p>🔥 ${streak()} week streak</p><button class="b" style="margin-top:1rem" onclick="closeM()">Nice</button>`,
  );
}
/* History actions: repeat or delete an old workout */
function repeatW(i) {
  const h = S.hist[i];
  const f = () => {
    S.cur = {
      name: h.name,
      start: Date.now(),
      ex: h.ex.map((e) => ({ n: e.n, sets: e.sets.map((s) => ({ r: s.r, w: s.w, d: 0 })) })),
    };
    save();
    go("log");
    toast("Workout copied");
  };
  S.cur ? ask("Replace your current workout?", f, "Replace") : f();
}
function delW(i) {
  ask(
    "Delete this workout?",
    () => {
      S.hist.splice(i, 1);
      save();
      go("hist");
    },
    "Delete",
  );
}
/* Log bodyweight */
function addBw() {
  const v = +$("#bwi").value;
  if (!(v > 0)) return toast("Enter your weight");
  S.bw.push({ d: Date.now(), w: K(v) });
  save();
  go("prog");
  toast("Weight logged");
}
/* Daily reminder: turn on/off, then a timer checks the time every 15 seconds */
async function remind() {
  if (S.rem.on) {
    S.rem.on = false;
    save();
    return go("me");
  }
  try {
    if ("Notification" in window && Notification.permission == "default")
      await Notification.requestPermission();
  } catch (e) {}
  S.rem.on = true;
  save();
  go("me");
  toast("Reminder on for " + S.rem.t);
}
setInterval(() => {
  if (!S.rem.on) return;
  const n = new Date(),
    t = String(n.getHours()).padStart(2, "0") + ":" + String(n.getMinutes()).padStart(2, "0"),
    k = n.toDateString() + t;
  if (t == S.rem.t && S.rem.last != k) {
    S.rem.last = k;
    save();
    toast("Time to train! 💪");
    try {
      Notification.permission == "granted" &&
        new Notification("Pulse", { body: "Time for your workout!" });
    } catch (e) {}
  }
}, 15000);
setInterval(() => {
  const e = $("#el");
  if (e && S.cur) {
    const s = Math.floor((Date.now() - S.cur.start) / 1e3);
    e.textContent = "Time: " + Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }
}, 1000);
/* Export data as JSON or CSV, download / share it */
function exp(f) {
  let t;
  if (f == "json")
    t = JSON.stringify({ profile: S.p, workouts: S.hist, bodyweight: S.bw }, null, 1);
  else {
    t = "date,workout,exercise,set,reps,weight_kg\n";
    S.hist.forEach((h) =>
      h.ex.forEach((e) =>
        e.sets.forEach(
          (s, i) =>
            (t += `${new Date(h.date).toISOString().slice(0, 10)},"${h.name}","${e.n}",${i + 1},${s.r},${s.w}\n`),
        ),
      ),
    );
  }
  window._x = t;
  modal(
    `<h3>Export ${f.toUpperCase()}</h3><textarea readonly>${t.replace(/</g, "&lt;")}</textarea><br><button class="b" onclick="navigator.clipboard.writeText(window._x).then(()=>toast('Copied'),()=>toast('Select the text and copy'))">Copy</button> <button class="g" onclick="dl('${f}')">Download</button> <button class="g" onclick="closeM()">Close</button>`,
  );
}
function dl(f) {
  if (navigator.share) {
    const fl = new File([window._x], "pulse-data." + f, { type: "text/plain" });
    if (navigator.canShare && navigator.canShare({ files: [fl] }))
      return navigator.share({ files: [fl] }).catch(() => {});
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([window._x], { type: "text/plain" }));
  a.download = "pulse-data." + f;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
/* Delete all data */
function wipe() {
  ask(
    "Delete all workouts, weights and profile data? This cannot be undone.",
    () => {
      try {
        localStorage.removeItem("pulse");
      } catch (e) {}
      S = {
        p: {
          goal: "Build muscle",
          age: 25,
          h: 170,
          lvl: "Beginner",
          eq: "Gym",
          unit: "kg",
          rest: 90,
          goalW: 3,
        },
        hist: [],
        bw: [],
        rem: { on: false, t: "18:00" },
      };
      go("home");
      toast("All data deleted");
    },
    "Delete all",
  );
}
/* ===== 9. IMPORT BACKUP ===== */
function imp() {
  modal(
    `<h3>Import JSON backup</h3><p style="margin:.6rem 0"><small>Choose a file or paste the exported JSON. This replaces your current data.</small></p><input type="file" id="fi" accept=".json,application/json"><textarea id="ij" placeholder="Paste JSON here"></textarea><br><button class="b" onclick="doImp()">Import</button> <button class="g" onclick="closeM()">Cancel</button>`,
  );
  $("#fi").onchange = (e) => {
    const f = e.target.files[0];
    if (f) {
      const r = new FileReader();
      r.onload = () => ($("#ij").value = r.result);
      r.readAsText(f);
    }
  };
}
function doImp() {
  try {
    const d = JSON.parse($("#ij").value);
    if (!Array.isArray(d.workouts)) throw 0;
    S.hist = d.workouts;
    S.bw = d.bodyweight || [];
    S.p = Object.assign(S.p, d.profile || {});
    save();
    closeM();
    go("me");
    toast("Data imported");
  } catch (e) {
    toast("Invalid JSON file");
  }
}
