document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const preguntasContainer = document.getElementById('preguntas-container');
    const form = document.getElementById('vocational-test');
    const submitButton = document.getElementById('submit-button');
    const resultadoDiv = document.getElementById('resultado');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    // We will get the WhatsApp button dynamically after creating it in results
    const contactSection = document.getElementById('contact-section');     // Contact Form Section
    const contactForm = document.getElementById('contact-form');           // The actual contact form
    const hiddenCareerInput = document.getElementById('hidden-career-interest'); // Hidden input in contact form
    const formStatus = document.getElementById('form-status-message');    // Message area for form status

    // --- Global variables ---
    let totalPreguntas = 0; // To store total questions count
    let lastMilestoneReached = 0; // For tracking GA progress milestones
    let testStarted = false; // To track if the first answer was given for GA

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

        // 1. Collect all questions
        for (const idCarrera in carreras) {
            if (carreras.hasOwnProperty(idCarrera)) {
                carreras[idCarrera].preguntas.forEach((pregunta, index) => {
                    todasLasPreguntas.push({
                        texto: pregunta,
                        idCarrera: idCarrera,
                        originalIndex: index
                    });
                    totalPreguntas++;
                });
            }
        }

        // 2. Shuffle questions
        shuffleArray(todasLasPreguntas);

        // 3. Generate HTML
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

        // 4. Insert HTML and update progress bar initially
        if (preguntasContainer) {
            preguntasContainer.innerHTML = htmlPreguntas;
        }
        updateProgressBar(); // Call initial progress bar update

        // Reset GA progress tracking if questions are re-rendered
        lastMilestoneReached = 0;
        testStarted = false;
    }

    // --- Function: Update Progress Bar & Track GA Progress ---
    function updateProgressBar() {
        if (!form || typeof gtag === 'undefined') return; // Exit if form or gtag not available

        // GA Event: Track test start on first interaction
        if (!testStarted && form.querySelector('input[type="radio"]:checked')) {
            testStarted = true;
            gtag('event', 'test_start', {
                'event_category': 'Vocational Test',
                'event_label': 'First Question Answered'
            });
            console.log("GA Event: test_start"); // For debugging
        }

        // Calculate progress
        const answeredQuestions = new Set();
        form.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            answeredQuestions.add(radio.name);
        });
        const respuestasSeleccionadas = answeredQuestions.size;
        const porcentaje = totalPreguntas > 0 ? Math.round((respuestasSeleccionadas / totalPreguntas) * 100) : 0;

        // Update visual progress bar
        if (progressBar && progressText) {
            progressBar.style.width = `${porcentaje}%`;
            progressText.textContent = `${porcentaje}% completado`;
        }

        // GA Event: Track Progress Milestones
        const milestones = [25, 50, 75, 100]; // Define milestones
        for (const milestone of milestones) {
            // Check if current percentage hits a milestone AND it's a *new* milestone
            if (porcentaje >= milestone && lastMilestoneReached < milestone) {
                gtag('event', 'test_progress', {
                    'event_category': 'Vocational Test',
                    'event_label': `Progress Reached - ${milestone}%`,
                    'value': milestone // Send percentage as value for potential analysis
                });
                console.log(`GA Event: test_progress - ${milestone}%`); // For debugging
                lastMilestoneReached = milestone; // Update the last milestone reached
                break; // Fire only one milestone event per update to avoid duplicates if progress jumps significantly
            }
        }

        // Reset GA tracking if user somehow un-answers all questions (unlikely with radios)
        if(respuestasSeleccionadas === 0) {
             lastMilestoneReached = 0;
             testStarted = false;
        }
    }

    // --- Function: Calculate and Display Results & Track GA Completion ---
    function calcularResultado() {
        if (!form || !resultadoDiv) return;

        const puntajes = {};
        let totalPreguntasRespondidas = 0;

        // 1. Initialize scores
        for (const idCarrera in carreras) {
             if (carreras.hasOwnProperty(idCarrera)) {
                puntajes[idCarrera] = 0;
            }
        }

        // 2. Get answers and count unique answered questions
        const respuestas = form.querySelectorAll('input[type="radio"]:checked');
        const answeredQuestionsNames = new Set(Array.from(respuestas).map(r => r.name));
        totalPreguntasRespondidas = answeredQuestionsNames.size;

        // 3. Validation: Check if all questions are answered
        if (totalPreguntasRespondidas < totalPreguntas) {
            resultadoDiv.innerHTML = `<p class="error-message">Por favor, responde todas las ${totalPreguntas} preguntas para ver tu resultado.</p>`;
            resultadoDiv.style.display = 'block';
            if (contactSection) contactSection.style.display = 'none';
             const existingShareButton = document.getElementById('share-whatsapp-button');
             if(existingShareButton) existingShareButton.style.display = 'none';
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return; // Stop execution
        }

        // --- If validation passes, proceed to calculate and track GA ---

        // 4. Sum scores based on answers
        respuestas.forEach(input => {
            const name = input.name;
            const idCarrera = name.split('-')[0];
            const valor = parseInt(input.value, 10);
            if (puntajes.hasOwnProperty(idCarrera)) {
                puntajes[idCarrera] += valor;
            }
        });

        // 5. Find the best career(s) based on score (including ties)
        let mejoresCarrerasIds = [];
        let maxPuntaje = -1;
        for (const idCarrera in puntajes) {
             if (puntajes.hasOwnProperty(idCarrera)) {
                const puntajeActual = puntajes[idCarrera];
                if (puntajeActual > maxPuntaje) {
                    maxPuntaje = puntajeActual;
                    mejoresCarrerasIds = [idCarrera]; // New highest score
                } else if (puntajeActual === maxPuntaje && maxPuntaje !== -1) {
                    mejoresCarrerasIds.push(idCarrera); // Tie with current highest
                }
            }
        }

        // 6. Prepare and Display the results
        if (mejoresCarrerasIds.length > 0 && maxPuntaje >= 0) {

             // *** GA Event: Track Test Completion ***
             // Create a user-friendly string of resulting careers (pipe-separated for potential multi-select filtering in GA)
             const resultNames = mejoresCarrerasIds.map(id => carreras[id].nombreDisplay).join(' | ');
             if (typeof gtag !== 'undefined') { // Check if gtag is loaded
                gtag('event', 'test_complete', {
                    'event_category': 'Vocational Test',
                    'event_label': `Result: ${resultNames}`, // Send resulting careers names
                    'value': mejoresCarrerasIds.length,       // Number of resulting careers (1 for single, >1 for tie) might be useful
                    'result_careers': resultNames            // Custom parameter if needed for dimensions/audiences
                });
                console.log(`GA Event: test_complete - Result: ${resultNames}`); // For debugging
             }

            // --- Prepare Result HTML ---
            let resultContentHTML = ''; // Holds the dynamic part of the result text/list
            let fullResultHTML = '';    // To rebuild the entire result div content including title and button

            // CASE 1: Single Recommended Career
            if (mejoresCarrerasIds.length === 1) {
                const idCarreraUnica = mejoresCarrerasIds[0];
                const carreraRecomendada = carreras[idCarreraUnica];
                const maxPosibleCarrera = carreraRecomendada.preguntas.length * 3; // Calculate max score for this specific career
                resultContentHTML = `
                    <p>Basado en tus respuestas, tu perfil muestra una fuerte inclinación hacia:</p>
                    <h4>${carreraRecomendada.nombreDisplay}</h4>
                    <p>${carreraRecomendada.descripcion}</p>
                    <p><strong>Puntaje obtenido:</strong> ${maxPuntaje} / ${maxPosibleCarrera}</p>
                    <p><em>Recuerda que este test es una guía. ¡Investiga más sobre esta y otras carreras que te interesen!</em></p>
                `;
            }
            // CASE 2: Tie Between Multiple Careers
            else {
                 // Assume all careers have the same number of questions for max score calculation in case of a tie
                 const numPreguntasPrimeraEmpatada = carreras[mejoresCarrerasIds[0]].preguntas.length;
                 const maxPosibleComun = numPreguntasPrimeraEmpatada * 3;
                 resultContentHTML = `<p>Basado en tus respuestas, muestras interés destacado y similar en varias áreas (Puntaje: <strong>${maxPuntaje} / ${maxPosibleComun}</strong>):</p><ul>`;
                 mejoresCarrerasIds.forEach(id => {
                     resultContentHTML += `<li><strong>${carreras[id].nombreDisplay}:</strong> ${carreras[id].descripcion}</li>`;
                 });
                 resultContentHTML += `</ul><p><em>Tienes intereses diversos y prometedores en estos campos. Te recomendamos explorar estas opciones más a fondo. ¡Este test es solo el comienzo!</em></p>`;
            }

            // --- Build the Full Result Div Content (including share button) ---
            fullResultHTML = `
                <h3>Resultado del Test Vocacional</h3>
                ${resultContentHTML}
                <button type="button" id="share-whatsapp-button" class="share-button" style="display: none;">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16" style="margin-right: 8px; vertical-align: middle;">
                         <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-0.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                     </svg>
                     Compartir Resultado en WhatsApp
                 </button>
            `;

            // --- Update the DOM ---
            resultadoDiv.innerHTML = fullResultHTML; // Set the complete HTML for the results section
            resultadoDiv.style.display = 'block';     // Make the results section visible

            // --- Setup Share Button (now that it exists in the DOM) ---
            const currentShareButton = resultadoDiv.querySelector('#share-whatsapp-button');
            if (currentShareButton) {
                currentShareButton.onclick = () => {
                    // *** GA Event: Track WhatsApp Share Click ***
                    if (typeof gtag !== 'undefined') {
                         gtag('event', 'share', {
                              'method': 'WhatsApp',                  // Standard GA4 share parameter
                              'content_type': 'Vocational Test Result', // Describe what's being shared
                              'item_id': resultNames                // Pass career names as item ID (useful for analysis)
                         });
                         console.log(`GA Event: share - Method: WhatsApp, Content: ${resultNames}`); // Debugging
                    }
                    compartirWhatsApp(mejoresCarrerasIds, maxPuntaje); // Call the original share function
                };
                currentShareButton.style.display = 'inline-flex'; // Make the button visible
            }

            // --- Show Contact Form ---
            if (contactSection && hiddenCareerInput) {
                const recommendedCareerNames = mejoresCarrerasIds.map(id => carreras[id].nombreDisplay).join(', ');
                hiddenCareerInput.value = recommendedCareerNames; // Pre-fill hidden input for the form
                contactSection.style.display = 'block';           // Show the contact form section
            }

            // --- Scroll to results title for better UX ---
            const resultTitle = resultadoDiv.querySelector('h3');
            if (resultTitle) {
                 resultTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

        } else {
             // Fallback if no clear result could be determined (should be rare if validation works)
             resultadoDiv.innerHTML = `<p class="error-message">No se pudo determinar un resultado claro. Por favor, asegúrate de responder todas las preguntas e intenta de nuevo.</p>`;
             resultadoDiv.style.display = 'block';
             // Ensure contact form and any potential share button are hidden
             if (contactSection) contactSection.style.display = 'none';
             const existingShareButton = document.getElementById('share-whatsapp-button');
             if(existingShareButton) existingShareButton.style.display = 'none';
        }
    }


    // --- Function: Share Results on WhatsApp ---
    function compartirWhatsApp(careerIds, score) {
         // --- IMPORTANT: Verify this URL points to your actual live test page ---
         const testUrl = 'https://oswcat.github.io/PerfiladorApp/'; // Example URL from original script
         // --- ---

        let messageText = '';
        let careerNames = careerIds.map(id => carreras[id].nombreDisplay);

        messageText = ` ¡Hice el test vocacional de UNIREM y este es mi resultado!\n\n`;

        if (careerNames.length === 1) {
            messageText += `Mi perfil muestra una fuerte inclinación hacia: *${careerNames[0]}*.`;
        } else {
            messageText += `Muestro interés destacado en varias áreas:\n - *${careerNames.join('*\n - *')}*`;
        }

        messageText += `\n\n ¡Descubre tu vocación también!\n${testUrl}`;
        // Adding UNIREM contact details from original script
        messageText += `\n\n Encuentra más sobre UNIREM en Facebook, Instagram y TikTok: @UNIREM.MX`;
        messageText += `\n\n Llamanos al 5550370100 o envía un WhatsApp al 5546190122 para más información.`;

        const encodedMessage = encodeURIComponent(messageText);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank'); // Open WhatsApp in a new tab
    }


    async function handleContactFormSubmit(event) {
        event.preventDefault();
        if (!contactForm || !formStatus) return;
    
        formStatus.textContent = 'Enviando...';
        formStatus.className = 'form-status'; // Reset classes
    
        const formData = new FormData(contactForm);
    
        // --- USA LA NUEVA URL DE GOOGLE APPS SCRIPT ---
        const googleAppScriptUrl = 'https://script.google.com/macros/s/AKfycbyiwMWpW2ha7bXH-N2jwqx8uvylYRGrgOZ_ykn34RF9INl343XNRa0Gm9Hz8A7cL8SKCQ/exec'; // <-- ¡¡Pega tu URL aquí!!
        // --- ---
    
        if (googleAppScriptUrl === 'https://script.google.com/macros/s/AKfycbyiwMWpW2ha7bXH-N2jwqx8uvylYRGrgOZ_ykn34RF9INl343XNRa0Gm9Hz8A7cL8SKCQ/exec' || !googleAppScriptUrl) {
             console.error("Google Apps Script URL no está definida en script.js.");
             formStatus.textContent = 'Error de configuración: URL no definida.';
             formStatus.classList.add('error');
             return;
        }
    
        try {
            // Envía los datos a Google Apps Script
            const response = await fetch(googleAppScriptUrl, {
                method: 'POST',
                // Apps Script suele manejar FormData directamente, pero si falla,
                // podrías necesitar convertir formData a otro formato o ajustar el script.
                // Por ahora, intentamos con FormData.
                body: formData,
                // Importante para evitar errores CORS raros con Apps Script a veces:
                mode: 'cors', // Aunque Apps Script maneja CORS si está bien desplegado, ser explícito no daña
                // No establezcas 'Content-Type' manualmente cuando uses FormData,
                // el navegador lo hará correctamente con el 'boundary' necesario.
            });
    
            // Google Apps Script devuelve JSON, así que lo parseamos
            const data = await response.json(); // Espera la respuesta JSON del script
    
            // Verificamos si la respuesta del script indica éxito
            if (response.ok && data.result === 'success') {
                // *** GA Event: Track Lead Generation (sin cambios) ***
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
                formStatus.classList.add('success');
                contactForm.reset();
    
            } else {
                 // Hubo un error, ya sea en la red o reportado por el Apps Script
                 console.error('Error enviando a Google Apps Script:', data.message || 'Respuesta no OK');
                 // Muestra el mensaje de error del script si existe, o uno genérico
                 formStatus.textContent = `Error al enviar: ${data.message || 'No se pudo completar la solicitud.'}. Intenta de nuevo.`;
                 formStatus.classList.add('error');
            }
    
        } catch (error) {
            // Error de red o al parsear JSON
            console.error('Error de Red o Fetch:', error);
            formStatus.textContent = 'Error de conexión o respuesta inválida. Verifica tu internet e intenta de nuevo.';
            formStatus.classList.add('error');
        }
    }
    // --- Initialization and Event Listeners ---

    // 1. Render questions when the DOM is ready
    renderizarPreguntasAleatorias();

    // 2. Add listener to the main test submit button
    if (submitButton) {
        submitButton.addEventListener('click', calcularResultado);
    }

    // 3. Add listener to the form itself to track changes for progress bar/GA events
    if (form) {
        // 'change' event bubbles up from radio buttons
        form.addEventListener('change', updateProgressBar);
    }

    // 4. Add listener for the contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    // 5. Initial state: Hide results and contact form sections
    // The share button is hidden via style="display:none" in the generated HTML initially and shown later
    if (resultadoDiv) resultadoDiv.style.display = 'none';
    if (contactSection) contactSection.style.display = 'none';

}); // End of DOMContentLoaded wrapper