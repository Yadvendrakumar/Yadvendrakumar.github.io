const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)], rm = matchMedia('(prefers-reduced-motion:reduce)').matches;

/* theme */
const root = document.documentElement;
try {
  root.dataset.theme = localStorage.getItem('yk-theme') || 'dark'
} catch(e) {}
$('#theme').onclick = () => {
  root.dataset.theme = root.dataset.theme == 'dark' ? 'light':'dark';
  try {
    localStorage.setItem('yk-theme', root.dataset.theme)
  } catch(e) {}
};

/* typing */
const roles = ['Full-Stack Developer', 'Software Developer', 'Web Developer'];
let ri = 0, ci = 0, del = 0;
(function t() {
  const w = roles[ri], el = $('#type');
  el.textContent = w.slice(0, ci);
  if(rm) {
    el.textContent = w;
    return
  }
  if(!del && ci == w.length) {
    del = 1;
    return setTimeout(t, 1600)
  }
  if(del && ci == 0) {
    del = 0;
    ri = (ri+1)%roles.length
  }
  ci += del ? -1:1;
  setTimeout(t, del ? 35:75)
})();

/* progress, cursor, tilt */
addEventListener('scroll', () => {
  $('#bar').style.width = scrollY/(document.body.scrollHeight-innerHeight)*100+'%'
});
const cur = $('#cur');
addEventListener('mousemove', e => {
  cur.style.opacity = 1;
  cur.style.left = e.clientX+'px';
  cur.style.top = e.clientY+'px'
});
$$('a,button,[data-tilt]').forEach(e => {
  e.onmouseenter = () => cur.classList.add('big');
  e.onmouseleave = () => cur.classList.remove('big')
});
if(!rm)$$('[data-tilt]').forEach(e => {
  e.addEventListener('mousemove', v => {
    const r = e.getBoundingClientRect(), x = (v.clientX-r.left)/r.width-.5, y = (v.clientY-r.top)/r.height-.5;
    e.style.transform = `perspective(900px) rotateY(${x*14}deg) rotateX(${-y*14}deg) scale(1.02)`
  });
  e.addEventListener('mouseleave', () => e.style.transform = '')
});

/* reveal + counters */
const io = new IntersectionObserver(es => es.forEach(e => {
  if(!e.isIntersecting)return;
  e.target.classList.add('in');
  e.target.querySelectorAll('[data-n]').forEach(c => {
    const n = +c.dataset.n, d = +c.dataset.d || 0, s = performance.now();
    (function f(t) {
      const p = Math.min((t-s)/1200, 1);
      c.textContent = (n*p).toFixed(d);
      p<1 && requestAnimationFrame(f)
    })(s)
  });
  io.unobserve(e.target)
}), {
  threshold:.15
});
$$('.sec h2,.sec>div,.sec>ol,.sec>.proj,.sec>.cards').forEach(e => {
  e.classList.add('rv');
  io.observe(e)
});

/* filters */
$$('.filters button').forEach(b => b.onclick = () => {
  $$('.filters button').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  $$('.pc').forEach(c => c.classList.toggle('hide', b.dataset.f != 'all' && c.dataset.t != b.dataset.f))
});

/* three.js hero background */
if(window.THREE && !rm) {
  const cv = $('#bg'), R = new THREE.WebGLRenderer({
    canvas:cv, alpha:true, antialias: innerWidth >= 860
  }), S = new THREE.Scene(), C = new THREE.PerspectiveCamera(60, 1, .1, 100);
  C.position.z = 7;
  const g = new THREE.Group();
  S.add(g);
  const m = (c, o) => new THREE.MeshBasicMaterial({
    color:c, wireframe:true, transparent:true, opacity:o
  });
  const a = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 1), m(0x3b6ff5, .35)), b = new THREE.Mesh(new THREE.TorusKnotGeometry(1, .28, innerWidth < 860 ? 70 : 120, innerWidth < 860 ? 10 : 16), m(0x5eb0ff, .5));
  g.add(a, b);
  const N = innerWidth < 860 ? 350 : 900, p = new Float32Array(N*3).map(() => (Math.random()-.5)*22), P = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(p, 3)), new THREE.PointsMaterial({
    color:0xd4af6a, size:.03
  }));
  S.add(P);
  b.scale.setScalar(1.7);
  const hp = $('.orbit'), k = Math.tan(Math.PI/6)*7;
  function fit() {
    const r = hp.getBoundingClientRect(), w = k*innerWidth/innerHeight;
    g.position.x = ((r.left+r.width/2)/innerWidth-.5)*2*w;
    g.position.y = -((r.top+r.height/2)/innerHeight-.5)*2*k;
    g.scale.setScalar(r.width*.5*2*k/innerHeight/2.6)
  }
  let mx = 0, my = 0;
  addEventListener('mousemove', e => {
    mx = e.clientX/innerWidth-.5;
    my = e.clientY/innerHeight-.5
  });
  const rs = () => {
    R.setSize(innerWidth, innerHeight);
    R.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 860 ? 1 : 1.5));
    C.aspect = innerWidth/innerHeight;
    C.updateProjectionMatrix()
  };
  rs();
  addEventListener('resize', rs);
  (function L() {
    if (document.hidden || scrollY > innerHeight * 1.3) {
      requestAnimationFrame(L);
      return;
    }

    a.rotation.y += .003;
    a.rotation.x += .0015;
    b.rotation.x += .006;
    b.rotation.y += .004;
    P.rotation.y += .0004;
    g.rotation.y += (mx*.8-g.rotation.y)*.04;
    g.rotation.x += (my*.6-g.rotation.x)*.04;
    fit();
    R.render(S, C);
    requestAnimationFrame(L)
  })()
}

