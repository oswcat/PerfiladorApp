document.addEventListener('DOMContentLoaded', () => {
    // --- Detectar página ---
    const pagePath = window.location.pathname;
    const isPreRegPage = pagePath.includes('preregistro.html');
    const isTestPage = pagePath.includes('test.html');
    const isWelcomePage = !isPreRegPage && !isTestPage;
    console.log(`Page detected: Welcome=${isWelcomePage}, PreReg=${isPreRegPage}, Test=${isTestPage}`);

    // --- Configuración y Variables Globales ---
    const CONFIG = {
        googleAppScriptUrl: 'https://script.google.com/macros/s/AKfycbyiwMWpW2ha7bXH-N2jwqx8uvylYRGrgOZ_ykn34RF9INl343XNRa0Gm9Hz8A7cL8SKCQ/exec',
        carrerasDataFile: './carreras.json',
        placeholderGASUrl: 'AQUI_VA_LA_URL'
    };
    // --- Definición de Habilidades (CON DESCRIPCIONES COMPLETAS) ---
    const HABILIDADES_DEFINICIONES = {
        analitico: {
            label: "Análisis - Lógica",
            maxScore: 0,
            descripcion: "Capacidad para descomponer problemas complejos, usar la lógica y el razonamiento, identificar patrones y trabajar con datos de manera estructurada."
        },
        creativo: {
            label: "Creatividad - Expresión Artística",
            maxScore: 0,
            descripcion: "Habilidad para generar ideas originales, expresarse a través de formas artísticas (visual, escrita, musical), pensar de forma no convencional y encontrar soluciones innovadoras."
        },
        social: {
            label: "Interacción - Comunicación",
            maxScore: 0,
            descripcion: "Facilidad para interactuar con otros, comunicar ideas de forma clara (oral y escrita), persuadir, colaborar en equipo y establecer relaciones interpersonales."
        },
        tecnico: {
            label: "Técnica - Práctica",
            maxScore: 0,
            descripcion: "Destreza en el manejo de herramientas, maquinaria, software o procedimientos específicos. Interés por el funcionamiento de las cosas y la aplicación práctica del conocimiento."
        },
        organizativo: {
            label: "Organización - Gestión",
            maxScore: 0,
            descripcion: "Capacidad para planificar, establecer prioridades, gestionar recursos (tiempo, personas, materiales), coordinar tareas y mantener el orden y la eficiencia."
        },
        investigativo: {
            label: "Investigación - Curiosidad",
            maxScore: 0,
            descripcion: "Interés por explorar, indagar, hacer preguntas, buscar información, experimentar y descubrir nuevo conocimiento. Disfrute por el aprendizaje autónomo."
        },
        empatico: {
            label: "Empatía - Apoyo Asistencial",
            maxScore: 0,
            descripcion: "Habilidad para comprender y compartir los sentimientos de los demás, mostrar sensibilidad hacia sus necesidades y tener vocación de ayuda, cuidado o servicio."
        }
        // Añade más si tienes otras habilidades aquí
    };
    let totalPreguntas = 0;
    let lastMilestoneReached = 0;
    let testStartedGA = false;
    let carrerasData = null;
    const skillPercentageListContainerId = 'skill-list-area-dynamic';

    // --- Funciones Auxiliares ---
    function shuffleArray(array) { for(let i=array.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[array[i],array[j]]=[array[j],array[i]];}return array;}
    function displayError(element, message, isFatal = false, isSuccess = false) {
        if (!element) { console.error("No target for error/status:", message); return; }
        const isResultError = (element.id === 'resultado');
        const isFormStatus = element.classList.contains('form-status');
        const isTestErrorMsg = (element.id === 'test-error-message-container');

        let statusClass = '';
        if (isFormStatus) { statusClass = isSuccess ? 'success' : 'error'; element.classList.remove('success', 'error'); }
        const errorMsgClassForResult = isResultError ? 'error-message' : '';
        const inlineStyle = !isFormStatus && !isResultError && !isTestErrorMsg && element.id !== 'init-status' && element.id !== 'preguntas-container' ? 'color:red; text-align:center; padding:10px; border:1px dashed red;' : '';

        element.innerHTML = `<p class="${errorMsgClassForResult}" style="${inlineStyle}">${message}</p>`;
        if(element.classList.contains('form-status') || element.id === 'test-error-message-container' || element.id === 'init-status' || element.id === 'resultado' || element.id === 'preguntas-container') { element.classList.add('visible'); }
        if (statusClass) { element.classList.add(statusClass); }
        if (element.id === 'init-status' && isFatal) { const startBtn = document.getElementById('start-prereg-link'); if(startBtn) {startBtn.style.pointerEvents='none'; startBtn.style.opacity='0.5';}}
        if (element.id !== 'preguntas-container' && element.id !== 'init-status' && !isFormStatus && !isTestErrorMsg) { element.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
     }

    // --- LÓGICA PRE-REGISTRO (isPreRegPage) ---
    if (isPreRegPage) {
        const preregContactForm = document.getElementById('prereg-contact-form');
        const submitPreregButton = document.getElementById('submit-prereg-button');
        const preregFormStatus = document.getElementById('prereg-form-status');
        async function handlePreRegSubmit(event) { /* ... (Sin cambios) ... */ event.preventDefault(); if (!preregContactForm || !preregFormStatus || !submitPreregButton) return; const name = preregContactForm.querySelector('#prereg-name').value.trim(); const email = preregContactForm.querySelector('#prereg-email').value.trim(); const phone = preregContactForm.querySelector('#prereg-phone').value.trim(); if (!name || !email || !phone) { displayError(preregFormStatus, 'Completa todos los campos.', false, false); return; } const originalButtonHTML = submitPreregButton.innerHTML; submitPreregButton.disabled = true; submitPreregButton.innerHTML = 'Enviando...'; preregFormStatus.classList.remove('visible', 'success', 'error'); const formData = new FormData(preregContactForm); const data = Object.fromEntries(formData.entries()); data.form_source = data.form_source || 'prereg'; if (!CONFIG.googleAppScriptUrl) { console.error('GAS URL missing'); displayError(preregFormStatus, 'Error: No se puede registrar.', false, false); submitPreregButton.disabled = false; submitPreregButton.innerHTML = originalButtonHTML; return; } try { await fetch(CONFIG.googleAppScriptUrl, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) }); displayError(preregFormStatus, '¡Registro exitoso! Redirigiendo...', false, true); setTimeout(() => { window.location.href = 'test.html'; }, 1500); } catch (error) { console.error('Error pre-registro:', error); displayError(preregFormStatus, 'Hubo un problema. Inténtalo de nuevo.', false, false); submitPreregButton.disabled = false; submitPreregButton.innerHTML = originalButtonHTML; } }
        if (preregContactForm) { preregContactForm.addEventListener('submit', handlePreRegSubmit); } else { console.error("#prereg-contact-form no encontrado."); }
    }

    // --- LÓGICA TEST (isTestPage) ---
    if (isTestPage) {
        // Referencias test.html
        const preguntasContainer = document.getElementById('preguntas-container');
        const form = document.getElementById('vocational-test');
        const submitButton = document.getElementById('submit-button');
        const resultadoDiv = document.getElementById('resultado');
        const progressBarInner = document.getElementById('progress-bar');
        const progressContainer = progressBarInner ? progressBarInner.parentElement : null;
        const progressText = document.getElementById('progress-text');
        const contactSection = document.getElementById('contact-section');
        const contactForm = document.getElementById('contact-form');
        const hiddenCareerInput = document.getElementById('hidden-career-interest');
        const formStatus = document.getElementById('form-status-message');
        const shareButtonContainer = document.getElementById('share-button-container');
        const testSection = document.getElementById('test-section');
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        const testErrorMsgContainer = document.getElementById('test-error-message-container');

        // Funciones necesarias para test.html
        function calcularMaxScoresHabilidades() { for(const h in HABILIDADES_DEFINICIONES){if(HABILIDADES_DEFINICIONES.hasOwnProperty(h)){HABILIDADES_DEFINICIONES[h].maxScore=0;}} if(!carrerasData)return; for(const idC in carrerasData){if(carrerasData.hasOwnProperty(idC)&&Array.isArray(carrerasData[idC].preguntas)){carrerasData[idC].preguntas.forEach(p=>{if(p&&p.habilidad&&HABILIDADES_DEFINICIONES[p.habilidad]){HABILIDADES_DEFINICIONES[p.habilidad].maxScore+=3;}});}} console.log("Max scores:",HABILIDADES_DEFINICIONES);}

        // --- Render Shuffled Questions (Revisado) ---
        function renderizarPreguntasAleatorias() {
             if (!carrerasData || !preguntasContainer) {
                 console.error("Faltan datos de carreras o contenedor de preguntas.");
                 return { success: false, message: "Error interno al cargar datos." }; // Devolver objeto
             }
            let todasLasPreguntas = []; totalPreguntas = 0; let skippedCount = 0;
            for (const idC in carrerasData) { if (carrerasData.hasOwnProperty(idC) && Array.isArray(carrerasData[idC].preguntas)) { carrerasData[idC].preguntas.forEach((p, i) => { if (p && p.texto && p.habilidad && HABILIDADES_DEFINICIONES[p.habilidad]) { todasLasPreguntas.push({ id: `${idC}-q${i}`, texto: p.texto, habilidad: p.habilidad, idCarrera: idC }); totalPreguntas++; } else { skippedCount++; } }); } }
            if (totalPreguntas === 0) {
                console.error("No se encontraron preguntas válidas.");
                 return { success: false, message: `No hay preguntas válidas. ${skippedCount > 0 ? `(${skippedCount} omitidas).` : ''}` }; // Devolver objeto
            }
            if(submitButton) submitButton.style.display = 'block'; if(progressContainer) progressContainer.style.display = 'block';
            todasLasPreguntas = shuffleArray(todasLasPreguntas); let htmlPreguntas = '';
            todasLasPreguntas.forEach((pData, dIndex) => { const genOpt = (v, t) => `<label><input type="radio" name="${pData.id}" value="${v}" required data-habilidad="${pData.habilidad}"><span>${v}: ${t}</span></label>`; htmlPreguntas += `<div class="question" data-question-ref="${pData.id}"><p><span class="question-number">${dIndex + 1}.</span> ${pData.texto}</p><div class="options">${genOpt(1,"No me interesa")}${genOpt(2,"Podría interesarme")}${genOpt(3,"Me interesa")}</div></div>`; });
            preguntasContainer.innerHTML = htmlPreguntas; updateProgressBar(); lastMilestoneReached = 0; testStartedGA = false;
            return { success: true }; // Devolver objeto
         }

        // --- Update Progress Bar (Restaurado) ---
        function updateProgressBar() {
             if (!form || !progressContainer || !progressBarInner || !progressText || totalPreguntas === 0) return;
             const answered = new Set(Array.from(form.querySelectorAll('input[type="radio"]:checked')).map(r => r.name));
             const sel = answered.size; const perc = Math.round((sel / totalPreguntas) * 100);
             progressBarInner.style.width = `${perc}%`;
             progressText.textContent = `${perc}% completado`;
             progressContainer.setAttribute('aria-valuenow', perc);
             if (typeof gtag !== 'undefined') {
                 if (!testStartedGA && sel > 0) { testStartedGA = true; try { gtag('event', 'test_start', { 'event_category': 'Vocational Test', 'event_label': 'First Question Answered' }); console.log("GA: Test Start");} catch (e) {console.error("GA Error", e);} }
                 const mS = [25, 50, 75, 100];
                 for (const m of mS) { if (perc >= m && lastMilestoneReached < m) { try { gtag('event', 'test_progress', { 'event_category': 'Vocational Test', 'event_label': `Progress - ${m}%`, 'value': m }); console.log(`GA: Progress ${m}%`);} catch (e) {console.error("GA Error", e);} lastMilestoneReached = m; } }
                 if (sel === 0) { lastMilestoneReached = 0; testStartedGA = false; }
             }
        }

        // --- Generar Lista Habilidades y Mostrar Descripción Inline (Sin Cambios) ---
        function generarListaPorcentajes(puntajesNormalizados) { const container=resultadoDiv.querySelector(`#${skillPercentageListContainerId}`);if(!container){return;} container.innerHTML='';const listElement=document.createElement('ul');listElement.className='skill-percentage-list';listElement.setAttribute('aria-label','Detalle de porcentajes');container.appendChild(listElement);const sortedHabilidades=Object.entries(puntajesNormalizados).map(([k,p])=>({key:k,percentage:p,label:HABILIDADES_DEFINICIONES[k]?.label||k,desc:HABILIDADES_DEFINICIONES[k]?.descripcion||'N/A'})).sort((a,b)=>b.percentage-a.percentage);if(sortedHabilidades.length>0){sortedHabilidades.forEach(item=>{const wrapper=document.createElement('div');wrapper.className='skill-item-wrapper';const listItem=document.createElement('li');listItem.className='skill-percentage-list-item skill-item-clickable';listItem.dataset.skillKey=item.key;listItem.setAttribute('role','button');listItem.setAttribute('tabindex','0');listItem.setAttribute('aria-expanded','false');listItem.innerHTML=`<strong>${item.label}:</strong> <span>${item.percentage}%</span>`;const descriptionDiv=document.createElement('div');descriptionDiv.className='skill-description-inline';descriptionDiv.setAttribute('aria-hidden','true');descriptionDiv.innerHTML=`<p>${item.desc}</p>`;wrapper.appendChild(listItem);wrapper.appendChild(descriptionDiv);listElement.appendChild(wrapper);});}else{listElement.innerHTML='<div class="skill-item-wrapper"><li>No hay datos.</li></div>';}}
        function mostrarDescripcionHabilidadInline(clickedLiElement) { if(!clickedLiElement)return;const wrapper=clickedLiElement.closest('.skill-item-wrapper');if(!wrapper)return;const descriptionDiv=wrapper.querySelector('.skill-description-inline');if(!descriptionDiv)return;const isVisible=descriptionDiv.classList.contains('visible');const allWrappers=resultadoDiv.querySelectorAll(`#${skillPercentageListContainerId} .skill-item-wrapper`);allWrappers.forEach(w=>{const desc=w.querySelector('.skill-description-inline');const li=w.querySelector('.skill-percentage-list-item');if(w!==wrapper&&desc&&li){desc.classList.remove('visible');desc.setAttribute('aria-hidden','true');li.classList.remove('skill-item-active');li.setAttribute('aria-expanded','false');}});if(!isVisible){descriptionDiv.classList.add('visible');descriptionDiv.setAttribute('aria-hidden','false');clickedLiElement.classList.add('skill-item-active');clickedLiElement.setAttribute('aria-expanded','true');}else{descriptionDiv.classList.remove('visible');descriptionDiv.setAttribute('aria-hidden','true');clickedLiElement.classList.remove('skill-item-active');clickedLiElement.setAttribute('aria-expanded','false');}}

        // --- Calcular Resultado (Restaurado y con validación/scroll) ---
        function calcularResultado() {
             form.querySelectorAll('.question-unanswered').forEach(q => q.classList.remove('question-unanswered'));
             if (testErrorMsgContainer) testErrorMsgContainer.innerHTML = ''; else { console.error("#test-error-message-container missing"); return; }
             if (!form || !resultadoDiv || !contactSection || !carrerasData || !shareButtonContainer) { if(resultadoDiv) displayError(resultadoDiv, "Error inesperado."); return; }
             resultadoDiv.innerHTML = ''; resultadoDiv.classList.add('screen-hidden'); resultadoDiv.classList.remove('screen-visible');
             shareButtonContainer.innerHTML = ''; shareButtonContainer.classList.add('screen-hidden'); shareButtonContainer.classList.remove('screen-visible');
             contactSection.classList.add('screen-hidden'); contactSection.classList.remove('screen-visible');

             const puntajes={}; const puntajesHabilidades={};
             for(const idC in carrerasData){if(carrerasData.hasOwnProperty(idC)){puntajes[idC]=0;}} for(const h in HABILIDADES_DEFINICIONES){if(HABILIDADES_DEFINICIONES.hasOwnProperty(h)){puntajesHabilidades[h]=0;}}

             const respuestas=form.querySelectorAll('input[type="radio"]:checked');
             const answeredNames=new Set(respuestas.length>0?Array.from(respuestas).map(r=>r.name):[]);
             let firstUnansweredDiv=null;
             if(totalPreguntas>0){const allQ=form.querySelectorAll('.question');for(const qDiv of allQ){ const nameAttr = qDiv.querySelector('input[type="radio"]')?.name; if (nameAttr && !answeredNames.has(nameAttr)){firstUnansweredDiv=qDiv;break;}}} // Corrección ligera para encontrar el name

             if(totalPreguntas>0&&firstUnansweredDiv){
                 displayError(testErrorMsgContainer,`Por favor, responde todas las ${totalPreguntas} preguntas.`);
                 firstUnansweredDiv.classList.add('question-unanswered');
                 firstUnansweredDiv.scrollIntoView({behavior:'smooth',block:'center'});
                 return;
             }
             if(totalPreguntas===0){displayError(resultadoDiv,"No hay preguntas.");return;}

             respuestas.forEach(input=>{const n=input.name; const idC=n.split('-')[0]; const v=parseInt(input.value,10)||0; if(puntajes.hasOwnProperty(idC)){puntajes[idC]+=v;} const h=input.dataset.habilidad; if(h&&puntajesHabilidades.hasOwnProperty(h)){puntajesHabilidades[h]+=v;}});

             let pArray=Object.entries(puntajes).map(([id,s])=>({id,s})).filter(c=>carrerasData[c.id]?.preguntas?.length>0).sort((a,b)=>b.s-a.s);
             let topIds=[]; let maxScore=-1; if(pArray.length>0){maxScore=pArray[0].s; const cMax=pArray.filter(c=>c.s===maxScore); topIds=cMax.slice(0,2).map(c=>c.id);}

             const pNorm={}; let hasSkills=false; for(const h in puntajesHabilidades){if(HABILIDADES_DEFINICIONES.hasOwnProperty(h)){const sB=puntajesHabilidades[h];const maxS=HABILIDADES_DEFINICIONES[h].maxScore; if(maxS>0){pNorm[h]=Math.round((sB/maxS)*100); hasSkills=true;}else{pNorm[h]=0;}}}

             if(topIds.length>0){
                const resultNames=topIds.map(id=>carrerasData[id]?.nombreDisplay||'N/A').join(' | ');
                let maxP=carrerasData[topIds[0]]?.preguntas?.length*3||0;
                let resultadoHTML='';
                // --- Construcción HTML Resultados (Textos Completos) ---
                resultadoHTML += `<h3 class="result-title">Resultado: Tu Carrera Ideal</h3>`;
                resultadoHTML += `<p class="result-score">Puntaje de Afinidad: <span class="result-score-value">${maxScore} / ${maxP}</span></p>`;
                if (topIds.length === 1) {
                     const id = topIds[0]; const c = carrerasData[id];
                     resultadoHTML += `<p class="result-intro-text">Basado en tus respuestas, la carrera que parece ajustarse mejor a tu perfil es:</p>`;
                     resultadoHTML += `<h4 class="career-single-name"><a href="${c?.url||'#'}" target="_blank" rel="noreferrer">${c?.nombreDisplay||id}</a></h4>
                                       <p class="career-single-description">${c?.descripcion||'Información detallada no disponible.'}</p>`;
                     resultadoHTML += `<p class="result-disclaimer"><em>Recuerda que este test es una guía inicial. Te recomendamos investigar más sobre esta carrera, hablar con profesionales del área y contactar a nuestros asesores educativos.</em></p>`;
                } else {
                     const c1 = carrerasData[topIds[0]]; const c2 = carrerasData[topIds[1]];
                     resultadoHTML += `<p class="result-intro-text" style="margin-top:-15px; margin-bottom: 15px;">Basado en tus respuestas, muestras una afinidad destacada y similar con las siguientes carreras:</p>`;
                     resultadoHTML += `<ul class="career-list">`;
                     [c1, c2].forEach(c => { if(c) resultadoHTML += `<li class="career-list-item"><strong class="career-name-in-list"><a href="${c.url||'#'}" target="_blank" rel="noreferrer">${c.nombreDisplay}</a></strong> <span class="career-description-in-list">${c.descripcion||'Información detallada no disponible.'}</span></li>`; });
                     resultadoHTML += `</ul>`;
                     resultadoHTML += `<p class="result-disclaimer"><em>Tienes intereses prometedores en ambas áreas. Te recomendamos explorar las dos opciones, comparar planes de estudio y considerar cuál resuena más contigo y tus metas a futuro.</em></p>`;
                }
                // Separador HR
                if (hasSkills) { resultadoHTML += `<hr class="internal-separator">`; }
                // Habilidades
                if(hasSkills){
                    resultadoHTML+=`<h3 class="skills-title-in-result">Tu Perfil Detallado de Habilidades</h3>`;
                    resultadoHTML+=`<p class="skills-description-in-result">Haz clic en cada habilidad para leer su descripción:</p>`;
                    resultadoHTML+=`<div id="${skillPercentageListContainerId}"></div>`;
                } else if (topIds.length > 0) {
                    resultadoHTML+=`<p class="error-message" style="margin-top: 20px;">No se generó un perfil de habilidades detallado.</p>`;
                }
                // --- Fin Construcción HTML ---

                if (testSection) { testSection.classList.add('screen-hidden'); testSection.classList.remove('screen-visible'); } // Ocultar test
                resultadoDiv.innerHTML=resultadoHTML;
                resultadoDiv.classList.add('screen-visible'); resultadoDiv.classList.remove('screen-hidden'); // Mostrar resultado
                if(hasSkills){generarListaPorcentajes(pNorm);} // Generar lista

                // --- Botón WhatsApp (Funcional) ---
                const whatsappSVG=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 8px;"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg>`;
                const shareBtnHTML=`<button type="button" id="share-whatsapp-button" class="button button-pill share-button">${whatsappSVG}Compartir Resultado</button>`;
                shareButtonContainer.innerHTML=shareBtnHTML;
                shareButtonContainer.classList.add('screen-visible'); shareButtonContainer.classList.remove('screen-hidden');
                const shareBtn=shareButtonContainer.querySelector('#share-whatsapp-button');
                if(shareBtn)shareBtn.onclick=()=>compartirWhatsApp(topIds); else console.error("Error listener botón compartir");

                // Contacto Post-Test
                if(contactSection&&hiddenCareerInput){hiddenCareerInput.value=resultNames;contactSection.classList.add('screen-visible');contactSection.classList.remove('screen-hidden');}

                // Scroll y GA
                const resTitle=resultadoDiv.querySelector('.result-title'); if(resTitle)resTitle.scrollIntoView({behavior:'smooth',block:'start'});
                if(typeof gtag!=='undefined'){try{gtag('event','test_complete',{/*...*/});}catch(e){}}
            }else{displayError(resultadoDiv,"No resultado claro.");contactSection.classList.add('screen-hidden');contactSection.classList.remove('screen-visible');}
        }

        // --- Compartir WhatsApp (Textos completos sin emojis) ---
        function compartirWhatsApp(careerIds) {
             if (!carrerasData || !Array.isArray(careerIds) || careerIds.length === 0) return;
             let messageText = '';
             const testLink = window.location.href;
             const uniremInfo = `---
 UNIREM
 Síguenos: @UNIREM.MX (FB/IG/TikTok)
 Contacto: Tel. 5550370100 | WA: 5546190122`;

             if (careerIds.length === 1) {
                 const careerId = careerIds[0];
                 const careerName = carrerasData[careerId]?.nombreDisplay || 'una carrera interesante';
                 messageText = `¡Hice el test vocacional de UNIREM!

Mi perfil muestra una *fuerte inclinación* hacia:
*${careerName}*

*¡Descubre tu vocación también!*
${testLink}

${uniremInfo}`;
             } else {
                 const careerName1 = carrerasData[careerIds[0]]?.nombreDisplay || 'un área';
                 const careerName2 = carrerasData[careerIds[1]]?.nombreDisplay || 'otra área';
                 messageText = `¡Hice el test vocacional de UNIREM!

Muestro *interés destacado* en estas áreas:
- *${careerName1}*
- *${careerName2}*

*¡Descubre tu vocación también!*
${testLink}

${uniremInfo}`;
             }
             const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;
             window.open(whatsappUrl, '_blank');
             if(typeof gtag!=='undefined'){try{gtag('event','share',{/*...*/});}catch(e){}}
        }

        // --- Handle Contact Form Submission (Post-Test) ---
        async function handleContactFormSubmit(event) { event.preventDefault();if(!contactForm||!formStatus)return;const btn=contactForm.querySelector('#contact-submit-button');const txt=btn?btn.textContent:'Enviar';if(btn){btn.disabled=true;btn.textContent='Enviando...';}formStatus.classList.remove('visible','success','error');const fData=new FormData(contactForm);const data=Object.fromEntries(fData.entries());data.form_source=data.form_source||'post_test';if(!CONFIG.googleAppScriptUrl){displayError(formStatus,'Error config.',false,false);if(btn){btn.disabled=false;btn.textContent=txt;}return;}try{await fetch(CONFIG.googleAppScriptUrl,{method:'POST',mode:'no-cors',body:JSON.stringify(data)});displayError(formStatus,'¡Gracias!',false,true);contactForm.reset();if(typeof gtag!=='undefined'){try{gtag('event','generate_lead',{/*...*/});}catch(e){}}}catch(error){displayError(formStatus,'Error al enviar.',false,false);}finally{if(btn){btn.disabled=false;btn.textContent=txt;}}}

        // --- Scroll to Top Logic ---
        function handleScroll() { if (scrollToTopBtn) { window.scrollY > 300 ? scrollToTopBtn.classList.add('visible') : scrollToTopBtn.classList.remove('visible'); } }
        function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

        // --- Inicialización test.html ---
        async function initializeTestPage() {
             // Validar elementos esenciales
             if (!testSection || !preguntasContainer || !form || !submitButton || !resultadoDiv || !scrollToTopBtn || !testErrorMsgContainer || !progressContainer) {
                 console.error("Faltan elementos HTML esenciales en test.html.");
                 if(testSection) testSection.innerHTML = "<p style='color:red; text-align:center;'>Error fatal al cargar la página del test.</p>";
                 return;
             }
             // Ocultar secciones dinámicas al inicio
            resultadoDiv.classList.add('screen-hidden'); resultadoDiv.classList.remove('screen-visible');
            shareButtonContainer.classList.add('screen-hidden'); shareButtonContainer.classList.remove('screen-visible');
            contactSection.classList.add('screen-hidden'); contactSection.classList.remove('screen-visible');
            scrollToTopBtn.classList.remove('visible');
            testErrorMsgContainer.innerHTML = ''; // Limpiar errores

            const loadingPlaceholder = preguntasContainer.querySelector('.loading-placeholder');
            if(loadingPlaceholder) loadingPlaceholder.textContent = "Preparando el test...";

            try {
                // Cargar datos
                const response = await fetch(CONFIG.carrerasDataFile);
                if (!response.ok) throw new Error(`Error ${response.status} al cargar ${CONFIG.carrerasDataFile}`);
                carrerasData = await response.json();
                if (!carrerasData || typeof carrerasData !== 'object' || Object.keys(carrerasData).length === 0) throw new Error("Archivo JSON inválido o vacío.");

                // Preparar test
                calcularMaxScoresHabilidades();
                const renderResult = renderizarPreguntasAleatorias(); // Renderiza preguntas
                if (!renderResult.success) {
                     // Mostrar error específico de renderizado
                     throw new Error(renderResult.message || "Fallo al preparar las preguntas.");
                 }

                 // Setup Listeners de la página
                 submitButton.addEventListener('click', calcularResultado);
                 form.addEventListener('input', updateProgressBar); // Listener progreso
                 if (contactForm) contactForm.addEventListener('submit', handleContactFormSubmit); // Listener form post-test
                 if(resultadoDiv) { // Listeners habilidades (delegados)
                     resultadoDiv.addEventListener('click',(e)=>{const li=e.target.closest(`#${skillPercentageListContainerId} .skill-item-clickable`);if(li){mostrarDescripcionHabilidadInline(li);}});
                     resultadoDiv.addEventListener('keydown',(e)=>{const li=e.target.closest(`#${skillPercentageListContainerId} .skill-item-clickable`);if(li&&(e.key==='Enter'||e.key===' ')){e.preventDefault();mostrarDescripcionHabilidadInline(li);}});
                 }
                 window.addEventListener('scroll', handleScroll); // Listener scroll-to-top
                 scrollToTopBtn.addEventListener('click', scrollToTop); // Listener click scroll-to-top

                 if (loadingPlaceholder) loadingPlaceholder.remove(); // Quitar placeholder

            } catch (error) { // Capturar errores de inicialización
                console.error("Error inicializando test.html:", error);
                if (loadingPlaceholder) loadingPlaceholder.remove();
                // Mostrar error en contenedor de preguntas
                displayError(preguntasContainer, `Error crítico: ${error.message}. Por favor, intenta recargar la página.`);
                // Ocultar elementos que no funcionarán
                if(submitButton) submitButton.style.display = 'none';
                if(progressContainer) progressContainer.style.display = 'none';
            }
        }
        // Ejecutar inicialización al cargar test.html
        initializeTestPage();
    }

    // --- LÓGICA BIENVENIDA (index.html) ---
    if (isWelcomePage) {
        const initStatusMsg = document.getElementById('init-status');
        const startBtnLink = document.getElementById('start-prereg-link');
        console.log("Welcome Page Loaded.");
        if (initStatusMsg) initStatusMsg.textContent = "";
        if (startBtnLink) startBtnLink.style.opacity = '1';
    }

}); // Fin DOMContentLoaded