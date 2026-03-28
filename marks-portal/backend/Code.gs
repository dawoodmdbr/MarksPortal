var SHEET_NAME     = 'Marks';
var ALLOWED_DOMAIN = '@cfd.nu.edu.pk';

function doGet(e) {
  try {
    var email = (e.parameter.email || '').trim().toLowerCase();

    if (!email)
      return respond({ error: 'Email parameter is required.' });
    if (!email.endsWith(ALLOWED_DOMAIN))
      return respond({ error: 'Access Denied: Only university email allowed.' });

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet)
      return respond({ error: 'Sheet not found. Contact admin.' });

    var data    = sheet.getDataRange().getValues();
    var headers = data[0];

    // Find email column (case-insensitive)
    var emailCol = headers.findIndex(function(h) {
      return h.toString().trim().toLowerCase() === 'email';
    });

    // Find max marks row (row where email cell = 'max')
    var maxRow = null;
    for (var i = 1; i < data.length; i++) {
      if ((data[i][emailCol] || '').toString().trim().toLowerCase() === 'max') {
        maxRow = data[i];
        break;
      }
    }

    // Find student row
    var studentRow = null;
    for (var i = 1; i < data.length; i++) {
      if ((data[i][emailCol] || '').toString().trim().toLowerCase() === email) {
        studentRow = data[i];
        break;
      }
    }

    if (!studentRow)
      return respond({ error: 'Access Denied: Your email is not registered.' });

    // Find name and rollNo columns (case-insensitive)
    var nameCol = headers.findIndex(function(h) {
      return h.toString().trim().toLowerCase() === 'name';
    });
    var rollCol = headers.findIndex(function(h) {
      return h.toString().trim().toLowerCase() === 'roll no';
    });

    var result = {
      name:        studentRow[nameCol] || '',
      rollNo:      studentRow[rollCol] || '',
      assignments: {},
      quizzes:     {},
      homeTests:   {},
      maxMarks:    {}
    };

    // Loop every header and categorise by prefix
    for (var j = 0; j < headers.length; j++) {
      var col = headers[j].toString().trim();
      var val = toNumber(studentRow[j]);
      var max = maxRow ? toNumber(maxRow[j]) : null;

      if (col.match(/^A\d+$/i)) {
        result.assignments[col] = val;
      } else if (col.match(/^Q\d+$/i)) {
        result.quizzes[col] = val;
      } else if (col.match(/^HT\d+$/i)) {
        result.homeTests[col] = val;
      }

      // Store max marks for any marks column
      if (col.match(/^(A|Q|HT)\d+$/i) && max !== null) {
        result.maxMarks[col] = max;
      }
    }

    return respond(result);

  } catch (err) {
    console.error(err);
    return respond({ error: 'Server error. Please try again later.' });
  }
}

function respond(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function toNumber(value) {
  var n = Number(value);
  return isNaN(n) ? null : n;
}