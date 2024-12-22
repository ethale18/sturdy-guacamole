document.addEventListener('DOMContentLoaded', function() {
  // Funkcja do ustawiania cookie z datą ważności
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Oblicza datę wygaśnięcia
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  // Funkcja do pobierania wartości cookie
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Sprawdzamy, czy użytkownik już wyraził zgodę
  if (getCookie('cookieConsent') === 'accepted') {
    return; // Jeśli zgoda została wcześniej zapisana, nie wyświetlamy bannera
  }

  // Pobieramy elementy
  const consentBanner = document.getElementById('cookie-consent-banner');
  const acceptButton = document.getElementById('accept-cookie');

  // Funkcja, która ukrywa banner
  function hideBanner() {
    consentBanner.style.display = 'none';
  }

  // Funkcja, która pokazuje banner
  function showBanner() {
    consentBanner.style.display = 'flex';
  }

  // Pokazujemy banner, jeśli użytkownik nie zaakceptował cookies
  showBanner();

  // Obsługa kliknięcia w "Akceptuję"
  acceptButton.addEventListener('click', function() {
    setCookie('cookieConsent', 'accepted', 90); // Ustawiamy cookie z ważnością na 90 dni (3 miesiące)
    hideBanner(); // Ukrywamy banner po kliknięciu
  });
});