/* Ask Me */
const KB = [[['project', 'built', 'work'], 'He has four projects: the International Conference Portal (live frontend), SPDS (Django ERP and LMS) and SmartFit Hub (Django REST fitness and diet app). The fourth is his Web Technology collection: 156 HTML files across five assignments plus three mini websites, on GitHub.'], [['skill', 'tech', 'stack', 'language'], 'Languages: Python, JavaScript, TypeScript, PHP, Java, SQL, HTML5, CSS3. Frameworks: Django, FastAPI, Next.js, Node.js, Express. Databases: Firebase, MongoDB, MySQL, SQLite. Tools: Git, GitHub, VS Code, PyCharm.'], [['web tech', 'assignment', 'practical', 'mini project', 'html file'], 'His Web Technology repository holds 156 HTML files across five assignments (first webpage, semantic HTML, tables, forms, blogs and college pages, JavaScript pages such as an online exam and calculator) plus three mini websites: ABC College, Online Shopping Store and City Care Hospital. Code: github.com/Yadvendrakumar/Web-Tech-Assignments.'], [['spds', 'student', 'erp', 'lms'], 'SPDS is a Django ERP and LMS portal with admin, teacher and student roles, QR-code attendance, work uploads, public profiles, analytics dashboards, leaderboards and quiz exports.'], [['smartfit', 'fitness', 'diet', 'gym'], 'SmartFit Hub is a fitness and diet app built with Django REST Framework and vanilla JS: JWT auth with roles, an Indian food database for TDEE plans, workout tracking, a water tracker and Chart.js analytics.'], [['conference', 'portal', 'college', 'live'], 'He built the frontend of the International Conference Portal, a live site for the college at conference.imedpune.org, working with the college team through Git and GitHub.'], [['education', 'study', 'mca', 'bca', 'college', 'cgpa', 'degree'], 'He is pursuing an MCA at Bharati Vidyapeeth IMED, Pune, and completed a BCA at Shri Rawatpura Sarkar University, Raipur, with a CGPA of 7.91.'], [['certif', 'course'], 'He holds a Web Development certification covering HTML, CSS, JavaScript, Django and Node.js.'], [['contact', 'email', 'phone', 'hire', 'reach', 'mail'], 'Email yashsahu11005@gmail.com, call +91 81037 45500, or use the contact form below. He is based in Raipur, Chhattisgarh.'], [['resume', 'cv'], 'Use the Download resume button at the top of the page to get his resume as a PDF.'], [['github', 'code'], 'His code is on github.com/Yadvendrakumar.'], [['who', 'about', 'yadvendra', 'you'], 'Yadvendra Kumar is a Full-Stack Developer and MCA student who builds registration workflows, dashboards and backends with Python, JavaScript and Django.'], [['location', 'where', 'live', 'based', 'city'], 'He is based in Raipur, Chhattisgarh, India, and studies in Pune.']];
const log = $('#log'), add = (t, c) => {
  const p = document.createElement('p');
  p.className = c;
  p.textContent = t;
  log.append(p);
  log.scrollTop = log.scrollHeight
};
const ask = q => {
  add(q, 'me');
  const l = q.toLowerCase(), h = KB.map(k => [k[1], k[0].filter(w => l.includes(w)).length]).sort((x, y) => y[1]-x[1])[0];
  setTimeout(() => add(h[1] ? h[0]:'I only know what is on this portfolio. Try asking about projects, skills, education, contact or the resume.', 'bot'), 350)
};
['What has he built?', 'Which skills?', 'Education', 'How to contact?'].forEach(q => {
  const b = document.createElement('button');
  b.textContent = q;
  b.onclick = () => ask(q);
  $('#chips').append(b)
});
$('#cf').onsubmit = e => {
  e.preventDefault();
  const v = $('#ci').value.trim();
  if(v) {
    ask(v);
    $('#ci').value = ''
  }
};

/* contact form */
$('#mail').onsubmit = async e => {
  e.preventDefault();
  const f = e.target, st = $('#st');
  if(f._honey.value)return;
  st.textContent = 'Sending…';
  try {
    const r = await fetch('https://formsubmit.co/ajax/yash23012026@gmail.com', {
      method:'POST', headers: {
        'Content-Type':'application/json', Accept:'application/json'
      }, body:JSON.stringify({
        name:f.name.value, email:f.email.value, message:f.message.value, _subject:'Portfolio message from '+f.name.value, _cc:'yashsahu11005@gmail.com', _template:'table'
      })
    });
    if(!r.ok)throw 0;
    st.textContent = 'Message sent. I will reply soon.';
    f.reset()
  } catch(x) {
    st.textContent = 'Could not send. Please email yashsahu11005@gmail.com directly.'
  }
};

