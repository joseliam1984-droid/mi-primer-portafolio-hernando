console.log("¡Hola, Dev! Si ves esto, tu entorno está configurado correctamente.");

// ========================================
// FUNCIONALIDAD DEL FORMULARIO DE CONTACTO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Validación básica
            if (!formData.name || !formData.email || !formData.phone || !formData.message) {
                alert('Por favor, completa todos los campos del formulario.');
                return;
            }
            
            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Por favor, introduce un email válido.');
                return;
            }
            
            // Deshabilitar botón y mostrar estado de carga
            const originalButtonHTML = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <span class="relative z-10 flex items-center justify-center gap-2">
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                </span>
            `;
            
            try {
                // Enviar a la función de Netlify
                const response = await fetch('/.netlify/functions/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Éxito
                    console.log('✅ Email enviado:', data);
                    successMessage.classList.remove('hidden');
                    contactForm.reset();
                    
                    // Ocultar mensaje después de 5 segundos
                    setTimeout(() => {
                        successMessage.classList.add('hidden');
                    }, 5000);
                } else {
                    // Error del servidor
                    console.error('❌ Error del servidor:', data);
                    alert(`Error al enviar el mensaje: ${data.error || 'Error desconocido'}`);
                }
                
            } catch (error) {
                // Error de red o fetch
                console.error('❌ Error de red:', error);
                alert('Hubo un error al conectar con el servidor. Por favor, intenta de nuevo más tarde.');
            } finally {
                // Restaurar botón
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
            }
        });
    }
    
    // Animación suave al hacer focus en los inputs
    const formInputs = document.querySelectorAll('#contactForm input, #contactForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('scale-[1.01]');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('scale-[1.01]');
        });
    });
});

