// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track Attendance
const attendance = {};
const maxCount = 50;

// Update attendance when team is selected

// Load counts and attendee lists from localStorage
function loadCounts() {
  const attendeeCount = document.getElementById("attendeeCount");
  const waterCount = document.getElementById("waterCount");
  const zeroCount = document.getElementById("zeroCount");
  const powerCount = document.getElementById("powerCount");
  const progressBar = document.getElementById("progressBar");
  const waterList = document.getElementById("waterList");
  const zeroList = document.getElementById("zeroList");
  const powerList = document.getElementById("powerList");

  const savedTotal = localStorage.getItem("attendeeCount");
  const savedWater = localStorage.getItem("waterCount");
  const savedZero = localStorage.getItem("zeroCount");
  const savedPower = localStorage.getItem("powerCount");
  const savedLists = localStorage.getItem("attendeeLists");

  attendeeCount.textContent = savedTotal ? savedTotal : "0";
  waterCount.textContent = savedWater ? savedWater : "0";
  zeroCount.textContent = savedZero ? savedZero : "0";
  powerCount.textContent = savedPower ? savedPower : "0";

  // Update progress bar
  const count = parseInt(attendeeCount.textContent);
  const percentage = Math.round((count / maxCount) * 100);
  progressBar.style.width = `${percentage}%`;

  // Load attendee lists
  waterList.innerHTML = "";
  zeroList.innerHTML = "";
  powerList.innerHTML = "";
  if (savedLists) {
    const lists = JSON.parse(savedLists);
    lists.water.forEach(function (att) {
      addAttendeeToList(att.name, "water", false);
    });
    lists.zero.forEach(function (att) {
      addAttendeeToList(att.name, "zero", false);
    });
    lists.power.forEach(function (att) {
      addAttendeeToList(att.name, "power", false);
    });
  }
}

// Save counts and attendee lists to localStorage
function saveCounts() {
  const attendeeCount = document.getElementById("attendeeCount").textContent;
  const waterCount = document.getElementById("waterCount").textContent;
  const zeroCount = document.getElementById("zeroCount").textContent;
  const powerCount = document.getElementById("powerCount").textContent;
  localStorage.setItem("attendeeCount", attendeeCount);
  localStorage.setItem("waterCount", waterCount);
  localStorage.setItem("zeroCount", zeroCount);
  localStorage.setItem("powerCount", powerCount);

  // Save attendee lists
  const waterList = document.getElementById("waterList");
  const zeroList = document.getElementById("zeroList");
  const powerList = document.getElementById("powerList");
  const lists = {
    water: [],
    zero: [],
    power: [],
  };
  waterList.querySelectorAll("li").forEach(function (li) {
    lists.water.push({ name: li.querySelector(".attendee-name").textContent });
  });
  zeroList.querySelectorAll("li").forEach(function (li) {
    lists.zero.push({ name: li.querySelector(".attendee-name").textContent });
  });
  powerList.querySelectorAll("li").forEach(function (li) {
    lists.power.push({ name: li.querySelector(".attendee-name").textContent });
  });
  localStorage.setItem("attendeeLists", JSON.stringify(lists));
}

// Add attendee to the correct team list in the DOM
function addAttendeeToList(name, team, save) {
  let listId = "";
  let emoji = "";
  let teamLabel = "";
  if (team === "water") {
    listId = "waterList";
    emoji = "🌊";
    teamLabel = "Team Water Wise";
  } else if (team === "zero") {
    listId = "zeroList";
    emoji = "🌿";
    teamLabel = "Team Net Zero";
  } else if (team === "power") {
    listId = "powerList";
    emoji = "⚡";
    teamLabel = "Team Renewables";
  }
  const attendeeList = document.getElementById(listId);
  const li = document.createElement("li");
  li.className = "attendee-list-item";
  li.setAttribute("data-team", team);
  li.innerHTML = `<span class=\"attendee-name\" style=\"font-weight:500;\">${name}</span> <span style=\"color:#64748b; font-size:14px;\">${emoji} ${teamLabel}</span>`;
  attendeeList.appendChild(li);
  if (save) {
    saveCounts();
  }
}

// Load counts on page load
window.addEventListener("DOMContentLoaded", loadCounts);

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // Update total attendee count
  const attendeeCount = document.getElementById("attendeeCount");
  attendeeCount.textContent = parseInt(attendeeCount.textContent) + 1;

  // Add attendee to the list and save
  addAttendeeToList(name, team, true);

  // Update progress bar
  const count = parseInt(attendeeCount.textContent);
  const progressBar = document.getElementById("progressBar");
  const percentage = Math.round((count / maxCount) * 100);
  progressBar.style.width = `${percentage}%`;

  // Show personalized greeting
  const greeting = document.getElementById("greeting");
  greeting.textContent = `🎉 Welcome, ${name} from ${teamName}!`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  // Celebration feature: when goal is reached
  if (count >= maxCount) {
    // Find winning team
    const water = parseInt(document.getElementById("waterCount").textContent);
    const zero = parseInt(document.getElementById("zeroCount").textContent);
    const power = parseInt(document.getElementById("powerCount").textContent);
    let winningTeam = "";
    let winningEmoji = "";
    if (water >= zero && water >= power) {
      winningTeam = "Team Water Wise";
      winningEmoji = "🌊";
    } else if (zero >= water && zero >= power) {
      winningTeam = "Team Net Zero";
      winningEmoji = "🌿";
    } else {
      winningTeam = "Team Renewables";
      winningEmoji = "⚡";
    }
    greeting.textContent = `🏆 Celebration! Attendance goal reached!\n${winningEmoji} ${winningTeam} has the most check-ins!`;
    greeting.classList.add("success-message");
    greeting.style.display = "block";
    greeting.style.backgroundColor = "#ffe066";
    greeting.style.color = "#003c71";
    greeting.style.fontSize = "22px";
    greeting.style.fontWeight = "bold";
    greeting.style.textAlign = "center";
  }

  form.reset();
});
