// Script dependencies
var moment = require("moment");
var data = require("./test.json");

var color = {
  primary: "red",
  secondary: "blue"
}

// Get calendar element
var elem = document.querySelectorAll('[data-calendar-name]')[0];
var parent = elem.parentElement;

var current = new Date("2018-03-01");

function renderCalendar(date, data) {
  var currentMonth = new moment(date);

  // Work out details of month
  var monthName = currentMonth.format('MMMM');
  var yearName = currentMonth.format('YYYY');

  currentMonth.startOf('month');

  var startDayId = currentMonth.day();
  var firstDay = currentMonth.clone();

  currentMonth.endOf('month');

  var endDayId = currentMonth.day();

  // Work out specifics for current month
  var days = moment.weekdays();  // Get weekdays based on moment locale
  var monthLength = currentMonth.daysInMonth();  // Get month length

  // Create calendar table / container
  var calendar = document.createElement("table");
  calendar.id = "calendar";

  // Work out sizes
  tableWidth = parent.clientWidth;
  cellWidth = parent.clientWidth / 7;
  cellHeight = parent.clientWidth / 7;
  headingFontSize = cellHeight / 2;
  cellFontSize = cellHeight / 3;

  // Add month heading
  var nameRow = document.createElement('tr');
  
  // Next and previous buttons
  var back = document.createElement('th');
  var next = document.createElement('th');
  var nameData = document.createElement('th');

  back.innerText = "B";
  back.style.cursor = "pointer";
  back.onclick = previousCalendar;

  next.innerText = "N";
  next.style.cursor = "pointer";
  next.onclick = nextCalendar;
  
  nameData.style.fontSize = headingFontSize;
  nameData.colSpan = 5;
  nameData.innerText = monthName + " " + yearName;

  nameRow.appendChild(back);
  nameRow.appendChild(nameData);
  nameRow.appendChild(next);

  calendar.appendChild(nameRow);

  // Create days as table header
  var calendarDaysRow = document.createElement("tr");

  for(i = 0; i < days.length; i++) {
    var th = document.createElement("th");
    th.innerText = days[i][0];
    th.height = cellHeight;
    th.width = cellWidth;
    th.style.fontSize = cellFontSize;

    calendarDaysRow.appendChild(th);
  }

  // Attach header row to table
  calendar.appendChild(calendarDaysRow);

  // Write calendar rows
  var totalDays = monthLength + ( 1 + startDayId ) + ( 6 - endDayId ); // Work out total days to iterate through
  firstDay.subtract(startDayId, 'day');

  var row = document.createElement('tr');

  for(i=0; i<totalDays; i++) {
    // Check if day is start of week and if so create new row
    if(firstDay.day() == 0) {
      var row = document.createElement('tr');
    }

    // Define and create day
    var day = document.createElement('td');
    day.height = cellHeight;
    day.width = cellWidth;
    day.style.fontSize = cellFontSize;

    day.id = firstDay.format();

    // Check if any events are present on this day
    for(var key in data.events) {
      var answer = moment(data.events[key].date).diff(firstDay);

      // If event falls on this day
      if(answer == 0) {
        day.style.borderBottom = "3px solid " + color.primary;
        day.style.color = color.primary;
        day.onclick = displayEvent;
        day.style.cursor = "pointer";
      }
    }
    
    day.innerText = firstDay.date();

    // Add day to row
    row.appendChild(day);

    // Progress to next day
    firstDay.add(1, 'day');

    // If end of week append row
    if(firstDay.day() == 6) {
      calendar.appendChild(row);
    }
  }

  // Debugging
  console.log("Loading... " + monthName);

  // Append calendar table to element
  elem.appendChild(calendar);
}

function clearCalendar() {
  elem.childNodes[0].remove();
}

function nextCalendar() {
  clearCalendar();

  current = moment(current).add(1, 'month');

  renderCalendar(current, data);
}

function previousCalendar() {
  clearCalendar();

  current = moment(current).subtract(1, 'month');

  renderCalendar(current, data);
}

function displayEvent(event) {
  var targetDate = moment(event.target.id);

  for(var key in data.events) {
    var answer = moment(data.events[key].date).diff(targetDate);

    // If event falls on this day
    if(answer == 0) {
      console.log(data.events[key]);
    }
  }
}

// Render calendar on load
renderCalendar(current, data);