import http from 'k6/http'
import { sleep, check } from 'k6'

import uuid from './libs/uuid.js'

export const options = {
  vus: 1,
  duration: '1m',
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

  console.log(response.body)

  check(response, {
    'status should be 201': res => res.status === 201
  })
  
  sleep(1)
}