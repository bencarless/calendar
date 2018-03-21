// Script dependencies
var moment = require("moment");

// Get calendar element
var elem = document.querySelectorAll('[data-calendar-name]')[0];
var parent = elem.parentElement;

var current = "1994-03-01";

function renderCalendar(date = new Date()) {
  var currentMonth = moment(date);
  
  // Work out details of month
  var monthName = currentMonth.format('MMMM');
  var yearName = currentMonth.format('YYYY');
  var startDayId = currentMonth.startOf('month').day();
  var endDayId = currentMonth.endOf('month').day();

  // Work out specifics for current month
  var days = moment.weekdays();  // Get weekdays based on moment locale
  var monthLength = currentMonth.daysInMonth();  // Get month length

  // Create calendar table / container
  var calendar = document.createElement("table");
  calendar.id = "calendar";

  // Work out sizes
  cellWidth = parent.clientWidth / 7;
  cellHeight = parent.clientWidth / 7;
  headingFontSize = cellHeight / 2;
  cellFontSize = cellHeight / 3;

  // Next and previous buttons

  // Add month heading
  var nameRow = document.createElement('tr');
  var nameData = document.createElement('th');

  nameData.colSpan = 7;
  nameData.style.fontSize = headingFontSize;
  nameData.innerText = monthName + " " + yearName;
  nameData.style.cursor = "pointer";
  nameData.onclick = nextCalendar;

  nameRow.appendChild(nameData);
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
  var totalDays = monthLength + startDayId + (7 - endDayId ); // Work out total days to iterate through
  var firstDay = currentMonth.startOf('month').subtract(startDayId + 1, 'day');
  var row = document.createElement('tr');

  for(i=0; i<totalDays; i++) {
    if(firstDay.day() == 0) {
      var row = document.createElement('tr');
    }

    var day = document.createElement('td');
    day.height = cellHeight;
    day.width = cellWidth;
    day.style.fontSize = cellFontSize;
    
    day.innerText = firstDay.add(1, 'day').date();
    row.appendChild(day);

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

  renderCalendar(current);
}

var calendar = renderCalendar(current);