/* ═══════════════════════════════════════════
   PUTYAHEARTINIT PASSION QUIZ ENGINE
   ═══════════════════════════════════════════ */
const QUIZ_QUESTIONS = [
  {category:"Creative Expression",q:"When you have free time, you're most likely to...",opts:["Make something — write, draw, record, design","Consume content — shows, music, social media","Connect — meet up, talk, build relationships","Plan and organize — strategize your next move"]},
  {category:"Creative Expression",q:"Which form of expression pulls at you most?",opts:["Music — sound is the universal language","Fashion — how you look is how you speak","Film and storytelling — life is a narrative","Writing — words outlast everything"]},
  {category:"Creative Expression",q:"Your creative style is...",opts:["Instinctive — I feel it out as I go","Structured — I plan it before I start","Collaborative — I build best with others","Experimental — I try everything and see what lands"]},
  {category:"Creative Expression",q:"A blank canvas makes you feel...",opts:["Excited — the possibilities are everywhere","Grounded — I already know what I want to create","Inspired — I'll let it tell me what it wants to be","Motivated — this is where real work begins"]},
  {category:"Hustle Style",q:"You do your best work...",opts:["Alone with deep focus and no interruptions","With a small trusted team that gets the vision","In a room full of energy and live collaboration","Wherever the inspiration hits — location is irrelevant"]},
  {category:"Hustle Style",q:"Your natural role when building something is...",opts:["The leader with the vision and the direction","The executor who gets it done no matter what","The connector who brings the right people together","The creative who brings the ideas nobody thought of"]},
  {category:"Hustle Style",q:"When you're deep in a project, what matters most?",opts:["The vision and the story it tells","The craft — every detail has to be right","The people — who is this for and does it serve them","The growth — what does this build toward"]},
  {category:"Hustle Style",q:"What would make you feel most successful in 5 years?",opts:["I built something people know and feel","I mastered a skill that's undeniable","I helped a lot of people change their lives","I'm financially free and building on my own terms"]},
  {category:"Core Values",q:"What drives you deeper than money?",opts:["Leaving a legacy that outlasts me","Having the freedom to live on my own terms","Making a real difference in someone's life","Being respected and recognized for what I do"]},
  {category:"Core Values",q:"You would give up a higher salary for...",opts:["Work that feels meaningful every single day","The freedom to do it completely my way","The chance to grow and learn something new","A strong community and culture around me"]},
  {category:"Core Values",q:"When you think about your purpose, you feel...",opts:["I'm here to create things that move people","I'm here to lead and build something bigger than me","I'm here to heal, teach, and help others rise","I'm here to innovate and change the way things work"]},
  {category:"Core Values",q:"Your dream life looks like...",opts:["Creating art that moves people across the world","Running a business I'm proud of every morning","Inspiring and coaching others to find their path","Building something that lasts long after I'm gone"]},
  {category:"Energy Type",q:"You recharge by...",opts:["Being alone with your thoughts and your craft","Being around energy and the right people","Getting into a deep creative flow state","Stepping back and thinking about the big picture"]},
  {category:"Energy Type",q:"Honestly, you're more...",opts:["Big picture visionary — the destination matters most","Detail-oriented executor — the work is in the details","Intuitive and feeling-led — you trust what you feel","Analytical and strategic — you think before you move"]},
  {category:"Energy Type",q:"Your heart is most lit up by...",opts:["Performing, expressing, and being fully seen","Building quietly and watching it come to life","Teaching, sharing, and watching others grow","Disrupting the norm and creating something new"]}
];

let quizStep = 0;
let quizAnswers = [];
const TOTAL_Q = QUIZ_QUESTIONS.length;
var __pyhi_shareText = '';

function quizStart() {
  document.getElementById('quizIntro').classList.remove('active');
  document.getElementById('quizProgressWrap').style.display = 'block';
  document.getElementById('quizRestartBtn').style.display = 'block';
  quizStep = 0;
  quizAnswers = [];
  buildQuizCards();
  setTimeout(function(){ showQuizCard(0); }, 50);
}

function buildQuizCards() {
  var container = document.getElementById('quizCards');
  container.innerHTML = '';
  QUIZ_QUESTIONS.forEach(function(q, i) {
    var card = document.createElement('div');
    card.className = 'quiz-card';
    card.id = 'quizQ' + i;
    card.innerHTML =
      '<div class="quiz-q-num">' + q.category + ' &middot; ' + (i+1) + ' of ' + TOTAL_Q + '</div>' +
      '<div class="quiz-question">' + q.q.toUpperCase() + '</div>' +
      '<div class="quiz-options">' +
        q.opts.map(function(o, j) {
          return '<button class="quiz-opt" onclick="quizAnswer(' + i + ',' + j + ',this)">' + o + '</button>';
        }).join('') +
      '</div>';
    container.appendChild(card);
  });
}

function showQuizCard(index) {
  var pct = Math.round((index / TOTAL_Q) * 100);
  document.getElementById('quizFill').style.width = pct + '%';
  document.getElementById('quizProgressTxt').textContent = 'Question ' + (index+1) + ' of ' + TOTAL_Q;
  document.querySelectorAll('.quiz-card').forEach(function(c){ c.classList.remove('active','exit'); });
  var card = document.getElementById('quizQ' + index);
  if (card) {
    card.classList.add('active');
    if (quizAnswers[index] !== undefined) {
      var opts = card.querySelectorAll('.quiz-opt');
      if (opts[quizAnswers[index]]) opts[quizAnswers[index]].classList.add('selected');
    }
  }
}

