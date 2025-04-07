
document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const preguntasContainer = document.getElementById('preguntas-container');
    const form = document.getElementById('vocational-test');
    const submitButton = document.getElementById('submit-button');
    const resultadoDiv = document.getElementById('resultado');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const contactSection = document.getElementById('contact-section');
    const contactForm = document.getElementById('contact-form');
    const hiddenCareerInput = document.getElementById('hidden-career-interest');
    const formStatus = document.getElementById('form-status-message');

    // --- Configuración ---
    const CONFIG = {
        googleAppScriptUrl: 'https://script.google.com/macros/s/AKfycbyiwMWpW2ha7bXH-N2jwqx8uvylYRGrgOZ_ykn34RF9INl343XNRa0Gm9Hz8A7cL8SKCQ/exec', // ¡VERIFICA QUE ESTA ES TU URL CORRECTA!
        carrerasDataFile: './carreras.json' // Nombre del archivo JSON
    };

    // --- Global variables ---
    let totalPreguntas = 0;
    let lastMilestoneReached = 0;
    let testStarted = false;
    let carrerasData = null; // Para almacenar los datos cargados

    // --- Helper Function: Shuffle Array ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Function: Render Shuffled Questions ---
    function renderizarPreguntasAleatorias() {
        if (!carrerasData) {
            console.error("Datos de carreras no cargados.");
            if (preguntasContainer) {
                preguntasContainer.innerHTML = '<p class="error-message">Error al cargar las preguntas. Intenta recargar la página.</p>';
            }
            return;
        }

        let todasLasPreguntas = [];
        totalPreguntas = 0;

        for (const idCarrera in carrerasData) {
            if (carrerasData.hasOwnProperty(idCarrera)) {
                carrerasData[idCarrera].preguntas.forEach((pregunta, index) => {
                    todasLasPreguntas.push({
                        texto: pregunta,
                        idCarrera: idCarrera,
                        originalIndex: index
                    });
                    totalPreguntas++;
                });
            }
        }

        shuffleArray(todasLasPreguntas);

        let htmlPreguntas = '';
        todasLasPreguntas.forEach((preguntaData, displayedIndex) => {
            const questionId = `${preguntaData.idCarrera}-q${preguntaData.originalIndex}`;
            htmlPreguntas += `
                <div class="question">
                    <p><span class="question-number">${displayedIndex + 1}.</span> ${preguntaData.texto}</p>
                    <div class="options">
                        <label>
                            <input type="radio" name="${questionId}" value="1" required>
                            <span>1: No me interesa</span>
                        </label>
                        <label>
                            <input type="radio" name="${questionId}" value="2" required>
                            <span>2: Podría interesarme</span>
                        </label>
                        <label>
                            <input type="radio" name="${questionId}" value="3" required>
                            <span>3: Me interesa</span>
                        </label>
                    </div>
                </div>
            `;
        });

        if (preguntasContainer) {
            preguntasContainer.innerHTML = htmlPreguntas;
        }
        updateProgressBar();
        lastMilestoneReached = 0;
        testStarted = false;
    }

    // --- Function: Update Progress Bar & Track GA Progress ---
    function updateProgressBar() {
        if (!form || !carrerasData) return; // Asegura que los datos estén cargados
        if (typeof gtag === 'undefined') {
            console.warn("gtag no está definido. El seguimiento de Google Analytics está desactivado.");
        }

        // GA Event: Track test start
        if (!testStarted && form.querySelector('input[type="radio"]:checked')) {
            testStarted = true;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'test_start', {
                    'event_category': 'Vocational Test',
                    'event_label': 'First Question Answered'
                });
                console.log("GA Event: test_start");
            }
        }

        // Calculate progress
        const answeredQuestions = new Set(
            Array.from(form.querySelectorAll('input[type="radio"]:checked')).map(r => r.name)
        );
        const respuestasSeleccionadas = answeredQuestions.size;
        const porcentaje = totalPreguntas > 0 ? Math.round((respuestasSeleccionadas / totalPreguntas) * 100) : 0;

        // Update visual progress bar
        if (progressBar && progressText) {
            progressBar.style.width = `${porcentaje}%`;
            progressText.textContent = `${porcentaje}% completado`;
        }

        // GA Event: Track Progress Milestones
        const milestones = [25, 50, 75, 100];
        for (const milestone of milestones) {
            if (porcentaje >= milestone && lastMilestoneReached < milestone) {
                 if (typeof gtag !== 'undefined') {
                    gtag('event', 'test_progress', {
                        'event_category': 'Vocational Test',
                        'event_label': `Progress Reached - ${milestone}%`,
                        'value': milestone
                    });
                    console.log(`GA Event: test_progress - ${milestone}%`);
                 }
                lastMilestoneReached = milestone;
                break;
            }
        }

        if (respuestasSeleccionadas === 0) {
            lastMilestoneReached = 0;
            testStarted = false;
        }
    }

    // --- Function: Calculate and Display Results & Track GA Completion ---
    function calcularResultado() {
        if (!form || !resultadoDiv || !carrerasData) return;

        const puntajes = {};
        for (const idCarrera in carrerasData) {
            if (carrerasData.hasOwnProperty(idCarrera)) {
                puntajes[idCarrera] = 0;
            }
        }

        const respuestas = form.querySelectorAll('input[type="radio"]:checked');
        const answeredQuestionsNames = new Set(Array.from(respuestas).map(r => r.name));
        const totalPreguntasRespondidas = answeredQuestionsNames.size;

        // Validation: Check if all questions are answered
        if (totalPreguntasRespondidas < totalPreguntas) {
            resultadoDiv.innerHTML = `<p class="error-message">Por favor, responde todas las ${totalPreguntas} preguntas para ver tu resultado.</p>`;
            resultadoDiv.style.display = 'block';
            if (contactSection) contactSection.style.display = 'none';
            const existingShareButton = document.getElementById('share-whatsapp-button');
            if (existingShareButton) existingShareButton.style.display = 'none';
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Sum scores
        respuestas.forEach(input => {
            const name = input.name;
            const idCarrera = name.split('-')[0];
            const valor = parseInt(input.value, 10);
            if (puntajes.hasOwnProperty(idCarrera)) {
                puntajes[idCarrera] += valor;
            }
        });

        // Find best career(s)
        let mejoresCarrerasIds = [];
        let maxPuntaje = -1;
        for (const idCarrera in puntajes) {
            if (puntajes.hasOwnProperty(idCarrera)) {
                const puntajeActual = puntajes[idCarrera];
                if (puntajeActual > maxPuntaje) {
                    maxPuntaje = puntajeActual;
                    mejoresCarrerasIds = [idCarrera];
                } else if (puntajeActual === maxPuntaje && maxPuntaje !== -1) {
                    mejoresCarrerasIds.push(idCarrera);
                }
            }
        }

        // Prepare and Display results
        if (mejoresCarrerasIds.length > 0 && maxPuntaje >= 0) {
            const resultNames = mejoresCarrerasIds.map(id => carrerasData[id].nombreDisplay).join(' | ');
            // GA Event: Track Test Completion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'test_complete', {
                    'event_category': 'Vocational Test',
                    'event_label': `Result: ${resultNames}`,
                    'value': mejoresCarrerasIds.length,
                    'result_careers': resultNames
                });
                console.log(`GA Event: test_complete - Result: ${resultNames}`);
            }

            let resultContentHTML = '';
            let fullResultHTML = '';

            // --- AÑADIR ENLACES AQUÍ ---
            if (mejoresCarrerasIds.length === 1) {
                const idCarreraUnica = mejoresCarrerasIds[0];
                const carreraRecomendada = carrerasData[idCarreraUnica];
                const maxPosibleCarrera = carreraRecomendada.preguntas.length * 3;
                resultContentHTML = `
                    <p>Basado en tus respuestas, tu perfil muestra una fuerte inclinación hacia:</p>
                    <h4><a href="${carreraRecomendada.url || '#'}" target="_blank" rel="noopener noreferrer">${carreraRecomendada.nombreDisplay}</a></h4>
                    <p>${carreraRecomendada.descripcion}</p>
                    <p><strong>Puntaje obtenido:</strong> ${maxPuntaje} / ${maxPosibleCarrera}</p>
                    <p><em>Recuerda que este test es una guía. ¡Investiga más sobre esta y otras carreras que te interesen!</em></p>
                `;
            } else {
                const numPreguntasPrimeraEmpatada = carrerasData[mejoresCarrerasIds[0]].preguntas.length;
                const maxPosibleComun = numPreguntasPrimeraEmpatada * 3;
                resultContentHTML = `<p>Basado en tus respuestas, muestras interés destacado y similar en varias áreas (Puntaje: <strong>${maxPuntaje} / ${maxPosibleComun}</strong>):</p><ul>`;
                mejoresCarrerasIds.forEach(id => {
                    const carrera = carrerasData[id];
                    resultContentHTML += `<li><strong><a href="${carrera.url || '#'}" target="_blank" rel="noopener noreferrer">${carrera.nombreDisplay}</a>:</strong> ${carrera.descripcion}</li>`;
                });
                resultContentHTML += `</ul><p><em>Tienes intereses diversos y prometedores en estos campos. Te recomendamos explorar estas opciones más a fondo. ¡Este test es solo el comienzo!</em></p>`;
            }
            // --- FIN AÑADIR ENLACES ---

            fullResultHTML = `
                <h3>Resultado del Test Vocacional</h3>
                ${resultContentHTML}
                <button type="button" id="share-whatsapp-button" class="share-button" style="display: none;">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16" style="margin-right: 8px; vertical-align: middle;">...</svg>
                     Compartir Resultado en WhatsApp
                 </button>
            `;

            resultadoDiv.innerHTML = fullResultHTML;
            resultadoDiv.style.display = 'block';

            // Setup Share Button
            const currentShareButton = resultadoDiv.querySelector('#share-whatsapp-button');
            if (currentShareButton) {
                currentShareButton.onclick = () => {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'share', {
                            'method': 'WhatsApp',
                            'content_type': 'Vocational Test Result',
                            'item_id': resultNames
                        });
                        console.log(`GA Event: share - Method: WhatsApp, Content: ${resultNames}`);
                    }
                    compartirWhatsApp(mejoresCarrerasIds, maxPuntaje);
                };
                currentShareButton.style.display = 'inline-flex';
            }

            // Show Contact Form
            if (contactSection && hiddenCareerInput) {
                const recommendedCareerNames = mejoresCarrerasIds.map(id => carrerasData[id].nombreDisplay).join(', ');
                hiddenCareerInput.value = recommendedCareerNames;
                contactSection.style.display = 'block';
            }

            // Scroll to results
            const resultTitle = resultadoDiv.querySelector('h3');
            if (resultTitle) {
                resultTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

        } else {
            resultadoDiv.innerHTML = `<p class="error-message">No se pudo determinar un resultado claro. Por favor, asegúrate de responder todas las preguntas e intenta de nuevo.</p>`;
            resultadoDiv.style.display = 'block';
            if (contactSection) contactSection.style.display = 'none';
            const existingShareButton = document.getElementById('share-whatsapp-button');
            if (existingShareButton) existingShareButton.style.display = 'none';
        }
    }

    // --- Function: Share Results on WhatsApp ---
    function compartirWhatsApp(careerIds, score) {
        if (!carrerasData) return; // Asegurarse que los datos están cargados
        const testUrl = 'https://oswcat.github.io/PerfiladorApp/';
        let messageText = '';
        let careerNames = careerIds.map(id => carrerasData[id].nombreDisplay);

        messageText = ` ¡Hice el test vocacional de UNIREM y este es mi resultado!\n\n`;
        if (careerNames.length === 1) {
            messageText += `Mi perfil muestra una fuerte inclinación hacia: *${careerNames[0]}*.`;
        } else {
            messageText += `Muestro interés destacado en varias áreas:\n - *${careerNames.join('*\n - *')}*`;
        }
        messageText += `\n\n ¡Descubre tu vocación también!\n${testUrl}`;
        messageText += `\n\n Encuentra más sobre UNIREM en Facebook, Instagram y TikTok: @UNIREM.MX`;
        messageText += `\n\n Llamanos al 5550370100 o envía un WhatsApp al 5546190122 para más información.`;

        const encodedMessage = encodeURIComponent(messageText);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    }

    // --- Function: Handle Contact Form Submission ---
    async function handleContactFormSubmit(event) {
        event.preventDefault();
        if (!contactForm || !formStatus) return;

        formStatus.textContent = 'Enviando...';
        formStatus.className = 'form-status'; // Reset classes
        formStatus.style.display = 'block'; // Asegurarse que está visible

        const formData = new FormData(contactForm);
        const googleAppScriptUrl = CONFIG.googleAppScriptUrl;

        // Validación rápida de la URL (solo si sigue siendo el placeholder)
        if (!googleAppScriptUrl || googleAppScriptUrl.includes('AQUI_VA_LA_URL')) {
             console.error("Google Apps Script URL no está definida correctamente en CONFIG.");
             formStatus.textContent = 'Error de configuración interna. No se puede enviar.';
             formStatus.classList.add('error');
             return;
        }

        try {
            const response = await fetch(googleAppScriptUrl, {
                method: 'POST',
                body: formData,
                mode: 'cors',
            });

            // Siempre intenta parsear como JSON, incluso si no es OK, para obtener el mensaje de error del script
            let data = {};
            try {
                 data = await response.json();
            } catch (parseError) {
                 // Si la respuesta no es JSON válido (ej. error 500 HTML del servidor)
                 console.error("La respuesta del servidor no es JSON válido:", parseError, response.status, response.statusText);
                 throw new Error(`Respuesta inesperada del servidor (Estado: ${response.status})`); // Lanza un nuevo error para el catch principal
            }


            // Verificamos si la respuesta indica éxito (tanto HTTP OK como resultado del script)
            if (response.ok && data.result === 'success') {
                // GA Event: Track Lead Generation
                const careerInterest = formData.get('carrera_interes') || 'Not Specified';
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'generate_lead', {
                        'event_category': 'Contact Form',
                        'event_label': `Vocational Test Lead - Interest: ${careerInterest}`,
                    });
                    console.log(`GA Event: generate_lead - Interest: ${careerInterest}`);
                }

                // Muestra mensaje de éxito
                formStatus.textContent = '¡Gracias! Hemos recibido tu información. Un asesor se pondrá en contacto pronto.';
                formStatus.classList.remove('error'); // Asegura quitar clase error si existía
                formStatus.classList.add('success');
                contactForm.reset();

            } else {
                 // Hubo un error (HTTP no OK o el script reportó 'error')
                 const errorMessage = data.message || (response.ok ? 'El servidor reportó un error desconocido.' : `Error del servidor (Estado: ${response.status})`);
                 console.error('Error enviando a Google Apps Script:', errorMessage);
                 formStatus.textContent = `Error al enviar: ${errorMessage}. Por favor, revisa los datos e intenta de nuevo.`;
                 formStatus.classList.remove('success'); // Asegura quitar clase success
                 formStatus.classList.add('error');
            }

        } catch (error) {
            // Error de red, CORS, o el error lanzado por parseo JSON fallido
            console.error('Error de Red o en Fetch:', error);
            formStatus.textContent = `Error de conexión o respuesta inválida del servidor (${error.message}). Verifica tu conexión e intenta de nuevo.`;
            formStatus.classList.remove('success');
            formStatus.classList.add('error');
        }
    }

    // --- Function: Load Initial Data ---
    async function initializeTest() {
        try {
            const response = await fetch(CONFIG.carrerasDataFile);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            carrerasData = await response.json();

            // Ahora que tenemos los datos, renderizamos y añadimos listeners
            renderizarPreguntasAleatorias();

            if (submitButton) {
                submitButton.addEventListener('click', calcularResultado);
            }
            if (form) {
                form.addEventListener('change', updateProgressBar);
            }
            if (contactForm) {
                contactForm.addEventListener('submit', handleContactFormSubmit);
            }

        } catch (error) {
            console.error("Error fatal al cargar los datos de las carreras:", error);
            if (preguntasContainer) {
                preguntasContainer.innerHTML = `<p class="error-message" style="text-align:center; padding: 20px;">No se pudieron cargar las preguntas del test. Por favor, recarga la página o inténtalo más tarde.</p>`;
            }
            // Ocultar otros elementos si la carga falla
            if (submitButton) submitButton.style.display = 'none';
            if (progressBar.parentElement) progressBar.parentElement.style.display = 'none';
        }
    }

    // --- Initialization ---
    // Hide elements initially via JS as backup/alternative to CSS
    if (resultadoDiv) resultadoDiv.style.display = 'none';
    if (contactSection) contactSection.style.display = 'none';
    if (formStatus) formStatus.style.display = 'none';

    // Start loading data and setting up the test
    initializeTest();

}); // End of DOMContentLoaded wrapper
// --- END OF FILE script.js (ACTUALIZADO) ---