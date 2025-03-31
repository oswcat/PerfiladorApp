document.addEventListener('DOMContentLoaded', () => {
    const preguntasContainer = document.getElementById('preguntas-container');
    const form = document.getElementById('vocational-test');
    const submitButton = document.getElementById('submit-button');
    const resultadoDiv = document.getElementById('resultado');
    // Elementos de la barra de progreso
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    let totalPreguntas = 0; // Variable para almacenar el total de preguntas

    // --- Datos del Test (Sin cambios aquí, se omite por brevedad) ---
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


    // --- Función para barajar un array (Fisher-Yates) ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Función para Generar las Preguntas Aleatorias en el HTML ---
    function renderizarPreguntasAleatorias() {
        let todasLasPreguntas = [];
        totalPreguntas = 0; // Reiniciar contador

        for (const idCarrera in carreras) {
            carreras[idCarrera].preguntas.forEach((pregunta, index) => {
                todasLasPreguntas.push({
                    texto: pregunta,
                    idCarrera: idCarrera,
                    originalIndex: index
                });
                totalPreguntas++; // Incrementar el contador total
            });
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

        preguntasContainer.innerHTML = htmlPreguntas;
        updateProgressBar(); // Actualizar barra a 0% inicialmente
    }

    // --- Función para Actualizar la Barra de Progreso ---
    function updateProgressBar() {
        const respuestasSeleccionadas = form.querySelectorAll('input[type="radio"]:checked').length;
        const porcentaje = totalPreguntas > 0 ? Math.round((respuestasSeleccionadas / totalPreguntas) * 100) : 0;

        if (progressBar && progressText) {
            progressBar.style.width = `${porcentaje}%`;
            progressText.textContent = `${porcentaje}% completado`;
        }
    }


    // --- Función para Calcular el Resultado (Sin cambios internos, solo validación) ---
    function calcularResultado() {
        const puntajes = {};
        let totalPreguntasRespondidas = 0;

        for (const idCarrera in carreras) {
            puntajes[idCarrera] = 0;
        }

        const respuestas = form.querySelectorAll('input[type="radio"]:checked');
        totalPreguntasRespondidas = respuestas.length;

        // *** Validación: Asegurarse de que todas las preguntas estén respondidas ***
        if (totalPreguntasRespondidas < totalPreguntas) {
             // Si ya hay un mensaje de error, no añadir otro
             if (!resultadoDiv.querySelector('.error-message')) {
                resultadoDiv.innerHTML = `<p class="error-message" style="color: red; font-weight: bold;">Por favor, responde todas las ${totalPreguntas} preguntas para ver tu resultado.</p>`;
                resultadoDiv.style.display = 'block';
                resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
             } else {
                 // Si ya hay error, solo hacer scroll
                 resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
             }
             return; // Detener cálculo
        }
         // Si la validación pasa y había un mensaje de error, limpiarlo antes de mostrar resultado
         if(resultadoDiv.querySelector('.error-message')){
             resultadoDiv.innerHTML = '';
         }


        respuestas.forEach(input => {
            const name = input.name;
            const idCarrera = name.split('-')[0];
            const valor = parseInt(input.value);

            if (puntajes.hasOwnProperty(idCarrera)) {
                puntajes[idCarrera] += valor;
            }
        });

        let mejoresCarrerasIds = [];
        let maxPuntaje = -1;

        for (const idCarrera in puntajes) {
            if (puntajes[idCarrera] > maxPuntaje) {
                maxPuntaje = puntajes[idCarrera];
                mejoresCarrerasIds = [idCarrera];
            } else if (puntajes[idCarrera] === maxPuntaje) {
                mejoresCarrerasIds.push(idCarrera);
            }
        }

        if (mejoresCarrerasIds.length > 0 && maxPuntaje >= 0) {
            resultadoDiv.innerHTML = `<h3>Resultado del Test Vocacional</h3>`;

            if (mejoresCarrerasIds.length === 1) {
                 const carreraRecomendada = carreras[mejoresCarrerasIds[0]];
                resultadoDiv.innerHTML += `
                    <p>Basado en tus respuestas, tu perfil muestra una fuerte inclinación hacia:</p>
                    <h4>${carreraRecomendada.nombreDisplay}</h4>
                    <p>${carreraRecomendada.descripcion}</p>
                    <p><strong>Puntaje obtenido:</strong> ${maxPuntaje} / ${carreras[mejoresCarrerasIds[0]].preguntas.length * 3}</p> <!-- Max puntaje posible para esa carrera -->
                    <p><em>Recuerda que este test es una guía. Investiga más sobre esta y otras carreras que te interesen.</em></p>
                `;
            } else {
                 const maxPosiblePorCarrera = carreras[mejoresCarrerasIds[0]].preguntas.length * 3; // Asumimos que todas las carreras empatadas tienen la misma cantidad de preguntas en este test. Si no, habría que calcularlo individualmente.
                 resultadoDiv.innerHTML += `<p>Basado en tus respuestas, tu perfil muestra inclinación hacia varias áreas con un puntaje de <strong>${maxPuntaje} / ${maxPosiblePorCarrera}</strong>:</p><ul>`;
                 mejoresCarrerasIds.forEach(id => {
                     resultadoDiv.innerHTML += `<li><strong>${carreras[id].nombreDisplay}:</strong> ${carreras[id].descripcion}</li>`;
                 });
                 resultadoDiv.innerHTML += `</ul><p><em>Tienes intereses diversos. Podrías explorar estas opciones más a fondo. Recuerda que este test es una guía.</em></p>`;
            }
            resultadoDiv.scrollIntoView({ behavior: 'smooth' });

        } else {
            resultadoDiv.innerHTML = `<p>No se pudo determinar un resultado. Asegúrate de haber respondido las preguntas.</p>`;
        }
         resultadoDiv.style.display = 'block';
    }

    // --- Inicialización ---
    renderizarPreguntasAleatorias(); // Dibuja preguntas aleatorias y calcula totalPreguntas
    submitButton.addEventListener('click', calcularResultado);
    form.addEventListener('change', updateProgressBar); // Actualiza la barra cada vez que se cambia una respuesta
    resultadoDiv.style.display = 'none';

}); // Fin del DOMContentLoaded