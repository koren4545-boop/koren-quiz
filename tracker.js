const SUPABASE_URL = 'https://hnyidycwpzayjxnturni.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nFIbqvHIKFVcF7A29DIzGg_eQqsD881';

function getSessionId() {
  let sid = sessionStorage.getItem('koren_sid');
  if (!sid) {
    sid = 'sid_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('koren_sid', sid);
  }
  return sid;
}

const SB_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY
};

function sbPost(table, payload) {
  return fetch(SUPABASE_URL + '/rest/v1/' + table, {
    method: 'POST',
    headers: SB_HEADERS,
    body: JSON.stringify(payload)
  }).catch(() => {});
}

function trackEvent(eventType, extra) {
  return sbPost('events', {
    session_id: getSessionId(),
    event_type: eventType,
    page: location.pathname.split('/').pop() || 'index.html',
    step: (extra && extra.step != null) ? extra.step : null,
    data: extra || {}
  });
}

function trackLead(name, phone, age, resultPage, formNumber) {
  return sbPost('leads', {
    session_id: getSessionId(),
    name: name,
    phone: phone,
    age: parseInt(age) || null,
    result_page: resultPage,
    form_number: formNumber
  });
}

// Track video watch time (call with YouTube player or native video)
function trackVideoWatch(page, seconds) {
  trackEvent('video_watch', { page: page, seconds_watched: seconds });
}

// Page view on load
trackEvent('page_view');

// Track current step (updated by quiz JS)
window._currentStep = 0;
