const cursor = document.querySelector('.cursor');
const cursorInner = document.querySelector('.cursor-move-inner');
const cursorOuter = document.querySelector('.cursor-move-outer');

const trigger = document.querySelector('.projects');
const navTrigger = document.querySelectorAll("nav ul li");

let mouseX = 0;
let mouseY = 0;
let mouseA = 0;

let innerX = 0;
let innerY = 0;

let outerX = 0;
let outerY = 0;

let loop = null;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!loop) {
    loop = window.requestAnimationFrame(render);
  }
});

navTrigger.forEach(function(navItem){  
  navItem.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor--hover');
  });

  navItem.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor--hover');
});
})

trigger.addEventListener('mouseenter', () => {
  cursor.classList.add('cursor--hover');
});

trigger.addEventListener('mouseleave', () => {
  cursor.classList.remove('cursor--hover');
});

function render() {
  // stats.begin();

  loop = null;
  
  innerX = lerp(innerX, mouseX, 0.15);
  innerY = lerp(innerY, mouseY, 0.15);
  
  outerX = lerp(outerX, mouseX, 0.13);
  outerY = lerp(outerY, mouseY, 0.13);
  
  const angle = Math.atan2(mouseY - outerY, mouseX - outerX) * 180 / Math.PI;
  
  const normalX = Math.min(Math.floor((Math.abs(mouseX - outerX) / outerX) * 1000) / 1000, 1);
  const normalY = Math.min(Math.floor((Math.abs(mouseY - outerY) / outerY) * 1000) / 1000, 1);
  const normal  = normalX + normalY * .5;
  const skwish  = normal * .7;
    
  cursorInner.style.transform = `translate3d(${innerX}px, ${innerY}px, 0)`;
  cursorOuter.style.transform = `translate3d(${outerX}px, ${outerY}px, 0) rotate(${angle}deg) scale(${1 + skwish}, ${1 - skwish})`;
  
  // stats.end();
  
  // Stop loop if interpolation is done.
  if (normal !== 0) {
    loop = window.requestAnimationFrame(render);
  }
}

function lerp(s, e, t) {
  return (1 - t) * s + t * e;
}

var firebaseConfig = {
  apiKey: "AIzaSyDQzKhyLpr5l8d3FjaRWoVdHLO5UTwHKpw",
  authDomain: "birthdayexchange.firebaseapp.com",
  databaseURL: "https://birthdayexchange.firebaseio.com",
  projectId: "birthdayexchange",
  storageBucket: "birthdayexchange.appspot.com",
  messagingSenderId: "1029658259190",
  appId: "1:1029658259190:web:dddcea91172b3895e0c6d7"
};
firebase.initializeApp(firebaseConfig);

$(document).ready(function () {
  setupData();
  createFooter();
  
});

function createFooter(){
  var yearText = $("<div class='copyright'>Copyright &copy; " + new Date().getFullYear() + " Pratham Khurana </div>")
  $("footer").append(yearText)
}

function setupData() {
  var database = firebase.database();

  database.ref('title').once('value').then((snapshot) => {
    $(".main-title").text(snapshot.val())
  });

  database.ref('projects').once('value').then((snapshot) => {
    var projects = snapshot.val();
    projects.forEach(function (val) {
      createTitleElement(val["link"],  val["title"], val["img"])
    });

    if ($(".projects").children().length % 2 != 0) {
      $(".projects").children().last().css("width", "100%");
    }

    setHoverListener();
  });
}

function setHoverListener() {
  $(".project-title-holder").hover(function () {
    $(this).find(".project-title").css("color", "white");
    $(this).find(".project-title").css("opacity", "1");
    $(this).find(".project-title").css("background-color", "#000000");
    $(this).css("background-color", "#ffffffce");
  }, function () {
    $(this).find(".project-title").css("opacity", "0");
    $(this).css("background-color", "#00000000");
  });
}

function createTitleElement(link, title, backgroundImage) {
  var projectTitle = $("<div class='project-title'>" + title + "</div>")
  var holder = $("<div class='project-title-holder'></div>").append(projectTitle)
  var newProject = $("<span href='www.google.com' id='project'></span>").append(holder);
  newProject.css("background-image", "url(" + backgroundImage + ")");
  newProject.css("background-repeat", "no-repeat");
  newProject.css("background-size", "cover");
  newProject.css("background-position", "center")
  newProject.click(function(){
    var win = window.open(link, '_blank');
    if (win) {
        win.focus();
    } else {
        alert('Please allow popups for this website');
    }
  })
  $(".projects").append(newProject)
}