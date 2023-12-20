async function fetchRandomDog() {
    try {
        // Ia datele de la API
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();

        const imageUrl = data.message;

        const jsonOutput = document.getElementById("jsonContainer");
        jsonOutput.textContent = JSON.stringify(data, null, 2);

        // Canvas si context (canvas in 2d)
        const canvas = document.getElementById('processedCanvas');
        const ctx = canvas.getContext('2d');

        // Creeaza o noua imagine
        const img = new Image();

        img.onload = function() {
            // Preia dimensiunile imaginii
            const maxWidth = img.width;
            const maxHeight = img.height;

            // Seteaza dimensiunile canvas-ului sa fie aceleasi cu ale imaginii
            canvas.width = maxWidth;
            canvas.height = maxHeight;

            // Calculeaza offsetul pentru centrarea imaginii frumos in interiorul canvasului
            const offsetX = (canvas.width - img.width) / 2;
            const offsetY = (canvas.height - img.height) / 2;

            // Da flip la imagine inainte sa inceapa sa o roteasca
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(img, offsetX, offsetY);

            // Astepta o secunda inainte sa inceapa sa roteasca imaginea 
            setTimeout(() => rotateSequence(img, ctx, offsetX, offsetY), 1000);
        };

        img.src = imageUrl;

    } catch (error) { // In caz ca apare vreo eroare cand incearca sa ia imaginea
      console.error('Error fetching dog image:', error);
    }
}


function rotateSequence(img, ctx, offsetX, offsetY) {
    const rotations = [0, 90, 180, 270];
    let currentRotationIndex = 0;

    function rotateImage() {
        // Pentru timer, startTime retine momentul de start pentru fiecare rotatie
        const startTime = performance.now(); 
        // Determina la ce rotatie din vectorul rotations se afla
        const degrees = rotations[currentRotationIndex];


        // Sterge continutul canvas-ului inainte sa faca altceva
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Dimensiunile canvasului devin un patrat cu latura egala cu maximul dintre inaltime si latime
        ctx.canvas.width = ctx.canvas.height = Math.max(img.height, img.width);

        // Rotesc imaginea si o mentin centrata in canvas
        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.rotate((degrees * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2 + offsetX, -img.height / 2 + offsetY);
        ctx.restore();


        // Pentru a calcula timpul pentru fiecare rotatie, endTime retine timpul final al rularii
        const endTime = performance.now(); 
        // Timpul de rulare este mai apoi diferenta dintre start si end 
        const executionTime = endTime - startTime;
        displayExecutionTime(executionTime);

        currentRotationIndex = (currentRotationIndex + 1) % rotations.length;

        // Asteapta o secunda inainte de a roti din nou imaginea
        setTimeout(rotateImage, 1000); 
    }
    // Incepe din nou secventa de rotatie
    rotateImage(); 
}


// Functia care afiseaza timpul de executie a fiecarei rotatie
function displayExecutionTime(executionTime) {
    const executionTimesContainer = document.getElementById('executionTimesContainer');

    // Sterge ce era inainte in executionTime pentru afisa doar ultimul timp
    executionTimesContainer.innerHTML = '';

    // Creaza un nou element p si il adauga in div-ul initial
    const executionTimeElement = document.createElement('p');
    executionTimeElement.textContent = `Rotate function executed in: ${executionTime.toFixed(2)} milliseconds`;
    executionTimesContainer.appendChild(executionTimeElement);
}


// Functia care afiseaza contentul din JSON 
function displayJSON(data) {
    const jsonContainer = document.getElementById('jsonContainer');
    jsonContainer.textContent = JSON.stringify(data, null, 2);
}

window.onload = fetchRandomDog;