/*
Original PHP/HTML (kept here as a comment):

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!-- Ustawiamy naszą nazwę która będzie działać na tej stronie -->
    <form method="post" action="">
        <label>
            Twoja nazwa:
            <input type="text" name="nazwa">
        </label>
        <button type="submit">Save</button>
    </form>
<!-- W tym skrypcie ustawimy 'ciasteczka' dla podanego użytkownika w formularzu -->
    <?php
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $nazwaUzytkownika = $_POST["nazwa"];

            $nazwaUzytkownika = htmlspecialchars($nazwaUzytkownika);
            //
            setcookie("nazwa", $nazwaUzytkownika, time() + 86400, "/");
            // 1 dzień to 86400 jednostek w ciasteczkach
        }
    ?>
</body>
</html>
*/

/* JS replacement for the PHP behavior:
   - Prevent form submit (no server).
   - Read input "nazwa", sanitize for display.
   - Set cookie "nazwa" for 86400 seconds (1 day).
   - Show current cookie value on page load.
   - Add read and delete cookie buttons.
   - Optional: send the value to server endpoint at /PHPJAREK/set_cookie.php (if you host it).
*/

(function () {
  'use strict';

  // Helper: set cookie (max-age in seconds)
  function setCookie(name, value, maxAgeSec, path) {
    path = path || '/';
    // encode value to be safe in cookie
    var encoded = encodeURIComponent(value);
    document.cookie = name + '=' + encoded + '; max-age=' + (maxAgeSec || 0) + '; path=' + path;
  }

  // Helper: read cookie by name
  function getCookie(name) {
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var key = parts.shift();
      var val = parts.join('=');
      if (key === name) return decodeURIComponent(val || '');
    }
    return null;
  }

  // Helper: delete cookie
  function deleteCookie(name, path) {
    path = path || '/';
    document.cookie = name + '=; max-age=0; path=' + path;
  }

  // Small HTML escaper for safe display
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function (m) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
    });
  }

  // Optional: POST to server endpoint that sets cookie server-side.
  // If your PHP endpoint is at https://yourdomain/PHPJAREK/set_cookie.php
  // and you want the server to set an HttpOnly cookie, use this function.
  // Note: Cross-origin cookies require the server domain and proper CORS headers
  // (Access-Control-Allow-Credentials: true and Access-Control-Allow-Origin must not be '*').
  function postToServer(url, nameValue) {
    return fetch(url, {
      method: 'POST',
      credentials: 'include', // important so cookies can be set for the server domain
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: 'nazwa=' + encodeURIComponent(nameValue)
    }).then(function (r) {
      if (!r.ok) throw new Error('Server error: ' + r.status);
      return r.json().catch(function () { return null; });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('nazwaForm');
    var input = document.getElementById('nazwa');
    var status = document.getElementById('status');
    var readBtn = document.getElementById('read');
    var deleteBtn = document.getElementById('delete');
    var saveServerBtn = document.getElementById('save-server');

    // Show existing cookie on load (if set)
    var existing = getCookie('nazwa');
    if (existing) {
      status.textContent = 'Cookie "nazwa" is set: ' + escapeHtml(existing);
    } else {
      status.textContent = 'Cookie "nazwa" is not set yet.';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = input.value || '';
      setCookie('nazwa', val, 86400, '/'); // 86400 = 1 day
      status.textContent = 'Saved locally via JS: ' + escapeHtml(val);
    });

    readBtn.addEventListener('click', function () {
      var v = getCookie('nazwa');
      status.textContent = 'Read cookie: ' + (v ? escapeHtml(v) : '<not set>');
    });

    deleteBtn.addEventListener('click', function () {
      deleteCookie('nazwa', '/');
      status.textContent = 'Deleted cookie "nazwa".';
    });

    saveServerBtn.addEventListener('click', function () {
      var val = input.value || '';
      // Update UI immediately to show intent
      status.textContent = 'Sending to server...';
      // Try posting to a server endpoint at /PHPJAREK/set_cookie.php
      postToServer('/PHPJAREK/set_cookie.php', val)
        .then(function (json) {
          // If server sets cookie, it will be for the server's domain.
          if (json && json.success) {
            status.textContent = 'Server responded and set cookie on server domain: ' + (json.value ? escapeHtml(json.value) : '<empty>');
          } else {
            status.textContent = 'Server response received. Check server response or cookie on server domain.';
          }
        })
        .catch(function (err) {
          status.textContent = 'Error contacting server endpoint: ' + (err && err.message ? err.message : err);
        });
    });
  });
})();