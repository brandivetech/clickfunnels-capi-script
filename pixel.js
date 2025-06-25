const waitForInputs = setInterval(() => {
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  const fullNameInput = document.querySelector('input[name="name"]');
  const submitLink = document.querySelector('a[href="#submit-form"]');

  if (emailInput && phoneInput && fullNameInput && submitLink) {
    console.log("✅ Inputs and submit link detected");

    submitLink.addEventListener('click', async function (e) {
      e.preventDefault();
      const email = emailInput.value.trim().toLowerCase();
      const phone = phoneInput.value.trim().replace(/[^0-9+]/g, '');
      const fullName = fullNameInput.value.trim();
      const [firstNameRaw, ...rest] = fullName.split(' ');
      const firstName = firstNameRaw.toLowerCase();
      const lastName = rest.join(' ').toLowerCase().trim();
      const eventId = 'cf_btvip_' + Date.now();

      if (!email || !email.includes('@') || phone.length < 5 || !firstName) {
        console.warn("🚫 Missing or invalid data. Event not sent.");
        return;
      }

      function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
      }
      const fbp = getCookie('_fbp') || '';
      const fbc = getCookie('_fbc') || '';

      async function sha256(str) {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      }

      const [em_hashed, ph_hashed, fn_hashed, ln_hashed] = await Promise.all([
        sha256(email),
        sha256(phone),
        sha256(firstName),
        sha256(lastName)
      ]);

      if (typeof fbq === 'function') {
        fbq('trackCustom', 'BT KRC VIP - Paid ($47)', {}, {
          eventID: eventId,
          test_event_code: 'TEST66934'
        });
      }

      await fetch('https://events.keyboardrichchallenge.com', {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'BT KRC VIP - Paid ($47)',
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: 'website',
          event_source_url: window.location.href,
          user_data: {
            em: em_hashed,
            ph: ph_hashed,
            fn: fn_hashed,
            ln: ln_hashed,
            fbp,
            fbc
          },
          custom_data: {
            content_name: 'BT KRC VIP - Paid ($47)',
            value: 47.00,
            currency: 'USD'
          },
          test_event_code: 'TEST66934'
        })
      });

      console.log("✅ $47 Pixel + CAPI sent", { eventId });

      setTimeout(() => {
        if (submitLink.href && submitLink.href !== '#submit-form') {
          window.location.href = submitLink.href;
        }
      }, 300);
    });

    clearInterval(waitForInputs);
  }
}, 500);