function quizAnswer(qIndex, optIndex, btn) {
  var card = document.getElementById('quizQ' + qIndex);
  card.querySelectorAll('.quiz-opt').forEach(function(b){ b.classList.remove('selected'); });
  btn.classList.add('selected');
  quizAnswers[qIndex] = optIndex;
  setTimeout(function() {
    card.classList.add('exit');
    setTimeout(function() {
      if (qIndex + 1 < TOTAL_Q) {
        quizStep = qIndex + 1;
        showQuizCard(quizStep);
      } else {
        showQuizGate();
      }
    }, 300);
  }, 280);
}

function showQuizGate() {
  document.getElementById('quizFill').style.width = '100%';
  document.getElementById('quizProgressTxt').textContent = 'All done. Unlock your results.';
  document.querySelectorAll('.quiz-card').forEach(function(c){ c.classList.remove('active','exit'); });
  setTimeout(function(){ document.getElementById('quizGate').classList.add('active'); }, 50);
}

async function quizGateSubmit(e) {
  e.preventDefault();
  var email = document.getElementById('quizEmail').value.trim();
  var btn = document.getElementById('quizGateBtn');
  if (!email) return;
  btn.textContent = 'Loading...';
  btn.disabled = true;
  document.getElementById('quizGate').classList.remove('active');
  setTimeout(function(){ document.getElementById('quizLoading').classList.add('active'); }, 50);
  var payload = {
    email: email,
    answers: quizAnswers.map(function(optIdx, qIdx) {
      return { question: QUIZ_QUESTIONS[qIdx].q, category: QUIZ_QUESTIONS[qIdx].category, answer: QUIZ_QUESTIONS[qIdx].opts[optIdx] };
    })
  };
  try {
    var res = await fetch('/api/quiz', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
    if (!res.ok) throw new Error('API error');
    var data = await res.json();
    showQuizResults(data);
  } catch(err) {
    showQuizResults({
      personality_type: 'THE HEART-LED CREATOR',
      tagline: 'You were built to make things that move people. The world needs what only you can make.',
      description: 'You operate at the intersection of instinct and vision. Your greatest gift is the ability to feel your way into something real. When you put your whole heart into your craft, something undeniable happens.',
      paths: [
        {title:'Creative Direction',description:'Shaping the visual and cultural identity of brands, artists, and movements.',why_it_fits:'Your instinct for aesthetics and storytelling is rare.'},
        {title:'Music Production',description:'Building sonic worlds that carry emotion and narrative at the same time.',why_it_fits:'You feel music before you think it.'},
        {title:'Brand Building',description:'Creating cultures, not just companies. Communities built around meaning.',why_it_fits:'You understand that the best brands are movements.'}
      ],
      pyhi_recommendation: 'The PUTYAHEARTINIT book was written for you. 17 chapters of exactly what you need to hear right now.',
      share_text: "Just took the PYHI Passion Finder and I'm a Heart-Led Creator. What are YOU gonna put ya heart in? putyaheartinit.com"
    });
  }
}

function showQuizResults(data) {
  document.getElementById('quizLoading').classList.remove('active');
  var pathsHtml = (data.paths||[]).map(function(p) {
    return '<div class="qr-path"><div class="qr-path-title">'+p.title+'</div><div class="qr-path-desc">'+p.description+'</div><div class="qr-path-why">'+p.why_it_fits+'</div></div>';
  }).join('');
  __pyhi_shareText = (data.share_text||'');
  document.getElementById('quizResults').innerHTML =
    '<div class="qr-type-label">Your PYHI Passion Profile</div>' +
    '<div class="qr-type">'+(data.personality_type||'')+'</div>' +
    '<div class="qr-tagline">&ldquo;'+(data.tagline||'')+'&rdquo;</div>' +
    '<div class="qr-desc">'+(data.description||'')+'</div>' +
    '<div class="qr-paths-label">Your Paths Forward</div>' +
    '<div class="qr-paths">'+pathsHtml+'</div>' +
    '<div class="qr-rec"><div class="qr-rec-label">PYHI Recommends</div><div class="qr-rec-txt">'+(data.pyhi_recommendation||'')+'</div></div>' +
    '<div class="qr-actions">' +
      '<button class="qr-share" onclick="quizShare()">Copy Share Text</button>' +
      '<button class="qr-retake" onclick="quizRestart()">Retake Quiz</button>' +
    '</div>' +
    '<div class="qr-copied" id="qrCopied">Copied to clipboard</div>';
  document.getElementById('quizProgressTxt').textContent = 'Your results are in.';
  document.getElementById('quizResultsCard').classList.add('active');
  setTimeout(function(){ document.getElementById('quizResults').classList.add('visible'); }, 100);
}

function quizShare() {
  navigator.clipboard.writeText(__pyhi_shareText).then(function() {
    var el = document.getElementById('qrCopied');
    if (el) { el.classList.add('show'); setTimeout(function(){ el.classList.remove('show'); }, 2500); }
  });
}

function quizRestart() {
  document.querySelectorAll('.quiz-card').forEach(function(c){ c.classList.remove('active','exit'); });
  document.getElementById('quizProgressWrap').style.display = 'none';
  document.getElementById('quizRestartBtn').style.display = 'none';
  document.getElementById('quizFill').style.width = '0%';
  quizStep = 0;
  quizAnswers = [];
  setTimeout(function(){ document.getElementById('quizIntro').classList.add('active'); }, 50);
}
