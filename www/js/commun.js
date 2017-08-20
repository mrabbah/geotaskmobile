function getDate(date) {
    if (date !== null) {
        date = new Date(date);
        var dayNumber = date.getDate() + "";
        var month = (date.getMonth() + 1) + "";
        if (dayNumber.length === 1) {
            dayNumber = "0" + dayNumber;
        }
        if (month.length === 1) {
            month = "0" + month;
        }
        var dateFormat = dayNumber + '-' + month + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
        return dateFormat;
    }
    else {
        return "";
    }
}
;
function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
;
function printJson(json) {
    alert(syntaxHighlight(json));
};