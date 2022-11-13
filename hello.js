import http from 'k6/http'
import { sleep, check } from 'k6'

export default function() {
  const response = http.get('http://localhost:3333')

  check(response, {
    'status should be 200': res => res.status === 200
  })
  
  // sleep(1)
}