/* command palette */
const cmds = [['Home', '#home'], ['About', '#about'], ['Skills', '#skills'], ['Projects', '#projects'], ['Experience', '#work'], ['Ask Me', '#ask'], ['Contact', '#contact'], ['Download resume', 'assets/Yadvendra_Kumar_Resume.pdf'], ['Open conference portal', 'https://conference.imedpune.org/'], ['GitHub profile', 'https://github.com/Yadvendrakumar'], ['Web Tech assignments', '#webtech'], ['Web Tech on GitHub', 'https://github.com/Yadvendrakumar/Web-Tech-Assignments']], pal = $('#pal'), pi = $('#pi'), pl = $('#pl');
let sel = 0, cur2 = cmds;
const draw = () => {
  pl.innerHTML = '';
  cur2.forEach((c, i) => {
    const li = document.createElement('li');
    li.textContent = c[0];
    if(i == sel)li.className = 'sel';
    li.onclick = () => go(c);
    pl.append(li)
  })
};
const go = c => {
  pal.hidden = true;
  c[1][0] == '#' ? (location.hash = c[1]):window.open(c[1], c[1].startsWith('http') ? '_blank':'_self')
};
const open = () => {
  pal.hidden = false;
  pi.value = '';
  cur2 = cmds;
  sel = 0;
  draw();
  pi.focus()
};
$('#kbtn').onclick = open;
pi.oninput = () => {
  cur2 = cmds.filter(c => c[0].toLowerCase().includes(pi.value.toLowerCase()));
  sel = 0;
  draw()
};
addEventListener('keydown', e => {
  if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() == 'k') {
    e.preventDefault();
    pal.hidden ? open():pal.hidden = true
  }
  if(pal.hidden)return;
  if(e.key == 'Escape')pal.hidden = true;
  if(e.key == 'ArrowDown') {
    sel = Math.min(sel+1, cur2.length-1);
    draw()
  }
  if(e.key == 'ArrowUp') {
    sel = Math.max(sel-1, 0);
    draw()
  }
  if(e.key == 'Enter' && cur2[sel])go(cur2[sel])
});
pal.onclick = e => {
  if(e.target == pal)pal.hidden = true
};

/* letters, marquee, spotlight, active nav */
const h1 = $('h1');
let li = 0;
h1.innerHTML = h1.innerHTML.split('<br>').map(w => '<span style="white-space:nowrap">'+[...w].map(ch => `<span class="l" style="--i:${li++}">${ch}</span>`).join('')+'</span>').join('<br>');
$('#mqt').innerHTML = [...Array(2)].map(() => ['Python', 'Django', 'FastAPI', 'Next.js', 'Node.js', 'TypeScript', 'JavaScript', 'Firebase', 'MongoDB', 'MySQL', 'Git', 'REST APIs'].map(t => `<span>${t}</span>`).join('')).join('');
$$('.cards article,.stats div,.chat').forEach(e => e.addEventListener('pointermove', v => {
  const r = e.getBoundingClientRect();
  e.style.setProperty('--mx', v.clientX-r.left+'px');
  e.style.setProperty('--my', v.clientY-r.top+'px')
}));
const so = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting)$$('#links a').forEach(a => a.classList.toggle('act', a.getAttribute('href') == '#'+e.target.id))
}), {
  rootMargin:'-45% 0px -50% 0px'
});
$$('main section').forEach(x => so.observe(x));
$('#top').onclick = () => scrollTo({
  top:0, behavior:rm ? 'auto':'smooth'
});
addEventListener('scroll', () => $('#top').classList.toggle('show', scrollY>500));

/* profile.js typing demo (runs only while visible) */
const codeEl = $('#code');
const CODE = [
  'const yadvendra = {',
  '  role: "Full-Stack Developer",',
  '  stack: ["Django", "Node.js", "JavaScript"],',
  '  projects: 4,',
  '  based: "Raipur, India",',
  '  openToWork: true',
  '};'
].join('\n');
const paint = t => codeEl.innerHTML = t.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/("[^"]*")/g, '<b class="s">$1</b>')
  .replace(/\b(const|true)\b/g, '<b class="k">$1</b>')
  .replace(/^(\s+)(\w+):/gm, '$1<b class="p">$2</b>:');
let pos = 0, timer = 0;

function tick() {
  paint(CODE.slice(0, pos));
  if (pos >= CODE.length) {
    pos = 0;
    timer = setTimeout(tick, 3200);
    return;
  }
  timer = setTimeout(tick, CODE[pos++] === '\n' ? 260 : 38);
}

if (rm) paint(CODE);
else new IntersectionObserver(es => es.forEach(e => {
  clearTimeout(timer);
  if (e.isIntersecting) tick();
})).observe(codeEl);

/* bar chart grows when it scrolls into view */
const chartIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    chartIO.unobserve(e.target);
  }
}), { threshold: .4 });
$$('.chart').forEach(c => chartIO.observe(c));
