//sidebar

var menu = document.getElementById("menu-btn");
var closemenu = document.getElementById("side-menu")
var sidebar = document.getElementById("sidebar")
menu.addEventListener("click", function () {
    sidebar.classList.add("active")
})
closemenu.addEventListener("click", function () {
    sidebar.classList.remove("active")
})

//addevent 
//display-styles
var addeventbutton = document.getElementById("add-event-btn");
var addevent = document.querySelector(".add-event")
var overlay = document.querySelector(".overlay")
addeventbutton.addEventListener("click", function () {
    addevent.style.display = "flex";
    overlay.style.display = "block";

})
overlay.addEventListener("click", function () {
    addevent.style.display = "none";
    overlay.style.display = "none";
})
function closevent() {
    addevent.style.display = "none";
    overlay.style.display = "none";
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function readEvents() {
    await delay(300);
    const events = localStorage.getItem("events");
    if (events) {
        return JSON.parse(events);
    }
    else {
        console.log("No data found!");
        return [];
    }
}

async function saveEvents(eventsArray) {
    await delay(100);
    try {
        localStorage.setItem("events", JSON.stringify(eventsArray));
    }
    catch (error) {
        console.error("Error in storing to localstorage : ", error)
    }
}

function renderEvents(events) {

    console.log("initializing...");
    const eventcontainer = document.getElementById("events");
    if (!eventcontainer) return;
    eventcontainer.innerHTML = '';
    const eventshtml = events.map(event => {

        const price = typeof event.price === 'number' ? event.price : parseFloat(String(event.price).replace(/[^0-9]/g, '')) || 0;

        return `
        <div class="event"><img src="${event.imageUrl || 'https://placehold.co/400x250/E9D5FF/7C3AED?text=Event+Image'}">
        <div class="event-details">
        <h1>${event.title}</h1>
        <h4>Venue : 📍${event.venue}</h4>
        <h5>Happening on: 📅 ${event.date}</h5>
        <h5>Price:${price.toLocaleString('en-IN')}/-</h5>
        <h5 class="registered-count">${event.registered} members registered</h5>
        </div>
        <button class="booknow" data-event-id="${event.id}">Book now</button>
        <button class="delete" data-event-id="${event.id}">Delete</button>
        </div> `;
    }).join('');
    eventcontainer.innerHTML = eventshtml;
}

async function initapp() {

    let events = await readEvents();
    if (events.length === 0) {
        events = [
            {
                id: 1,
                title: "Coldplay live - Music of the Spheres Tour",
                venue: "Jawaharlal Nehru Stadium, Delhi",
                date: "2025-11-06",
                price: 4999,
                registered: 850,
                imageUrl: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg"
            },
            {
                id: 2,
                title: "Comic Con India 2025",
                venue: "Hitex Exhibition Center, Hyderabad",
                date: "2025-12-03",
                price: 1499,
                registered: 420,
                imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
            },
            {
                id: 3,
                title: "Sunburn Festival 2025",
                venue: "Vagator Beach, Goa",
                date: "2026-01-06",
                price: 5499,
                registered: 690,
                imageUrl: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg"
            },
            {
                id: 4,
                title: "International Food Carnival",
                venue: "India Gate Lawns, Delhi",
                date: "2025-12-26",
                price: 499,
                registered: 700,
                imageUrl: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"
            },
            {
                id: 5,
                title: "Stand-up Comedy Night - Zakir Khan",
                venue: "Phoenix Marketcity, Bangalore",
                date: "2025-12-06",
                price: 899,
                registered: 640,
                imageUrl: "https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg"
            }

        ];
        await saveEvents(events);
    }

    renderEvents(events);

    const submitBtn = document.getElementById("add-event-button");
    if (submitBtn) {
        submitBtn.addEventListener("click", savenewevent);
    }

    const booking = document.getElementById("events");
    if (booking) {
        booking.addEventListener("click", function (event) {
            if (event.target.classList.contains("booknow")) {
                const eventId = event.target.dataset.eventId;
                bookmyevent(eventId);
            }
            else if (event.target.classList.contains("delete")) {
                const eventId = event.target.dataset.eventId;
                deleteEvent(eventId);
            }
        });
    }
    const search = document.getElementById("searchEvent");
    if (search) {
        search.addEventListener("keyup", searchEvent);
    }
}


window.onload = initapp;

async function savenewevent() {

    const title = document.getElementById("new-event-title").value;
    const venue = document.getElementById("new-event-venue").value;
    const date = document.getElementById("new-event-date").value;
    const price = document.getElementById("new-event-price").value;
    const image = document.getElementById("eventimage").value;

    if (!title || !venue || !date || !price || !image) {
        alert("Please fill all necessary details");
        return;
    }

    const newevent = {
        id: Date.now(),
        title: title,
        venue: venue,
        date: date,
        price: price,
        registered: 0,
        imageUrl: image
    };

    const existing = await readEvents();
    existing.push(newevent);
    await saveEvents(existing);

    document.getElementById("new-event-title").value = '';
    document.getElementById("new-event-venue").value = '';
    document.getElementById("new-event-date").value = '';
    document.getElementById("new-event-price").value = '';
    document.getElementById("eventimage").value = '';

    renderEvents(existing);
    closevent();

}
async function bookmyevent(eventId) {

    const events = await readEvents();
    const find = Number(eventId);
    const eventindex = events.findIndex(event => event.id === find);

    if (eventindex !== -1) {
        events[eventindex].registered += 1;
        const eventname = events[eventindex].title;
        alert(`${eventname} Event booked`);
        await saveEvents(events);
        renderEvents(events);
    }
    else {
        console.error("Event index not found");
    }
}
async function deleteEvent(eventId) {
    const events = await readEvents();
    const find = Number(eventId);
    const eventindex = events.findIndex(event => event.id === find);

    if (eventindex !== -1) {
        const eventname = events[eventindex].title;
        const bool = confirm(`Are you sure do you want to delete ${eventname} event?`);
        if (bool) {
            events.splice(eventindex, 1);
            await saveEvents(events);
            renderEvents(events);
            alert(`${eventname} has been deleted`);
        }
    }
    else {
        console.error("Event index not found");
    }
}
async function searchEvent() {
    const searchitem = document.getElementById("searchEvent").value.toLowerCase();
    const allevents =await readEvents();
    if (searchitem === "")
    {
        renderEvents(allevents);
        return;
    }
    const filteredEvents = allevents.filter(event=>{
        const searchtitle = event.title.toLowerCase().includes(searchitem);
        const searchvenue = event.venue.toLowerCase().includes(searchitem);
        return searchtitle || searchvenue;
    }
    );
    renderEvents(filteredEvents);
}