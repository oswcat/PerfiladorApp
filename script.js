document.addEventListener('DOMContentLoaded', () => {
    // Element references
    const preguntasContainer = document.getElementById('preguntas-container');
    const form = document.getElementById('vocational-test');
    const submitButton = document.getElementById('submit-button');
    const resultadoDiv = document.getElementById('resultado');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    // Global variable to store total questions count
    let totalPreguntas = 0;

    // --- Test Data (Careers and Questions) ---
    const carreras = {
        adminEmpresas: {
            nombreDisplay: "Administración de Empresas",
            descripcion: "Se enfoca en la planificación, organización, dirección y control de los recursos (humanos, financieros, materiales) de una organización para alcanzar sus objetivos de manera eficiente.",
            preguntas: [
                "Me interesa diseñar estrategias para el crecimiento de una organización.",
                "Disfruto trabajar en equipo y coordinar tareas para alcanzar objetivos.",
                "Me motiva analizar el impacto de las decisiones financieras en una empresa.",
                "Me gustaría optimizar procesos para mejorar la productividad en una organización.",
                "Me atrae la idea de liderar proyectos y gestionar recursos.",
                "Me interesa aprender sobre modelos de negocio y su aplicación en el mercado actual."
            ]
        },
        adminTurismo: {
            nombreDisplay: "Administración de Empresas Turísticas",
            descripcion: "Combina la gestión empresarial con el conocimiento del sector turístico, preparando para administrar hoteles, agencias de viajes, organizar eventos y promover destinos.",
            preguntas: [
                "Me gusta organizar y planificar eventos para diferentes tipos de público.",
                "Me interesa descubrir nuevas culturas y su impacto en la economía global.",
                "Disfruto analizar tendencias en el turismo y su evolución en el tiempo.",
                "Me motiva el reto de ofrecer experiencias inolvidables a clientes y viajeros.",
                "Me gustaría desarrollar estrategias para promover destinos turísticos.",
                "Me atrae la logística y operación de hoteles y restaurantes."
            ]
        },
        arquitectura: {
            nombreDisplay: "Arquitectura",
            descripcion: "Combina arte y técnica para diseñar y construir espacios funcionales, estéticos y seguros, considerando aspectos estructurales, sociales y ambientales.",
            preguntas: [
                "Me gusta observar y analizar el diseño de los espacios a mi alrededor.",
                "Me interesa entender cómo los materiales influyen en la estructura de un edificio.",
                "Disfruto visualizar y crear planos para optimizar espacios.",
                "Me motiva diseñar ambientes funcionales que combinen estética y utilidad.",
                "Me gustaría desarrollar proyectos urbanos que mejoren la calidad de vida.",
                "Me atrae la combinación entre creatividad y técnica en la construcción."
            ]
        },
        comunicacion: {
            nombreDisplay: "Ciencias de la Comunicación",
            descripcion: "Estudia los procesos de comunicación humana y mediática. Incluye áreas como periodismo, relaciones públicas, producción audiovisual y comunicación organizacional.",
            preguntas: [
                "Me interesa entender cómo los medios de comunicación influyen en la sociedad.",
                "Disfruto crear contenido para diferentes plataformas y públicos.",
                "Me motiva analizar y desarrollar estrategias de comunicación efectiva.",
                "Me gustaría trabajar en la producción de medios como radio, televisión o prensa.",
                "Me atrae la investigación sobre la opinión pública y su impacto social.",
                "Me apasiona la publicidad y la forma en que conecta con las audiencias."
            ]
        },
        comercioInt: {
            nombreDisplay: "Comercio Internacional",
            descripcion: "Se centra en las relaciones comerciales entre países, incluyendo importaciones, exportaciones, logística, regulaciones aduaneras y estrategias de negocios globales.",
            preguntas: [
                "Me interesa conocer cómo funcionan los mercados internacionales.",
                "Disfruto analizar acuerdos comerciales entre países.",
                "Me motiva entender cómo las exportaciones e importaciones afectan la economía.",
                "Me gustaría aprender sobre logística y distribución a nivel global.",
                "Me atrae el impacto de la globalización en los negocios.",
                "Me interesa el intercambio cultural y la negociación con personas de otros países."
            ]
        },
        contaduria: {
            nombreDisplay: "Contaduría",
            descripcion: "Se ocupa del registro, análisis e interpretación de la información financiera de una entidad para la toma de decisiones, el cumplimiento fiscal y el control de recursos.",
            preguntas: [
                "Me gusta analizar datos y hacer cálculos financieros.",
                "Me interesa la transparencia en el manejo de los recursos de una empresa.",
                "Disfruto encontrar patrones en la información y hacer reportes.",
                "Me motiva entender la importancia de los impuestos y la contabilidad en la economía.",
                "Me gustaría asesorar empresas para mejorar su administración financiera.",
                "Me atrae la precisión y el orden en los registros contables."
            ]
        },
        derecho: {
            nombreDisplay: "Derecho",
            descripcion: "Estudia el conjunto de normas y principios que regulan la conducta humana en sociedad, buscando la justicia y el orden a través de la interpretación y aplicación de las leyes.",
            preguntas: [
                "Me interesa analizar y debatir sobre temas de justicia y derechos humanos.",
                "Disfruto argumentar mis ideas con fundamentos lógicos.",
                "Me motiva aprender sobre leyes y su impacto en la sociedad.",
                "Me gustaría ayudar a personas a resolver problemas legales.",
                "Me atrae el proceso de investigación y análisis en casos jurídicos.",
                "Me apasiona la ética y la equidad en la toma de decisiones."
            ]
        },
        disenoGrafico: {
            nombreDisplay: "Diseño Gráfico",
            descripcion: "Combina creatividad y herramientas tecnológicas para comunicar mensajes visualmente a través de imágenes, tipografía y composición en medios impresos y digitales.",
            preguntas: [
                "Me interesa transformar ideas en imágenes atractivas y funcionales.",
                "Disfruto trabajar con colores, formas y tipografías para comunicar mensajes.",
                "Me motiva aprender sobre tendencias en diseño y publicidad.",
                "Me gustaría desarrollar identidad visual para marcas y empresas.",
                "Me atrae la edición y manipulación de imágenes digitales.",
                "Me apasiona la creatividad aplicada a soluciones visuales."
            ]
        },
        fisioterapia: {
            nombreDisplay: "Fisioterapia",
            descripcion: "Se dedica a la prevención, tratamiento y rehabilitación de lesiones y disfunciones del movimiento corporal mediante técnicas manuales, ejercicio terapéutico y agentes físicos.",
            preguntas: [
                "Me interesa el funcionamiento del cuerpo humano y su rehabilitación.",
                "Disfruto ayudar a las personas a recuperar movilidad y bienestar.",
                "Me motiva aprender sobre técnicas de terapia física.",
                "Me gustaría trabajar en la prevención y tratamiento de lesiones.",
                "Me atrae la idea de combinar ciencia y salud para mejorar vidas.",
                "Me apasiona el estudio del movimiento y la postura corporal."
            ]
        },
        gastronomia: {
            nombreDisplay: "Gastronomía",
            descripcion: "Estudia la relación entre la comida, la cultura y las técnicas culinarias. Prepara profesionales para la creación, preparación y gestión en el ámbito de la alimentación.",
            preguntas: [
                "Me interesa la cultura culinaria de diferentes países.",
                "Disfruto experimentar con ingredientes y técnicas de cocina.",
                "Me motiva crear nuevas recetas y combinaciones de sabores.",
                "Me gustaría conocer la historia y evolución de la gastronomía.",
                "Me atrae la organización y operación en la cocina profesional.",
                "Me apasiona la presentación y estética en los platillos."
            ]
        },
        ingSistemas: {
            nombreDisplay: "Ingeniería en Sistemas Computacionales",
            descripcion: "Se enfoca en el diseño, desarrollo, implementación y mantenimiento de software, hardware y sistemas de información para resolver problemas mediante la tecnología.",
            preguntas: [
                "Me interesa desarrollar soluciones tecnológicas para problemas actuales.",
                "Disfruto programar y entender el funcionamiento de los sistemas digitales.",
                "Me motiva la seguridad informática y la protección de datos.",
                "Me gustaría diseñar y optimizar software para distintas aplicaciones.",
                "Me atrae la inteligencia artificial y su impacto en el mundo.",
                "Me apasiona la lógica y el pensamiento estructurado en la tecnología."
            ]
        },
        mercadotecnia: {
            nombreDisplay: "Mercadotecnia",
            descripcion: "Analiza el mercado y los consumidores para desarrollar estrategias que permitan posicionar productos o servicios, satisfacer necesidades y alcanzar objetivos comerciales.",
            preguntas: [
                "Me interesa analizar las tendencias del mercado y el comportamiento del consumidor.",
                "Disfruto crear estrategias para posicionar productos o servicios.",
                "Me motiva la creatividad en la publicidad y el branding.",
                "Me gustaría desarrollar campañas de marketing digital.",
                "Me atrae la investigación de mercado y el análisis de datos.",
                "Me apasiona la innovación en la manera de conectar con el público."
            ]
        },
        nutricion: {
            nombreDisplay: "Nutrición",
            descripcion: "Ciencia que estudia los alimentos y su relación con la salud. Se enfoca en evaluar necesidades nutricionales y diseñar planes de alimentación para individuos y grupos.",
            preguntas: [
                "Me interesa la relación entre la alimentación y la salud.",
                "Disfruto aprender sobre los beneficios de los distintos nutrientes.",
                "Me motiva ayudar a las personas a mejorar sus hábitos alimenticios.",
                "Me gustaría diseñar planes de alimentación personalizados.",
                "Me atrae el estudio del metabolismo y su impacto en el bienestar.",
                "Me apasiona la investigación sobre alimentación y enfermedades."
            ]
        },
        pedagogia: {
            nombreDisplay: "Pedagogía",
            descripcion: "Estudia los procesos de enseñanza y aprendizaje en diferentes contextos educativos. Analiza y diseña estrategias y metodologías para mejorar la educación.",
            preguntas: [
                "Me interesa el impacto de la educación en el desarrollo social.",
                "Disfruto compartir conocimientos y ayudar a otros a aprender.",
                "Me motiva analizar métodos de enseñanza innovadores.",
                "Me gustaría diseñar estrategias para mejorar la educación.",
                "Me atrae la psicología del aprendizaje y el desarrollo infantil.",
                "Me apasiona la enseñanza como herramienta para el cambio social."
            ]
        },
        psicologia: {
            nombreDisplay: "Psicología",
            descripcion: "Ciencia que estudia el comportamiento humano, los procesos mentales y las emociones. Busca comprender y ayudar a las personas a mejorar su bienestar y salud mental.",
            preguntas: [
                "Me interesa entender el comportamiento humano y las emociones.",
                "Disfruto escuchar y ayudar a las personas a resolver problemas personales.",
                "Me motiva analizar cómo el entorno influye en la mente de las personas.",
                "Me gustaría trabajar en la prevención y tratamiento de trastornos emocionales.",
                "Me atrae la investigación en neurociencia y desarrollo personal.",
                "Me apasiona el estudio de la mente y su complejidad."
            ]
        }
        // Add more careers here if needed following the same structure
    };

    // --- Helper Function: Shuffle Array (Fisher-Yates Algorithm) ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    // --- Function: Render Shuffled Questions into HTML ---
    function renderizarPreguntasAleatorias() {
        let todasLasPreguntas = [];
        totalPreguntas = 0; // Reset total question count

        // 1. Collect all questions, associating them with their career ID and original index
        for (const idCarrera in carreras) {
            carreras[idCarrera].preguntas.forEach((pregunta, index) => {
                todasLasPreguntas.push({
                    texto: pregunta,
                    idCarrera: idCarrera,
                    originalIndex: index // Keep original index for the 'name' attribute
                });
                totalPreguntas++; // Increment total count
            });
        }

        // 2. Shuffle the combined list of questions
        shuffleArray(todasLasPreguntas);

        // 3. Generate HTML for the shuffled questions
        let htmlPreguntas = '';
        todasLasPreguntas.forEach((preguntaData, displayedIndex) => {
            // Construct the unique name for radio buttons using career ID and original index
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

        // 4. Insert the generated HTML into the container and update progress bar
        preguntasContainer.innerHTML = htmlPreguntas;
        updateProgressBar(); // Initialize progress bar at 0%
    }

    // --- Function: Update Progress Bar ---
    function updateProgressBar() {
        // Count how many radio buttons are currently checked
        const respuestasSeleccionadas = form.querySelectorAll('input[type="radio"]:checked').length;
        // Calculate percentage, avoiding division by zero if no questions exist
        const porcentaje = totalPreguntas > 0 ? Math.round((respuestasSeleccionadas / totalPreguntas) * 100) : 0;

        // Update the width of the progress bar and the text content if elements exist
        if (progressBar && progressText) {
            progressBar.style.width = `${porcentaje}%`;
            progressText.textContent = `${porcentaje}% completado`;
        }
    }

    // --- Function: Calculate and Display Results ---
    function calcularResultado() {
        const puntajes = {};
        let totalPreguntasRespondidas = 0;

        // 1. Initialize scores for each career to 0
        for (const idCarrera in carreras) {
            puntajes[idCarrera] = 0;
        }

        // 2. Get all checked radio buttons
        const respuestas = form.querySelectorAll('input[type="radio"]:checked');
        totalPreguntasRespondidas = respuestas.length;

        // 3. Validate if all questions have been answered
        if (totalPreguntasRespondidas < totalPreguntas) {
            // Display error message only if it's not already shown
            if (!resultadoDiv.querySelector('.error-message')) {
                resultadoDiv.innerHTML = `<p class="error-message" style="color: red; font-weight: bold;">Por favor, responde todas las ${totalPreguntas} preguntas para ver tu resultado.</p>`;
                resultadoDiv.style.display = 'block'; // Ensure the div is visible
                // Scroll to the error message smoothly
                resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // If error is already visible, just scroll to it again
                resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return; // Stop calculation
        }

        // Clear any previous error message if validation passes
        if (resultadoDiv.querySelector('.error-message')) {
            resultadoDiv.innerHTML = '';
        }

        // 4. Sum the scores for each career based on selected values
        respuestas.forEach(input => {
            const name = input.name; // e.g., "adminEmpresas-q0"
            const idCarrera = name.split('-')[0]; // Extracts "adminEmpresas"
            const valor = parseInt(input.value); // Gets 1, 2, or 3

            // Add score if the career ID is valid
            if (puntajes.hasOwnProperty(idCarrera)) {
                puntajes[idCarrera] += valor;
            }
        });

        // 5. Find the highest score and identify all careers matching that score (handling ties)
        let mejoresCarrerasIds = [];
        let maxPuntaje = -1;

        for (const idCarrera in puntajes) {
            const puntajeActual = puntajes[idCarrera];

            if (puntajeActual > maxPuntaje) {
                // New highest score found
                maxPuntaje = puntajeActual;
                mejoresCarrerasIds = [idCarrera]; // Reset the list with the new top career
            } else if (puntajeActual === maxPuntaje && maxPuntaje !== -1) {
                // Found a tie with the current highest score
                mejoresCarrerasIds.push(idCarrera); // Add this career to the list of ties
            }
        }

        // 6. Display the results based on whether there was a single top career or a tie
        if (mejoresCarrerasIds.length > 0 && maxPuntaje >= 0) { // Check if valid results were found
            resultadoDiv.innerHTML = `<h3>Resultado del Test Vocacional</h3>`; // Common title

            // CASE 1: Single Recommended Career
            if (mejoresCarrerasIds.length === 1) {
                const idCarreraUnica = mejoresCarrerasIds[0];
                const carreraRecomendada = carreras[idCarreraUnica];
                // Calculate max possible score for this specific career
                const maxPosibleCarrera = carreraRecomendada.preguntas.length * 3;
                resultadoDiv.innerHTML += `
                    <p>Basado en tus respuestas, tu perfil muestra una fuerte inclinación hacia:</p>
                    <h4>${carreraRecomendada.nombreDisplay}</h4>
                    <p>${carreraRecomendada.descripcion}</p>
                    <p><strong>Puntaje obtenido:</strong> ${maxPuntaje} / ${maxPosibleCarrera}</p>
                    <p><em>Recuerda que este test es una guía. ¡Investiga más sobre esta y otras carreras que te interesen!</em></p>
                `;
            }
            // CASE 2: Tie Between Multiple Careers
            else {
                 // Calculate max possible score (assuming tied careers have same # questions or using the first one)
                 const numPreguntasPrimeraEmpatada = carreras[mejoresCarrerasIds[0]].preguntas.length;
                 const maxPosibleComun = numPreguntasPrimeraEmpatada * 3; // Adjust if necessary

                 resultadoDiv.innerHTML += `<p>Basado en tus respuestas, muestras interés destacado y similar en varias áreas (Puntaje: <strong>${maxPuntaje} / ${maxPosibleComun}</strong>):</p><ul>`;
                 // Loop through the tied career IDs and list them
                 mejoresCarrerasIds.forEach(id => {
                     resultadoDiv.innerHTML += `<li><strong>${carreras[id].nombreDisplay}:</strong> ${carreras[id].descripcion}</li>`;
                 });
                 resultadoDiv.innerHTML += `</ul><p><em>Tienes intereses diversos y prometedores en estos campos. Te recomendamos explorar estas opciones más a fondo. ¡Este test es solo el comienzo!</em></p>`;
            }
            // Scroll smoothly to the beginning of the result section
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } else {
            // Fallback message if no valid result could be determined
            resultadoDiv.innerHTML = `<p>No se pudo determinar un resultado claro con las respuestas proporcionadas. Intenta responder nuevamente asegurándote de completar todas las preguntas.</p>`;
        }

        // Make the result section visible
        resultadoDiv.style.display = 'block';
    }

    // --- Initialization ---
    renderizarPreguntasAleatorias(); // Generate and display questions on page load
    submitButton.addEventListener('click', calcularResultado); // Add click listener to the submit button
    form.addEventListener('change', updateProgressBar); // Add change listener to the form to update progress bar on selection
    resultadoDiv.style.display = 'none'; // Hide the result section initially

}); // End of DOMContentLoaded event listener