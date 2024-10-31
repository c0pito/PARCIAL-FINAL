
let currentPage = 1;
const photosPerPage = 25;
let currentPhotos = [];

// Función para cargar las fotos de la fecha por defecto al cargar la página
async function loadDefaultPhotos() {
    document.getElementById('date').value = '2015-07-02'; // Establece la fecha por defecto
    await fetchMarsPhotos(); // Llama a la función de búsqueda
}

async function fetchMarsPhotos() {
    const dateInput = document.getElementById('date').value;
    const apiKey = "TzW3zsyCSXZX3G9epitf8lhV4uKTxKbBD2tPhvOQ"; // Reemplaza con tu API Key
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${dateInput}&api_key=${apiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        currentPhotos = data.photos;
        currentPage = 1; // Reiniciar a la primera página
        updateNavigationButtons();
        displayPhotos();
    } catch (error) {
        console.error("Error al obtener las fotos del rover:", error);
    }
}

function displayPhotos() {
    const tableBody = document.getElementById('photosTable').querySelector('tbody');
    tableBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos
    
    const start = (currentPage - 1) * photosPerPage;
    const end = start + photosPerPage;
    const photosToShow = currentPhotos.slice(start, end);

    photosToShow.forEach(photo => {
        const row = document.createElement('tr');

        // ID
        const idCell = document.createElement('td');
        idCell.textContent = photo.id;
        row.appendChild(idCell);

        // Rover Name
        const nameCell = document.createElement('td');
        nameCell.textContent = photo.rover.name;
        row.appendChild(nameCell);

        // Camera
        const cameraCell = document.createElement('td');
        cameraCell.textContent = photo.camera.full_name;
        row.appendChild(cameraCell);

        // Details
        const detailsCell = document.createElement('td');
        const moreButton = document.createElement('button');
        moreButton.textContent = "More";
        moreButton.style.backgroundColor = "blue";
        moreButton.style.color = "white";
        moreButton.style.border = "none";
        moreButton.style.cursor = "pointer";
        moreButton.onclick = () => showPhotoDetails(photo); // Cambiamos aquí
        detailsCell.appendChild(moreButton);
        row.appendChild(detailsCell);

        tableBody.appendChild(row);
    });

    // Mostrar detalles de la primera foto, si existe
    if (photosToShow.length > 0) {
        showPhotoDetails(photosToShow[0]);
    } else {
        clearPhotoDetails();
    }
}

function clearPhotoDetails() {
    const photoDetailsDiv = document.getElementById('photoDetails');
    const detailImage = document.getElementById('detailImage');
    const detailId = document.getElementById('detailId');
    const detailSol = document.getElementById('detailSol');
    const detailEarthDate = document.getElementById('detailEarthDate');

    // Limpiar detalles
    detailImage.src = '';
    detailId.textContent = '';
    detailSol.textContent = '';
    detailEarthDate.textContent = '';

    // Ocultar el div de detalles
    photoDetailsDiv.style.display = 'none';
}

function showPhotoDetails(photo) {
    const photoDetailsDiv = document.getElementById('photoDetails');
    const detailImage = document.getElementById('detailImage');
    const detailId = document.getElementById('detailId');
    const detailSol = document.getElementById('detailSol');
    const detailEarthDate = document.getElementById('detailEarthDate');

    // Establecer los valores de los detalles
    detailImage.src = photo.img_src;
    detailId.textContent = photo.id; // Sin negrita
    detailSol.textContent = photo.sol; // Sin negrita
    detailEarthDate.textContent = photo.earth_date; // Sin negrita

    // Mostrar el div de detalles
    photoDetailsDiv.style.display = 'block';
}

function updateNavigationButtons() {
    const totalPages = Math.ceil(currentPhotos.length / photosPerPage);
    document.getElementById('previousButton').disabled = currentPage === 1;
    document.getElementById('nextButton').disabled = currentPage === totalPages || totalPages === 0;
}

function nextPage() {
    const totalPages = Math.ceil(currentPhotos.length / photosPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPhotos();
        updateNavigationButtons();
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPhotos();
        updateNavigationButtons();
    }
}

// Cargar los datos por defecto al iniciar la página
window.onload = loadDefaultPhotos;

