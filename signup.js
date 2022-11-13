import http from 'k6/http'
import { sleep, check } from 'k6'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/2.4.0/dist/bundle.js"
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js'

import uuid from './libs/uuid.js'

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% das requests devem responder em ate 2s
    http_req_failed: ['rate<0.01'] // 1% das requests podem falhar
  }
}

export default function() {
  const url = 'http://localhost:3333/signup'

  const userEmail = uuid.v4().substring(24)

  const payload = JSON.stringify({
    email: `${userEmail}@qa.k6.io`,
    password: 'bell123'
  })

  const headers = {
    'headers': {
      'Content-Type': 'application/json'
    },
  }

  const response = http.post(url, payload, headers)

  check(response, {
    'status should be 201': res => res.status === 201
  })
  
  sleep(1)
}

export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
    stdout: textSummary(data)
  }
}