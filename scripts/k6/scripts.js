import http from 'k6/http'
import { sleep } from 'k6'
const { url } = require(`../config/${__ENV.AMBIENTE}.config.js`)

export default function () {
    http.get(`${url}`)
    sleep(1)
}