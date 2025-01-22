document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        editable: true,
        droppable: true,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'customDayButton,customWeekButton,customMonthButton'
        },
        customButtons: {
            customDayButton: {
                text: 'Day',
                click: function () {
                    calendar.changeView('timeGridDay'); // Use timeGridDay for a full day's time grid
                }
            },
            customWeekButton: {
                text: 'Week',
                click: function () {
                    calendar.changeView('timeGridWeek');
                }
            },
            customMonthButton: {
                text: 'Month',
                click: function () {
                    calendar.changeView('dayGridMonth');
                }
            }
        },
        dateClick: function (info) {
            $('#eventModal').modal('show');
            $('#eventDate').val(info.dateStr);
        },
        eventClick: function (info) {
            $('#eventDetailsModal').modal('show');
            $('#detailsTitle').text(info.event.title);
            $('#detailsStart').text(info.event.start.toLocaleString());
            $('#detailsEnd').text(info.event.end ? info.event.end.toLocaleString() : 'N/A');
            $('#deleteEvent').data('event-id', info.event.id);
        },
        eventDrop: function (info) {
            alert('Event moved to: ' + info.event.start.toLocaleString());
        },
        eventResize: function (info) {
            alert('Event resized to: ' + info.event.start.toLocaleString() + ' - ' + info.event.end.toLocaleString());
        }
    });
    calendar.render();

    $('#eventForm').on('submit', function (e) {
        e.preventDefault();

        const title = $('#eventTitle').val();
        const startTime = $('#eventStartTime').val();
        const endTime = $('#eventEndTime').val();
        const mobileNumber = $('#mobileNumber').val();
        const date = $('#eventDate').val();

        const mobileRegex = /^[1-9]{1}[0-9]{9}$/;  // Validates 10-digit number that does not start with 0

        if (title && startTime && endTime && mobileRegex.test(mobileNumber)) {
            calendar.addEvent({
                title: title,
                start: date + 'T' + startTime,
                end: date + 'T' + endTime,
                allDay: false,
                extendedProps: {
                    mobileNumber: mobileNumber
                }
            });

            $('#eventModal').modal('hide');
            $('#eventForm')[0].reset();
            $('#mobileError').hide();
        } else {
            if (!mobileRegex.test(mobileNumber)) {
                $('#mobileError').show();
            }
        }
    });

    $('#deleteEvent').on('click', function () {
        const eventId = $(this).data('event-id');
        const event = calendar.getEventById(eventId);
        event.remove();
        $('#eventDetailsModal').modal('hide');
    });
});
