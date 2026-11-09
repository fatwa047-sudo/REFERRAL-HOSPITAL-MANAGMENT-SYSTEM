// =====================================
// REFERRAL HOSPITAL MANAGEMENT SYSTEM
// =====================================


// 1. NAVIGATION SYSTEM

const navLinks = document.querySelectorAll(".sidebar nav a");
const pages = document.querySelectorAll(".page");

function showPage(pageId) {

    pages.forEach(page => {
        page.classList.remove("active");
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageId);

    if (!selectedPage || !selectedPage.classList.contains("page")) {
        return;
    }

    selectedPage.classList.add("active");

    const selectedLink = document.querySelector(
        `.sidebar nav a[data-page="${pageId}"]`
    );

    if (selectedLink) {
        selectedLink.classList.add("active");
    }

    const heading = document.querySelector(".topbar h2");
    const pageHeading = selectedPage.querySelector("h2");

    if (heading && pageHeading) {
        heading.textContent = pageHeading.textContent;
    }
}


// Navigation click events

navLinks.forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        const pageId = this.dataset.page;

        showPage(pageId);

        window.location.hash = pageId;

    });

});


// Open correct page on refresh

const initialPage = window.location.hash.substring(1);

showPage(
    document.getElementById(initialPage)?.classList.contains("page")
        ? initialPage
        : "dashboard"
);


// 2. APPOINTMENT SYSTEM

const appointmentForm =
    document.getElementById("appointmentForm");

const appointmentDate =
    document.getElementById("appointmentDate");

const appointmentMessage =
    document.getElementById("appointmentMessage");


// Get today's date

function getTodayDate() {

    const today = new Date();

    return today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");

}

appointmentDate.min = getTodayDate();


// Load saved appointments

let appointments = [];

try {

    appointments = JSON.parse(
        localStorage.getItem("hospitalAppointments") || "[]"
    );

    if (!Array.isArray(appointments)) {
        appointments = [];
    }

} catch (error) {

    appointments = [];

}


// 3. DISPLAY APPOINTMENTS

function displayAppointments() {

    const tableBody =
        document.getElementById("recentAppointments");

    const appointmentCount =
        document.getElementById("appointmentCount");

    appointmentCount.textContent = appointments.length;

    tableBody.innerHTML = "";

    if (appointments.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    No appointments available.
                </td>
            </tr>
        `;

        return;
    }

    appointments.forEach(appointment => {

        const row = document.createElement("tr");

        const patientCell = document.createElement("td");
        patientCell.textContent = appointment.patient;

        const doctorCell = document.createElement("td");
        doctorCell.textContent = appointment.doctor;

        const dateCell = document.createElement("td");
        dateCell.textContent = appointment.date;

        const statusCell = document.createElement("td");
        statusCell.textContent = appointment.status;

        row.appendChild(patientCell);
        row.appendChild(doctorCell);
        row.appendChild(dateCell);
        row.appendChild(statusCell);

        tableBody.appendChild(row);

    });

}


// 4. BOOK NEW APPOINTMENT

appointmentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const newAppointment = {

        id: document.getElementById("patientId").value.trim(),

        patient: document.getElementById("patientName").value.trim(),

        phone: document.getElementById("patientPhone").value.trim(),

        doctor: document.getElementById("doctorName").value,

        department: document.getElementById("department").value,

        date: appointmentDate.value,

        time: document.getElementById("appointmentTime").value,

        status: document.getElementById("appointmentStatus").value,

        reason: document.getElementById("appointmentReason").value.trim()

    };


    // Validate appointment date

    if (newAppointment.date < getTodayDate()) {

        appointmentMessage.textContent =
            "Please select today or a future date.";

        return;

    }


    // Validate patient information

    if (
        !newAppointment.id ||
        !newAppointment.patient ||
        !newAppointment.phone ||
        !newAppointment.reason
    ) {

        appointmentMessage.textContent =
            "Please complete all required fields.";

        return;

    }


    // Save appointment

    appointments.push(newAppointment);

    localStorage.setItem(
        "hospitalAppointments",
        JSON.stringify(appointments)
    );


    // Update dashboard

    displayAppointments();


    // Success message

    appointmentMessage.textContent =
        "Appointment booked successfully!";


    // Clear form

    appointmentForm.reset();

    appointmentDate.min = getTodayDate();

});


// 5. CLEAR FORM MESSAGE

appointmentForm.addEventListener("reset", function() {

    appointmentMessage.textContent = "";

});


// 6. LOAD SAVED DATA

displayAppointments();

console.log("Referral Hospital System is running!");

